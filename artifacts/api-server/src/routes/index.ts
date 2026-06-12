import { Router, type IRouter } from "express";
import healthRouter from "./health";
import syllabusRouter from "./syllabus";
import notesRouter from "./notes";
import testsRouter from "./tests";
import usersRouter from "./users";
import progressRouter from "./progress";
import bookmarksRouter from "./bookmarks";
import chatRouter from "./chat";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/syllabus", syllabusRouter);
router.use("/notes", notesRouter);
router.use("/tests", testsRouter);
router.use("/users", usersRouter);
router.use("/progress", progressRouter);
router.use("/bookmarks", bookmarksRouter);
router.use("/chat", chatRouter);
router.use("/stats", statsRouter);
router.get("/results", (req, res, next) => {
  req.url = "/results";
  statsRouter(req, res, next);
});

export default router;
