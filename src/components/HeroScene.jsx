import React from 'react';
import { motion } from 'framer-motion';
import { EVENT } from '../config/event';

export default function HeroScene() {
  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center p-6 text-center z-10">
      
      {/* 1. SHORT ANNIVERSARY QUOTE AT THE TOP */}
      <motion.p
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="font-editorial italic text-base md:text-2xl text-slate-300 tracking-widest mb-4"
      >
        "Two hearts. One extraordinary journey."
      </motion.p>

      {/* 2. LARGE ELEGANT SILVER "25" WITH GLOWING ORBITAL RING */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="relative my-4 flex items-center justify-center"
      >
        {/* Orbital Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          className="absolute w-44 h-44 md:w-72 md:h-72 rounded-full border border-dashed border-slate-300/40 shadow-[0_0_30px_rgba(226,232,240,0.3)] pointer-events-none"
        />

        {/* Silver 25 */}
        <h1 className="font-serif-luxury text-7xl md:text-[11rem] font-extrabold text-silver-metallic tracking-tighter drop-shadow-2xl relative z-10">
          25
        </h1>
      </motion.div>

      {/* SUBTITLE */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="font-serif-luxury text-xs md:text-lg tracking-[0.35em] text-slate-400 uppercase mt-2"
      >
        SILVER JUBILEE CELEBRATION
      </motion.p>

      {/* GROOM & BRIDE NAMES */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="font-serif-luxury text-3xl md:text-7xl font-bold text-slate-100 tracking-wide mt-4"
      >
        {EVENT.groom} <span className="text-silver-metallic font-light">&</span> {EVENT.bride}
      </motion.h2>

      {/* BOTTOM QUOTE */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="font-editorial italic text-sm md:text-xl text-slate-300 mt-6 tracking-wider"
      >
        "25 years of love, laughter & togetherness."
      </motion.p>
    </section>
  );
}