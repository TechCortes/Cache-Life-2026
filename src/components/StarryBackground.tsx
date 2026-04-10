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
      const count = Math.floor((canvas.width * canvas.height) / 200);
      stars = Array.from({ length: count }, () => {
        const isBright = Math.random() < 0.08;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isBright ? Math.random() * 2.5 + 1.5 : Math.random() * 1.8 + 0.2,
          opacity: isBright ? Math.random() * 0.4 + 0.6 : Math.random() * 0.6 + 0.15,
          speed: isBright ? Math.random() * 0.015 + 0.008 : Math.random() * 0.006 + 0.002,
          phase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.12,
          driftY: (Math.random() - 0.5) * 0.08 - 0.03,
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

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
        const twinkle = Math.sin(time * star.speed * 80 + star.phase) * 0.5 + 0.5;
        const shine = Math.pow(twinkle, 3);
        const currentOpacity = star.opacity * (0.3 + 0.7 * shine);
        const currentSize = star.size * (0.8 + 0.4 * shine);

        // Glow effect for brighter stars
        if (currentSize > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, currentSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${currentOpacity * 0.08})`;
          ctx.fill();
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
