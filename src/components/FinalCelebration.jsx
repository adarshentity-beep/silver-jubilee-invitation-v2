import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { EVENT } from '../config/event';

export default function FinalCelebration() {
  useEffect(() => {
    // Trigger Silver/White Confetti Burst
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffffff', '#cbd5e1', '#94a3b8'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffffff', '#cbd5e1', '#94a3b8'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center text-center p-6 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="space-y-4">
          <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-slate-100 tracking-tight text-silver-metallic">
            JOIN US IN CELEBRATION
          </h2>
          <p className="font-editorial text-2xl md:text-4xl text-slate-300 italic">
            25 Years of Elegance, Love & Togetherness
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-md space-y-4">
          <p className="font-serif-luxury text-xl md:text-3xl text-slate-100">
            {EVENT.couple}
          </p>
          <div className="h-px w-24 bg-slate-600 mx-auto" />
          <p className="font-mono text-sm md:text-lg text-slate-300 tracking-widest">
            {EVENT.date}
          </p>
          <p className="text-xs md:text-sm text-slate-400 tracking-widest uppercase">
            {EVENT.location}
          </p>
        </div>

        <footer className="pt-12 text-xs text-slate-500 tracking-widest uppercase">
          Hosted with ♥ by the {EVENT.family}
        </footer>
      </motion.div>
    </section>
  );
}