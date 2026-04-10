import Layout from "@/components/Layout";
import { useEffect, useRef } from "react";

const services = [
  {
    title: "Private Event Production",
    desc: "End-to-end curation of exclusive, unforgettable private events — from intimate gatherings to grand celebrations.",
  },
  {
    title: "Co-Produced Events",
    desc: "Strategic partnerships with brands, venues, and artists to co-create cultural moments that resonate.",
  },
  {
    title: "Digital Content Creation",
    desc: "Cinematic visuals, photography, and editorial content that captures the energy and essence of every experience.",
  },
  {
    title: "Cultural Programming",
    desc: "Thoughtfully designed programming that bridges art, music, fashion, and community in unexpected ways.",
  },
];

const FadeIn = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-8");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
};

const DiscoBall = () => (
  <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-8">
    <div className="w-full h-full rounded-full bg-gradient-to-br from-muted-foreground/40 via-foreground/20 to-muted-foreground/10 shadow-[0_0_60px_20px_rgba(255,255,255,0.08)] animate-[spin_20s_linear_infinite]">
      {/* Facets */}
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 12 }).map((_, col) => {
          const angle = (col / 12) * 360;
          const vAngle = (row / 6) * 180 - 90;
          const r = 50;
          const x = 50 + r * Math.cos((vAngle * Math.PI) / 180) * Math.cos((angle * Math.PI) / 180);
          const y = 50 + r * Math.cos((vAngle * Math.PI) / 180) * Math.sin((angle * Math.PI) / 180);
          const opacity = 0.1 + Math.random() * 0.4;
          return (
            <div
              key={`${row}-${col}`}
              className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-foreground"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                opacity,
              }}
            />
          );
        })
      )}
    </div>
    {/* Light rays */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-foreground/5 to-foreground/10 animate-pulse" />
  </div>
);

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        <DiscoBall />
        <h1 className="font-script text-5xl md:text-7xl lg:text-8xl text-foreground mb-4">
          What We Do
        </h1>
        <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">
          New York City
        </p>
      </section>

      {/* About */}
      <FadeIn>
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-6">
            Arts & Entertainment
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-foreground mb-8 leading-tight">
            A Creative Agency for Culture
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
            Caché Life is a New York-based arts and entertainment agency specializing in private event production,
            cultural programming, and digital content creation. We transform spaces, curate moments,
            and craft stories that move people.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Our work lives at the intersection of art, music, fashion, and community — bringing together
            visionary creators and discerning audiences in environments that inspire.
          </p>
        </section>
      </FadeIn>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <FadeIn>
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4 text-center">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground text-center mb-16">
            What We Offer
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, i) => (
            <FadeIn key={i}>
              <div className="border border-border/40 rounded-sm p-8 hover:border-primary/40 transition-colors bg-card/30 backdrop-blur-sm">
                <h3 className="text-xl font-serif text-foreground mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Showreel */}
      <FadeIn>
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">
            Showreel
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-12">
            Check Out Our Client Projects
          </h2>
          <div className="aspect-video bg-secondary/30 border border-border/30 rounded-sm overflow-hidden flex items-center justify-center">
            <p className="text-muted-foreground text-sm tracking-widest uppercase">
              Video Coming Soon
            </p>
          </div>
        </section>
      </FadeIn>
    </Layout>
  );
};

export default Index;
