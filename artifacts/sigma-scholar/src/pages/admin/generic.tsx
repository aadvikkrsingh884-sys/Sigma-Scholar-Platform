import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "wouter";

// This serves as a generic placeholder for the specific admin pages
// to ensure completeness of the requested routes.
export default function AdminGenericPage({ title }: { title: string }) {
  return (
    <ProtectedRoute adminOnly>
      <Layout>
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <Button className="ml-auto">
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          </div>
          
          <Card className="border-border shadow-sm mt-8">
            <CardContent className="py-24 text-center">
              <div className="text-muted-foreground/30 mb-4 flex justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              </div>
              <h3 className="text-xl font-bold">Manage {title}</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                This is a placeholder for the {title} management interface. 
                CRUD operations for this entity would go here.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}