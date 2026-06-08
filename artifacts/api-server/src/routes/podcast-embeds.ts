import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, podcastEmbedsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/podcast-embed", async (_req, res): Promise<void> => {
  const [embed] = await db
    .select()
    .from(podcastEmbedsTable)
    .orderBy(desc(podcastEmbedsTable.id))
    .limit(1);

  if (!embed) {
    res.status(404).json({ error: "No podcast embed set" });
    return;
  }

  res.json(embed);
});

router.post("/podcast-embed", requireAdmin, async (req, res): Promise<void> => {
  const { embedUrl, title } = req.body as { embedUrl?: string; title?: string };

  if (!embedUrl || typeof embedUrl !== "string") {
    res.status(400).json({ error: "embedUrl is required" });
    return;
  }

  const now = new Date().toISOString();
  const [embed] = await db
    .insert(podcastEmbedsTable)
    .values({ embedUrl, title: title ?? null, createdAt: now })
    .returning();

  res.status(201).json(embed);
});

export default router;
