import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Classes from "@/pages/classes";
import ClassDetail from "@/pages/class-detail";
import SubjectDetail from "@/pages/subject-detail";
import ChapterDetail from "@/pages/chapter-detail";
import TopicDetail from "@/pages/topic-detail";
import Notes from "@/pages/notes";
import Tests from "@/pages/tests";
import TakeTest from "@/pages/take-test";
import Results from "@/pages/results";
import Bookmarks from "@/pages/bookmarks";
import AIAssistant from "@/pages/ai-assistant";
import Search from "@/pages/search";
import Profile from "@/pages/profile";
import AdminDashboard from "@/pages/admin/index";
import AdminGenericPage from "@/pages/admin/generic";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      
      {/* Student App */}
      <Route path="/classes" component={Classes} />
      <Route path="/class/:classId" component={ClassDetail} />
      <Route path="/subject/:subjectId" component={SubjectDetail} />
      <Route path="/chapter/:chapterId" component={ChapterDetail} />
      <Route path="/topic/:topicId" component={TopicDetail} />
      <Route path="/notes" component={Notes} />
      <Route path="/tests" component={Tests} />
      <Route path="/test/:testId" component={TakeTest} />
      <Route path="/results" component={Results} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/search" component={Search} />
      <Route path="/profile" component={Profile} />
      
      {/* Admin Console */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/syllabus" component={() => <AdminGenericPage title="Syllabus" />} />
      <Route path="/admin/notes" component={() => <AdminGenericPage title="Notes" />} />
      <Route path="/admin/tests" component={() => <AdminGenericPage title="Tests" />} />
      <Route path="/admin/users" component={() => <AdminGenericPage title="Users" />} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
