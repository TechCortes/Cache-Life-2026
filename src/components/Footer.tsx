import { Instagram, Music } from "lucide-react";
import SignupForm from "@/components/SignupForm";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-border/30 mt-20">
      {/* Instagram CTA */}
      <div className="text-center py-16 px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Follow us</p>
        <a
          href="https://instagram.com/cachelifeny"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl md:text-3xl font-serif tracking-wider text-foreground hover:text-primary transition-colors"
        >
          @CACHELIFENY
        </a>
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
            href="https://instagram.com/cachelifeny"
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
