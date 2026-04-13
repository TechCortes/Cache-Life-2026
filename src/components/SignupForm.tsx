import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("event_signups").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("You're on the list! We'll be in touch.");
      setName("");
      setEmail("");
      setPhone("");
    }
    setLoading(false);
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
        <Button
          type="submit"
          disabled={loading}
          className="tracking-widest text-xs uppercase w-full"
        >
          {loading ? "Joining..." : "Join"}
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;
