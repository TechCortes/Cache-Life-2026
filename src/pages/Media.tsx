import Layout from "@/components/Layout";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import mediaTitle from "@/assets/media-title.png";

import collage1 from "@/assets/media-collage/1.jpg";
import collage2 from "@/assets/media-collage/2.jpg";
import collage3 from "@/assets/media-collage/3.jpg";
import collage4 from "@/assets/media-collage/4.jpg";
import collage5 from "@/assets/media-collage/5.jpg";
import collage6 from "@/assets/media-collage/6.jpg";
import collage7 from "@/assets/media-collage/7.jpg";
import collage8 from "@/assets/media-collage/8.jpg";
import collage9 from "@/assets/media-collage/9.jpg";
import collage10 from "@/assets/media-collage/10.jpg";
import collage11 from "@/assets/media-collage/11.jpg";
import collage12 from "@/assets/media-collage/12.jpg";
import collage13 from "@/assets/media-collage/13.jpg";
import collage14 from "@/assets/media-collage/14.jpg";

const collageImages = [
  collage1, collage2, collage3, collage4, collage5, collage6, collage7,
  collage8, collage9, collage10, collage11, collage12, collage13, collage14,
];

interface VideoItem {
  id: string;
  vimeoId: string;
  title: string;
}

// Playlist sourced from Caché Signature Recaps
const playlistTitle = "Caché Signature Recaps";

const videos: VideoItem[] = [
  { id: "a710a2c", vimeoId: "1096370342", title: "Caché x Park Lane Residency Launch" },
  { id: "329761c", vimeoId: "1125586960", title: "Caché Life x Laissez Faire" },
  { id: "deefb57", vimeoId: "1125588285", title: "Caché Life x Ruschmeyers [Art Party]" },
  { id: "d30e723", vimeoId: "1125591065", title: "Fourth of July at EHP Resort" },
  { id: "9188791", vimeoId: "1117487423", title: "NYFW at Darling Penthouse" },
  { id: "98d51bf", vimeoId: "1096359491", title: "Caché x Westlight Residency Launch" },
  { id: "824d364", vimeoId: "1082193591", title: "Art Basel 2025" },
  { id: "75e81f1", vimeoId: "1010302371", title: "10th Anniversary Party" },
  { id: "885f838", vimeoId: "787184644", title: "Caché x Sagamore Hotel South Beach" },
  { id: "a123363", vimeoId: "1041998185", title: "Art Basel 2024" },
  { id: "b09bb5d", vimeoId: "952080182", title: "CACHÉ X SISI EAST HAMPTON" },
  { id: "f6c2067", vimeoId: "914781470", title: "NYFW at Paradise Club" },
  { id: "2ea0fc5", vimeoId: "905749201", title: "NEW YEARS EVE at THE 1 HOTEL BK BRIDGE [2024]" },
  { id: "c243536", vimeoId: "1012529371", title: "Arlo WB Sunset Party" },
  { id: "deeef59", vimeoId: "624717210", title: "Caché Life 7th Year Anniversary" },
  { id: "0c11dec", vimeoId: "584588501", title: "Caché Life Grand Disco Gala 2021" },
  { id: "0244639", vimeoId: "340257402", title: "Caché Debuts at The William Vale" },
  { id: "a1c2e22", vimeoId: "312769295", title: "NYFW Underground" },
  { id: "bec3fe1", vimeoId: "369397147", title: "Caché Life Visual Arts Showreel feat. Juice" },
  { id: "74127a9", vimeoId: "385028256", title: "Caché Life NYE at citizenM Bowery 2020" },
  { id: "0631d6f", vimeoId: "1135437352", title: "PENTHOUSE NIGHTMARE [HALLOWEEN 2025]" },
];

const Media = () => {
  // Read ?video=ID from the URL to set initial selection
  const initial = useMemo(() => {
    if (typeof window === "undefined") return videos[0];
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("video");
    return videos.find((v) => v.id === requested) ?? videos[0];
  }, []);

  const [active, setActive] = useState<VideoItem>(initial);

  const handleSelect = (v: VideoItem) => {
    setActive(v);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("playlist", "774cf55");
      url.searchParams.set("video", v.id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="min-h-[20vh] flex flex-col items-center justify-center px-6 text-center pt-12">
        <h1>
          <img
            src={mediaTitle}
            alt="Media"
            className="w-auto h-[110px] md:h-[160px] lg:h-[190px] mx-auto"
          />
        </h1>
        <p className="font-abel mt-6 text-lg md:text-2xl tracking-wide text-foreground">
          Relive the night, the energy never ends.
        </p>
      </section>

      {/* Video Playlist */}
      <section className="max-w-[1600px] mx-auto px-2 md:px-6 py-12">
        <div className="border border-border/30 rounded-sm overflow-hidden bg-card/30 backdrop-blur-sm">
          {/* Playlist title bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <h2 className="text-xl md:text-2xl font-serif font-light text-foreground">
              {playlistTitle}
            </h2>
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              {videos.length} Videos
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
            {/* Player */}
            <div className="bg-black relative aspect-video lg:aspect-auto lg:min-h-[560px]">
              <iframe
                key={active.vimeoId}
                src={`https://player.vimeo.com/video/${active.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                title={active.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Playlist sidebar */}
            <aside className="border-t lg:border-t-0 lg:border-l border-border/30 max-h-[560px] overflow-y-auto">
              <ul role="tablist">
                {videos.map((v) => {
                  const isActive = v.id === active.id;
                  return (
                    <li key={v.id}>
                      <button
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleSelect(v)}
                        className={`w-full flex items-start gap-3 text-left px-4 py-3 border-b border-border/20 transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/80 hover:bg-secondary/40 hover:text-foreground"
                        }`}
                      >
                        <span
                          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center ${
                            isActive
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border/60"
                          }`}
                        >
                          <Play size={10} fill="currentColor" />
                        </span>
                        <span className="text-sm leading-snug">{v.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>

          {/* Now playing footer */}
          <div className="px-6 py-4 border-t border-border/30">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
              Now Playing
            </p>
            <p className="text-base md:text-lg font-serif text-foreground">
              {active.title}
            </p>
          </div>
        </div>

        <p className="font-abel mt-10 text-lg md:text-2xl tracking-wide text-foreground text-center max-w-4xl mx-auto leading-relaxed">
          Our photo recaps showcase unforgettable moments across Manhattan, The Hamptons and exclusive hotel residences — including seasonal boutique festivals during Art Basel.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="https://cachelife.pixieset.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-foreground/70 text-foreground text-xs tracking-[0.3em] uppercase px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
          >
            View Photo Gallery
          </a>
        </div>
      </section>

      {/* Photo collage */}
      <section className="max-w-[1600px] mx-auto px-2 md:px-6 pb-20">
        <div className="columns-1 md:columns-2 gap-2 md:gap-3 [column-fill:_balance]">
          {collageImages.map((src, i) => (
            <div key={i} className="mb-2 md:mb-3 break-inside-avoid overflow-hidden rounded-sm border border-border/20">
              <img
                src={src}
                alt={`Caché Life event recap ${i + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover block"
              />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Media;
