import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Target, Clock, Trophy, Flame, BrainCircuit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  
  // In a real implementation we would fetch user-specific stats
  // For now using the generic stats just for visual structure
  const { data: stats, isLoading } = useGetDashboardStats();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome back, {user?.displayName?.split(" ")[0]}!
              </h2>
              <p className="text-muted-foreground mt-1 text-lg">
                Ready to crush your goals today?
              </p>
            </div>
            <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20">
              <Flame className="h-5 w-5 fill-secondary" />
              <span className="font-bold">3 Day Streak</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/classes">
              <Card className="hover-elevate cursor-pointer border-border/60 shadow-sm transition-all hover:border-primary/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Continue Learning</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Science</div>
                  <p className="text-xs text-muted-foreground mt-1">Chapter 4: Structure of Atom</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tests">
              <Card className="hover-elevate cursor-pointer border-border/60 shadow-sm transition-all hover:border-primary/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Take a Test</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Mock Exams</div>
                  <p className="text-xs text-muted-foreground mt-1">Test your knowledge</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/notes">
              <Card className="hover-elevate cursor-pointer border-border/60 shadow-sm transition-all hover:border-primary/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Recent Notes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Maths</div>
                  <p className="text-xs text-muted-foreground mt-1">Quadratic Equations PDF</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/results">
              <Card className="hover-elevate cursor-pointer border-border/60 shadow-sm transition-all hover:border-primary/50 group bg-primary/5 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Trophy className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">85%</div>
                  <p className="text-xs text-muted-foreground mt-1">Top 10% of class</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Subjects Overview */}
            <Card className="col-span-4 border-border shadow-sm">
              <CardHeader>
                <CardTitle>Your Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Mathematics", progress: 65, color: "bg-blue-500" },
                    { name: "Science", progress: 42, color: "bg-emerald-500" },
                    { name: "English", progress: 80, color: "bg-orange-500" },
                    { name: "Social Science", progress: 30, color: "bg-amber-500" }
                  ].map((sub) => (
                    <div key={sub.name} className="flex items-center gap-4">
                      <div className={`w-2 h-10 rounded-full ${sub.color}`} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm leading-none">{sub.name}</p>
                          <span className="text-xs text-muted-foreground">{sub.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/classes">View All Classes & Subjects</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant Promo */}
            <Card className="col-span-3 border-border shadow-sm bg-gradient-to-br from-indigo-900/10 via-background to-background relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="h-32 w-32" />
              </div>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Ask our AI Assistant anything</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-muted-foreground mb-6">
                  Stuck on a tough math problem or need a concept explained simply? Our Gemini-powered AI tutor is ready to help 24/7.
                </p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                  <Link href="/ai-assistant">Chat with AI</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}