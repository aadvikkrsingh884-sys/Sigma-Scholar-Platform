import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, AlertCircle, PlayCircle, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Results() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Results & Analytics
            </h2>
            <p className="text-muted-foreground">Track your performance and test history.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Average Score
                  <Trophy className="h-4 w-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">85%</div>
                <p className="text-sm text-muted-foreground mt-1">Across 12 tests</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Tests Attempted
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">12</div>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Weakest Subject
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Science</div>
                <p className="text-sm text-muted-foreground mt-1">Average: 72%</p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">Recent Tests</h3>
          
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
                <div>
                  <h4 className="font-bold text-lg">Mathematics - Chapter {i} Test</h4>
                  <p className="text-sm text-muted-foreground">Completed 2 days ago • 45 mins taken</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">92%</div>
                    <div className="text-sm text-muted-foreground">46/50 Marks</div>
                  </div>
                  <Button variant="outline">Review</Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center p-8 bg-muted/30 rounded-xl border border-border">
            <h3 className="text-lg font-bold mb-2">Ready to improve your score?</h3>
            <p className="text-muted-foreground mb-4">Take a mock exam to see where you stand.</p>
            <Button asChild>
              <Link href="/tests">Browse Tests</Link>
            </Button>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}