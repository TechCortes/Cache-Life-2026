import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAfterglowAccess } from "./useAfterglowAccess";
import AfterglowPage from "./AfterglowPage";

const AfterglowGate = () => {
  const { authorized, checking, login, logout } = useAfterglowAccess();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (checking) return null;

  if (authorized) {
    return <AfterglowPage onSignOut={logout} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      await login(password);
    } catch {
      toast.error("Incorrect password.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm flex flex-col items-center">
        <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-8">
          Private
        </span>
        <h1 className="font-serif text-foreground leading-[0.95] text-6xl md:text-7xl text-center">
          Afterglow
        </h1>
        <p className="font-serif italic text-foreground/80 text-xl md:text-2xl mt-2 mb-12">
          at Nubeluz
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <Input
            type="password"
            aria-label="Access password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground text-center tracking-[0.25em]"
            autoFocus
            maxLength={200}
          />
          <Button
            type="submit"
            disabled={loading || !password}
            className="tracking-[0.25em] text-xs uppercase w-full mt-2"
          >
            {loading ? "Verifying..." : "Enter"}
          </Button>
        </form>
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-10 text-center">
          By invitation only
        </p>
      </div>
    </main>
  );
};

export default AfterglowGate;
