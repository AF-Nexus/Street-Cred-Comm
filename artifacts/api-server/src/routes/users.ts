import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET ?? "streetcred-secret-key";

function generateUserToken(id: number, email: string, username: string, role: string, country?: string | null): string {
  return jwt.sign({ id, email, username, role, country: country ?? "MW", type: "user" }, JWT_SECRET, { expiresIn: "30d" });
}

function verifyUserToken(token: string): { id: number; email: string; username: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; username: string; role: string };
  } catch {
    return null;
  }
}

function requireUser(req: any, res: any, next: any): void {
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const payload = verifyUserToken(authHeader.slice(7));
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  req.userId = payload.id;
  req.userEmail = payload.email;
  req.userRole = payload.role;
  next();
}

function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/users/register", async (req, res): Promise<void> => {
  const { email, username, password, country } = req.body as {
    email?: string;
    username?: string;
    password?: string;
    country?: string;
  };

  if (!email || !username || !password) {
    res.status(400).json({ error: "Email, username and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(409).json({ error: "Email is already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({
      email,
      username,
      passwordHash,
      country: country ?? "MW",
      createdAt: new Date().toISOString(),
    })
    .returning();

  const token = generateUserToken(user.id, user.email, user.username, user.role, user.country);
  res.status(201).json({ token });
});

router.post("/users/login", async (req, res): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  if (user.banned === 1) {
    res.status(403).json({ error: "Your account has been banned. Contact us on WhatsApp for help." });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = generateUserToken(user.id, user.email, user.username, user.role, user.country);
  res.json({ token });
});

router.get("/users/me", requireUser, async (req: any, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const { passwordHash: _, resetCode: __, resetCodeExpiry: ___, ...safe } = user;
  res.json(safe);
});

// Forgot password — generates a 6-digit code, admin sees it in dashboard
router.post("/users/forgot-password", async (req, res): Promise<void> => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  // Always respond same to prevent email enumeration
  if (!user) {
    res.json({ message: "If that email exists, a code has been issued." });
    return;
  }

  const code = generateResetCode();
  const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  await db
    .update(usersTable)
    .set({ resetCode: code, resetCodeExpiry: expiry })
    .where(eq(usersTable.id, user.id));

  res.json({ message: "Code issued. Please DM +265993702468 on WhatsApp with your email to receive your code." });
});

// Reset password with code
router.post("/users/reset-password", async (req, res): Promise<void> => {
  const { email, code, newPassword } = req.body as {
    email?: string;
    code?: string;
    newPassword?: string;
  };

  if (!email || !code || !newPassword) {
    res.status(400).json({ error: "Email, code and new password are required" });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user || !user.resetCode || !user.resetCodeExpiry) {
    res.status(400).json({ error: "No reset code found. Please request a new one." });
    return;
  }

  if (user.resetCode !== code) {
    res.status(400).json({ error: "Invalid reset code." });
    return;
  }

  if (new Date() > new Date(user.resetCodeExpiry)) {
    res.status(400).json({ error: "Reset code has expired. Please request a new one." });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db
    .update(usersTable)
    .set({ passwordHash, resetCode: null, resetCodeExpiry: null })
    .where(eq(usersTable.id, user.id));

  res.json({ message: "Password updated successfully. You can now sign in." });
});

// Admin: list all users (including reset codes for admin to relay)
router.get("/admin/users", requireAdmin, async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable);
  const safe = users.map(({ passwordHash: _, ...u }) => u);
  res.json(safe);
});

router.patch("/admin/users/:id/ban", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const { banned } = req.body as { banned?: number };

  if (isNaN(id) || banned === undefined) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ banned })
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const { passwordHash: _, resetCode: __, resetCodeExpiry: ___, ...safe } = user;
  res.json(safe);
});

router.patch("/admin/users/:id/role", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const { role } = req.body as { role?: string };

  if (isNaN(id) || !role) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  if (!["user", "admin"].includes(role)) {
    res.status(400).json({ error: "Role must be 'user' or 'admin'" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ role })
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const { passwordHash: _, resetCode: __, resetCodeExpiry: ___, ...safe } = user;
  res.json(safe);
});

export default router;
