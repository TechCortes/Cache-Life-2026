import Layout from "@/components/Layout";
import { useEffect, useRef } from "react";
import discoBallImg from "@/assets/disco-ball.gif";
import eventsCollage from "@/assets/events-collage.png";
import whatWeDoTitle from "@/assets/what-we-do.png";

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
  <div className="relative w-[276px] h-[276px] md:w-[388px] md:h-[388px] mx-auto mb-8 animate-[disco-sway_6s_ease-in-out_infinite]">
    {/* Star sparkles */}
    <Sparkle style={{ top: '-15%', left: '10%' }} delay="0s" size={14} />
    <Sparkle style={{ top: '5%', right: '-10%' }} delay="0.4s" size={10} />
    <Sparkle style={{ bottom: '10%', right: '-15%' }} delay="0.8s" size={16} />
    <Sparkle style={{ bottom: '-10%', left: '20%' }} delay="1.2s" size={12} />
    <Sparkle style={{ top: '30%', left: '-18%' }} delay="0.6s" size={11} />
    <Sparkle style={{ top: '-8%', right: '15%' }} delay="1.5s" size={8} />
    <Sparkle style={{ bottom: '25%', left: '-12%' }} delay="1.0s" size={9} />
    <Sparkle style={{ top: '50%', right: '-20%' }} delay="0.2s" size={13} />
    <img
      src={discoBallImg}
      alt="Disco ball"
      className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
    />
  </div>
);

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="min-h-[25vh] flex flex-col items-center justify-center px-6 text-center">
        <DiscoBall />
        <h1 className="mb-4">
          <img
            src={whatWeDoTitle}
            alt="What We Do"
            className="w-auto h-[100px] md:h-[150px] lg:h-[174px] mx-auto"
          />
        </h1>
      </section>

      {/* Featured Video */}
      <FadeIn>
        <section className="max-w-[1267px] mx-auto px-4 md:px-6 py-4">
          <div className="aspect-video rounded-sm overflow-hidden border border-border/30">
            <video
              src="https://cachelifeny.com/wp-content/uploads/2023/01/cache_homevid.mov"
              autoPlay
              loop
              muted
              playsInline
              controlsList="nodownload"
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </FadeIn>
      {/* About */}
      <FadeIn>
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-base md:text-lg tracking-[0.4em] uppercase text-primary mb-6">
            Arts & Entertainment
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-foreground mb-10 leading-tight">
            A Creative Agency for Culture
          </h2>
          <p className="text-2xl md:text-3xl font-normal text-foreground leading-loose max-w-5xl mx-auto mb-8 tracking-wide">
            Caché Life is a New York-based arts and entertainment agency specializing in private event production, cultural programming, and digital content creation. We transform spaces, curate moments, and craft stories that move people.
          </p>
          <p className="text-2xl md:text-3xl font-normal text-foreground leading-loose max-w-5xl mx-auto tracking-wide">
            Our work lives at the intersection of art, music, fashion, and community — bringing together visionary creators and discerning audiences in environments that inspire.
          </p>
        </section>
      </FadeIn>

      {/* Events Collage */}
      <FadeIn>
        <section className="max-w-[1600px] mx-auto px-2 md:px-4 py-12">
          <div className="rounded-sm overflow-hidden border border-border/30">
            <img
              src={eventsCollage}
              alt="Caché Life events collage featuring nightlife, art, music, and culture in New York City"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
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
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">{s.title}</h3>
                <p className="text-lg md:text-xl font-normal text-foreground leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Showreel */}
      <FadeIn>
        <section className="max-w-[1600px] mx-auto px-2 md:px-4 py-20 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">
            Showreel
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-12">
            Check Out Our Client Projects
          </h2>
          <div className="aspect-video bg-secondary/30 border border-border/30 rounded-sm overflow-hidden grayscale">
            <iframe
              src="https://player.vimeo.com/video/681646876?autoplay=1&loop=1&muted=1&background=1"
              title="Caché Life Client Projects Showreel"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </section>
      </FadeIn>
    </Layout>
  );
};

export default Index;
