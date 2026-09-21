import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { EVENT } from '../config/event';

export default function ScratchReveal({ onRevealed }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);
  const timerRef = useRef(null);

  const triggerCelebrationBurst = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#cbd5e1', '#94a3b8', '#e2e8f0'],
    });
  };

  const revealFull = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    triggerCelebrationBurst();
    if (onRevealed) onRevealed();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Restored original metallic silver layer
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#cbd5e1');
      gradient.addColorStop(0.5, '#ffffff');
      gradient.addColorStop(1, '#94a3b8');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText('SCRATCH TO REVEAL DATE', canvas.width / 2, canvas.height / 2);
    };

    setCanvasSize();

    // IntersectionObserver to start timer ONLY when user arrives on this 2nd page section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRevealed) {
            // Start 5-second timer only once page 2 is active on screen
            timerRef.current = setTimeout(() => {
              revealFull();
            }, 5000);
          } else {
            // Clear timer if user scrolls away before 5 sec
            if (timerRef.current) clearTimeout(timerRef.current);
          }
        });
      },
      { threshold: 0.5 } // Requires at least 50% of the scratch page to be visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [isRevealed]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels / (imageData.data.length / 4)) * 100;
    if (percentage > 30) {
      if (timerRef.current) clearTimeout(timerRef.current);
      revealFull();
    }
  };

  const scratch = (e) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 30, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center p-6 text-center z-10"
    >
      <p className="font-editorial italic text-base md:text-2xl text-slate-300 mb-6">
        "25 years. One beautiful journey."
      </p>

      <div className="w-full max-w-xl bg-slate-900/80 border border-slate-400/40 rounded-3xl p-6 md:p-10 shadow-[0_0_60px_rgba(226,232,240,0.15)] backdrop-blur-xl space-y-6">
        <p className="font-serif-luxury text-sm md:text-base tracking-[0.3em] text-slate-300 uppercase">
          SAVE THE DATE
        </p>

        <div className="relative min-h-[180px] flex items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 p-6 overflow-hidden">
          <div className="space-y-2">
            <h3
              className={`font-serif-luxury text-3xl md:text-6xl font-extrabold text-silver-metallic transition-all duration-700 ${
                isRevealed ? 'scale-105 drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]' : ''
              }`}
            >
              {EVENT.date}
            </h3>
            <p className="font-editorial italic text-xl md:text-2xl text-slate-300">
              {EVENT.location}
            </p>
          </div>

          {!isRevealed && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-pointer touch-none z-20 rounded-2xl"
              onMouseDown={() => (isDrawing.current = true)}
              onMouseUp={() => (isDrawing.current = false)}
              onMouseMove={(e) => isDrawing.current && scratch(e)}
              onTouchMove={scratch}
            />
          )}
        </div>

        <p className="text-xs md:text-sm text-slate-400 tracking-wider">
          {isRevealed ? "✨ Here's to 25 beautiful years!" : "Scratch to reveal the date"}
        </p>
      </div>
    </section>
  );
}