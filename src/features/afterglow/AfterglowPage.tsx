import { useEffect } from "react";
import StarryBackground from "@/components/StarryBackground";
import AfterglowContent from "./AfterglowContent";
import { Button } from "@/components/ui/button";

const AfterglowPage = ({ onSignOut }: { onSignOut: () => void }) => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Afterglow at Nubeluz · Private";
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <StarryBackground />
      <main className="relative z-10">
        <AfterglowContent />
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

