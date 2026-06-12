import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, progressTable, bookmarksTable, chatHistoryTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await db.select().from(usersTable);
    res.json(users.map(u => ({
      id: u.id, email: u.email, displayName: u.displayName, photoURL: u.photoUrl,
      classId: u.classId, className: u.className, isAdmin: u.isAdmin,
      createdAt: u.createdAt.toISOString(), lastActive: u.lastActive?.toISOString() ?? null,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list users");
    res.status(500).json({ error: "Failed to list users" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.params.userId));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      id: user.id, email: user.email, displayName: user.displayName, photoURL: user.photoUrl,
      classId: user.classId, className: user.className, isAdmin: user.isAdmin,
      createdAt: user.createdAt.toISOString(), lastActive: user.lastActive?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get user");
    res.status(500).json({ error: "Failed to get user" });
  }
});

router.patch("/:userId", async (req, res) => {
  try {
    const { displayName, classId, photoURL } = req.body;
    const updates: Record<string, unknown> = { lastActive: new Date() };
    if (displayName !== undefined) updates.displayName = displayName;
    if (classId !== undefined) updates.classId = classId;
    if (photoURL !== undefined) updates.photoUrl = photoURL;
    const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.params.userId)).returning();
    if (!user) {
      const { displayName: dn, classId: ci } = req.body;
      const [newUser] = await db.insert(usersTable).values({
        id: req.params.userId, email: req.body.email ?? "", displayName: dn ?? "User",
        classId: ci ?? null,
      }).returning();
      return res.json({
        id: newUser.id, email: newUser.email, displayName: newUser.displayName, photoURL: newUser.photoUrl,
        classId: newUser.classId, className: newUser.className, isAdmin: newUser.isAdmin,
        createdAt: newUser.createdAt.toISOString(), lastActive: null,
      });
    }
    res.json({
      id: user.id, email: user.email, displayName: user.displayName, photoURL: user.photoUrl,
      classId: user.classId, className: user.className, isAdmin: user.isAdmin,
      createdAt: user.createdAt.toISOString(), lastActive: user.lastActive?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update user");
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
