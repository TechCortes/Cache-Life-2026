import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import afterglowPoster from "@/assets/afterglow-wednesday.jpg";
import heroVideo from "@/assets/cache-home.mp4";
import nubeluzVenue from "@/assets/nubeluz-venue.webp";
import GuestListForm from "./GuestListForm";
import { getNextWednesday } from "@/components/AfterglowRSVP";

// Replace with the real OpenTable link when ready.
const OPENTABLE_URL =
  "https://www.opentable.com/r/nubeluz-by-jose-andres-new-york";

const fmtDate = (d: Date) =>
  d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const Divider = () => (
  <div
    aria-hidden
    className="mx-auto h-px w-16 bg-foreground/40 my-12 md:my-16"
  />
);

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-[10px] tracking-[0.45em] uppercase text-muted-foreground mb-6">
    {children}
  </span>
);

const Hero = ({ nextDate }: { nextDate: Date }) => (
  <section className="relative w-full min-h-[100svh] flex items-end overflow-hidden">
    <video
      className="absolute inset-0 w-full h-full object-cover"
      src={heroVideo}
      poster={afterglowPoster}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden
    />
    <div
      aria-hidden
      className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background"
    />
    <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24">
      <div className="max-w-5xl mx-auto">
        <span className="text-[10px] tracking-[0.5em] uppercase text-foreground/80 mb-6 block">
          A weekly evening at Nubeluz
        </span>
        <h1 className="font-serif leading-[0.9] text-foreground text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem]">
          Afterglow
        </h1>
        <p className="font-serif italic text-foreground/85 text-2xl md:text-4xl mt-3">
          at Nubeluz
        </p>
        <p className="mt-8 text-xs md:text-sm tracking-[0.35em] uppercase text-foreground/80">
          Wednesdays · 7PM – 11PM
        </p>
        <p className="mt-2 text-xs md:text-sm tracking-[0.25em] uppercase text-muted-foreground">
          The Ritz-Carlton New York, NoMad
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            asChild
            className="tracking-[0.3em] text-[11px] uppercase h-12 px-7 rounded-none"
          >
            <a href={OPENTABLE_URL} target="_blank" rel="noopener noreferrer">
              Reserve on OpenTable
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="tracking-[0.3em] text-[11px] uppercase h-12 px-7 rounded-none bg-transparent border-foreground/50 hover:bg-foreground hover:text-background"
          >
            <a href="#guest-list">Request Standing Guest List</a>
          </Button>
        </div>

        <p className="mt-10 text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
          Next · {fmtDate(nextDate)}
        </p>
      </div>
    </div>
  </section>
);

const ComingUp = ({ nextDate }: { nextDate: Date }) => (
  <section className="px-6 md:px-12 py-24 md:py-32">
    <div className="max-w-5xl mx-auto">
      <SectionEyebrow>Coming Up</SectionEyebrow>
      <h2 className="font-serif text-foreground text-4xl md:text-6xl leading-[1.05]">
        {fmtDate(nextDate)}
      </h2>

      <div className="mt-12 grid md:grid-cols-3 gap-10 md:gap-14 text-foreground">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">
            Music
          </p>
          <p className="font-serif text-2xl md:text-3xl">DJ Amanduh</p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">
            Live Trumpet
          </p>
          <p className="font-serif text-2xl md:text-3xl">Dave Levy</p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">
            Percussion
          </p>
          <p className="font-serif text-2xl md:text-3xl">Jimmy Lopez</p>
        </div>
      </div>

      <p className="mt-14 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
        An elevated evening of DJ-led music and live instrumentation —
        designed for dinner, cocktails, and a sophisticated midweek
        nightlife atmosphere.
      </p>
    </div>
  </section>
);

const Programming = () => (
  <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border/30">
    <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-10">
      <div className="md:col-span-5">
        <SectionEyebrow>Monthly Programming</SectionEyebrow>
        <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-[1.05]">
          A rotating
          <br />
          <em className="font-serif italic">weekly</em> lineup.
        </h2>
      </div>
      <div className="md:col-span-7 md:pt-2">
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          A rotating weekly lineup of DJs, live musicians, and special
          guests — curated to create one of New York City's leading
          weekday luxury hospitality experiences.
        </p>
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          Each Wednesday features a unique music direction with live
          elements including trumpet, percussion, saxophone, guitar, and
          other performance moments.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {[
            "DJ Sets",
            "Trumpet",
            "Percussion",
            "Saxophone",
            "Guitar",
            "Special Guests",
          ].map((tag) => (
            <span
              key={tag}
              className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground border border-border/50 px-3 py-1.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Reservations = () => (
  <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border/30">
    <div className="max-w-3xl mx-auto text-center">
      <SectionEyebrow>Reservations</SectionEyebrow>
      <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-[1.05]">
        Dinner, cocktails, <em className="italic">and tables</em>.
      </h2>
      <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed">
        For dinner, cocktails, and table reservations, please book
        directly through OpenTable.
      </p>
      <Button
        asChild
        className="mt-10 tracking-[0.3em] text-[11px] uppercase h-12 px-8 rounded-none"
      >
        <a href={OPENTABLE_URL} target="_blank" rel="noopener noreferrer">
          Reserve on OpenTable
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  </section>
);

const GuestList = ({
  rsvpDate,
  dateLabel,
}: {
  rsvpDate: Date;
  dateLabel: string;
}) => (
  <section
    id="guest-list"
    className="px-6 md:px-12 py-24 md:py-32 border-t border-border/30 scroll-mt-24"
  >
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-start">
      <div>
        <SectionEyebrow>Standing Guest List</SectionEyebrow>
        <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-[1.05]">
          For lounge access &amp; <em className="italic">standing</em>{" "}
          arrivals.
        </h2>
        <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed">
          For lounge access and standing guest list consideration, please
          submit your request below. All requests are subject to approval
          and capacity.
        </p>
        <p className="mt-8 text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
          Requesting for · {dateLabel}
        </p>
      </div>

      <div className="w-full">
        <GuestListForm rsvpDate={rsvpDate} dateLabel={dateLabel} />
      </div>
    </div>
  </section>
);

const About = () => (
  <section className="px-6 md:px-12 py-24 md:py-32 border-t border-border/30">
    <div className="max-w-3xl mx-auto">
      <SectionEyebrow>About Afterglow</SectionEyebrow>
      <p className="font-serif text-foreground text-2xl md:text-3xl leading-[1.35]">
        Afterglow is a weekly Wednesday evening concept created to elevate
        the midweek hospitality experience at Nubeluz.
      </p>
      <Divider />
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
        The program combines the elegance of The Ritz-Carlton New York,
        NoMad with a curated music identity, live performance, and a
        sophisticated downtown-meets-uptown energy.
      </p>
      <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
        Designed for guests seeking more than a dinner reservation,
        Afterglow offers a weekly cultural moment where music, cocktails,
        ambience, and skyline views come together.
      </p>
    </div>
  </section>
);

const AfterglowContent = () => {
  const nextDate = useMemo(() => getNextWednesday(), []);
  const dateLabel = fmtDate(nextDate);
  return (
    <>
      <Hero nextDate={nextDate} />
      <ComingUp nextDate={nextDate} />
      <Programming />
      <Reservations />
      <GuestList rsvpDate={nextDate} dateLabel={dateLabel} />
      <About />
      <footer className="px-6 md:px-12 py-10 border-t border-border/30 text-center">
        <p className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">
          Afterglow · Nubeluz · Private
        </p>
      </footer>
    </>
  );
};

export default AfterglowContent;
