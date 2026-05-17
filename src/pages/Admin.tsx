import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Trash2,
  Download,
  LogIn,
  LogOut,
  Search,
  Plus,
  Pencil,
  ExternalLink,
} from "lucide-react";
import { lovable } from "@/integrations/lovable/index";

interface Signup {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  posh_event_id: string | null;
  posh_url: string | null;
  rsvp_for_date: string | null;
  source: string | null;
}

interface PoshEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  image_url: string | null;
  posh_url: string;
  is_active: boolean;
  sort_order: number;
  provider: "posh" | "partiful";
}

const emptyEvent: Omit<PoshEvent, "id"> = {
  title: "",
  description: "",
  event_date: "",
  location: "",
  image_url: "",
  posh_url: "",
  is_active: true,
  sort_order: 0,
  provider: "posh",
};

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signups, setSignups] = useState<Signup[]>([]);
  const [events, setEvents] = useState<PoshEvent[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Event dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Omit<PoshEvent, "id">>(emptyEvent);
  const [savingEvent, setSavingEvent] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setAuthLoading(false);
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchSignups();
      fetchEvents();
    }
  }, [session]);

  const fetchSignups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("event_signups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load signups");
    } else {
      setSignups((data || []) as Signup[]);
    }
    setLoading(false);
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    const { data, error } = await supabase
      .from("posh_events")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("event_date", { ascending: true });

    if (error) {
      toast.error("Failed to load events");
    } else {
      setEvents((data || []) as PoshEvent[]);
    }
    setEventsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
  };

  const handleGoogleLogin = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error instanceof Error ? result.error.message : "Google sign-in failed");
    }
  };

  const handleAppleLogin = async () => {
    const result = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error instanceof Error ? result.error.message : "Apple sign-in failed");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSignups([]);
    setEvents([]);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("event_signups").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setSignups((prev) => prev.filter((s) => s.id !== id));
      toast.success("Removed");
    }
  };

  const handleExport = () => {
    const headers = ["Name", "Email", "Phone", "Event", "Posh URL", "Signed Up"];
    const rows = filtered.map((s) => {
      const ev = events.find((e) => e.id === s.posh_event_id);
      return [
        s.name,
        s.email,
        s.phone,
        ev?.title ?? "",
        s.posh_url ?? "",
        new Date(s.created_at).toLocaleDateString(),
      ];
    });
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signups-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openNewEvent = () => {
    setEditingEventId(null);
    setEventForm(emptyEvent);
    setDialogOpen(true);
  };

  const openEditEvent = (ev: PoshEvent) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      description: ev.description ?? "",
      event_date: ev.event_date ? ev.event_date.slice(0, 16) : "",
      location: ev.location ?? "",
      image_url: ev.image_url ?? "",
      posh_url: ev.posh_url,
      is_active: ev.is_active,
      sort_order: ev.sort_order,
      provider: ev.provider ?? "posh",
    });
    setDialogOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.posh_url.trim()) {
      toast.error("Title and event URL are required");
      return;
    }

    setSavingEvent(true);

    const payload = {
      title: eventForm.title.trim(),
      description: eventForm.description?.trim() || null,
      event_date: eventForm.event_date
        ? new Date(eventForm.event_date).toISOString()
        : null,
      location: eventForm.location?.trim() || null,
      image_url: eventForm.image_url?.trim() || null,
      posh_url: eventForm.posh_url.trim(),
      is_active: eventForm.is_active,
      sort_order: Number(eventForm.sort_order) || 0,
      provider: eventForm.provider,
    };

    const { error } = editingEventId
      ? await supabase.from("posh_events").update(payload).eq("id", editingEventId)
      : await supabase.from("posh_events").insert(payload);

    setSavingEvent(false);

    if (error) {
      toast.error("Failed to save event");
      return;
    }

    toast.success(editingEventId ? "Event updated" : "Event created");
    setDialogOpen(false);
    fetchEvents();
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event? Signups linked to it will be kept.")) return;
    const { error } = await supabase.from("posh_events").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete event");
    } else {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted");
    }
  };

  const filtered = signups.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <section className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-serif text-foreground text-center mb-8">Admin Login</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                required
              />
              <Button type="submit" className="tracking-widest text-xs uppercase">
                <LogIn size={16} className="mr-2" /> Sign In
              </Button>
              <div className="flex items-center gap-3 my-2">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <Button type="button" variant="outline" onClick={handleGoogleLogin} className="tracking-widest text-xs uppercase">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign in with Google
              </Button>
              <Button type="button" variant="outline" onClick={handleAppleLogin} className="tracking-widest text-xs uppercase">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Sign in with Apple
              </Button>
            </form>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-serif text-foreground">Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-xs uppercase tracking-wider text-muted-foreground"
          >
            <LogOut size={14} className="mr-1" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="signups" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="signups">Signups ({signups.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="signups">
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <p className="text-sm text-muted-foreground">
                {signups.length} total signup{signups.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  size="sm"
                  className="text-xs uppercase tracking-wider"
                  disabled={filtered.length === 0}
                >
                  <Download size={14} className="mr-1" /> Export CSV
                </Button>
                <Button
                  onClick={fetchSignups}
                  variant="outline"
                  size="sm"
                  className="text-xs uppercase tracking-wider"
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div className="relative mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {loading ? (
              <p className="text-muted-foreground text-center py-12">Loading signups...</p>
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                {search ? "No results found" : "No signups yet"}
              </p>
            ) : (
              <div className="border border-border/40 rounded-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40">
                      <TableHead className="text-foreground">Name</TableHead>
                      <TableHead className="text-foreground">Email</TableHead>
                      <TableHead className="text-foreground">Phone</TableHead>
                      <TableHead className="text-foreground">Event</TableHead>
                      <TableHead className="text-foreground">Date</TableHead>
                      <TableHead className="text-foreground w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((s) => {
                      const ev = events.find((e) => e.id === s.posh_event_id);
                      return (
                        <TableRow key={s.id} className="border-border/30">
                          <TableCell className="text-foreground">{s.name}</TableCell>
                          <TableCell className="text-foreground">{s.email}</TableCell>
                          <TableCell className="text-foreground">{s.phone}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {ev?.title ?? (s.posh_url ? "—" : "General")}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(s.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              aria-label="Delete signup"
                            >
                              <Trash2 size={16} />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="events">
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <p className="text-sm text-muted-foreground">
                Manage events shown on the site, linked to Posh.vip or Partiful
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={fetchEvents}
                  variant="outline"
                  size="sm"
                  className="text-xs uppercase tracking-wider"
                >
                  Refresh
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={openNewEvent}
                      size="sm"
                      className="text-xs uppercase tracking-wider"
                    >
                      <Plus size={14} className="mr-1" /> New Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {editingEventId ? "Edit Event" : "New Event"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveEvent} className="flex flex-col gap-3 py-2">
                      <div>
                        <Label htmlFor="ev-title" className="text-xs uppercase tracking-wider">
                          Title *
                        </Label>
                        <Input
                          id="ev-title"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          required
                          maxLength={200}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ev-provider" className="text-xs uppercase tracking-wider">
                          Provider *
                        </Label>
                        <Select
                          value={eventForm.provider}
                          onValueChange={(v) =>
                            setEventForm({ ...eventForm, provider: v as "posh" | "partiful" })
                          }
                        >
                          <SelectTrigger id="ev-provider">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="posh">Posh.vip</SelectItem>
                            <SelectItem value="partiful">Partiful</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ev-posh" className="text-xs uppercase tracking-wider">
                          {eventForm.provider === "partiful" ? "Partiful URL *" : "Posh URL *"}
                        </Label>
                        <Input
                          id="ev-posh"
                          type="url"
                          placeholder={
                            eventForm.provider === "partiful"
                              ? "https://partiful.com/e/..."
                              : "https://posh.vip/e/..."
                          }
                          value={eventForm.posh_url}
                          onChange={(e) => setEventForm({ ...eventForm, posh_url: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="ev-date" className="text-xs uppercase tracking-wider">
                            Date & Time
                          </Label>
                          <Input
                            id="ev-date"
                            type="datetime-local"
                            value={eventForm.event_date ?? ""}
                            onChange={(e) =>
                              setEventForm({ ...eventForm, event_date: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="ev-loc" className="text-xs uppercase tracking-wider">
                            Location
                          </Label>
                          <Input
                            id="ev-loc"
                            value={eventForm.location ?? ""}
                            onChange={(e) =>
                              setEventForm({ ...eventForm, location: e.target.value })
                            }
                            maxLength={200}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="ev-img" className="text-xs uppercase tracking-wider">
                          Image URL
                        </Label>
                        <Input
                          id="ev-img"
                          type="url"
                          placeholder="https://..."
                          value={eventForm.image_url ?? ""}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, image_url: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="ev-desc" className="text-xs uppercase tracking-wider">
                          Description
                        </Label>
                        <Textarea
                          id="ev-desc"
                          value={eventForm.description ?? ""}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, description: e.target.value })
                          }
                          rows={3}
                          maxLength={1000}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 items-end">
                        <div>
                          <Label htmlFor="ev-sort" className="text-xs uppercase tracking-wider">
                            Sort Order
                          </Label>
                          <Input
                            id="ev-sort"
                            type="number"
                            value={eventForm.sort_order}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                sort_order: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2 pb-2">
                          <Switch
                            id="ev-active"
                            checked={eventForm.is_active}
                            onCheckedChange={(v) =>
                              setEventForm({ ...eventForm, is_active: v })
                            }
                          />
                          <Label htmlFor="ev-active" className="text-xs uppercase tracking-wider">
                            Active
                          </Label>
                        </div>
                      </div>
                      <DialogFooter className="mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={savingEvent}>
                          {savingEvent ? "Saving..." : "Save"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {eventsLoading ? (
              <p className="text-muted-foreground text-center py-12">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                No events yet — click "New Event" to add your first Posh or Partiful link.
              </p>
            ) : (
              <div className="border border-border/40 rounded-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40">
                      <TableHead className="text-foreground">Title</TableHead>
                      <TableHead className="text-foreground">Provider</TableHead>
                      <TableHead className="text-foreground">Date</TableHead>
                      <TableHead className="text-foreground">Location</TableHead>
                      <TableHead className="text-foreground">Active</TableHead>
                      <TableHead className="text-foreground">Link</TableHead>
                      <TableHead className="text-foreground w-24"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((ev) => (
                      <TableRow key={ev.id} className="border-border/30">
                        <TableCell className="text-foreground">{ev.title}</TableCell>
                        <TableCell className="text-muted-foreground text-sm capitalize">
                          {ev.provider ?? "posh"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {ev.event_date
                            ? new Date(ev.event_date).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {ev.location ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {ev.is_active ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          <a
                            href={ev.posh_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
                          >
                            Open <ExternalLink size={12} />
                          </a>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditEvent(ev)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Edit event"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              aria-label="Delete event"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default Admin;
