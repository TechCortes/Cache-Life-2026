import starfield from "@/assets/bg/starfield.gif";

/**
 * Persistent universe-like background — matches the reference site exactly.
 * A single animated B&W starfield GIF tiled across the viewport, fixed so it
 * stays put as the user scrolls (giving the feeling of a vast, still cosmos).
 */
const StarryBackground = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 pointer-events-none"
    style={{
      zIndex: 0,
      backgroundColor: "#000",
      backgroundImage: `url(${starfield})`,
      backgroundRepeat: "repeat",
      backgroundSize: "auto",
      backgroundAttachment: "fixed",
    }}
  />
);

export default StarryBackground;
