import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { useListSubjects, useListClasses } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ArrowLeft, BookMarked, Calculator, FlaskConical, Globe2, BookOpen, Leaf, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SUBJECT_ICON_MAP: Record<string, React.ReactNode> = {
  'mathematics': <Calculator className="h-6 w-6" />,
  'science': <FlaskConical className="h-6 w-6" />,
  'physics': <Zap className="h-6 w-6" />,
  'chemistry': <FlaskConical className="h-6 w-6" />,
  'biology': <Leaf className="h-6 w-6" />,
  'english': <BookOpen className="h-6 w-6" />,
  'hindi': <BookOpen className="h-6 w-6" />,
  'social science': <Globe2 className="h-6 w-6" />,
  'history': <Globe2 className="h-6 w-6" />,
  'geography': <Globe2 className="h-6 w-6" />,
  'civics': <Globe2 className="h-6 w-6" />,
  'political science': <Globe2 className="h-6 w-6" />,
  'economics': <Globe2 className="h-6 w-6" />,
};

function getSubjectIcon(name: string) {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(SUBJECT_ICON_MAP)) {
    if (key.includes(k)) return v;
  }
  return <BookMarked className="h-6 w-6" />;
}

export default function ClassDetail() {
  const { classId } = useParams();
  const [, navigate] = useLocation();
  const { data: subjects, isLoading: subjectsLoading } = useListSubjects(classId || "");
  const { data: classes } = useListClasses();

  const currentClass = classes?.find(c => c.id === classId);

  const handleSubjectClick = (subject: { id: string; name: string; color: string; totalChapters?: number | null }) => {
    const ctx = {
      subjectName: subject.name,
      className: currentClass?.name || "",
      classId: classId || "",
      color: subject.color,
    };
    sessionStorage.setItem(`subject_${subject.id}`, JSON.stringify(ctx));
    navigate(`/subject/${subject.id}`);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground">
                {currentClass?.name || <Skeleton className="h-8 w-32 inline-block" />}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">Select a subject to explore chapters and topics</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjectsLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)
            ) : subjects?.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <BookMarked className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No subjects found for this class.</p>
              </div>
            ) : (
              subjects?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((subject, idx) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <button
                    onClick={() => handleSubjectClick(subject)}
                    className="w-full text-left rounded-2xl border-2 border-border overflow-hidden hover:border-opacity-80 hover:shadow-lg transition-all duration-200 group bg-card"
                    style={{ borderColor: `${subject.color}40` }}
                  >
                    {/* Color banner */}
                    <div className="h-2 w-full" style={{ backgroundColor: subject.color }} />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div 
                          className="p-2.5 rounded-xl"
                          style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                        >
                          {getSubjectIcon(subject.name)}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform mt-0.5" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground leading-tight mb-1">{subject.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-muted-foreground">{subject.totalChapters || 0} chapters</span>
                        <Badge variant="outline" className="text-xs" style={{ color: subject.color, borderColor: `${subject.color}50` }}>
                          {(subject.totalChapters || 0) * 5 * 40} questions
                        </Badge>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
