import Layout from "@/components/Layout";
import SubscribeSection from "@/components/SubscribeSection";
import { useEffect, useRef } from "react";
import discoBallImg from "@/assets/disco-ball.png";

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

const Sparkle = ({ style, delay, size }: { style: React.CSSProperties; delay: string; size: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="white"
    className="absolute animate-[sparkle-shine_2s_ease-in-out_infinite]"
    style={{ width: size, height: size, animationDelay: delay, ...style }}
  >
    <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
  </svg>
);

const DiscoBall = () => (
  <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto mb-8 animate-[disco-sway_6s_ease-in-out_infinite]">
    <Sparkle style={{ top: "-15%", left: "10%" }} delay="0s" size={14} />
    <Sparkle style={{ top: "5%", right: "-10%" }} delay="0.4s" size={10} />
    <Sparkle style={{ bottom: "10%", right: "-15%" }} delay="0.8s" size={16} />
    <Sparkle style={{ bottom: "-10%", left: "20%" }} delay="1.2s" size={12} />
    <Sparkle style={{ top: "30%", left: "-18%" }} delay="0.6s" size={11} />
    <Sparkle style={{ top: "-8%", right: "15%" }} delay="1.5s" size={8} />
    <Sparkle style={{ bottom: "25%", left: "-12%" }} delay="1.0s" size={9} />
    <Sparkle style={{ top: "50%", right: "-20%" }} delay="0.2s" size={13} />
    <img
      src={discoBallImg}
      alt="Disco ball"
      width={512}
      height={512}
      className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] animate-[disco-spin_4s_ease-in-out_infinite]"
    />
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
            Arts &amp; Entertainment
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

      {/* Subscribe */}
      <FadeIn>
        <div className="border-t border-border/20 mx-6">
          <SubscribeSection />
        </div>
      </FadeIn>
    </Layout>
  );
};

export default Index;
