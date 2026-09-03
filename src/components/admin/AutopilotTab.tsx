import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Zap, Clock, FileText, Lightbulb, Image, Link2 } from "lucide-react";

export default function AutopilotTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [running, setRunning] = useState(false);

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

  const { data: recentBlogs } = useQuery({
    queryKey: ["autopilot_blogs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title, slug, created_at, meta_description, image_url")
        .eq("source", "ai_generated")
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  const { data: recentIdeas } = useQuery({
    queryKey: ["autopilot_ideas"],
    queryFn: async () => {
      const { data } = await supabase
        .from("generated_content")
        .select("title, channel, status, created_at, body, hashtags, territories(name)")
        .eq("content_type", "content_idea")
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
      queryClient.invalidateQueries({ queryKey: ["autopilot_ideas"] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setRunning(false);
  };

  const lastRunTime = lastRun?.timestamp
    ? new Date(lastRun.timestamp).toLocaleString()
    : "Never";

  const totalImages = lastRun?.results?.filter((r: any) => r.image).length ?? 0;
  const totalLinks = lastRun?.results?.reduce((sum: number, r: any) => sum + (r.internal_links ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Status cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" /> Last Run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{lastRunTime}</p>
            <p className="text-xs text-muted-foreground mt-1">Daily at 6:00 AM UTC</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" /> Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{recentBlogs?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Auto-published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Image className="h-4 w-4" /> Pool Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{totalImages}</p>
            <p className="text-xs text-muted-foreground mt-1">Real photos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Link2 className="h-4 w-4" /> Internal Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{totalLinks}</p>
            <p className="text-xs text-muted-foreground mt-1">Last run</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> Content Ideas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{recentIdeas?.filter((s: any) => s.status === "draft").length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Run now */}
      <Card>
        <CardContent className="py-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium flex items-center gap-2"><Zap className="h-4 w-4" /> Manual Run</h3>
            <p className="text-sm text-muted-foreground">Trigger the supercharged autopilot now for all territories</p>
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
                  <TableHead>Image</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Ideas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastRun.results.map((r: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.territory}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{r.blog ?? ", "}</TableCell>
                    <TableCell>{r.image ? "✅" : ", "}</TableCell>
                    <TableCell>{r.internal_links ?? 0}</TableCell>
                    <TableCell>{r.content_ideas ?? 0}</TableCell>
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

      {/* Recent autopilot blogs */}
      {recentBlogs && recentBlogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Blog Posts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBlogs.map((b: any) => (
                  <TableRow key={b.slug}>
                    <TableCell className="font-medium max-w-[250px] truncate">{b.title}</TableCell>
                    <TableCell>{b.image_url ? "✅" : ", "}</TableCell>
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

      {/* Content Ideas */}
      {recentIdeas && recentIdeas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Content Ideas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hook</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Territory</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIdeas.map((idea: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium max-w-[250px] truncate">{idea.title}</TableCell>
                    <TableCell><Badge variant="outline">{idea.channel}</Badge></TableCell>
                    <TableCell className="text-sm">{idea.territories?.name ?? ", "}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(idea.created_at).toLocaleDateString()}
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
