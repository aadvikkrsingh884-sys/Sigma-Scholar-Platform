import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading, isAdminUser } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (adminOnly && !isAdminUser) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-center px-4">
        <h1 className="text-4xl font-bold text-foreground">Access Denied</h1>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          You do not have permission to view this page. If you believe this is an error, please contact an administrator.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}