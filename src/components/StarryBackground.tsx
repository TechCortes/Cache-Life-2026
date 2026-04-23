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
      // Very dense starfield — many tiny stars
      const count = Math.floor((w * h) / 300);
      stars = Array.from({ length: count }, () => {
        const r = Math.random();
        let size: number;
        let baseOpacity: number;
        let hasSpike = false;
        if (r < 0.85) {
          // tiny dust — abundant and thin
          size = Math.random() * 0.4 + 0.2;
          baseOpacity = Math.random() * 0.4 + 0.3;
        } else if (r < 0.97) {
          // small medium
          size = Math.random() * 0.5 + 0.5;
          baseOpacity = Math.random() * 0.3 + 0.5;
        } else {
          // rare bright sparkle with cross spike
          size = Math.random() * 0.8 + 0.9;
          baseOpacity = Math.random() * 0.2 + 0.8;
          hasSpike = true;
        }
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          baseOpacity,
          // faster, more varied twinkle for on/off shimmer
          twinkleSpeed: Math.random() * 1.8 + 0.8,
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
        // Slow cascade downward; speed scales subtly with star size for parallax
        star.y += 0.15 + star.size * 0.08;
        if (star.y > h + 4) {
          star.y = -4;
          star.x = Math.random() * w;
        }
        // Twinkle: sharp on/off shimmer using power curve
        const slow = Math.sin(time * star.twinkleSpeed + star.phase) * 0.5 + 0.5;
        const fast = Math.sin(time * star.twinkleSpeed * 3.1 + star.phase * 1.7) * 0.5 + 0.5;
        const raw = slow * 0.6 + fast * 0.4;
        const twinkle = Math.pow(raw, 2.2);
        const opacity = star.baseOpacity * (0.05 + 0.95 * twinkle);

        // Sparkle cross for bright stars (always visible, intensity twinkles)
        if (star.hasSpike) {
          const spikeIntensity = 0.4 + 0.6 * twinkle;
          const spikeLen = star.size * 9;

          // wide soft halo
          const haloGrad = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 8
          );
          haloGrad.addColorStop(0, `rgba(200, 220, 255, ${opacity * 0.35})`);
          haloGrad.addColorStop(0.4, `rgba(255, 255, 255, ${opacity * 0.15})`);
          haloGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 8, 0, Math.PI * 2);
          ctx.fill();

          // inner bright glow
          const coreGrad = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          coreGrad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.9})`);
          coreGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();

          // 4-point cross spike (long, bright)
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * spikeIntensity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(star.x - spikeLen, star.y);
          ctx.lineTo(star.x + spikeLen, star.y);
          ctx.moveTo(star.x, star.y - spikeLen);
          ctx.lineTo(star.x, star.y + spikeLen);
          ctx.stroke();

          // diagonal secondary spike (shorter) for extra sparkle
          const diag = spikeLen * 0.55;
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * spikeIntensity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - diag, star.y - diag);
          ctx.lineTo(star.x + diag, star.y + diag);
          ctx.moveTo(star.x - diag, star.y + diag);
          ctx.lineTo(star.x + diag, star.y - diag);
          ctx.stroke();
        } else if (star.size > 0.9) {
          // soft glow for medium stars too
          const grad = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.4})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star core (slightly boosted)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, opacity * 1.2)})`;
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
