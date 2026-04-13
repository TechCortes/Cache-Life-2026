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
