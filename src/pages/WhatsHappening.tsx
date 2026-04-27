import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import whatsHappeningTitle from "@/assets/whats-happening-title.png";

interface PoshEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  image_url: string | null;
  posh_url: string;
  provider: "posh" | "partiful";
}

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const providerLabel = (p: PoshEvent["provider"]) =>
  p === "partiful" ? "Register on Partiful" : "Register on Posh";

const WhatsHappening = () => {
  const [events, setEvents] = useState<PoshEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("posh_events")
        .select("id, title, description, event_date, location, image_url, posh_url, provider")
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
      <div className="lg:h-screen lg:overflow-y-auto snap-none lg:snap-y lg:snap-mandatory scroll-smooth">
        {/* Compact hero */}
        <section className="lg:snap-start min-h-0 lg:min-h-0 flex-col px-6 pt-6 pb-0 lg:pt-8 lg:pb-0 flex items-center justify-center">
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Upcoming</p>
          <h1>
            <img
              src={whatsHappeningTitle}
              alt="What's Happening"
              className="w-auto h-[80px] md:h-[120px] lg:h-[150px] mx-auto"
            />
          </h1>
          {!loading && events.length > 0 && (
            <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              Scroll to explore
            </p>
          )}
        </section>

        {loading ? (
          <section className="lg:snap-start min-h-[60vh] lg:min-h-screen flex items-center justify-center">
            <p className="text-center text-muted-foreground">Loading events...</p>
          </section>
        ) : events.length === 0 ? (
          <section className="lg:snap-start min-h-[60vh] lg:min-h-screen flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              No upcoming events at the moment. Check back soon.
            </p>
          </section>
        ) : (
          events.map((e, idx) => (
            <section
              key={e.id}
              className={`lg:snap-start min-h-0 ${idx === 0 ? "lg:min-h-0" : "lg:min-h-screen"} w-full flex items-start lg:items-center justify-center px-6 ${idx === 0 ? "pt-10 pb-12" : "pt-0 pb-12"} ${idx === 0 ? "lg:pt-32 lg:pb-16" : "lg:py-8"}`}
            >
              <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Image */}
                {e.image_url ? (
                  <div className="flex justify-center items-center">
                    <img
                      src={e.image_url}
                      alt={e.title}
                      className="w-auto max-w-full max-h-[55vh] lg:max-h-[80vh] object-contain rounded-sm border border-border/40"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="hidden lg:block" />
                )}

                {/* Details */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <span className="text-[10px] tracking-[0.25em] uppercase border border-border/60 text-muted-foreground px-2 py-0.5 rounded-sm">
                      {e.provider === "partiful" ? "Partiful" : "Posh"}
                    </span>
                    {e.event_date && (
                      <p className="text-xs tracking-[0.2em] uppercase text-primary">
                        {formatDate(e.event_date)}
                      </p>
                    )}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-3 whitespace-pre-line">
                    {e.title}
                  </h2>

                  {e.location && (
                    <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">
                      {e.location}
                    </p>
                  )}

                  {e.description && (
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8 line-clamp-none">
                      {e.description}
                    </p>
                  )}

                  <div>
                    <Button asChild className="tracking-widest text-xs uppercase">
                      <a href={e.posh_url} target="_blank" rel="noopener noreferrer">
                        {providerLabel(e.provider)} <ExternalLink size={14} className="ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          ))
        )}
      </div>
    </Layout>
  );
};

export default WhatsHappening;
