import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Download, Printer, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronUp, BookOpen, FlaskConical, BrainCircuit, AlertTriangle, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateStudyNotes, generateCheatSheet, generateTestQuestions, type TestQuestion } from "@/lib/ai";
import { toast } from "sonner";

// Derive human-readable names from IDs
function parseTopicId(topicId: string) {
  // Format: classId-subjectId-chId-suffix
  const parts = topicId.split('-');
  return topicId;
}

// Question type metadata
const QUESTION_TYPE_META: Record<string, { label: string; color: string; bg: string; icon: string; desc: string }> = {
  'mcq': { label: 'MCQ', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: '🔵', desc: '1 Mark' },
  'assertion-reason': { label: 'Assertion-Reason', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: '🟣', desc: '1 Mark' },
  'true-false': { label: 'True / False', color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: '🟢', desc: '1 Mark' },
  'very-short': { label: 'Very Short Answer', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: '🟡', desc: '1 Mark' },
  'short': { label: 'Short Answer', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: '🟠', desc: '3 Marks' },
  'long': { label: 'Long Answer', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: '🔴', desc: '5 Marks' },
  'case-based': { label: 'Case-Based', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200', icon: '🩵', desc: '4 Marks' },
};

const QUESTION_TYPE_ORDER = ['mcq', 'assertion-reason', 'true-false', 'very-short', 'short', 'long', 'case-based'];

interface TestState {
  answers: Record<number, string | boolean>;
  submitted: boolean;
  score: number;
  maxScore: number;
  openAnswers: Record<number, boolean>;
}

export default function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>();

  // Parse from URL state
  const [topicName, setTopicName] = useState("Topic");
  const [chapterName, setChapterName] = useState("Chapter");
  const [subjectName, setSubjectName] = useState("Subject");
  const [className, setClassName] = useState("Class");

  // Notes state
  const [notes, setNotes] = useState<string | null>(null);
  const [cheatSheet, setCheatSheet] = useState<string | null>(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [cheatSheetLoading, setCheatSheetLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  // Test state
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testState, setTestState] = useState<TestState>({
    answers: {},
    submitted: false,
    score: 0,
    maxScore: 0,
    openAnswers: {},
  });

  const printRef = useRef<HTMLDivElement>(null);

  // Load topic info from sessionStorage (set by chapter-detail)
  useEffect(() => {
    const stored = sessionStorage.getItem(`topic_${topicId}`);
    if (stored) {
      const info = JSON.parse(stored);
      setTopicName(info.topicName || "Topic");
      setChapterName(info.chapterName || "Chapter");
      setSubjectName(info.subjectName || "Subject");
      setClassName(info.className || "Class");
    }
  }, [topicId]);

  const loadNotes = useCallback(async () => {
    if (!topicName || topicName === "Topic") return;
    setNotesLoading(true);
    setNotesError(null);
    try {
      const content = await generateStudyNotes(topicName, chapterName, subjectName, className);
      setNotes(content);
    } catch (e: any) {
      if (e.message === "AI_KEY_MISSING") {
        setNotesError("missing_key");
      } else {
        setNotesError(e.message || "Failed to generate notes");
        toast.error("Failed to generate notes");
      }
    } finally {
      setNotesLoading(false);
    }
  }, [topicName, chapterName, subjectName, className]);

  const loadCheatSheet = useCallback(async () => {
    if (!topicName || topicName === "Topic") return;
    setCheatSheetLoading(true);
    try {
      const content = await generateCheatSheet(topicName, chapterName, subjectName, className);
      setCheatSheet(content);
    } catch (e: any) {
      toast.error("Failed to generate cheat sheet");
    } finally {
      setCheatSheetLoading(false);
    }
  }, [topicName, chapterName, subjectName, className]);

  const loadTest = useCallback(async () => {
    if (!topicName || topicName === "Topic") return;
    setTestLoading(true);
    setTestError(null);
    setTestState({ answers: {}, submitted: false, score: 0, maxScore: 0, openAnswers: {} });
    try {
      const qs = await generateTestQuestions(topicName, chapterName, subjectName, className);
      setQuestions(qs);
      const maxScore = qs.reduce((sum, q) => sum + (q.marks || 1), 0);
      setTestState(s => ({ ...s, maxScore }));
    } catch (e: any) {
      if (e.message === "AI_KEY_MISSING") {
        setTestError("missing_key");
      } else {
        setTestError(e.message || "Failed to generate test");
        toast.error("Failed to generate test");
      }
    } finally {
      setTestLoading(false);
    }
  }, [topicName, chapterName, subjectName, className]);

  // Auto-load notes when topic info is ready
  useEffect(() => {
    if (topicName !== "Topic") {
      loadNotes();
    }
  }, [topicName]);

  const handleAnswer = (idx: number, value: string | boolean) => {
    if (testState.submitted) return;
    setTestState(s => ({ ...s, answers: { ...s.answers, [idx]: value } }));
  };

  const handleSubmitTest = () => {
    let score = 0;
    questions.forEach((q, i) => {
      const answer = testState.answers[i];
      if (q.type === 'mcq' || q.type === 'assertion-reason') {
        if (answer === q.correct) score += q.marks;
      } else if (q.type === 'true-false') {
        if (answer === q.correct) score += q.marks;
      }
    });
    const objMax = questions
      .filter(q => ['mcq', 'assertion-reason', 'true-false'].includes(q.type))
      .reduce((s, q) => s + q.marks, 0);
    setTestState(s => ({ ...s, submitted: true, score, maxScore: objMax }));
    toast.success("Test submitted! Check your results below.");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleAnswer = (idx: number) => {
    setTestState(s => ({
      ...s,
      openAnswers: { ...s.openAnswers, [idx]: !s.openAnswers[idx] }
    }));
  };

  const groupedQuestions = QUESTION_TYPE_ORDER.reduce((acc, type) => {
    const qs = questions.map((q, i) => ({ q, i })).filter(({ q }) => q.type === type);
    if (qs.length > 0) acc[type] = qs;
    return acc;
  }, {} as Record<string, Array<{ q: TestQuestion; i: number }>>);

  const isKeyMissing = notesError === "missing_key" || testError === "missing_key";

  const MissingKeyBanner = () => (
    <Card className="border-amber-300 bg-amber-50">
      <CardContent className="py-8 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-3" />
        <h3 className="font-bold text-lg text-amber-900 mb-2">Gemini AI Key Required</h3>
        <p className="text-amber-700 text-sm mb-4 max-w-md mx-auto">
          Study notes and test generation require a Google Gemini API key. 
          Please add <code className="bg-amber-200 px-1 rounded">VITE_GEMINI_API_KEY</code> to your environment secrets.
        </p>
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 text-sm font-medium"
        >
          Get Free Gemini API Key →
        </a>
      </CardContent>
    </Card>
  );

  const ScoreBar = ({ score, maxScore }: { score: number; maxScore: number }) => {
    const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const grade = pct >= 90 ? '🏆 Excellent!' : pct >= 75 ? '🌟 Great!' : pct >= 60 ? '👍 Good' : pct >= 40 ? '📚 Keep Practicing' : '💪 Needs Work';
    const color = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <Card className={`border-2 ${pct >= 75 ? 'border-emerald-300 bg-emerald-50' : pct >= 50 ? 'border-yellow-300 bg-yellow-50' : 'border-red-300 bg-red-50'}`}>
        <CardContent className="py-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-black">{score}/{maxScore}</div>
            <div className="text-xl font-bold mt-1">{grade}</div>
            <div className="text-sm text-muted-foreground mt-1">Objective Section Score ({Math.round(pct)}%)</div>
          </div>
          <div className="w-full bg-muted rounded-full h-4">
            <div className={`${color} h-4 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Subjective questions (Short, Long, Case-Based) are self-evaluated. Use "View Model Answer" to check your responses.
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <ProtectedRoute>
      <Layout>
        {/* Print styles */}
        <style>{`
          @media print {
            .no-print { display: none !important; }
            .print-content { display: block !important; }
            body { font-size: 12pt; }
            .prose h1 { font-size: 18pt; }
            .prose h2 { font-size: 14pt; }
            blockquote { border-left: 4px solid #F59E0B; padding-left: 12px; background: #FEF3C7; }
          }
          @media screen {
            .print-content { display: block; }
          }
        `}</style>

        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6 no-print">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="shrink-0 mt-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">{className}</Badge>
                <span className="text-muted-foreground text-xs">›</span>
                <Badge variant="outline" className="text-xs">{subjectName}</Badge>
                <span className="text-muted-foreground text-xs">›</span>
                <Badge variant="outline" className="text-xs truncate max-w-[200px]">{chapterName}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight">{topicName}</h1>
            </div>
          </div>

          {isKeyMissing && <div className="mb-6 no-print"><MissingKeyBanner /></div>}

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="mb-6 no-print w-full md:w-auto">
              <TabsTrigger value="notes" className="flex items-center gap-2 flex-1 md:flex-none">
                <BookOpen className="h-4 w-4" />
                Study Notes & Cheat Sheet
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2 flex-1 md:flex-none" onClick={() => { if (questions.length === 0 && !testLoading && !isKeyMissing) loadTest(); }}>
                <BrainCircuit className="h-4 w-4" />
                Interactive Test (40 Qs)
              </TabsTrigger>
            </TabsList>

            {/* ─────────────────── STUDY NOTES TAB ─────────────────── */}
            <TabsContent value="notes">
              <div ref={printRef} className="print-content">
                {/* Action bar */}
                <div className="flex flex-wrap gap-2 mb-6 no-print">
                  <Button variant="outline" size="sm" onClick={handlePrint} disabled={!notes && !cheatSheet}>
                    <Printer className="h-4 w-4 mr-2" />
                    Download / Print PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadNotes} disabled={notesLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${notesLoading ? 'animate-spin' : ''}`} />
                    Regenerate Notes
                  </Button>
                  {!cheatSheet && !cheatSheetLoading && (
                    <Button variant="outline" size="sm" onClick={loadCheatSheet} disabled={isKeyMissing}>
                      <FlaskConical className="h-4 w-4 mr-2" />
                      Load Cheat Sheet
                    </Button>
                  )}
                </div>

                {/* Cheat Sheet */}
                {(cheatSheetLoading || cheatSheet) && (
                  <Card className="mb-6 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-amber-900">
                        <span>⚡</span> Formula Cheat Sheet
                        {cheatSheetLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {cheatSheetLoading ? (
                        <div className="space-y-2">
                          {[1,2,3,4].map(i => <div key={i} className="h-4 bg-amber-200 rounded animate-pulse" style={{width: `${70 + i*7}%`}} />)}
                        </div>
                      ) : (
                        <div className="prose prose-amber max-w-none prose-blockquote:border-amber-400 prose-blockquote:bg-amber-100 prose-blockquote:rounded prose-blockquote:p-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cheatSheet || ''}</ReactMarkdown>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Study Notes */}
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <span>📚</span> Study Notes
                      {notesLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notesLoading ? (
                      <div className="space-y-3">
                        <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                        <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
                        <div className="h-6 bg-muted rounded animate-pulse w-2/3 mt-4" />
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded animate-pulse w-11/12" />
                        <p className="text-sm text-muted-foreground text-center mt-6 animate-pulse">
                          🤖 Generating comprehensive study notes with Gemini AI...
                        </p>
                      </div>
                    ) : notesError && notesError !== "missing_key" ? (
                      <div className="text-center py-8">
                        <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                        <p className="text-muted-foreground">{notesError}</p>
                        <Button variant="outline" className="mt-4" onClick={loadNotes}>Try Again</Button>
                      </div>
                    ) : notes ? (
                      <div className="prose prose-slate dark:prose-invert max-w-none
                        prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-6 prose-h3:text-lg
                        prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                        prose-code:bg-muted prose-code:px-1 prose-code:rounded
                        prose-table:border prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ─────────────────── TEST TAB ─────────────────── */}
            <TabsContent value="test">
              {testError === "missing_key" ? (
                <MissingKeyBanner />
              ) : testLoading ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Generating 40-Question Assessment...</h3>
                    <p className="text-muted-foreground text-sm">Creating MCQs, Assertion-Reason, True/False, Short & Long answers, and Case-based questions</p>
                  </CardContent>
                </Card>
              ) : testError ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">{testError}</p>
                    <Button onClick={loadTest}>Try Again</Button>
                  </CardContent>
                </Card>
              ) : questions.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <BrainCircuit className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-bold text-xl mb-2">Ready for Your Assessment?</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      40 questions covering MCQs, Assertion-Reason, True/False, VSA, SA, LA, and Case-Based questions. Auto-graded with model answers.
                    </p>
                    <Button size="lg" onClick={loadTest} disabled={isKeyMissing}>
                      <BrainCircuit className="h-5 w-5 mr-2" />
                      Start 40-Question Test
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Score (shown after submission) */}
                  {testState.submitted && (
                    <ScoreBar score={testState.score} maxScore={testState.maxScore} />
                  )}

                  {/* Question Type Summary */}
                  <div className="flex flex-wrap gap-2 no-print">
                    {QUESTION_TYPE_ORDER.map(type => {
                      const meta = QUESTION_TYPE_META[type];
                      const count = questions.filter(q => q.type === type).length;
                      if (!count) return null;
                      return (
                        <Badge key={type} variant="outline" className={`${meta.color} text-xs`}>
                          {meta.icon} {meta.label}: {count} ({meta.desc})
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Questions by type */}
                  {QUESTION_TYPE_ORDER.map(type => {
                    const group = groupedQuestions[type];
                    if (!group) return null;
                    const meta = QUESTION_TYPE_META[type];

                    return (
                      <div key={type}>
                        <div className={`flex items-center gap-2 mb-3 p-3 rounded-lg border ${meta.bg}`}>
                          <span className="text-lg">{meta.icon}</span>
                          <div>
                            <h3 className={`font-bold ${meta.color}`}>{meta.label}</h3>
                            <p className="text-xs text-muted-foreground">{group.length} questions · {meta.desc} each</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {group.map(({ q, i }) => (
                            <QuestionCard
                              key={i}
                              q={q}
                              index={i}
                              globalIndex={questions.indexOf(q)}
                              answer={testState.answers[i]}
                              submitted={testState.submitted}
                              isOpen={testState.openAnswers[i]}
                              onAnswer={handleAnswer}
                              onToggleAnswer={toggleAnswer}
                              meta={meta}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Submit / New Test */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {!testState.submitted ? (
                      <Button size="lg" onClick={handleSubmitTest} className="flex-1 md:flex-none">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Submit Test & Get Score
                      </Button>
                    ) : (
                      <Button size="lg" variant="outline" onClick={loadTest} className="flex-1 md:flex-none">
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Generate New Test
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

// ─────────────────── Question Card Component ───────────────────
interface QuestionCardProps {
  q: TestQuestion;
  index: number;
  globalIndex: number;
  answer: string | boolean | undefined;
  submitted: boolean;
  isOpen: boolean;
  onAnswer: (idx: number, val: string | boolean) => void;
  onToggleAnswer: (idx: number) => void;
  meta: typeof QUESTION_TYPE_META[string];
}

function QuestionCard({ q, index, globalIndex, answer, submitted, isOpen, onAnswer, onToggleAnswer, meta }: QuestionCardProps) {
  const isObjective = ['mcq', 'assertion-reason', 'true-false'].includes(q.type);
  const isCorrect = submitted && isObjective && answer === q.correct;
  const isWrong = submitted && isObjective && answer !== undefined && answer !== q.correct;

  return (
    <Card className={`border ${
      submitted && isObjective 
        ? isCorrect ? 'border-emerald-300 bg-emerald-50/50' : isWrong ? 'border-red-300 bg-red-50/50' : 'border-muted'
        : 'border-border'
    }`}>
      <CardContent className="pt-4 pb-4">
        {/* Question header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${meta.bg} ${meta.color} border`}>
            {globalIndex + 1}
          </div>
          <div className="flex-1">
            {/* Case-based: show passage first */}
            {q.type === 'case-based' && q.passage && (
              <div className="mb-3 p-3 bg-muted rounded-lg text-sm leading-relaxed border-l-4 border-teal-400">
                <p className="font-semibold text-teal-700 text-xs mb-1">📄 CASE STUDY</p>
                {q.passage}
              </div>
            )}
            <p className="text-base font-medium leading-relaxed whitespace-pre-line">{q.question}</p>
          </div>
          <div className="shrink-0 flex items-center gap-1">
            {submitted && isObjective && (
              isCorrect 
                ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                : isWrong ? <XCircle className="h-5 w-5 text-red-500" /> : null
            )}
            <Badge variant="outline" className="text-xs">{q.marks}m</Badge>
          </div>
        </div>

        {/* MCQ options */}
        {(q.type === 'mcq' || q.type === 'assertion-reason') && q.options && (
          <div className="space-y-2 ml-11">
            {q.options.map((opt, oi) => {
              const isSelected = answer === opt;
              const isCorrectOpt = submitted && opt === q.correct;
              const isWrongOpt = submitted && isSelected && opt !== q.correct;
              return (
                <button
                  key={oi}
                  onClick={() => onAnswer(index, opt)}
                  disabled={submitted}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all
                    ${isCorrectOpt ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-medium' :
                      isWrongOpt ? 'border-red-400 bg-red-50 text-red-800' :
                      isSelected ? 'border-primary bg-primary/10 font-medium' :
                      'border-border hover:border-muted-foreground hover:bg-muted/50'}
                    ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {opt}
                  {isCorrectOpt && submitted && <span className="ml-2 text-emerald-600">✓ Correct</span>}
                  {isWrongOpt && <span className="ml-2 text-red-500">✗ Wrong</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* True/False */}
        {q.type === 'true-false' && (
          <div className="flex gap-3 ml-11">
            {[true, false].map(val => {
              const label = val ? 'True' : 'False';
              const isSelected = answer === val;
              const isCorrectOpt = submitted && val === q.correct;
              const isWrongOpt = submitted && isSelected && val !== q.correct;
              return (
                <button
                  key={label}
                  onClick={() => onAnswer(index, val)}
                  disabled={submitted}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all
                    ${isCorrectOpt ? 'border-emerald-400 bg-emerald-50 text-emerald-800' :
                      isWrongOpt ? 'border-red-400 bg-red-50 text-red-800' :
                      isSelected ? 'border-primary bg-primary/10' :
                      'border-border hover:border-muted-foreground hover:bg-muted/50'}
                    ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {val ? '✅ True' : '❌ False'}
                </button>
              );
            })}
          </div>
        )}

        {/* Subjective: text input */}
        {['very-short', 'short', 'long'].includes(q.type) && (
          <div className="ml-11 mt-2">
            <textarea
              className="w-full border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={q.type === 'very-short' ? 1 : q.type === 'short' ? 3 : 6}
              placeholder={
                q.type === 'very-short' ? 'Write your answer (one word/line)...' :
                q.type === 'short' ? 'Write your answer (30-50 words)...' :
                'Write your detailed answer (80-120 words)...'
              }
              value={typeof answer === 'string' ? answer : ''}
              onChange={e => onAnswer(index, e.target.value)}
              disabled={submitted}
            />
          </div>
        )}

        {/* Case-based sub-questions */}
        {q.type === 'case-based' && q.subQuestions && (
          <div className="ml-11 mt-3 space-y-3">
            {q.subQuestions.map((sq, si) => (
              <div key={si} className="border border-border rounded-lg p-3">
                <p className="text-sm font-medium mb-2">({String.fromCharCode(97 + si)}) {sq.question} <Badge variant="outline" className="ml-1 text-xs">{sq.marks}m</Badge></p>
                <textarea
                  className="w-full border border-muted rounded p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/20"
                  rows={2}
                  placeholder="Your answer..."
                  disabled={submitted}
                />
                {submitted && (
                  <div className="mt-2 p-2 bg-teal-50 border border-teal-200 rounded text-sm">
                    <p className="text-xs font-semibold text-teal-700 mb-1">Model Answer:</p>
                    <p className="text-teal-800">{sq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Model answer for objective (after submit) */}
        {submitted && isObjective && q.modelAnswer && (
          <div className="ml-11 mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded text-sm">
            <p className="text-xs text-emerald-700 font-semibold">Explanation:</p>
            <p className="text-emerald-800">{q.modelAnswer}</p>
          </div>
        )}

        {/* Model answer toggle for subjective */}
        {['very-short', 'short', 'long'].includes(q.type) && q.modelAnswer && (
          <Collapsible open={isOpen} onOpenChange={() => onToggleAnswer(index)} className="ml-11 mt-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                {isOpen ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                {isOpen ? 'Hide' : 'View'} Model Answer
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm whitespace-pre-line">
                <p className="text-xs font-semibold text-blue-700 mb-1">📝 Model Answer:</p>
                <p className="text-blue-900 leading-relaxed">{q.modelAnswer}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
