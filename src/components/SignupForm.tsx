import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { PRIVACY_POLICY_VERSION } from "@/lib/consent";

const newsletterSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
});

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = newsletterSchema.safeParse({ name, email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!consent) {
      toast.error("Please accept the Privacy Policy to continue.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("event_signups").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: null,
      source: "newsletter",
      consent_version: PRIVACY_POLICY_VERSION,
      consent_at: new Date().toISOString(),
    });
    setLoading(false);

    const isDuplicate = error?.code === "23505";
    if (error && !isDuplicate) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success(
      isDuplicate ? "You're already subscribed." : "Welcome to the list."
    );
    setSubmitted(true);
    setName("");
    setEmail("");
    setConsent(false);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-xl mx-auto text-center py-8">
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
          Subscribed
        </p>
        <p className="font-serif text-2xl md:text-3xl text-foreground leading-snug">
          You're on the list.
        </p>
        <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
          Look out for our next dispatch — curated events, residencies, and cultural moments.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 text-[10px] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          Subscribe another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-end">
        <div className="flex-1 sm:border-b sm:border-border/40 sm:focus-within:border-foreground/70 transition-colors">
          <label
            htmlFor="nl-name"
            className="block text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-2 sm:mb-1"
          >
            Name
          </label>
          <Input
            id="nl-name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="bg-transparent border border-border/40 sm:border-0 rounded-md sm:rounded-none px-3 sm:px-0 h-11 sm:h-9 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex-1 sm:ml-6 sm:border-b sm:border-border/40 sm:focus-within:border-foreground/70 transition-colors">
          <label
            htmlFor="nl-email"
            className="block text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-2 sm:mb-1"
          >
            Email
          </label>
          <Input
            id="nl-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            className="bg-transparent border border-border/40 sm:border-0 rounded-md sm:rounded-none px-3 sm:px-0 h-11 sm:h-9 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="sm:ml-6 tracking-[0.3em] text-[10px] uppercase h-11 px-8 rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          {loading ? "Joining..." : "Subscribe"}
        </Button>
      </div>

      <label className="flex items-start gap-3 mt-6 cursor-pointer max-w-md mx-auto sm:mx-0">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          aria-label="Accept Privacy Policy"
          className="mt-[2px]"
        />
        <span className="text-[10px] tracking-[0.15em] text-muted-foreground leading-relaxed">
          I agree to receive the Caché Life newsletter and accept the{" "}
          <Link
            to="/privacy"
            className="text-foreground underline underline-offset-2 hover:opacity-80"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>
    </form>
  );
};

export default SignupForm;
