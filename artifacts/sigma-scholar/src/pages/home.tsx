import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Bot, BrainCircuit, GraduationCap, LayoutDashboard, Target } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background w-full overflow-hidden">
      <nav className="flex items-center justify-between p-6 container mx-auto z-10 relative">
        <div className="flex items-center gap-3">
          <img src="/sigma-scholar-logo.png" alt="Sigma Scholar Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-foreground">Sigma Scholar</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-base">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-6">
              Start Learning
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-40 px-6 overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background -z-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] bg-[size:50px_50px] -z-10" />
          
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  <span className="text-sm font-medium">CBSE Classes 6-12</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                  Learn Smarter, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-500">
                    Score Higher.
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  The ultimate companion for CBSE students. Structured NCERT learning, AI-powered doubt solving, and intelligent tests—all in one premium platform.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link href="/login">
                    <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                      Join Sigma Scholar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 relative w-full max-w-lg lg:max-w-none"
              >
                {/* Abstract visualization instead of image to save generation time */}
                <div className="relative aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl opacity-50 absolute inset-0 mix-blend-screen" />
                <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
                  <div className="h-12 border-b border-border bg-muted/50 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col gap-6 bg-background">
                    <div className="flex gap-4 items-center">
                      <div className="h-16 w-16 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <BrainCircuit className="h-8 w-8" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted/50 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-12 bg-muted/30 rounded-lg border border-border w-full" />
                      <div className="h-12 bg-muted/30 rounded-lg border border-border w-full" />
                      <div className="h-12 bg-muted/30 rounded-lg border border-border w-3/4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30 px-6">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need to excel</h2>
              <p className="text-lg text-muted-foreground">Built by a student, for students. We know exactly what it takes to master the CBSE curriculum.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Structured Learning</h3>
                <p className="text-muted-foreground">Complete NCERT syllabus broken down into digestible chapters, topics, and premium study notes.</p>
              </div>
              
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Smart Testing</h3>
                <p className="text-muted-foreground">Chapter-wise tests, mock exams, and instant performance analytics to identify your weak spots.</p>
              </div>
              
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">AI Assistant</h3>
                <p className="text-muted-foreground">Stuck on a problem at 2 AM? Our Gemini-powered AI tutor is always available to explain concepts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Story */}
        <section className="py-24 px-6 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Built by a student, <br />for students.</h2>
                <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed mb-6">
                  "I built Sigma Scholar because I was tired of scattered notes, confusing interfaces, and boring study materials. Learning should feel like an adventure, not a chore."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                    AK
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Aadvik Kumar Singh</p>
                    <p className="text-primary-foreground/70">Class 9 Student & Founder</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 rounded-full" />
                  <img src="/sigma-scholar-logo.png" alt="Sigma Scholar" className="relative h-64 w-64 md:h-80 md:w-80 object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 text-center border-t border-border bg-background">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Sigma Scholar. Empowering students worldwide.
        </p>
      </footer>
    </div>
  );
}