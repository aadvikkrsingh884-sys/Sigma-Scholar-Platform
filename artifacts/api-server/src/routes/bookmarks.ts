import { Router } from "express";
import { db } from "@workspace/db";
import { bookmarksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const bmarks = await db.select().from(bookmarksTable).where(eq(bookmarksTable.userId, req.params.userId));
    res.json(bmarks.map(b => ({
      id: b.id, userId: b.userId, type: b.type, refId: b.refId,
      title: b.title, subtitle: b.subtitle, createdAt: b.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get bookmarks");
    res.status(500).json({ error: "Failed to get bookmarks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, type, refId, title, subtitle } = req.body;
    const id = randomUUID();
    const [bmark] = await db.insert(bookmarksTable).values({
      id, userId, type, refId, title, subtitle: subtitle ?? null,
    }).returning();
    res.status(201).json({
      id: bmark.id, userId: bmark.userId, type: bmark.type, refId: bmark.refId,
      title: bmark.title, subtitle: bmark.subtitle, createdAt: bmark.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to add bookmark");
    res.status(500).json({ error: "Failed to add bookmark" });
  }
});

router.delete("/:bookmarkId", async (req, res) => {
  try {
    await db.delete(bookmarksTable).where(eq(bookmarksTable.id, req.params.bookmarkId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to remove bookmark");
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
});

export default router;
