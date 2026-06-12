import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, FileText, Target, BookOpen } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Search() {
  const [query, setQuery] = useState("");
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 p-6 md:p-12 pt-12 max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              What do you want to learn today?
            </h2>
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
              <Input 
                placeholder="Search across chapters, notes, and tests..." 
                className="pl-14 h-16 rounded-full text-lg shadow-md border-border/60"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {query ? (
            <div className="space-y-8">
              <p className="text-muted-foreground">Showing simulated results for "{query}"</p>
              
              <div className="space-y-4">
                <Card className="hover-elevate cursor-pointer">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Science Chapter 4</h4>
                      <p className="text-muted-foreground text-sm">Matching topic: Structure of Atom</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover-elevate cursor-pointer">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Mock Test: Science</h4>
                      <p className="text-muted-foreground text-sm">Contains questions about your search</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold mb-4 text-center text-muted-foreground">Quick Links</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {['Trigonometry', 'Newton\'s Laws', 'French Revolution', 'Grammar Rules', 'Python Basics'].map(term => (
                  <Button key={term} variant="outline" className="rounded-full" onClick={() => setQuery(term)}>
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}