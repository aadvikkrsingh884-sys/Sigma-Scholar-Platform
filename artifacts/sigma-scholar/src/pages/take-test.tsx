import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { useGetTest } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Clock, CheckCircle2, ChevronRight, ChevronLeft, Flag } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Mock questions for demo purposes
const MOCK_QUESTIONS = [
  { id: "q1", text: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
  { id: "q2", text: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
  { id: "q3", text: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
];

export default function TakeTest() {
  const { testId } = useParams();
  const [, setLocation] = useLocation();
  const { data: test, isLoading } = useGetTest(testId || "");
  
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  
  useEffect(() => {
    if (test && !started) {
      setTimeLeft(test.duration * 60);
    }
  }, [test, started]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (started && timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = () => setStarted(true);

  const handleAnswer = (optionIdx: number) => {
    setAnswers({ ...answers, [MOCK_QUESTIONS[currentQuestion].id]: optionIdx });
  };

  const handleSubmit = () => {
    toast.success("Test submitted successfully!");
    setLocation("/results");
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
            <Skeleton className="h-64 w-full max-w-2xl rounded-xl" />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!test) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
            <Card className="max-w-md w-full text-center py-12">
              <CardTitle>Test not found</CardTitle>
              <Button className="mt-4" onClick={() => setLocation("/tests")}>Back to Tests</Button>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!started) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-muted/10">
            <Card className="max-w-2xl w-full border-primary/20 shadow-lg">
              <CardHeader className="text-center pb-8 border-b border-border/50">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">{test.title}</CardTitle>
                <p className="text-muted-foreground mt-2 uppercase tracking-widest text-sm font-semibold">{test.type} TEST</p>
              </CardHeader>
              <CardContent className="py-8 grid grid-cols-2 gap-8 text-center divide-x divide-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5 text-primary" /> {test.duration} mins
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Marks</p>
                  <p className="text-2xl font-bold">{test.totalMarks}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 pt-6">
                <Button size="lg" className="w-full text-lg h-14" onClick={handleStart}>
                  Start Test Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const question = MOCK_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100;

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-lg">{test.title}</div>
          <div className={`font-mono text-xl font-bold flex items-center gap-2 px-4 py-1.5 rounded-md ${timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          <Button variant="outline" onClick={handleSubmit}>Submit Early</Button>
        </header>
        
        <main className="flex-1 container max-w-4xl mx-auto p-6 md:p-8 flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-muted-foreground">Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}</span>
              <span className="text-primary">{Math.round(progress)}% Completed</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="flex-1 shadow-md border-border/60">
            <CardContent className="p-8">
              <h3 className="text-2xl font-medium mb-8 leading-relaxed">
                <span className="text-muted-foreground mr-4 font-normal">{currentQuestion + 1}.</span>
                {question.text}
              </h3>
              
              <div className="space-y-3">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      answers[question.id] === idx 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border hover:border-primary/40 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      answers[question.id] === idx ? 'border-primary' : 'border-muted-foreground/30'
                    }`}>
                      {answers[question.id] === idx && <div className="h-3 w-3 bg-primary rounded-full" />}
                    </div>
                    <span className="text-lg">{opt}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="lg"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(c => c - 1)}
            >
              <ChevronLeft className="mr-2 h-5 w-5" /> Previous
            </Button>
            
            <Button variant="ghost" className="text-muted-foreground">
              <Flag className="mr-2 h-4 w-4" /> Flag for review
            </Button>

            {currentQuestion === MOCK_QUESTIONS.length - 1 ? (
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSubmit}>
                Submit Test <CheckCircle2 className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => setCurrentQuestion(c => c + 1)}>
                Next <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}