import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, KeyRound, Wine, PartyPopper } from 'lucide-react';
import { EVENT } from '../config/event';
import { startBackgroundMusic } from '../../utils/audio';

// Module-level audio instance to persist background music across component unmounts

export default function OpeningGate({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGate = () => {
    if (isOpen) return;

    // 1. Play air whoosh sound effect on gate open
    const whoosh = new Audio('/swoosh.mp3');
    whoosh.volume = 0.7;
    whoosh.play().catch((err) => console.warn("Whoosh play prevented:", err));

    // 2. Queue background music to fade in right as central light dims (~1200ms)
    startBackgroundMusic();

    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-slate-950 perspective-1000">
      
      {/* 1. BLINDING SPOTLIGHT BEAMS FROM TOP CORNERS */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-slate-100/30 via-slate-300/10 to-transparent blur-3xl pointer-events-none z-10 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-slate-100/30 via-slate-300/10 to-transparent blur-3xl pointer-events-none z-10 animate-pulse" />

      {/* 2. REVEAL LIGHT CORE BEHIND DOORS */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isOpen ? 1 : 0.25,
          scale: isOpen ? [1, 1.8, 2.5] : 1,
        }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_#cbd5e1_40%,_#334155_70%,_transparent_100%)] blur-3xl pointer-events-none z-10"
      />

      {/* 3. FLOATING PARTY GLITTER, CONFETTI & BOKEH LIGHTS */}
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-tr from-white via-slate-200 to-amber-100 shadow-[0_0_12px_#ffffff]"
            style={{
              width: Math.random() * 6 + 3 + 'px',
              height: Math.random() * 6 + 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.6, 1.4, 0.6],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 4. LEFT DOOR - ORNATE & GLAMOROUS */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: isOpen ? '-102%' : '0%' }}
        transition={{ duration: 2.4, ease: [0.65, 0, 0.15, 1] }}
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-r-2 border-slate-200/60 shadow-[0_0_80px_rgba(255,255,255,0.2)] z-20 flex flex-col justify-between p-6 md:p-12 overflow-hidden"
      >
        {/* Glamorous Corner Frame with Internal Diamond Pattern */}
        <div className="relative border-t-2 border-l-2 border-slate-200/70 w-28 h-28 md:w-48 md:h-48 rounded-tl-2xl p-3 bg-gradient-to-br from-slate-200/10 to-transparent backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div className="w-full h-full border border-dashed border-slate-300/40 rounded-tl-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-slate-200 opacity-60 animate-spin" />
          </div>
        </div>

        {/* Center Groom Title Branding */}
        <div className="flex flex-col items-end pr-4 md:pr-12 space-y-4 relative z-10">
          <div className="flex items-center space-x-2">
            <PartyPopper className="w-5 h-5 text-slate-300 animate-bounce" />
            <p className="font-serif-luxury text-slate-300 text-xs md:text-xl tracking-[0.4em] uppercase font-light drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              25TH ANNIVERSARY
            </p>
          </div>
          <div className="w-32 md:w-64 h-0.5 bg-gradient-to-r from-transparent via-slate-100 to-transparent shadow-[0_0_15px_#ffffff]" />
          <div className="text-right">
            <h2 className="font-serif-luxury text-3xl md:text-7xl font-bold text-silver-metallic mt-1 drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] tracking-wider">
              {EVENT.groom}
            </h2>
          </div>
        </div>

        {/* Metallic Handle with Glow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-40 md:w-5 md:h-56 rounded-full bg-gradient-to-b from-white via-slate-300 to-slate-100 shadow-[0_0_30px_rgba(255,255,255,0.9)] border-2 border-white" />

        {/* Bottom Corner Frame */}
        <div className="relative border-b-2 border-l-2 border-slate-200/70 w-28 h-28 md:w-48 md:h-48 rounded-bl-2xl p-3 bg-gradient-to-tr from-slate-200/10 to-transparent backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div className="w-full h-full border border-dashed border-slate-300/40 rounded-bl-xl flex items-end justify-start p-2">
            <Wine className="w-6 h-6 text-slate-300 opacity-70" />
          </div>
        </div>
      </motion.div>

      {/* 5. RIGHT DOOR - ORNATE & GLAMOROUS */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: isOpen ? '102%' : '0%' }}
        transition={{ duration: 2.4, ease: [0.65, 0, 0.15, 1] }}
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-slate-950 via-slate-900 to-slate-950 border-l-2 border-slate-200/60 shadow-[0_0_80px_rgba(255,255,255,0.2)] z-20 flex flex-col justify-between p-6 md:p-12 overflow-hidden"
      >
        {/* Top Right Corner Frame */}
        <div className="relative border-t-2 border-r-2 border-slate-200/70 w-28 h-28 md:w-48 md:h-48 rounded-tr-2xl p-3 bg-gradient-to-bl from-slate-200/10 to-transparent backdrop-blur-sm self-end shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div className="w-full h-full border border-dashed border-slate-300/40 rounded-tr-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-slate-200 opacity-60 animate-spin" />
          </div>
        </div>

        {/* Center Bride Title Branding */}
        <div className="flex flex-col items-start pl-4 md:pl-12 space-y-4 relative z-10">
          <div className="flex items-center space-x-2">
            <p className="font-serif-luxury text-slate-300 text-xs md:text-xl tracking-[0.4em] uppercase font-light drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              SILVER JUBILEE
            </p>
            <PartyPopper className="w-5 h-5 text-slate-300 animate-bounce" />
          </div>
          <div className="w-32 md:w-64 h-0.5 bg-gradient-to-r from-transparent via-slate-100 to-transparent shadow-[0_0_15px_#ffffff]" />
          <div className="text-left">
            <h2 className="font-serif-luxury text-3xl md:text-7xl font-bold text-silver-metallic mt-1 drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] tracking-wider">
              {EVENT.bride}
            </h2>
          </div>
        </div>

        {/* Metallic Handle */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-40 md:w-5 md:h-56 rounded-full bg-gradient-to-b from-white via-slate-300 to-slate-100 shadow-[0_0_30px_rgba(255,255,255,0.9)] border-2 border-white" />

        {/* Bottom Right Corner Frame */}
        <div className="relative border-b-2 border-r-2 border-slate-200/70 w-28 h-28 md:w-48 md:h-48 rounded-br-2xl p-3 bg-gradient-to-tl from-slate-200/10 to-transparent backdrop-blur-sm self-end shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div className="w-full h-full border border-dashed border-slate-300/40 rounded-br-xl flex items-end justify-end p-2">
            <Wine className="w-6 h-6 text-slate-300 opacity-70" />
          </div>
        </div>
      </motion.div>

      {/* CENTER GLAMOROUS KEY BUTTON */}
      {!isOpen && (
        <div
          className="absolute z-30 flex flex-col items-center justify-center cursor-pointer group text-center px-4 translate-y-36 md:translate-y-48"
          onClick={handleOpenGate}
        >
          {/* Key Button Seal Wrapper */}
          <div className="relative flex items-center justify-center">
            {/* Ambient Pulse Ring - Perfectly Centered */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.8)] pointer-events-none"
            />

            {/* Main Circle Seal */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-white shadow-[0_0_80px_rgba(255,255,255,0.9)] backdrop-blur-2xl flex items-center justify-center group-hover:scale-105 transition duration-500">
              <Sparkles className="absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6 text-white animate-spin drop-shadow-[0_0_10px_#ffffff]" />
              <KeyRound className="w-10 h-10 md:w-14 md:h-14 text-white animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,1)]" />
            </div>
          </div>

          {/* Text Below - Remains Static & Readable */}
          <div className="mt-6 space-y-2 pointer-events-none">
            <p className="font-serif-luxury text-lg md:text-3xl tracking-[0.3em] text-white uppercase font-bold text-silver-glow drop-shadow-[0_0_20px_rgba(255,255,255,1)]">
              CLICK TO REVEAL DATE
            </p>
            <p className="text-xs md:text-base text-slate-200 tracking-widest uppercase italic font-light drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              "Some stories are meant to be celebrated."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}