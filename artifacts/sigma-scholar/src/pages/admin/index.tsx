import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Target, BookOpen, Settings, LayoutDashboard } from "lucide-react";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: stats } = useGetDashboardStats();

  const menuItems = [
    { title: "Manage Syllabus", icon: BookOpen, href: "/admin/syllabus", desc: "Classes, subjects, chapters" },
    { title: "Manage Notes", icon: FileText, href: "/admin/notes", desc: "Upload and edit PDFs/notes" },
    { title: "Manage Tests", icon: Target, href: "/admin/tests", desc: "Create tests and questions" },
    { title: "Manage Users", icon: Users, href: "/admin/users", desc: "View student progress" },
  ];

  return (
    <ProtectedRoute adminOnly>
      <Layout>
        <div className="flex-1 space-y-8 p-6 md:p-12 pt-8 bg-muted/5">
          <div className="flex items-center gap-3 border-b border-border pb-6">
            <div className="p-3 bg-primary text-primary-foreground rounded-xl">
              <LayoutDashboard className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Admin Console</h2>
              <p className="text-muted-foreground text-lg">Manage Sigma Scholar content and users</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalStudents || 0}</div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalNotes || 0}</div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalTests || 0}</div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Chapters</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalChapters || 0}</div>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-bold pt-4">Management Modules</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {menuItems.map((item) => (
              <Link key={item.title} href={item.href}>
                <Card className="hover-elevate cursor-pointer border-border h-full transition-all hover:border-primary">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {stats?.recentActivity && stats.recentActivity.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <Card className="border-border shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {stats.recentActivity.map(activity => (
                      <div key={activity.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</p>
                        </div>
                        <span className="text-xs uppercase bg-muted px-2 py-1 rounded">{activity.type}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}