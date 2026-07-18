"use client";

import { useEffect, useRef } from "react";

const DEFAULT_COLORS = ["#c0174c", "#D4537E", "#ED93B1", "#5DCAA5", "#9FE1CB", "#7F77DD", "#CECBF6", "#EF9F27"];

/**
 * Full-bleed confetti burst on a canvas. Mounts → bursts once → fades out.
 * Render it conditionally (only while a celebration is visible).
 */
export default function ConfettiCanvas({
  colors = DEFAULT_COLORS,
  count = 110,
  className = "absolute inset-0 w-full h-full pointer-events-none",
}: {
  colors?: string[];
  count?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const pieces = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 160,
      size: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      speedY: 1.5 + Math.random() * 2.5,
      speedX: (Math.random() - 0.5) * 1.5,
      opacity: 1,
      isRect: Math.random() > 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      pieces.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height * 0.8) p.opacity -= 0.02;
        if (p.opacity > 0) alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.isRect) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      if (alive) animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [colors, count]);

  return <canvas ref={canvasRef} className={className} />;
}
