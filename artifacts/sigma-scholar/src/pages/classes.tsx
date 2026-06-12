import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { useListClasses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Classes() {
  const { data: classes, isLoading } = useListClasses();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              Classes
            </h2>
            <p className="text-muted-foreground">Select your class to explore subjects and chapters.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))
            ) : classes?.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No classes available at the moment.</p>
              </div>
            ) : (
              classes?.sort((a, b) => a.order - b.order).map((cls, idx) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/class/${cls.id}`}>
                    <Card className="hover-elevate cursor-pointer border-border shadow-sm transition-all hover:border-primary/50 group h-full flex flex-col justify-center">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                          {cls.name}
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {cls.totalSubjects || 0} Subjects
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}