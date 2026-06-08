import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const podcastEmbedsTable = sqliteTable("podcast_embeds", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  embedUrl: text("embed_url").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertPodcastEmbedSchema = createInsertSchema(podcastEmbedsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPodcastEmbed = z.infer<typeof insertPodcastEmbedSchema>;
export type PodcastEmbed = typeof podcastEmbedsTable.$inferSelect;
