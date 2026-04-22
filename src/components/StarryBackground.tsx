import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
  driftX: number;
  driftY: number;
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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 180);
      stars = Array.from({ length: count }, () => {
        const isBright = Math.random() < 0.12;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isBright ? Math.random() * 2.8 + 1.6 : Math.random() * 1.8 + 0.2,
          opacity: isBright ? Math.random() * 0.4 + 0.6 : Math.random() * 0.6 + 0.2,
          speed: isBright ? Math.random() * 0.04 + 0.025 : Math.random() * 0.025 + 0.01,
          phase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.03,
          driftY: isBright ? Math.random() * 0.35 + 0.25 : Math.random() * 0.25 + 0.15,
        };
      });
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      for (const star of stars) {
        star.x += star.driftX;
        star.y += star.driftY;

        // Wrap: falling stars reappear at top with new x
        if (star.y > canvas.height) {
          star.y = -2;
          star.x = Math.random() * canvas.width;
        }
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;

        const twinkle = Math.sin(time * star.speed * 100 + star.phase) * 0.5 + 0.5;
        const flicker = Math.sin(time * star.speed * 230 + star.phase * 1.7) * 0.5 + 0.5;
        const combined = twinkle * 0.7 + flicker * 0.3;
        const shine = Math.pow(combined, 2);
        const currentOpacity = star.opacity * (0.05 + 0.95 * shine);
        const currentSize = star.size * (0.5 + 0.8 * shine);

        // Outer glow for bright stars
        if (currentSize > 1.0) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, currentSize * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 210, 255, ${currentOpacity * 0.06})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(star.x, star.y, currentSize * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 235, 255, ${currentOpacity * 0.15})`;
          ctx.fill();
        }

        // Cross/spike effect on brightest moments
        if (shine > 0.7 && star.size > 1.2) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.5})`;
          ctx.lineWidth = 0.6;
          const spikeLen = currentSize * 7;
          ctx.beginPath();
          ctx.moveTo(star.x - spikeLen, star.y);
          ctx.lineTo(star.x + spikeLen, star.y);
          ctx.moveTo(star.x, star.y - spikeLen);
          ctx.lineTo(star.x, star.y + spikeLen);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
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
