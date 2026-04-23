import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  phase: number;
  hasSpike: boolean;
}

const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = document.documentElement.scrollHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars(w, h);
    };

    const initStars = (w: number, h: number) => {
      // Dense starfield like cachelifeny.com — ~1 star per 900 px²
      const count = Math.floor((w * h) / 900);
      stars = Array.from({ length: count }, () => {
        const r = Math.random();
        // tiered brightness: lots of tiny dust, fewer mediums, rare bright sparkles
        let size: number;
        let baseOpacity: number;
        let hasSpike = false;
        if (r < 0.7) {
          // dust
          size = Math.random() * 0.7 + 0.3;
          baseOpacity = Math.random() * 0.4 + 0.25;
        } else if (r < 0.93) {
          // medium
          size = Math.random() * 1.0 + 0.8;
          baseOpacity = Math.random() * 0.3 + 0.55;
        } else {
          // bright sparkle with cross spike
          size = Math.random() * 1.3 + 1.4;
          baseOpacity = Math.random() * 0.2 + 0.8;
          hasSpike = true;
        }
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          baseOpacity,
          twinkleSpeed: Math.random() * 0.6 + 0.3,
          phase: Math.random() * Math.PI * 2,
          hasSpike,
        };
      });
    };

    let time = 0;
    const animate = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      time += 0.025;

      for (const star of stars) {
        // Twinkle: combine slow pulse + fast flicker for lively shimmer
        const slow = Math.sin(time * star.twinkleSpeed + star.phase) * 0.5 + 0.5;
        const fast = Math.sin(time * star.twinkleSpeed * 3.1 + star.phase * 1.7) * 0.5 + 0.5;
        const twinkle = slow * 0.65 + fast * 0.35;
        const opacity = star.baseOpacity * (0.2 + 0.8 * twinkle);

        // Sparkle cross for bright stars (always visible, intensity twinkles)
        if (star.hasSpike) {
          const spikeIntensity = 0.25 + 0.75 * twinkle;
          const spikeLen = star.size * 6;

          // soft outer glow
          const grad = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            star.size * 5
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.35})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 5, 0, Math.PI * 2);
          ctx.fill();

          // 4-point cross spike
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * spikeIntensity * 0.85})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(star.x - spikeLen, star.y);
          ctx.lineTo(star.x + spikeLen, star.y);
          ctx.moveTo(star.x, star.y - spikeLen);
          ctx.lineTo(star.x, star.y + spikeLen);
          ctx.stroke();
        }

        // Star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    observer.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default StarryBackground;
