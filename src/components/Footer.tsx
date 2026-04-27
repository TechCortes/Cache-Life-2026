import { Instagram, Music } from "lucide-react";
import { useEffect } from "react";
import SignupForm from "@/components/SignupForm";

// Replace with your real Behold feed ID from https://behold.so
const BEHOLD_FEED_ID = "YOUR_BEHOLD_FEED_ID";

const Footer = () => {
  useEffect(() => {
    const scriptId = "behold-widget-script";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://w.behold.so/widget.js";
    script.type = "module";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const hasFeed = BEHOLD_FEED_ID && BEHOLD_FEED_ID !== "YOUR_BEHOLD_FEED_ID";

  return (
    <footer className="relative z-10 border-t border-border/30 mt-20">
      {/* Instagram CTA */}
      <div className="text-center py-16 px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Follow us</p>
        <a
          href="https://www.instagram.com/cachelife/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl md:text-3xl font-serif tracking-wider text-foreground hover:text-primary transition-colors"
        >
          @CACHELIFE
        </a>

        {/* Instagram grid (Behold) — themed dark to match site */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="rounded-sm border border-border/40 bg-card/30 backdrop-blur-sm p-6 md:p-8 text-center">
            {hasFeed ? (
              // @ts-expect-error - custom element from behold.so widget script
              <behold-widget feed-id={BEHOLD_FEED_ID} />
            ) : (
              <div className="py-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border/40 bg-background/60 text-foreground mb-4">
                  <Instagram size={26} strokeWidth={1.25} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Instagram grid will appear here once the Behold feed ID is added in <code className="text-foreground/80">Footer.tsx</code>.
                </p>
              </div>
            )}
            <a
              href="https://www.instagram.com/cachelife/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              View full profile →
            </a>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <SignupForm />

      {/* Bottom */}
      <div className="border-t border-border/20 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Caché Life NY. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://www.instagram.com/cachelife/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href="https://soundcloud.com/cachelifeny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Soundcloud"
          >
            <Music size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
