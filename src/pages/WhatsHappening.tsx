import Layout from "@/components/Layout";

const events = [
  { title: "Summer Night Soirée", date: "August 2026", location: "Brooklyn, NY", desc: "An intimate evening of live performances and immersive art." },
  { title: "Culture Club: Volume III", date: "July 2026", location: "Manhattan, NY", desc: "Our flagship series returns with curated music, fashion, and conversation." },
  { title: "Art After Dark", date: "June 2026", location: "Chelsea, NY", desc: "A late-night gallery experience featuring emerging NYC artists." },
  { title: "The Annual Gala", date: "September 2026", location: "SoHo, NY", desc: "Our most anticipated event celebrating a year of culture and community." },
];

const WhatsHappening = () => (
  <Layout>
    <section className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Upcoming</p>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground">What's Happening</h1>
      </div>
      <div className="flex flex-col gap-6">
        {events.map((e, i) => (
          <div
            key={i}
            className="border border-border/40 rounded-sm p-8 hover:border-primary/40 transition-colors bg-card/30 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
              <h2 className="text-xl font-serif text-foreground">{e.title}</h2>
              <p className="text-xs tracking-[0.2em] uppercase text-primary">{e.date}</p>
            </div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">{e.location}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default WhatsHappening;
