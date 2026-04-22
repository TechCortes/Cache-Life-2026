import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";

interface PoshEventOption {
  id: string;
  title: string;
  posh_url: string;
  event_date: string | null;
  provider: "posh" | "partiful";
}

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(5, "Phone is required").max(20),
});

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("general");
  const [events, setEvents] = useState<PoshEventOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("posh_events")
        .select("id, title, posh_url, event_date, provider")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("event_date", { ascending: true });
      if (data) setEvents(data as PoshEventOption[]);
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = signupSchema.safeParse({ name, email, phone });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);

    const selectedEvent =
      selectedEventId !== "general"
        ? events.find((ev) => ev.id === selectedEventId)
        : null;

    const { error } = await supabase.from("event_signups").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      posh_event_id: selectedEvent?.id ?? null,
      posh_url: selectedEvent?.posh_url ?? null,
    });

    setLoading(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    if (selectedEvent?.posh_url) {
      toast.success("You're on the list — opening Posh checkout...");
      window.open(selectedEvent.posh_url, "_blank", "noopener,noreferrer");
    } else {
      toast.success("You're on the list! We'll be in touch.");
    }

    setName("");
    setEmail("");
    setPhone("");
    setSelectedEventId("general");
  };

  return (
    <div className="max-w-md mx-auto px-6 pb-12">
      <p className="text-center text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
        Get on the List
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
          required
          maxLength={100}
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
          required
          maxLength={255}
        />
        <Input
          type="tel"
          placeholder="Your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
          required
          maxLength={20}
        />
        {events.length > 0 && (
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground">
              <SelectValue placeholder="Select an event (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General — just join the list</SelectItem>
              {events.map((ev) => (
                <SelectItem key={ev.id} value={ev.id}>
                  {ev.title}
                  {ev.event_date
                    ? ` — ${new Date(ev.event_date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="tracking-widest text-xs uppercase w-full"
        >
          {loading
            ? "Submitting..."
            : selectedEventId !== "general"
            ? "Register on Posh"
            : "Join"}
        </Button>
        {selectedEventId !== "general" && (
          <p className="text-[10px] text-center text-muted-foreground tracking-wider">
            You'll be redirected to Posh.vip to complete checkout
          </p>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
