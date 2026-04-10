import Layout from "@/components/Layout";

const mediaItems = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Project ${i + 1}`,
  category: ["Event", "Content", "Photography", "Video"][i % 4],
}));

const Media = () => (
  <Layout>
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Portfolio</p>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground">Media</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="aspect-square bg-secondary/20 border border-border/30 rounded-sm flex flex-col items-center justify-center hover:border-primary/40 transition-colors group cursor-pointer"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">{item.category}</p>
            <p className="text-lg font-serif text-foreground group-hover:text-primary transition-colors">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Media;
