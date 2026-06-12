import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { useListNotes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, FileText, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Notes() {
  const { data: notes, isLoading } = useListNotes();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredNotes = notes?.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || note.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                Notes Library
              </h2>
              <p className="text-muted-foreground">Premium study materials for all subjects.</p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search notes..." 
                  className="pl-9 bg-card border-border/60"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px] bg-card">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDFs</SelectItem>
                  <SelectItem value="text">Text Notes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))
            ) : filteredNotes?.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-card rounded-xl border border-dashed border-border">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium text-foreground">No notes found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              filteredNotes?.map((note) => (
                <Card key={note.id} className="hover-elevate flex flex-col border-border shadow-sm transition-all hover:border-primary/40 group overflow-hidden">
                  <div className={`h-1.5 w-full ${note.type === 'pdf' ? 'bg-red-500' : 'bg-primary'}`} />
                  <CardHeader className="pb-3 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-muted rounded-md">
                        {note.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {note.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    {note.type === 'pdf' ? (
                      <Button className="w-full bg-card hover:bg-muted text-foreground border border-border group-hover:border-red-500/30 group-hover:text-red-500 transition-colors" onClick={() => note.pdfUrl && window.open(note.pdfUrl, '_blank')}>
                        <Download className="h-4 w-4 mr-2" /> Download PDF
                      </Button>
                    ) : (
                      <Button className="w-full" variant="default">
                        Read Note
                      </Button>
                    )}
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