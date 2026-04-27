import { Instagram, Music } from "lucide-react";
import SignupForm from "@/components/SignupForm";

const Footer = () => {
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

        {/* Simple dark-themed Instagram card */}
        <div className="mt-10 max-w-md mx-auto">
          <a
            href="https://www.instagram.com/cachelife/"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-sm border border-border/40 bg-card/30 backdrop-blur-sm p-8 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/40 bg-background/60 text-foreground group-hover:text-primary transition-colors">
                <Instagram size={26} strokeWidth={1.25} />
              </div>
              <div className="text-left">
                <p className="text-base font-serif tracking-wide text-foreground">@cachelife</p>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">
                  Follow on Instagram
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              Nightlife, art, music & culture from New York City.
            </p>
            <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-muted-foreground/70 group-hover:text-primary transition-colors">
              View profile →
            </p>
          </a>
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
