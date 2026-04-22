import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PoshEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  image_url: string | null;
  posh_url: string;
}

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const WhatsHappening = () => {
  const [events, setEvents] = useState<PoshEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("posh_events")
        .select("id, title, description, event_date, location, image_url, posh_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("event_date", { ascending: true });
      if (data) setEvents(data as PoshEvent[]);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Upcoming</p>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground">
            What's Happening
          </h1>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No upcoming events at the moment. Check back soon.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {events.map((e) => (
              <div
                key={e.id}
                className="border border-border/40 rounded-sm overflow-hidden hover:border-primary/40 transition-colors bg-card/30 backdrop-blur-sm"
              >
                {e.image_url && (
                  <div className="aspect-[16/9] overflow-hidden grayscale">
                    <img
                      src={e.image_url}
                      alt={e.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <h2 className="text-2xl font-serif text-foreground">{e.title}</h2>
                    {e.event_date && (
                      <p className="text-xs tracking-[0.2em] uppercase text-primary">
                        {formatDate(e.event_date)}
                      </p>
                    )}
                  </div>
                  {e.location && (
                    <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3">
                      {e.location}
                    </p>
                  )}
                  {e.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {e.description}
                    </p>
                  )}
                  <Button
                    asChild
                    className="tracking-widest text-xs uppercase"
                  >
                    <a href={e.posh_url} target="_blank" rel="noopener noreferrer">
                      Register on Posh <ExternalLink size={14} className="ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default WhatsHappening;
