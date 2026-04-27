import Layout from "@/components/Layout";
import { useEffect, useRef } from "react";
import discoBallImg from "@/assets/disco-ball.gif";
import pressTitle from "@/assets/press-title.png";

import forbesLogo from "@/assets/press/forbes-logo.png";
import forbesBg from "@/assets/press/forbes-bg.jpg";
import bkBg from "@/assets/press/bk-bg.jpg";
import miamiBg from "@/assets/press/miami-bg.jpg";
import valeLogo from "@/assets/press/vale.png";
import guestLogo from "@/assets/press/guest.png";
import timeoutLogo from "@/assets/press/timeout.png";

const Sparkle = ({
  style,
  delay,
  size,
}: {
  style: React.CSSProperties;
  delay: string;
  size: number;
}) => (
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
  <div className="relative w-[220px] h-[220px] md:w-[300px] md:h-[300px] mx-auto mb-6 animate-[disco-sway_6s_ease-in-out_infinite]">
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
      className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
    />
  </div>
);

const FadeIn = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
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
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

interface FeatureItem {
  title: string;
  description: string;
  href: string;
  bg: string;
  logo?: string;
  logoAlt?: string;
}

const features: FeatureItem[] = [
  {
    title: "Caché Featured in Forbes",
    description:
      "Inside Caché Life: A Luxurious Brand And Event Series Taking Over Boutique New York City Hotels",
    href: "https://www.forbes.com/sites/lisakocay/2023/05/11/inside-cach-life-a-luxurious-brand-and-event-series-taking-over-boutique-new-york-city-hotels/?sh=696b22219b8f",
    bg: forbesBg,
    logo: forbesLogo,
    logoAlt: "Forbes",
  },
  {
    title: "Caché in Brooklyn Magazine",
    description: "Inside Caché, an exclusive party for grown-ups",
    href: "https://www.bkmag.com/2022/10/13/cache-an-exclusive-party-for-grown-ups/",
    bg: bkBg,
  },
  {
    title: "Caché x Miami Music Week",
    description: "A celebration of Artistry at Zaytinya by José Andrés Group",
    href: "https://resident.com/sports-and-entertainment/2025/03/25/where-to-keep-the-beat-going-luxe-hotspots-to-hit-during-miami-music-week-2025",
    bg: miamiBg,
  },
];

const outletLogos = [
  {
    src: valeLogo,
    alt: "The William Vale",
    href: "https://www.thewilliamvale.com/journal/september-19-2019-cache-life-finale/",
  },
  {
    src: guestLogo,
    alt: "Guest of a Guest",
    href: "https://guestofaguest.com/new-york/nyc/actually-fun-things-to-do-this-september-in-nyc?slide=6",
  },
  {
    src: timeoutLogo,
    alt: "Time Out New York",
    href: "https://www.timeout.com/newyork/things-to-do/cache-sunset-rooftop-party",
  },
];

const FeatureBanner = ({ item }: { item: FeatureItem }) => (
  <section className="relative w-full overflow-hidden border-y border-border/30 min-h-[340px] md:min-h-[420px] flex items-center">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${item.bg})` }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-background/70" aria-hidden="true" />
    <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20 w-full">
      {item.logo && (
        <img
          src={item.logo}
          alt={item.logoAlt ?? ""}
          className="h-14 md:h-20 w-auto mb-6 brightness-0 invert opacity-90"
          loading="lazy"
        />
      )}
      <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-4 tracking-wide">
        {item.title}
      </h2>
      <p className="font-abel text-lg md:text-xl text-foreground/90 leading-relaxed tracking-wide max-w-3xl mb-8">
        {item.description}
      </p>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block border border-foreground/70 text-foreground text-xs tracking-[0.3em] uppercase px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
      >
        Read the Article
      </a>
    </div>
  </section>
);

const Press = () => (
  <Layout>
    {/* Hero */}
    <section className="min-h-[40vh] flex flex-col items-center justify-center px-6 text-center pt-8 pb-16">
      <DiscoBall />
      <h1 className="font-script font-light text-6xl md:text-8xl lg:text-9xl text-foreground leading-none">
        Press
      </h1>
    </section>

    {/* Featured banners */}
    <div className="flex flex-col gap-px">
      {features.map((f, i) => (
        <FadeIn key={i}>
          <FeatureBanner item={f} />
        </FadeIn>
      ))}
    </div>

    {/* Outlet logos row */}
    <FadeIn>
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-center">
          {outletLogos.map((o, i) => (
            <a
              key={i}
              href={o.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-sm border border-border/30 hover:border-primary/40 transition-colors"
            >
              <img
                src={o.src}
                alt={o.alt}
                loading="lazy"
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </a>
          ))}
        </div>
      </section>
    </FadeIn>
  </Layout>
);

export default Press;
