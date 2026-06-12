import { Router } from "express";
import { db } from "@workspace/db";
import { classesTable, subjectsTable, chaptersTable, topicsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/classes", async (req, res) => {
  try {
    const classes = await db.select().from(classesTable).orderBy(classesTable.order);
    res.json(classes.map(c => ({
      id: c.id,
      name: c.name,
      order: c.order,
      totalSubjects: c.totalSubjects,
      totalChapters: c.totalChapters,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list classes");
    res.status(500).json({ error: "Failed to list classes" });
  }
});

router.get("/classes/:classId/subjects", async (req, res) => {
  try {
    const { classId } = req.params;
    const subjects = await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.classId, classId))
      .orderBy(subjectsTable.order);
    res.json(subjects.map(s => ({
      id: s.id,
      classId: s.classId,
      name: s.name,
      color: s.color,
      icon: s.icon,
      order: s.order,
      totalChapters: s.totalChapters,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list subjects");
    res.status(500).json({ error: "Failed to list subjects" });
  }
});

router.get("/subjects/:subjectId/chapters", async (req, res) => {
  try {
    const { subjectId } = req.params;
    const chapters = await db
      .select()
      .from(chaptersTable)
      .where(eq(chaptersTable.subjectId, subjectId))
      .orderBy(chaptersTable.order);
    res.json(chapters.map(c => ({
      id: c.id,
      subjectId: c.subjectId,
      classId: c.classId,
      name: c.name,
      order: c.order,
      description: c.description,
      totalTopics: c.totalTopics,
      hasNotes: c.hasNotes,
      hasPDF: c.hasPdf,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list chapters");
    res.status(500).json({ error: "Failed to list chapters" });
  }
});

router.get("/chapters/:chapterId/topics", async (req, res) => {
  try {
    const { chapterId } = req.params;
    const topics = await db
      .select()
      .from(topicsTable)
      .where(eq(topicsTable.chapterId, chapterId))
      .orderBy(topicsTable.order);
    res.json(topics.map(t => ({
      id: t.id,
      chapterId: t.chapterId,
      name: t.name,
      order: t.order,
      description: t.description,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list topics");
    res.status(500).json({ error: "Failed to list topics" });
  }
});

export default router;
