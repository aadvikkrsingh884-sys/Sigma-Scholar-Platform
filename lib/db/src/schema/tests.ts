import { pgTable, text, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testsTable = pgTable("tests", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull(),
  subjectId: text("subject_id").notNull(),
  chapterId: text("chapter_id"),
  title: text("title").notNull(),
  type: text("type").notNull().default("chapter"),
  duration: integer("duration").notNull().default(30),
  totalMarks: integer("total_marks").notNull().default(100),
  totalQuestions: integer("total_questions").notNull().default(20),
  questions: text("questions"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const resultsTable = pgTable("results", {
  id: text("id").primaryKey(),
  testId: text("test_id").notNull().references(() => testsTable.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  score: integer("score").notNull().default(0),
  totalMarks: integer("total_marks").notNull(),
  percentage: doublePrecision("percentage").notNull().default(0),
  timeTaken: integer("time_taken").notNull().default(0),
  answers: text("answers"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTestSchema = createInsertSchema(testsTable).omit({ createdAt: true });
export const insertResultSchema = createInsertSchema(resultsTable).omit({ createdAt: true });
export type Test = typeof testsTable.$inferSelect;
export type Result = typeof resultsTable.$inferSelect;
export type InsertTest = z.infer<typeof insertTestSchema>;
export type InsertResult = z.infer<typeof insertResultSchema>;
