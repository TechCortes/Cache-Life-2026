import Layout from "@/components/Layout";

const pressItems = [
  { outlet: "Vogue", title: "Caché Life: The Agency Redefining NYC Nightlife", date: "March 2026" },
  { outlet: "Hypebeast", title: "Inside the World of Caché Life's Cultural Programming", date: "February 2026" },
  { outlet: "The New York Times", title: "How a New Wave of Event Curators Is Changing the City", date: "January 2026" },
  { outlet: "Complex", title: "Caché Life's Most Unforgettable Events of the Year", date: "December 2025" },
  { outlet: "Paper Magazine", title: "The Creative Collective Behind NYC's Hottest Events", date: "November 2025" },
];

const Press = () => (
  <Layout>
    <section className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">In the News</p>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground">Press</h1>
      </div>
      <div className="flex flex-col gap-4">
        {pressItems.map((item, i) => (
          <div
            key={i}
            className="border-b border-border/30 pb-6 hover:border-primary/30 transition-colors cursor-pointer group"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">{item.outlet}</p>
            <h2 className="text-lg md:text-xl font-serif text-foreground group-hover:text-primary transition-colors mb-1">
              {item.title}
            </h2>
            <p className="text-xs text-muted-foreground">{item.date}</p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Press;
