import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, announcementsTable } from "@workspace/db";
import {
  CreateAnnouncementBody,
  DeleteAnnouncementParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/announcements", async (_req, res): Promise<void> => {
  const announcements = await db
    .select()
    .from(announcementsTable)
    .where(eq(announcementsTable.active, 1))
    .orderBy(announcementsTable.id);
  res.json(announcements);
});

router.post("/announcements", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const now = new Date().toISOString();
  const [announcement] = await db
    .insert(announcementsTable)
    .values({ ...parsed.data, createdAt: now })
    .returning();

  res.status(201).json(announcement);
});

router.delete("/announcements/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteAnnouncementParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [ann] = await db
    .delete(announcementsTable)
    .where(eq(announcementsTable.id, params.data.id))
    .returning();

  if (!ann) {
    res.status(404).json({ error: "Announcement not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
