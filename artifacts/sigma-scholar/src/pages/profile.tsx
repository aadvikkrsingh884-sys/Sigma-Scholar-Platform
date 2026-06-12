import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Bell, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const { user, signOut, isAdminUser } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 space-y-8 p-6 md:p-12 max-w-5xl mx-auto w-full">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-1 border-border shadow-sm self-start">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl mb-4">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold">{user?.displayName}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                
                {isAdminUser && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    <Shield className="h-4 w-4" /> Administrator
                  </div>
                )}
                
                <Button variant="destructive" className="w-full mt-8" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" /> Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.displayName || ""} disabled />
                    <p className="text-xs text-muted-foreground">Managed by Google account</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={user?.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Current Class</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option>Class 9</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                    </select>
                  </div>
                  <Button className="mt-4">Save Changes</Button>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" /> Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Study Reminders</h4>
                      <p className="text-sm text-muted-foreground">Get reminded to keep your daily streak.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-primary/20 relative cursor-pointer">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Tests Available</h4>
                      <p className="text-sm text-muted-foreground">Notify when new practice tests are added.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}