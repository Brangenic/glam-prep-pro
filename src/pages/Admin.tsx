import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Sparkles, Check, Trash2, RefreshCw, Bot } from "lucide-react";
import AdminChat from "@/components/admin/AdminChat";

export default function Admin() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [genTerritory, setGenTerritory] = useState("all");
  const [genChannel, setGenChannel] = useState("instagram");
  const [generating, setGenerating] = useState(false);

  const { data: territories } = useQuery({
    queryKey: ["territories"],
    queryFn: async () => {
      const { data } = await supabase.from("territories").select("*").eq("active", true).order("name");
      return data ?? [];
    },
  });

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["generated_content"],
    queryFn: async () => {
      const { data } = await supabase
        .from("generated_content")
        .select("*, territories(name)")
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("generated_content").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated_content"] });
      toast({ title: "Updated" });
    },
  });

  const deleteContent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("generated_content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated_content"] });
      toast({ title: "Deleted" });
    },
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          territory_slug: genTerritory === "all" ? undefined : genTerritory,
          channel: genChannel,
          count: 1,
        },
      });
      if (error) throw error;
      toast({ title: "Content generated", description: JSON.stringify(data?.results?.map((r: any) => `${r.territory}: ${r.generated}`)) });
      queryClient.invalidateQueries({ queryKey: ["generated_content"] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setGenerating(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-2xl font-display">Access Denied</h1>
      <p className="text-muted-foreground">You don't have admin access. Contact the team lead.</p>
      <Button variant="outline" onClick={signOut}>Sign Out</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-display font-bold">Glam Hub Admin</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <Tabs defaultValue="assistant">
          <TabsList>
            <TabsTrigger value="assistant" className="gap-1.5"><Bot className="h-4 w-4" /> AI Assistant</TabsTrigger>
            <TabsTrigger value="content">Generated Content</TabsTrigger>
            <TabsTrigger value="generate">Generate New</TabsTrigger>
            <TabsTrigger value="territories">Territories</TabsTrigger>
          </TabsList>

          <TabsContent value="assistant">
            <Card>
              <AdminChat />
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> Generate Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Territory</label>
                    <Select value={genTerritory} onValueChange={setGenTerritory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All territories</SelectItem>
                        {territories?.map((t) => (
                          <SelectItem key={t.id} value={t.slug}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Channel</label>
                    <Select value={genChannel} onValueChange={setGenChannel}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["instagram", "whatsapp", "facebook", "twitter", "blog", "email"].map((ch) => (
                          <SelectItem key={ch} value={ch}>{ch.charAt(0).toUpperCase() + ch.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleGenerate} disabled={generating} className="w-full">
                      {generating ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate</>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                {contentLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading content...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Territory</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {content?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.territories?.name ?? "—"}</TableCell>
                          <TableCell><Badge variant="outline">{item.channel}</Badge></TableCell>
                          <TableCell className="max-w-[200px] truncate">{item.title ?? item.body.slice(0, 50)}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === "published" ? "default" : "secondary"}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {item.status === "draft" && (
                                <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate({ id: item.id, status: "published" })}>
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => deleteContent.mutate(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {content?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No content yet. Generate some from the "Generate New" tab.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="territories">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Event Dates</TableHead>
                      <TableHead>Keywords</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {territories?.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell>{t.country}</TableCell>
                        <TableCell>{t.event_dates ?? "—"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{t.keywords?.join(", ")}</TableCell>
                        <TableCell><Badge variant={t.active ? "default" : "secondary"}>{t.active ? "Active" : "Inactive"}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
