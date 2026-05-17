import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PRIVACY_POLICY_VERSION } from "@/lib/consent";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(5, "Phone is required").max(20),
  partySize: z.coerce.number().int().min(1).max(20),
});

type Props = { rsvpDate: Date; dateLabel: string };

const GuestListForm = ({ rsvpDate, dateLabel }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, phone, partySize });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!consent) {
      toast.error("Please accept the Privacy Policy to continue.");
      return;
    }
    setLoading(true);
    const sourceTag = `afterglow-guestlist · party ${parsed.data.partySize}${
      notes.trim() ? ` · ${notes.trim().slice(0, 160)}` : ""
    }`;

    const { error } = await supabase.from("event_signups").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      rsvp_for_date: rsvpDate.toISOString(),
      source: sourceTag.slice(0, 255),
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
      isDuplicate
        ? `You're already on the list for ${dateLabel}.`
        : `Request received for ${dateLabel}. We'll be in touch.`
    );
    setName("");
    setEmail("");
    setPhone("");
    setPartySize("2");
    setNotes("");
    setConsent(false);
  };

  const fieldClass =
    "bg-transparent border-0 border-b border-border/40 rounded-none px-0 h-11 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:border-foreground";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        type="text"
        aria-label="Full name"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={fieldClass}
        required
        maxLength={100}
      />
      <Input
        type="email"
        aria-label="Email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={fieldClass}
        required
        maxLength={255}
      />
      <Input
        type="tel"
        aria-label="Phone"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={fieldClass}
        required
        maxLength={20}
      />
      <Input
        type="number"
        min={1}
        max={20}
        aria-label="Party size"
        placeholder="Party size"
        value={partySize}
        onChange={(e) => setPartySize(e.target.value)}
        className={fieldClass}
        required
      />
      <Input
        type="text"
        aria-label="Notes (optional)"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className={fieldClass}
        maxLength={500}
      />

      <label className="flex items-start gap-3 mt-2 cursor-pointer">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          aria-label="Accept Privacy Policy"
          className="mt-[2px]"
        />
        <span className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground leading-snug">
          I agree to the{" "}
          <Link
            to="/privacy"
            className="text-foreground underline underline-offset-2"
          >
            Privacy Policy
          </Link>{" "}
          and to receive event updates.
        </span>
      </label>

      <Button
        type="submit"
        disabled={loading || !consent}
        className="tracking-[0.3em] text-[11px] uppercase w-full mt-3 h-12 rounded-none"
      >
        {loading ? "Submitting…" : "Request Guest List"}
      </Button>
      <p className="text-[10px] tracking-[0.3em] uppercase text-center text-muted-foreground mt-1">
        Subject to approval · 21+
      </p>
    </form>
  );
};

export default GuestListForm;
