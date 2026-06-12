import { Router } from "express";
import { db } from "@workspace/db";
import { testsTable, resultsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { classId, subjectId, type } = req.query as Record<string, string>;
    const conditions = [];
    if (classId) conditions.push(eq(testsTable.classId, classId));
    if (subjectId) conditions.push(eq(testsTable.subjectId, subjectId));
    if (type) conditions.push(eq(testsTable.type, type));
    const tests = conditions.length
      ? await db.select().from(testsTable).where(and(...conditions))
      : await db.select().from(testsTable);
    res.json(tests.map(t => ({
      id: t.id, classId: t.classId, subjectId: t.subjectId, chapterId: t.chapterId,
      title: t.title, type: t.type, duration: t.duration, totalMarks: t.totalMarks,
      totalQuestions: t.totalQuestions, createdAt: t.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list tests");
    res.status(500).json({ error: "Failed to list tests" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { classId, subjectId, chapterId, title, type, duration, totalMarks, questions } = req.body;
    const id = randomUUID();
    const totalQuestions = questions ? JSON.parse(questions).length : 0;
    const [test] = await db.insert(testsTable).values({
      id, classId, subjectId, chapterId: chapterId ?? null, title,
      type: type ?? "chapter", duration, totalMarks, totalQuestions, questions: questions ?? null,
    }).returning();
    res.status(201).json({ ...test, createdAt: test.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create test");
    res.status(500).json({ error: "Failed to create test" });
  }
});

router.get("/:testId", async (req, res) => {
  try {
    const [test] = await db.select().from(testsTable).where(eq(testsTable.id, req.params.testId));
    if (!test) return res.status(404).json({ error: "Test not found" });
    res.json({ ...test, createdAt: test.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get test");
    res.status(500).json({ error: "Failed to get test" });
  }
});

router.patch("/:testId", async (req, res) => {
  try {
    const { title, duration, totalMarks, questions } = req.body;
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (duration !== undefined) updates.duration = duration;
    if (totalMarks !== undefined) updates.totalMarks = totalMarks;
    if (questions !== undefined) {
      updates.questions = questions;
      updates.totalQuestions = JSON.parse(questions).length;
    }
    const [test] = await db.update(testsTable).set(updates).where(eq(testsTable.id, req.params.testId)).returning();
    if (!test) return res.status(404).json({ error: "Test not found" });
    res.json({ ...test, createdAt: test.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update test");
    res.status(500).json({ error: "Failed to update test" });
  }
});

router.delete("/:testId", async (req, res) => {
  try {
    await db.delete(testsTable).where(eq(testsTable.id, req.params.testId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete test");
    res.status(500).json({ error: "Failed to delete test" });
  }
});

router.post("/:testId/submit", async (req, res) => {
  try {
    const { userId, score, totalMarks, timeTaken, answers } = req.body;
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const id = randomUUID();
    const [result] = await db.insert(resultsTable).values({
      id, testId: req.params.testId, userId, score, totalMarks, percentage, timeTaken,
      answers: answers ?? null,
    }).returning();
    res.status(201).json({
      id: result.id, testId: result.testId, userId: result.userId,
      score: result.score, totalMarks: result.totalMarks, percentage: result.percentage,
      timeTaken: result.timeTaken, createdAt: result.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit test result");
    res.status(500).json({ error: "Failed to submit test result" });
  }
});

router.get("/results/list", async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    const results = userId
      ? await db.select().from(resultsTable).where(eq(resultsTable.userId, userId))
      : await db.select().from(resultsTable);
    res.json(results.map(r => ({
      id: r.id, testId: r.testId, userId: r.userId, score: r.score,
      totalMarks: r.totalMarks, percentage: r.percentage, timeTaken: r.timeTaken,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list results");
    res.status(500).json({ error: "Failed to list results" });
  }
});

export default router;
