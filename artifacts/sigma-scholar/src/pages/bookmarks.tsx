import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark as BookmarkIcon, FileText, PlayCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getUserBookmarks, removeBookmark } from "@/lib/firestore";
import { Bookmark } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Bookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserBookmarks(user.uid).then(data => {
        setBookmarks(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleRemove = async (id: string) => {
    await removeBookmark(id);
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'note': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'test': return <PlayCircle className="h-5 w-5 text-emerald-500" />;
      default: return <BookmarkIcon className="h-5 w-5 text-primary" />;
    }
  };

  const getLink = (type: string, refId: string) => {
    switch (type) {
      case 'note': return `/notes/${refId}`;
      case 'test': return `/test/${refId}`;
      default: return `/chapter/${refId}`;
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
          <div className="flex flex-col gap-1 mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BookmarkIcon className="h-8 w-8 text-primary fill-primary" />
              Bookmarks
            </h2>
            <p className="text-muted-foreground">Your saved chapters, notes, and tests.</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="py-24 text-center">
              <BookmarkIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-bold text-foreground">No bookmarks yet</h3>
              <p className="text-muted-foreground mt-2">Save important items to find them easily later.</p>
              <Button className="mt-6" asChild>
                <Link href="/classes">Explore Classes</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {bookmarks.map(bookmark => (
                <Card key={bookmark.id} className="hover-elevate">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-muted rounded-xl">
                        {getIcon(bookmark.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg line-clamp-1">{bookmark.title}</h4>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">{bookmark.type}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleRemove(bookmark.id)}>
                        Remove
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={getLink(bookmark.type, bookmark.refId)}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}