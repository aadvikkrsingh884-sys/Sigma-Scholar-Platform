import { Router } from "express";
import { db } from "@workspace/db";
import { notesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { classId, subjectId, chapterId } = req.query as Record<string, string>;
    let query = db.select().from(notesTable);
    const conditions = [];
    if (classId) conditions.push(eq(notesTable.classId, classId));
    if (subjectId) conditions.push(eq(notesTable.subjectId, subjectId));
    if (chapterId) conditions.push(eq(notesTable.chapterId, chapterId));
    const notes = conditions.length
      ? await db.select().from(notesTable).where(and(...conditions))
      : await db.select().from(notesTable);
    res.json(notes.map(n => ({
      id: n.id, classId: n.classId, subjectId: n.subjectId, chapterId: n.chapterId,
      title: n.title, content: n.content, pdfUrl: n.pdfUrl, type: n.type,
      createdAt: n.createdAt.toISOString(), updatedAt: n.updatedAt?.toISOString() ?? null,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list notes");
    res.status(500).json({ error: "Failed to list notes" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { classId, subjectId, chapterId, title, content, pdfUrl, type } = req.body;
    const id = randomUUID();
    const [note] = await db.insert(notesTable).values({
      id, classId, subjectId, chapterId, title,
      content: content ?? null, pdfUrl: pdfUrl ?? null, type: type ?? "text",
    }).returning();
    res.status(201).json({
      ...note, createdAt: note.createdAt.toISOString(), updatedAt: note.updatedAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create note");
    res.status(500).json({ error: "Failed to create note" });
  }
});

router.get("/:noteId", async (req, res) => {
  try {
    const [note] = await db.select().from(notesTable).where(eq(notesTable.id, req.params.noteId));
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ ...note, createdAt: note.createdAt.toISOString(), updatedAt: note.updatedAt?.toISOString() ?? null });
  } catch (err) {
    req.log.error({ err }, "Failed to get note");
    res.status(500).json({ error: "Failed to get note" });
  }
});

router.patch("/:noteId", async (req, res) => {
  try {
    const { title, content, pdfUrl, type } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (pdfUrl !== undefined) updates.pdfUrl = pdfUrl;
    if (type !== undefined) updates.type = type;
    const [note] = await db.update(notesTable).set(updates).where(eq(notesTable.id, req.params.noteId)).returning();
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ ...note, createdAt: note.createdAt.toISOString(), updatedAt: note.updatedAt?.toISOString() ?? null });
  } catch (err) {
    req.log.error({ err }, "Failed to update note");
    res.status(500).json({ error: "Failed to update note" });
  }
});

router.delete("/:noteId", async (req, res) => {
  try {
    await db.delete(notesTable).where(eq(notesTable.id, req.params.noteId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete note");
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
