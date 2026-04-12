import { useState } from "react";
import { Instagram, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Footer = () => {
  const [fields, setFields] = useState({ email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:        fields.email.trim(),
          phone_number: fields.phone.trim() || undefined,
          source:       "footer",
        }),
      });

      if (res.ok) {
        toast.success("You're in! We'll keep you posted on upcoming events.");
        setFields({ email: "", phone: "" });
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.status === 422 && data.fields?.email) {
        toast.error(data.fields.email);
      } else {
        toast.error(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative z-10 border-t border-border/30 mt-20">
      {/* Instagram CTA */}
      <div className="text-center py-16 px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Follow us</p>
        <a
          href="https://instagram.com/cachelifeny"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl md:text-3xl font-serif tracking-wider text-foreground hover:text-primary transition-colors"
        >
          @CACHELIFENY
        </a>
      </div>

      {/* Newsletter */}
      <div className="max-w-md mx-auto px-6 pb-12">
        <p className="text-center text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Join Our Newsletter
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
          <Input
            name="email"
            type="email"
            placeholder="Your email"
            value={fields.email}
            onChange={handleChange}
            className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
            required
            disabled={loading}
          />
          <Input
            name="phone"
            type="tel"
            placeholder="Phone (optional — SMS event alerts)"
            value={fields.phone}
            onChange={handleChange}
            className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
            disabled={loading}
          />
          <Button
            type="submit"
            className="tracking-widest text-xs uppercase w-full"
            disabled={loading}
          >
            {loading ? "..." : "Join"}
          </Button>
        </form>
      </div>

      {/* Bottom */}
      <div className="border-t border-border/20 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Cach\u00e9 Life NY. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://instagram.com/cachelifeny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href="https://soundcloud.com/cachelifeny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Soundcloud"
          >
            <Music size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
