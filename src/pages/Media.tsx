import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";

interface FeaturedPress {
  outletLogo: string;
  outletName: string;
  heading: string;
  excerpt: string;
  url: string;
}

interface LogoPress {
  outletLogo: string;
  outletName: string;
  url: string;
}

// Featured press cards (large banner cards, like the original Press page)
const featured: FeaturedPress[] = [
  {
    outletLogo: "https://cachelifeny.com/wp-content/uploads/2023/05/forbes-logo-300x78.png",
    outletName: "Forbes",
    heading: "Caché Featured in Forbes",
    excerpt:
      "Inside Caché Life: A Luxurious Brand And Event Series Taking Over Boutique New York City Hotels",
    url: "https://www.forbes.com/sites/lisakocay/2023/05/11/inside-cach-life-a-luxurious-brand-and-event-series-taking-over-boutique-new-york-city-hotels/",
  },
  {
    outletLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Brooklyn_Magazine_logo.svg/512px-Brooklyn_Magazine_logo.svg.png",
    outletName: "Brooklyn Magazine",
    heading: "Caché in Brooklyn Magazine",
    excerpt: "Inside Caché, an exclusive party for grown-ups",
    url: "https://www.bkmag.com/2022/10/13/cache-an-exclusive-party-for-grown-ups/",
  },
  {
    outletLogo:
      "https://resident.com/_next/image?url=%2Flogo-resident.png&w=384&q=75",
    outletName: "Resident",
    heading: "Caché x Miami Music Week",
    excerpt: "A celebration of Artistry at Zaytinya by José Andrés Group",
    url: "https://resident.com/sports-and-entertainment/2025/03/25/where-to-keep-the-beat-going-luxe-hotspots-to-hit-during-miami-music-week-2025",
  },
];

// Smaller logo-only mentions
const mentions: LogoPress[] = [
  {
    outletLogo: "https://cachelifeny.com/wp-content/uploads/2023/01/vale.png",
    outletName: "The William Vale",
    url: "https://www.thewilliamvale.com/journal/september-19-2019-cache-life-finale/",
  },
  {
    outletLogo: "https://cachelifeny.com/wp-content/uploads/2023/01/guest.png",
    outletName: "Guest of a Guest",
    url: "https://guestofaguest.com/new-york/nyc/actually-fun-things-to-do-this-september-in-nyc",
  },
  {
    outletLogo: "https://cachelifeny.com/wp-content/uploads/2023/01/timeout.png",
    outletName: "Time Out New York",
    url: "https://www.timeout.com/newyork/things-to-do/cache-sunset-rooftop-party",
  },
];

const Media = () => (
  <Layout>
    {/* Hero */}
    <section className="min-h-[30vh] flex flex-col items-center justify-center px-6 text-center pt-12">
      <h1 className="font-script text-6xl md:text-8xl lg:text-9xl text-foreground">
        Press
      </h1>
    </section>

    {/* Featured banner cards */}
    <section className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
      {featured.map((item, i) => (
        <article
          key={i}
          className="relative border border-border/30 rounded-sm overflow-hidden bg-card/40 backdrop-blur-sm hover:border-primary/40 transition-colors"
        >
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] items-center gap-6 p-8 md:p-10">
            <div className="flex items-center justify-center md:justify-start">
              <img
                src={item.outletLogo}
                alt={item.outletName}
                className="max-h-20 md:max-h-24 w-auto object-contain brightness-0 invert opacity-90"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-3 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground">
                {item.heading}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {item.excerpt}
              </p>
              <div className="mt-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border/60 hover:border-primary/60 hover:text-primary text-foreground rounded-full px-6 py-2 text-[10px] tracking-[0.3em] uppercase transition-colors"
                >
                  Read the Article <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>

    {/* Smaller logo grid */}
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {mentions.map((m, i) => (
          <a
            key={i}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-border/30 rounded-sm bg-card/30 backdrop-blur-sm hover:border-primary/40 transition-colors aspect-[3/2] flex items-center justify-center p-8"
            aria-label={m.outletName}
          >
            <img
              src={m.outletLogo}
              alt={m.outletName}
              className="max-h-16 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity brightness-0 invert"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </section>
  </Layout>
);

export default Media;
