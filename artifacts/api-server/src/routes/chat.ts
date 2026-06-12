import { Router } from "express";
import { db } from "@workspace/db";
import { chatHistoryTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const messages = await db
      .select()
      .from(chatHistoryTable)
      .where(eq(chatHistoryTable.userId, req.params.userId))
      .orderBy(chatHistoryTable.createdAt);
    res.json(messages.map(m => ({
      id: m.id, userId: m.userId, role: m.role, content: m.content,
      createdAt: m.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get chat history");
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, role, content } = req.body;
    const id = randomUUID();
    const [msg] = await db.insert(chatHistoryTable).values({ id, userId, role, content }).returning();
    res.status(201).json({
      id: msg.id, userId: msg.userId, role: msg.role, content: msg.content,
      createdAt: msg.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to save chat message");
    res.status(500).json({ error: "Failed to save chat message" });
  }
});

export default router;
