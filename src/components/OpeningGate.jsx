import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, KeyRound } from 'lucide-react';
import { EVENT } from '../config/event';

export default function OpeningGate({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGate = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-slate-950 perspective-1000">
      {/* Glow / Light burst behind doors */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0.2 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-radial-glow from-slate-100/30 via-blue-900/40 to-slate-950 blur-3xl pointer-events-none"
      />

      {/* LEFT ELEGANT DARK NAVY DOOR */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: isOpen ? '-102%' : '0%' }}
        transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-r-2 border-slate-300/40 shadow-[0_0_50px_rgba(226,232,240,0.2)] z-20 flex flex-col justify-between p-6 md:p-12"
      >
        <div className="border-t-2 border-l-2 border-slate-400/50 w-20 h-20 md:w-36 md:h-36 rounded-tl-xl" />

        <div className="flex flex-col items-end pr-4 md:pr-12 space-y-4">
          <div className="w-24 md:w-48 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <div className="text-right">
            <p className="font-serif-luxury text-slate-400 text-xs md:text-lg tracking-[0.3em] uppercase">
              25TH ANNIVERSARY
            </p>
            <h2 className="font-serif-luxury text-2xl md:text-6xl font-bold text-silver-metallic mt-1">
              {EVENT.groom}
            </h2>
          </div>
        </div>

        {/* Metallic Handle */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-32 md:w-4 md:h-48 rounded-full bg-gradient-to-b from-slate-200 via-slate-400 to-slate-100 shadow-xl border border-slate-200" />

        <div className="border-b-2 border-l-2 border-slate-400/50 w-20 h-20 md:w-36 md:h-36 rounded-bl-xl" />
      </motion.div>

      {/* RIGHT ELEGANT DARK NAVY DOOR */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: isOpen ? '102%' : '0%' }}
        transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-slate-950 via-slate-900 to-slate-950 border-l-2 border-slate-400/40 shadow-[0_0_50px_rgba(226,232,240,0.2)] z-20 flex flex-col justify-between p-6 md:p-12"
      >
        <div className="border-t-2 border-r-2 border-slate-400/50 w-20 h-20 md:w-36 md:h-36 rounded-tr-xl self-end" />

        <div className="flex flex-col items-start pl-4 md:pl-12 space-y-4">
          <div className="w-24 md:w-48 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <div className="text-left">
            <p className="font-serif-luxury text-slate-400 text-xs md:text-lg tracking-[0.3em] uppercase">
              SILVER JUBILEE
            </p>
            <h2 className="font-serif-luxury text-2xl md:text-6xl font-bold text-silver-metallic mt-1">
              & {EVENT.bride}
            </h2>
          </div>
        </div>

        {/* Metallic Handle */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-32 md:w-4 md:h-48 rounded-full bg-gradient-to-b from-slate-200 via-slate-400 to-slate-100 shadow-xl border border-slate-200" />

        <div className="border-b-2 border-r-2 border-slate-400/50 w-20 h-20 md:w-36 md:h-36 rounded-br-xl self-end" />
      </motion.div>

      {/* CENTER INTERACTIVE SEAL */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1,y:200 }}
          transition={{ duration: 0.8 }}
          className="relative z-30 flex flex-col items-center justify-center cursor-pointer group text-center px-4"
          onClick={handleOpenGate}
        >
          <div className="relative p-7 md:p-11 rounded-full bg-slate-950/90 border-2 border-slate-300 shadow-[0_0_50px_rgba(226,232,240,0.4)] backdrop-blur-xl group-hover:scale-105 transition duration-500">
            <KeyRound className="w-10 h-10 md:w-14 md:h-14 text-slate-100 relative z-10 animate-pulse" />
          </div>

          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-6 space-y-2"
          >
            <p className="font-serif-luxury text-base md:text-2xl tracking-[0.25em] text-slate-100 uppercase font-semibold text-silver-glow">
              CLICK TO REVEAL INVITATION
            </p>
            <p className="text-xs md:text-sm text-slate-400 tracking-widest uppercase italic">
              "Some stories are meant to be celebrated."
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}