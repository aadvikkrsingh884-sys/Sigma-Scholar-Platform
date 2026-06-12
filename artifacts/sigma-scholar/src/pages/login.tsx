import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { GraduationCap } from "lucide-react";

export default function Login() {
  const { user, signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-muted/30 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <img src="/sigma-scholar-logo.png" alt="Sigma Scholar Logo" className="h-16 w-16 mb-4 drop-shadow-md" />
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to continue your learning journey.</p>
        </div>

        <Card className="border-border shadow-xl shadow-primary/5">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Use your Google account to access Sigma Scholar
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full h-12 text-base font-medium relative group"
              onClick={handleSignIn}
            >
              <FcGoogle className="h-6 w-6 mr-2 absolute left-4 group-hover:scale-110 transition-transform" />
              Continue with Google
            </Button>
            
            <div className="relative mt-4 mb-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Secure Login</span>
              </div>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}