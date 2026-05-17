import { useEffect } from "react";
import StarryBackground from "@/components/StarryBackground";
import AfterglowRSVP from "@/components/AfterglowRSVP";
import { Button } from "@/components/ui/button";

const AfterglowPage = ({ onSignOut }: { onSignOut: () => void }) => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Afterglow";
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <StarryBackground />
      <main className="relative z-10">
        <AfterglowRSVP />
      </main>
      <div className="fixed bottom-4 right-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default AfterglowPage;
