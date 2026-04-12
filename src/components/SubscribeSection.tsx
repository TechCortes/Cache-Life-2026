import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

function validateEmail(email: string) {
  return EMAIL_RE.test(email.trim());
}

function validatePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return PHONE_RE.test(phone.trim()) && digits.length >= 7 && digits.length <= 15;
}

const SubscribeSection = () => {
  const [fields, setFields] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      return { ...prev, [name]: "" };
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fields.email.trim()) {
      next.email = "Email is required.";
    } else if (!validateEmail(fields.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (fields.phone && !validatePhone(fields.phone)) {
      next.phone = "Please enter a valid phone number.";
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.email.trim(),
          phone_number: fields.phone.trim() || undefined,
          name: fields.name.trim() || undefined,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFields({ name: "", email: "", phone: "" });
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.fields) {
        const mapped: Record<string, string> = {};
        if (data.fields.email) mapped.email = data.fields.email;
        if (data.fields.phone_number) mapped.phone = data.fields.phone_number;
        setErrors(mapped);
        setStatus("idle");
      } else {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setServerError("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="max-w-xl mx-auto px-6 py-24 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">You&apos;re in</p>
        <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-4">
          See You at the Next One.
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          We&apos;ll be in touch with early access and exclusive invites.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs tracking-widest uppercase text-primary underline underline-offset-4 hover:text-primary/70 transition-colors"
        >
          Subscribe another email
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-24">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Exclusive Access</p>
        <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-4">
          Stay in the Loop
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Get early access to events and exclusive invites — straight to your inbox and phone.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sub-name" className="text-xs tracking-widest uppercase text-muted-foreground">
            Name <span className="normal-case tracking-normal opacity-50">(optional)</span>
          </label>
          <Input
            id="sub-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            value={fields.name}
            onChange={handleChange}
            disabled={status === "loading"}
            className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sub-email" className="text-xs tracking-widest uppercase text-muted-foreground">
            Email <span className="text-primary">*</span>
          </label>
          <Input
            id="sub-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            value={fields.email}
            onChange={handleChange}
            disabled={status === "loading"}
            aria-describedby={errors.email ? "sub-email-error" : undefined}
            aria-invalid={!!errors.email}
            className={`bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50${
              errors.email ? " border-destructive" : ""
            }`}
          />
          {errors.email ? (
            <p id="sub-email-error" role="alert" className="text-xs text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sub-phone" className="text-xs tracking-widest uppercase text-muted-foreground">
            Phone{" "}
            <span className="normal-case tracking-normal opacity-50">
              (optional &mdash; for SMS event alerts)
            </span>
          </label>
          <Input
            id="sub-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 800 555 0199"
            value={fields.phone}
            onChange={handleChange}
            disabled={status === "loading"}
            aria-describedby={errors.phone ? "sub-phone-error" : undefined}
            aria-invalid={!!errors.phone}
            className={`bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50${
              errors.phone ? " border-destructive" : ""
            }`}
          />
          {errors.phone ? (
            <p id="sub-phone-error" role="alert" className="text-xs text-destructive">
              {errors.phone}
            </p>
          ) : null}
        </div>

        {/* Server error */}
        {status === "error" && serverError ? (
          <p role="alert" className="text-xs text-destructive border border-destructive/30 bg-destructive/10 rounded px-3 py-2">
            {serverError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full tracking-widest uppercase text-xs mt-2"
        >
          {status === "loading" ? "Sending…" : "Get Exclusive Access"}
        </Button>
      </form>
    </section>
  );
};

export default SubscribeSection;
