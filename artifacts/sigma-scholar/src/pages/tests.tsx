import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { useListTests } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Target, Clock, AlertCircle, PlayCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Tests() {
  const { data: tests, isLoading } = useListTests();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredTests = tests?.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || test.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mock': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'exam': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'chapter': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'subject': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Target className="h-8 w-8 text-primary" />
                Tests & Exams
              </h2>
              <p className="text-muted-foreground">Practice chapter-wise tests or full mock exams.</p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tests..." 
                  className="pl-9 bg-card border-border/60"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] bg-card">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Test Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tests</SelectItem>
                  <SelectItem value="chapter">Chapter Tests</SelectItem>
                  <SelectItem value="subject">Subject Tests</SelectItem>
                  <SelectItem value="mock">Mock Exams</SelectItem>
                  <SelectItem value="exam">Final Exams</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))
            ) : filteredTests?.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-card rounded-xl border border-dashed border-border">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium text-foreground">No tests found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              filteredTests?.map((test) => (
                <Card key={test.id} className="hover-elevate flex flex-col border-border shadow-sm transition-all hover:border-primary/40 group">
                  <CardHeader className="pb-3 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className={`font-semibold uppercase tracking-wider ${getTypeColor(test.type)}`}>
                        {test.type}
                      </Badge>
                      <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        <Clock className="h-3 w-3 mr-1" />
                        {test.duration}m
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 mt-1">
                      {test.title}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-2 font-medium flex gap-4">
                      <span>{test.totalMarks} Marks</span>
                      {test.totalQuestions && <span>{test.totalQuestions} Questions</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" asChild>
                      <Link href={`/test/${test.id}`}>
                        <PlayCircle className="h-4 w-4 mr-2" /> Start Test
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}