import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notesTable = pgTable("notes", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull(),
  subjectId: text("subject_id").notNull(),
  chapterId: text("chapter_id").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  pdfUrl: text("pdf_url"),
  type: text("type").notNull().default("text"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNoteSchema = createInsertSchema(notesTable).omit({ createdAt: true, updatedAt: true });
export type Note = typeof notesTable.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
