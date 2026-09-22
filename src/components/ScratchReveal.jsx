import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Sparkles, Check, Heart, Wine } from 'lucide-react';
import { EVENT } from '../config/event';

export default function ScratchReveal({ onRevealed }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);
  const isDrawing = useRef(false);
  const timerRef = useRef(null);
  const scrollTimerRef = useRef(null); // 👈 Timer for delayed auto-scroll

  const triggerCelebrationBurst = () => {
    const end = Date.now() + 1000;
    const colors = ['#ffffff', '#cbd5e1', '#94a3b8', '#e2e8f0', '#f8fafc'];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const scrollToNext = () => {
    // 1. Try finding the next sibling element in the container
    if (containerRef.current && containerRef.current.nextElementSibling) {
      containerRef.current.nextElementSibling.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    // 2. Fallback: Find the parent scroll container and scroll down one full screen height
    const scrollParent = containerRef.current?.closest('.overflow-y-auto');
    if (scrollParent) {
      scrollParent.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    } else {
      // 3. Final fallback to window scroll
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  const revealFull = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    triggerCelebrationBurst();
    if (onRevealed) onRevealed();
    // No automatic scroll timer here! It stays completely still.
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`25th Anniversary Celebration - ${EVENT.groom || 'Ramu'} & ${EVENT.bride || 'Beena'}`);
    const details = encodeURIComponent("Silver Jubilee Celebration.");
    const location = encodeURIComponent(EVENT.location || "Odisha · Barbil");
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261227T120000Z/20261227T180000Z&details=${details}&location=${location}`;

    window.open(googleCalendarUrl, '_blank');
    setIsAddedToCalendar(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#cbd5e1');
      gradient.addColorStop(0.25, '#f8fafc');
      gradient.addColorStop(0.5, '#94a3b8');
      gradient.addColorStop(0.75, '#e2e8f0');
      gradient.addColorStop(1, '#64748b');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 250; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5 + 0.5;
        const alpha = Math.random() * 0.5 + 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ SCRATCH OR WAIT TO REVEAL ✨', canvas.width / 2, canvas.height / 2);
    };

    setCanvasSize();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRevealed) {
            timerRef.current = setTimeout(() => {
              revealFull();
            }, 5000);
          } else {
            if (timerRef.current) clearTimeout(timerRef.current);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
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
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center p-6 text-center z-10 overflow-hidden"
    >
      {isRevealed && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000 opacity-100">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white shadow-[0_0_10px_#ffffff] animate-pulse"
              style={{
                width: `${(i % 3) + 3}px`,
                height: `${(i % 3) + 3}px`,
                top: `${(i * 17) % 90 + 5}%`,
                left: `${(i * 23) % 90 + 5}%`,
                animationDuration: `${(i % 2) + 2}s`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      <p className="font-editorial italic text-base md:text-2xl text-slate-300 mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        "25 years. One beautiful journey."
      </p>

      <div className="w-full max-w-xl bg-slate-900/80 border border-slate-300/40 rounded-3xl p-6 md:p-10 shadow-[0_0_60px_rgba(226,232,240,0.2)] backdrop-blur-xl space-y-6 relative">
        <p className="text-amber-300 font-bold tracking-[0.3em] text-lg uppercase drop-shadow-[0_0_12px_rgba(252,211,77,0.8)]">SAVE THE DATE</p>

        <div className="relative min-h-[180px] flex items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 p-6 overflow-hidden shadow-inner">
          <div className="space-y-2 z-10">
            <h3
              className={`font-serif-luxury text-3xl md:text-6xl font-extrabold text-silver-metallic transition-all duration-1000 ${
                isRevealed
                  ? 'scale-105 drop-shadow-[0_0_35px_rgba(255,255,255,0.95)]'
                  : ''
              }`}
            >
              {EVENT.date}
            </h3>
            <p className="font-editorial italic text-xl md:text-2xl text-slate-300">
              {EVENT.location}
            </p>
          </div>

          {!isRevealed && (
            <div className="absolute inset-0 z-20 overflow-hidden rounded-2xl">
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-pointer touch-none"
                onMouseDown={() => (isDrawing.current = true)}
                onMouseUp={() => (isDrawing.current = false)}
                onMouseMove={(e) => isDrawing.current && scratch(e)}
                onTouchMove={scratch}
              />
              <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] pointer-events-none animate-[shine_3.5s_infinite_ease-in-out]" />
            </div>
          )}
        </div>

        <p className="text-xs md:text-sm text-slate-300 tracking-wider">
          {isRevealed ? "✨ Here's to 25 beautiful years!" : "Scratch to reveal the date"}
        </p>

        <div
          className={`transition-all duration-1000 ease-out transform ${
            isRevealed
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          <div className="pt-2 flex flex-col items-center space-y-5">
            <button
              onClick={handleAddToCalendar}
              className="flex items-center space-x-2.5 px-6 py-2.5 rounded-full bg-slate-950 border border-slate-300/50 text-slate-100 hover:text-white hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 text-xs md:text-sm font-medium tracking-wider uppercase backdrop-blur-md cursor-pointer"
            >
              {isAddedToCalendar ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Added To Calendar</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 text-slate-200" />
                  <span>Add To Calendar</span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-300 opacity-80" />
                </>
              )}
            </button>

            <button
              onClick={scrollToNext}
              className="animate-bounce text-[11px] md:text-xs tracking-[0.2em] uppercase text-amber-300/90 hover:text-amber-200 flex items-center space-x-1.5 pt-1 cursor-pointer transition-colors mx-auto"
            >
              <span>Continue to Next Section</span>
              <span>↓</span>
            </button>

            <div className="pt-4 border-t border-slate-700/50 w-full flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3 text-slate-300">
                <Wine className="w-4 h-4 text-slate-200" />
                <span className="font-serif-luxury text-xs tracking-[0.25em] uppercase text-slate-200">
                  LET’S CELEBRATE TOGETHER
                </span>
                <Heart className="w-4 h-4 text-slate-200 fill-slate-200/20" />
              </div>
              <p className="text-[11px] md:text-xs text-slate-400 font-light tracking-wide italic">
                We look forward to celebrating this silver milestone with you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}