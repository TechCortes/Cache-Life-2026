import { Instagram, Music } from "lucide-react";
import SignupForm from "@/components/SignupForm";
import instagramGrid from "@/assets/instagram-grid.jpg";

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

        {/* Instagram grid preview */}
        <div className="mt-10 max-w-md mx-auto">
          <a
            href="https://www.instagram.com/cachelife/"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-sm border border-border/40 bg-card/30 backdrop-blur-sm p-4 md:p-6 hover:border-primary/40 transition-colors"
          >
            <div className="overflow-hidden rounded-sm">
              <img
                src={instagramGrid}
                alt="@cachelife Instagram preview"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Instagram size={16} strokeWidth={1.5} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground group-hover:text-primary transition-colors">
                @cachelife · View on Instagram →
              </span>
            </div>
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
          <a
            href="https://bitbasel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
            aria-label="BitBasel"
          >
            <img
              src={bitbaselLogo}
              alt="BitBasel"
              width={96}
              height={19}
              loading="lazy"
              className="h-4 w-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
