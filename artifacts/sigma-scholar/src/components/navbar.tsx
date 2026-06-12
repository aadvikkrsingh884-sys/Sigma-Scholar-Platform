import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Search, 
  User as UserIcon,
  ShieldCheck,
  Bot
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, signOut, isAdminUser } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <img src="/sigma-scholar-logo.png" alt="Sigma Scholar" className="h-8 w-8 object-contain" />
            <span className="hidden font-bold text-lg text-foreground sm:inline-block">
              Sigma Scholar
            </span>
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard" className={`transition-colors hover:text-foreground/80 ${location === "/dashboard" ? "text-foreground" : "text-foreground/60"}`}>
                Dashboard
              </Link>
              <Link href="/classes" className={`transition-colors hover:text-foreground/80 ${location.startsWith("/class") ? "text-foreground" : "text-foreground/60"}`}>
                Classes
              </Link>
              <Link href="/notes" className={`transition-colors hover:text-foreground/80 ${location === "/notes" ? "text-foreground" : "text-foreground/60"}`}>
                Notes
              </Link>
              <Link href="/tests" className={`transition-colors hover:text-foreground/80 ${location.startsWith("/test") ? "text-foreground" : "text-foreground/60"}`}>
                Tests
              </Link>
              {isAdminUser && (
                <Link href="/admin" className={`transition-colors hover:text-foreground/80 ${location.startsWith("/admin") ? "text-primary font-semibold" : "text-foreground/60"}`}>
                  Admin
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/search">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Bot className="h-5 w-5" />
                  <span className="sr-only">AI Assistant</span>
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.displayName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground text-truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer flex items-center w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center w-full">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdminUser && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer flex items-center w-full">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          <span>Admin Console</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col gap-6 py-6">
                      <Link href="/dashboard" className="text-lg font-medium text-foreground hover:text-primary">Dashboard</Link>
                      <Link href="/classes" className="text-lg font-medium text-foreground hover:text-primary">Classes</Link>
                      <Link href="/notes" className="text-lg font-medium text-foreground hover:text-primary">Notes Library</Link>
                      <Link href="/tests" className="text-lg font-medium text-foreground hover:text-primary">Tests & Exams</Link>
                      <Link href="/bookmarks" className="text-lg font-medium text-foreground hover:text-primary">Bookmarks</Link>
                      {isAdminUser && (
                        <Link href="/admin" className="text-lg font-medium text-primary">Admin Console</Link>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}