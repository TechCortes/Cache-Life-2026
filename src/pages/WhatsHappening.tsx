import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type EventItem = {
  slug: string;
  title: string;
  date: string;
  location: string;
  desc: string;
};

const events: EventItem[] = [
  {
    slug: "art-after-dark",
    title: "Art After Dark",
    date: "June 2026",
    location: "Chelsea, NY",
    desc: "A late-night gallery experience featuring emerging NYC artists.",
  },
  {
    slug: "culture-club-vol-iii",
    title: "Culture Club: Volume III",
    date: "July 2026",
    location: "Manhattan, NY",
    desc: "Our flagship series returns with curated music, fashion, and conversation.",
  },
  {
    slug: "summer-night-soiree",
    title: "Summer Night Soirée",
    date: "August 2026",
    location: "Brooklyn, NY",
    desc: "An intimate evening of live performances and immersive art.",
  },
  {
    slug: "the-annual-gala",
    title: "The Annual Gala",
    date: "September 2026",
    location: "SoHo, NY",
    desc: "Our most anticipated event celebrating a year of culture and community.",
  },
];

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

type ModalStatus = "idle" | "loading" | "success" | "error";

const WhatsHappening = () => {
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [fields, setFields] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalStatus, setModalStatus] = useState<ModalStatus>("idle");
  const [serverError, setServerError] = useState("");

  const resetModal = () => {
    setFields({ name: "", email: "", phone: "" });
    setErrors({});
    setModalStatus("idle");
    setServerError("");
  };

  const openModal = (event: EventItem) => {
    resetModal();
    setActiveEvent(event);
  };

  const closeModal = () => {
    setActiveEvent(null);
    resetModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const next: Record<string, string> = {};
    if (!fields.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_RE.test(fields.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (fields.phone) {
      const digits = fields.phone.replace(/\D/g, "");
      if (!PHONE_RE.test(fields.phone.trim()) || digits.length < 7 || digits.length > 15) {
        next.phone = "Please enter a valid phone number.";
      }
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setModalStatus("loading");
    try {
      const res = await fetch("/api/event-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:       fields.email.trim(),
          phone_number: fields.phone.trim() || undefined,
          name:        fields.name.trim() || undefined,
          event_slug:  activeEvent!.slug,
          event_title: activeEvent!.title,
        }),
      });

      if (res.ok) {
        setModalStatus("success");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.fields) {
        const mapped: Record<string, string> = {};
        if (data.fields.email)        mapped.email = data.fields.email;
        if (data.fields.phone_number) mapped.phone = data.fields.phone_number;
        setErrors(mapped);
        setModalStatus("idle");
      } else {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setModalStatus("error");
      }
    } catch {
      setServerError("Network error. Please check your connection.");
      setModalStatus("error");
    }
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Upcoming</p>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground">
            What's Happening
          </h1>
        </div>

        <div className="flex flex-col gap-6">
          {events.map((event) => (
            <div
              key={event.slug}
              className="border border-border/40 rounded-sm p-8 hover:border-primary/40 transition-colors bg-card/30 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <h2 className="text-xl font-serif text-foreground">{event.title}</h2>
                <p className="text-xs tracking-[0.2em] uppercase text-primary">{event.date}</p>
              </div>
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                {event.location}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{event.desc}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openModal(event)}
                className="text-xs tracking-widest uppercase border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
              >
                Get Notified
              </Button>
            </div>
          ))}
        </div>
      </section>

      <Dialog open={!!activeEvent} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="max-w-md bg-background border-border/50">
          <DialogHeader>
            <DialogTitle className="font-serif font-light text-2xl text-foreground">
              {activeEvent?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Leave your info and we'll reach out with details and exclusive access.
            </DialogDescription>
          </DialogHeader>

          {modalStatus === "success" ? (
            <div className="text-center py-6">
              <p className="text-xs tracking-[0.4em] uppercase text-primary mb-3">You're on the list</p>
              <p className="text-sm text-muted-foreground mb-6">
                We'll be in touch with event details and early access.
              </p>
              <button
                onClick={closeModal}
                className="text-xs tracking-widest uppercase text-primary underline underline-offset-4 hover:text-primary/70 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 mt-2">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="notify-name"
                  className="text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Name{" "}
                  <span className="normal-case tracking-normal opacity-50">(optional)</span>
                </label>
                <Input
                  id="notify-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  value={fields.name}
                  onChange={handleChange}
                  disabled={modalStatus === "loading"}
                  className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="notify-email"
                  className="text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Email <span className="text-primary">*</span>
                </label>
                <Input
                  id="notify-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  value={fields.email}
                  onChange={handleChange}
                  disabled={modalStatus === "loading"}
                  aria-describedby={errors.email ? "notify-email-error" : undefined}
                  aria-invalid={!!errors.email}
                  className={`bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/50${
                    errors.email ? " border-destructive" : ""
                  }`}
                />
                {errors.email && (
                  <p id="notify-email-error" role="alert" className="text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="notify-phone"
                  className="text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Phone{" "}
                  <span className="normal-case tracking-normal opacity-50">
                    (optional &mdash; SMS alerts)
                  </span>
                </label>
                <Input
                  id="notify-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 800 555 0199"
                  value={fields.phone}
                  onChange={handleChange}
                  disabled={modalStatus === "loading"}
                  aria-describedby={errors.phone ? "notify-phone-error" : undefined}
                  aria-invalid={!!errors.phone}
                  className={`bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/50${
                    errors.phone ? " border-destructive" : ""
                  }`}
                />
                {errors.phone && (
                  <p id="notify-phone-error" role="alert" className="text-xs text-destructive">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Server error */}
              {modalStatus === "error" && serverError && (
                <p
                  role="alert"
                  className="text-xs text-destructive border border-destructive/30 bg-destructive/10 rounded px-3 py-2"
                >
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                disabled={modalStatus === "loading"}
                className="w-full tracking-widest uppercase text-xs mt-1"
              >
                {modalStatus === "loading" ? "Sending\u2026" : "Notify Me"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default WhatsHappening;
