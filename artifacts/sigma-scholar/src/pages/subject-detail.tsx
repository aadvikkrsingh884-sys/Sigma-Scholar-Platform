import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { useListChapters } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ArrowLeft, FileText, CheckCircle2, Bookmark as BookmarkIcon, BrainCircuit, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { getUserProgress, getUserBookmarks } from "@/lib/firestore";
import { useAuth } from "@/lib/auth";

function getStoredContext(key: string) {
  try {
    const s = sessionStorage.getItem(key);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export default function SubjectDetail() {
  const { subjectId } = useParams();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: chapters, isLoading: chaptersLoading } = useListChapters(subjectId || "");

  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  // Subject context stored by ClassDetail
  const ctx = getStoredContext(`subject_${subjectId}`);
  const subjectName = ctx?.subjectName || "Subject";
  const className = ctx?.className || "";
  const classId = ctx?.classId || "";
  const subjectColor = ctx?.color || "#3B82F6";

  useEffect(() => {
    if (user && subjectId) {
      getUserProgress(user.uid).then(progList => {
        const m: Record<string, boolean> = {};
        progList.forEach(p => { if (p.completed) m[p.chapterId] = true; });
        setProgress(m);
      });
      getUserBookmarks(user.uid).then(bmList => {
        const m: Record<string, boolean> = {};
        bmList.forEach(b => { if (b.type === "chapter") m[b.refId] = true; });
        setBookmarks(m);
      });
    }
  }, [user, subjectId]);

  const completedCount = chapters?.filter(c => progress[c.id]).length || 0;
  const totalCount = chapters?.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleChapterClick = (chapter: { id: string; name: string; order: number }) => {
    const chCtx = {
      chapterName: chapter.name,
      subjectName,
      className,
      classId,
      subjectId,
      subjectColor,
    };
    sessionStorage.setItem(`chapter_${chapter.id}`, JSON.stringify(chCtx));
    navigate(`/chapter/${chapter.id}`);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="shrink-0 mt-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {className && <Badge variant="secondary" className="text-xs">{className}</Badge>}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight">{subjectName}</h1>
            </div>
          </div>

          {/* Progress bar */}
          {!chaptersLoading && totalCount > 0 && (
            <div className="mb-6 p-4 rounded-xl border border-border bg-card">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-bold">{completedCount} / {totalCount} chapters</span>
              </div>
              <Progress value={progressPercent} className="h-2.5" />
            </div>
          )}

          {/* Chapter list */}
          <div className="space-y-3">
            {chaptersLoading ? (
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
            ) : chapters?.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground bg-card border rounded-xl">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No chapters available yet.</p>
              </div>
            ) : (
              chapters?.sort((a, b) => a.order - b.order).map((chapter, idx) => {
                const isCompleted = progress[chapter.id];
                const isBkm = bookmarks[chapter.id];
                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <button
                      onClick={() => handleChapterClick(chapter)}
                      className={`w-full text-left border-2 rounded-xl p-4 transition-all duration-200 group
                        ${isCompleted
                          ? 'border-emerald-300 bg-emerald-50/60 hover:border-emerald-400'
                          : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                          ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                          {isCompleted ? '✓' : chapter.order}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base leading-snug">
                              {chapter.name}
                            </h3>
                            {isBkm && <BookmarkIcon className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {chapter.totalTopics || 5} topics</span>
                            <span className="flex items-center gap-1"><BrainCircuit className="h-3 w-3" /> {(chapter.totalTopics || 5) * 40} questions</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
