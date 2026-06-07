import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const announcementsTable = sqliteTable("announcements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  message: text("message").notNull(),
  active: integer("active").notNull().default(1),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertAnnouncementSchema = createInsertSchema(announcementsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcementsTable.$inferSelect;
