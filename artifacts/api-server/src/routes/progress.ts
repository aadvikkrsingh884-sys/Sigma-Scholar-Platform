import { Router } from "express";
import { db } from "@workspace/db";
import { progressTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const entries = await db.select().from(progressTable).where(eq(progressTable.userId, req.params.userId));
    res.json(entries.map(e => ({
      id: e.id, userId: e.userId, chapterId: e.chapterId, subjectId: e.subjectId,
      classId: e.classId, completed: e.completed, percentage: e.percentage,
      updatedAt: e.updatedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get user progress");
    res.status(500).json({ error: "Failed to get user progress" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, chapterId, subjectId, classId, completed, percentage } = req.body;
    const id = randomUUID();
    const [entry] = await db.insert(progressTable).values({
      id, userId, chapterId, subjectId, classId,
      completed: completed ?? false, percentage: percentage ?? 0,
    }).returning();
    res.status(201).json({
      id: entry.id, userId: entry.userId, chapterId: entry.chapterId,
      subjectId: entry.subjectId, classId: entry.classId, completed: entry.completed,
      percentage: entry.percentage, updatedAt: entry.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to save progress");
    res.status(500).json({ error: "Failed to save progress" });
  }
});

export default router;
