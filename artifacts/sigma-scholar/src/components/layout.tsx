import { Navbar } from "./navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t border-border/40 py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2">
            <img src="/sigma-scholar-logo.png" alt="Sigma Scholar" className="h-6 w-6 opacity-70" />
            <p className="text-sm text-muted-foreground leading-loose">
              Built with purpose by Aadvik Kumar Singh.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sigma Scholar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}