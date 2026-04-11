import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "@/assets/cache-life-logo.png";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "What We Do" },
  { to: "/media", label: "Media" },
  { to: "/whats-happening", label: "What's Happening" },
  { to: "/press", label: "Press" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Left links (desktop) */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {navLinks.slice(0, 2).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-xs tracking-[0.2em] uppercase transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Spacer for mobile left side */}
        <div className="w-8 md:hidden" />

        {/* Logo — always centered */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <img src={logoImg} alt="Caché Life" className="h-10 md:h-14 w-auto" />
        </Link>

        {/* Right links (desktop) */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
          {navLinks.slice(2).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-xs tracking-[0.2em] uppercase transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/30 px-6 py-6 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`text-sm tracking-[0.2em] uppercase transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
