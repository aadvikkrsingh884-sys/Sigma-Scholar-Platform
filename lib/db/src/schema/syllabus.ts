import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const classesTable = pgTable("classes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
  totalSubjects: integer("total_subjects").default(0),
  totalChapters: integer("total_chapters").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subjectsTable = pgTable("subjects", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull().default("#3B82F6"),
  icon: text("icon").notNull().default("BookOpen"),
  order: integer("order").notNull().default(0),
  totalChapters: integer("total_chapters").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const chaptersTable = pgTable("chapters", {
  id: text("id").primaryKey(),
  subjectId: text("subject_id").notNull().references(() => subjectsTable.id, { onDelete: "cascade" }),
  classId: text("class_id").notNull(),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
  description: text("description"),
  totalTopics: integer("total_topics").default(0),
  hasNotes: boolean("has_notes").default(false),
  hasPdf: boolean("has_pdf").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const topicsTable = pgTable("topics", {
  id: text("id").primaryKey(),
  chapterId: text("chapter_id").notNull().references(() => chaptersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const syllabusVersionsTable = pgTable("syllabus_versions", {
  id: serial("id").primaryKey(),
  version: text("version").notNull(),
  year: text("year").notNull(),
  board: text("board").notNull().default("CBSE"),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertClassSchema = createInsertSchema(classesTable).omit({ createdAt: true, updatedAt: true });
export const insertSubjectSchema = createInsertSchema(subjectsTable).omit({ createdAt: true });
export const insertChapterSchema = createInsertSchema(chaptersTable).omit({ createdAt: true });
export const insertTopicSchema = createInsertSchema(topicsTable).omit({ createdAt: true });

export type ClassItem = typeof classesTable.$inferSelect;
export type Subject = typeof subjectsTable.$inferSelect;
export type Chapter = typeof chaptersTable.$inferSelect;
export type Topic = typeof topicsTable.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
