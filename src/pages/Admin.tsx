import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, Download, LogIn, LogOut, Search } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";

interface Signup {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signups, setSignups] = useState<Signup[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

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
    if (session) fetchSignups();
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
      setSignups(data || []);
    }
    setLoading(false);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSignups([]);
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
    const headers = ["Name", "Email", "Phone", "Signed Up"];
    const rows = filtered.map((s) => [
      s.name,
      s.email,
      s.phone,
      new Date(s.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signups-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <div>
            <h1 className="text-3xl font-serif text-foreground">Event Signups</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {signups.length} total signup{signups.length !== 1 ? "s" : ""}
            </p>
          </div>
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
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              <LogOut size={14} className="mr-1" /> Logout
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
                  <TableHead className="text-foreground">Date</TableHead>
                  <TableHead className="text-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="border-border/30">
                    <TableCell className="text-foreground">{s.name}</TableCell>
                    <TableCell className="text-foreground">{s.email}</TableCell>
                    <TableCell className="text-foreground">{s.phone}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Admin;
