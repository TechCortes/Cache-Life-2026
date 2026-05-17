import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { PRIVACY_POLICY_VERSION } from "@/lib/consent";

const rsvpSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(5, "Phone is required").max(20),
});

// Show time: doors at 10:00 PM local
const SHOW_HOUR = 22;
const SHOW_MINUTE = 0;

/** Returns the upcoming Wednesday at SHOW_HOUR. If today is Wednesday and
 * we're past show time, jumps to next week. */
export const getNextWednesday = (now: Date = new Date()): Date => {
  const result = new Date(now);
  const day = result.getDay(); // 0 Sun..6 Sat, Wed = 3
  let delta = (3 - day + 7) % 7;
  if (delta === 0) {
    const todayShow = new Date(result);
    todayShow.setHours(SHOW_HOUR, SHOW_MINUTE, 0, 0);
    if (now.getTime() > todayShow.getTime()) delta = 7;
  }
  result.setDate(result.getDate() + delta);
  result.setHours(SHOW_HOUR, SHOW_MINUTE, 0, 0);
  return result;
};

const formatDateLine = (d: Date) =>
  d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const formatTimeLine = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

const AfterglowRSVP = () => {
  const nextWed = useMemo(() => getNextWednesday(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = rsvpSchema.safeParse({ name, email, phone });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("event_signups").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      rsvp_for_date: nextWed.toISOString(),
      source: "afterglow",
    });
    setLoading(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success(`You're on the list for ${formatDateLine(nextWed)}.`);
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <section className="lg:snap-start min-h-0 lg:min-h-screen w-full flex items-start lg:items-center justify-center px-6 pt-10 pb-16 lg:pt-32 lg:pb-16">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left — editorial type lockup */}
        <div className="flex flex-col items-start">
          <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6 border border-border/60 px-3 py-1 rounded-sm">
            Weekly · Every Wednesday
          </span>
          <h2 className="font-serif text-foreground leading-[0.95] text-6xl md:text-7xl lg:text-8xl">
            Afterglow
          </h2>
          <p className="font-serif italic text-foreground/80 text-2xl md:text-3xl mt-2">
            at Nubeluz
          </p>
          <div className="mt-8 space-y-2">
            <p className="text-xs tracking-[0.25em] uppercase text-primary">
              Next: {formatDateLine(nextWed)}
            </p>
            <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
              Doors {formatTimeLine(nextWed)}
            </p>
          </div>
          <p className="mt-8 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            A weekly ritual above the city. Curated sound, low light, and
            the people who make the night.
          </p>
        </div>

        {/* Right — RSVP card */}
        <div className="w-full max-w-md justify-self-center lg:justify-self-end border border-border/40 bg-background/40 backdrop-blur-sm p-8 md:p-10 rounded-sm">
          <p className="text-center text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
            Reserve your place
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="text"
              name="name"
              aria-label="Your name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              required
              maxLength={100}
            />
            <Input
              type="email"
              name="email"
              aria-label="Your email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              required
              maxLength={255}
            />
            <Input
              type="tel"
              name="phone"
              aria-label="Your phone number"
              placeholder="Your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              required
              maxLength={20}
            />
            <Button
              type="submit"
              disabled={loading}
              className="tracking-[0.25em] text-xs uppercase w-full mt-2"
            >
              {loading ? "Submitting..." : "RSVP"}
            </Button>
            <p className="text-[10px] tracking-[0.2em] uppercase text-center text-muted-foreground mt-2">
              Limited capacity · 21+
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AfterglowRSVP;
