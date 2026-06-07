import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, adminTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import { AdminLoginBody, AdminChangePasswordBody } from "@workspace/api-zod";
import { generateToken, requireAdmin, verifyToken } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

async function ensureAdminExists(): Promise<void> {
  const existing = await db.select().from(adminTable).where(eq(adminTable.email, "efkidgamer@gmail.com"));
  if (existing.length === 0) {
    const hash = await bcrypt.hash("admin1234", 10);
    await db.insert(adminTable).values({
      email: "efkidgamer@gmail.com",
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    });
    logger.info("Default admin account created");
  }
}

ensureAdminExists().catch((err) => logger.error({ err }, "Failed to seed admin"));

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const [admin] = await db.select().from(adminTable).where(eq(adminTable.email, email));

  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken(admin.email);
  res.json({ token });
});

router.post("/admin/change-password", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminChangePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const authHeader = req.headers.authorization!;
  const token = authHeader.slice(7);
  const payload = verifyToken(token)!;

  const [admin] = await db.select().from(adminTable).where(eq(adminTable.email, payload.email));
  if (!admin) {
    res.status(401).json({ error: "Admin not found" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await db.update(adminTable).set({ passwordHash: newHash }).where(eq(adminTable.email, payload.email));

  res.json({ success: true });
});

router.get("/admin/verify", requireAdmin, async (_req, res): Promise<void> => {
  res.json({ success: true });
});

export default router;
