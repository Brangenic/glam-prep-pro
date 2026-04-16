import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Zap, Clock, FileText, MessageSquare } from "lucide-react";

export default function AutopilotTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [running, setRunning] = useState(false);

  // Last run info
  const { data: lastRun } = useQuery({
    queryKey: ["autopilot_last_run"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_config")
        .select("value, updated_at")
        .eq("key", "autopilot_last_run")
        .maybeSingle();
      if (!data) return null;
      try {
        return { ...JSON.parse(data.value), updated_at: data.updated_at };
      } catch {
        return null;
      }
    },
  });

  // Recent AI-generated blog posts
  const { data: recentBlogs } = useQuery({
    queryKey: ["autopilot_blogs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title, slug, created_at, meta_description")
        .eq("source", "ai_generated")
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  // Recent auto-generated social drafts
  const { data: recentSocial } = useQuery({
    queryKey: ["autopilot_social"],
    queryFn: async () => {
      const { data } = await supabase
        .from("generated_content")
        .select("title, channel, status, created_at, territories(name)")
        .order("created_at", { ascending: false })
        .limit(15);
      return data ?? [];
    },
  });

  const handleRunNow = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("autopilot-content");
      if (error) throw error;
      toast({
        title: "Autopilot complete",
        description: `Generated ${data?.results?.length ?? 0} territory batches`,
      });
      queryClient.invalidateQueries({ queryKey: ["autopilot_last_run"] });
      queryClient.invalidateQueries({ queryKey: ["autopilot_blogs"] });
      queryClient.invalidateQueries({ queryKey: ["autopilot_social"] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setRunning(false);
  };

  const lastRunTime = lastRun?.timestamp
    ? new Date(lastRun.timestamp).toLocaleString()
    : "Never";

  return (
    <div className="space-y-6">
      {/* Status & trigger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" /> Last Run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{lastRunTime}</p>
            <p className="text-xs text-muted-foreground mt-1">Runs daily at 6:00 AM UTC</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" /> AI Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{recentBlogs?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Auto-published to /blogs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Social Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{recentSocial?.filter((s: any) => s.status === "draft").length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Run now button */}
      <Card>
        <CardContent className="py-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium flex items-center gap-2"><Zap className="h-4 w-4" /> Manual Run</h3>
            <p className="text-sm text-muted-foreground">Trigger the autopilot content engine now for all territories</p>
          </div>
          <Button onClick={handleRunNow} disabled={running}>
            {running ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Running...</> : <><Zap className="h-4 w-4 mr-2" /> Run Now</>}
          </Button>
        </CardContent>
      </Card>

      {/* Last run results */}
      {lastRun?.results && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last Run Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Territory</TableHead>
                  <TableHead>Blog</TableHead>
                  <TableHead>Social Posts</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastRun.results.map((r: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.territory}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{r.blog ?? "—"}</TableCell>
                    <TableCell>{r.social}</TableCell>
                    <TableCell>
                      <Badge variant={r.errors?.length ? "destructive" : "default"}>
                        {r.errors?.length ? `${r.errors.length} error(s)` : "Success"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent AI blogs */}
      {recentBlogs && recentBlogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent AI Blog Posts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBlogs.map((b: any) => (
                  <TableRow key={b.slug}>
                    <TableCell className="font-medium max-w-[300px] truncate">{b.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(b.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
