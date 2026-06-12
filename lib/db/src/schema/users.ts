import { pgTable, text, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  photoUrl: text("photo_url"),
  classId: text("class_id"),
  className: text("class_name"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastActive: timestamp("last_active", { withTimezone: true }),
});

export const progressTable = pgTable("progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  chapterId: text("chapter_id").notNull(),
  subjectId: text("subject_id").notNull(),
  classId: text("class_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  percentage: doublePrecision("percentage").default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bookmarksTable = pgTable("bookmarks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull().default("chapter"),
  refId: text("ref_id").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const chatHistoryTable = pgTable("chat_history", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  role: text("role").notNull().default("user"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ createdAt: true });
export const insertProgressSchema = createInsertSchema(progressTable).omit({ updatedAt: true });
export const insertBookmarkSchema = createInsertSchema(bookmarksTable).omit({ createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatHistoryTable).omit({ createdAt: true });

export type User = typeof usersTable.$inferSelect;
export type Progress = typeof progressTable.$inferSelect;
export type Bookmark = typeof bookmarksTable.$inferSelect;
export type ChatHistory = typeof chatHistoryTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
