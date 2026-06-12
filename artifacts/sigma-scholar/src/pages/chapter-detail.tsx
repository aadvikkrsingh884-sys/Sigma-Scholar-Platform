import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { useListTopics } from "@workspace/api-client-react";
import { Link, useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, Bookmark as BookmarkIcon, BookOpen, BrainCircuit, ChevronRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getProgress, saveProgress, isBookmarked, addBookmark } from "@/lib/firestore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useListChapters, useListSubjects } from "@workspace/api-client-react";

const TOPIC_ICONS = ['🔭', '📐', '⚗️', '🧮', '📝'];
const TOPIC_COLORS = [
  'border-blue-200 bg-blue-50/60 hover:border-blue-400',
  'border-purple-200 bg-purple-50/60 hover:border-purple-400',
  'border-amber-200 bg-amber-50/60 hover:border-amber-400',
  'border-emerald-200 bg-emerald-50/60 hover:border-emerald-400',
  'border-rose-200 bg-rose-50/60 hover:border-rose-400',
];

// Collect context from URL params via sessionStorage pattern
function getStoredContext(key: string) {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export default function ChapterDetail() {
  const { chapterId } = useParams();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  const { data: topics, isLoading: topicsLoading } = useListTopics(chapterId || "");

  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Chapter context (stored by SubjectDetail when navigating here)
  const chapterCtx = getStoredContext(`chapter_${chapterId}`);
  const chapterName = chapterCtx?.chapterName || "Chapter";
  const subjectName = chapterCtx?.subjectName || "";
  const className = chapterCtx?.className || "";
  const subjectColor = chapterCtx?.subjectColor || "#3B82F6";

  useEffect(() => {
    if (user && chapterId) {
      getProgress(user.uid, chapterId).then(p => {
        if (p) setCompleted(p.completed);
      });
      isBookmarked(user.uid, chapterId).then(bm => setBookmarked(bm));
    }
  }, [user, chapterId]);

  const toggleComplete = async () => {
    if (!user || !chapterId) return;
    try {
      await saveProgress({
        userId: user.uid,
        chapterId,
        subjectId: chapterCtx?.subjectId || "unknown",
        classId: chapterCtx?.classId || "unknown",
        completed: !completed
      });
      setCompleted(!completed);
      toast.success(!completed ? "Chapter marked as completed! 🎉" : "Progress updated");
    } catch {
      toast.error("Failed to update progress");
    }
  };

  const toggleBookmark = async () => {
    if (!user || !chapterId) return;
    try {
      if (!bookmarked) {
        await addBookmark({ userId: user.uid, type: "chapter", refId: chapterId, title: chapterName });
        setBookmarked(true);
        toast.success("Chapter bookmarked!");
      } else {
        setBookmarked(false);
        toast.success("Bookmark removed");
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  // Navigate to topic, storing context in sessionStorage
  const handleTopicClick = (topic: { id: string; name: string; order: number }) => {
    const topicContext = {
      topicName: topic.name,
      chapterName,
      subjectName,
      className,
      classId: chapterCtx?.classId,
      subjectId: chapterCtx?.subjectId,
      chapterId,
    };
    sessionStorage.setItem(`topic_${topic.id}`, JSON.stringify(topicContext));
    navigate(`/topic/${topic.id}`);
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
                {subjectName && <><span className="text-muted-foreground text-xs">›</span><Badge variant="outline" className="text-xs">{subjectName}</Badge></>}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight">{chapterName}</h1>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={toggleBookmark} className={bookmarked ? "text-amber-600 border-amber-300 bg-amber-50" : ""}>
                <BookmarkIcon className={`h-4 w-4 ${bookmarked ? "fill-amber-500" : ""}`} />
              </Button>
              <Button 
                size="sm" 
                variant={completed ? "outline" : "default"}
                onClick={toggleComplete}
                className={completed ? "text-emerald-600 border-emerald-300 bg-emerald-50" : ""}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                {completed ? "Done ✓" : "Mark Done"}
              </Button>
            </div>
          </div>

          {/* Chapter Stats Banner */}
          <div 
            className="rounded-2xl p-5 mb-8 text-white"
            style={{ background: `linear-gradient(135deg, ${subjectColor}ee, ${subjectColor}99)` }}
          >
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-2xl font-black">{topics?.length || 5}</div>
                <div className="text-white/80 text-sm">Topics</div>
              </div>
              <div>
                <div className="text-2xl font-black">{(topics?.length || 5) * 40}</div>
                <div className="text-white/80 text-sm">Practice Questions</div>
              </div>
              <div>
                <div className="text-2xl font-black">AI</div>
                <div className="text-white/80 text-sm">Powered Notes</div>
              </div>
            </div>
            <p className="mt-3 text-white/90 text-sm">
              Select any topic below to access study notes, cheat sheets, and a 40-question interactive test.
            </p>
          </div>

          {/* Topics Grid */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Topics in this Chapter
            </h2>

            {topicsLoading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : !topics || topics.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>Topics are being added to this chapter.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {topics.sort((a, b) => a.order - b.order).map((topic, idx) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <button
                      onClick={() => handleTopicClick(topic)}
                      className={`w-full text-left border-2 rounded-xl p-4 transition-all duration-200 ${TOPIC_COLORS[idx % TOPIC_COLORS.length]}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                          {TOPIC_ICONS[idx % TOPIC_ICONS.length]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Topic {topic.order}</span>
                          </div>
                          <h3 className="font-bold text-foreground text-base leading-snug">{topic.name}</h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <BookOpen className="h-3 w-3" /> Study Notes
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <BrainCircuit className="h-3 w-3" /> 40 Questions
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
