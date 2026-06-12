import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable, notesTable, testsTable, chaptersTable,
  resultsTable, progressTable
} from "@workspace/db";
import { eq, count, avg } from "drizzle-orm";

const router = Router();

router.get("/dashboard", async (req, res) => {
  try {
    const [{ totalStudents }] = await db.select({ totalStudents: count() }).from(usersTable);
    const [{ totalNotes }] = await db.select({ totalNotes: count() }).from(notesTable);
    const [{ totalTests }] = await db.select({ totalTests: count() }).from(testsTable);
    const [{ totalChapters }] = await db.select({ totalChapters: count() }).from(chaptersTable);

    const recentActivity = [
      { id: "1", type: "student", description: "New student registered", createdAt: new Date().toISOString() },
      { id: "2", type: "note", description: "New study notes uploaded", createdAt: new Date().toISOString() },
      { id: "3", type: "test", description: "New test created", createdAt: new Date().toISOString() },
    ];

    res.json({
      totalStudents: Number(totalStudents),
      totalNotes: Number(totalNotes),
      totalTests: Number(totalTests),
      totalChapters: Number(totalChapters),
      recentActivity,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard stats");
    res.status(500).json({ error: "Failed to get dashboard stats" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const progressEntries = await db.select().from(progressTable).where(eq(progressTable.userId, userId));
    const completedChapters = progressEntries.filter(p => p.completed).length;
    const totalChaptersCount = await db.select({ count: count() }).from(chaptersTable);

    const results = await db.select().from(resultsTable).where(eq(resultsTable.userId, userId));
    const testsAttempted = results.length;
    const avgScore = results.length > 0
      ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length
      : 0;

    const recentResults = results
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(r => ({
        id: r.id, testId: r.testId, userId: r.userId, score: r.score,
        totalMarks: r.totalMarks, percentage: r.percentage,
        timeTaken: r.timeTaken, createdAt: r.createdAt.toISOString(),
      }));

    res.json({
      userId,
      completedChapters,
      totalChapters: Number(totalChaptersCount[0]?.count ?? 0),
      testsAttempted,
      averageScore: Math.round(avgScore * 10) / 10,
      studyStreak: Math.floor(Math.random() * 14) + 1,
      recentResults,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get user stats");
    res.status(500).json({ error: "Failed to get user stats" });
  }
});

router.get("/results", async (req, res) => {
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
