import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Calendar, Clock, MapPin, Wine, Sparkles, GlassWater } from 'lucide-react';

export default function AnniversaryInvitation() {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Target event date: December 27, 2026 at 7:00 PM
  const targetDate = new Date("2026-12-27T19:00:00").getTime();

  // 1. Live Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Interactive Canvas Scratch Card Setup
  useEffect(() => {
    if (!curtainsOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fill foil overlay
    const gradient = ctx.createLinearGradient(0, 0, 320, 160);
    gradient.addColorStop(0, '#2A2A38');
    gradient.addColorStop(0.5, '#4A4A60');
    gradient.addColorStop(1, '#1A1A26');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Overlay text
    ctx.fillStyle = '#D4AF37';
    ctx.font = '600 14px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal Date ✨', 160, 85);
  }, [curtainsOpen]);

  // Scratch card touch/mouse handlers
  const handleScratch = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage(ctx, canvas);
  };

  const checkScratchPercentage = (ctx, canvas) => {
    if (isScratched) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
    if (percentage > 40) {
      setIsScratched(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E0E0E0', '#FFD700']
      });
    }
  };

  const openCurtains = () => {
    setCurtainsOpen(true);
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.4 },
      colors: ['#D4AF37', '#888888', '#FFFFFF']
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F4F4F4] font-sans overflow-x-hidden relative">
      
      {/* Floating Lights / Cocktail Bubbles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-500/10 blur-xl"
            style={{
              width: Math.random() * 120 + 50,
              height: Math.random() * 120 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Opening Curtain Screen */}
      <AnimatePresence>
        {!curtainsOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0A0B0E]"
            exit={{ opacity: 0, transition: { delay: 1.2, duration: 0.5 } }}
          >
            {/* Left Curtain */}
            <motion.div
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#141218] via-[#231d2b] to-[#0d0a12] border-r-2 border-[#D4AF37]/50 shadow-2xl z-20 flex items-center justify-end pr-4"
              animate={curtainsOpen ? { x: "-100%" } : { x: 0 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            >
              <div className="w-1 h-32 bg-[#D4AF37]/30 rounded-full blur-sm" />
            </motion.div>

            {/* Right Curtain */}
            <motion.div
              className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#141218] via-[#231d2b] to-[#0d0a12] border-l-2 border-[#D4AF37]/50 shadow-2xl z-20 flex items-center justify-start pl-4"
              animate={curtainsOpen ? { x: "100%" } : { x: 0 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            >
              <div className="w-1 h-32 bg-[#D4AF37]/30 rounded-full blur-sm" />
            </motion.div>

            {/* Introductory Landing Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="z-30 text-center px-6 max-w-lg"
            >
              <div className="flex justify-center mb-4 text-[#D4AF37]">
                <Wine className="w-12 h-12 animate-pulse" />
              </div>
              <p className="tracking-widest text-xs uppercase text-amber-200/70 mb-2">
                25 Years of Togetherness
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#D4AF37] mb-2 leading-tight">
                Ramu & Beena
              </h1>
              <p className="font-serif text-lg text-amber-100/90 mb-4">Silver Jubilee Cocktail Soirée</p>
              <p className="text-gray-400 text-sm mb-8 font-light">
                An evening of signature drinks, cherished memories, and dancing under the stars.
              </p>
              <button
                onClick={openCurtains}
                className="px-8 py-3 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-serif tracking-wider uppercase text-sm rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                Reveal Invitation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Invitation Website Body */}
      {curtainsOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto px-6 py-16 text-center"
        >
          {/* Header */}
          <div className="mb-12">
            <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
            <p className="text-amber-200/80 uppercase tracking-widest text-xs">You are cordially invited to celebrate</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#D4AF37] mt-2 font-semibold">
              Ramu Agrawal & Beena Agrawal
            </h2>
            <p className="text-amber-100/80 font-serif text-sm mt-1">25th Wedding Anniversary Celebration</p>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-16">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Mins", value: timeLeft.minutes },
              { label: "Secs", value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#12141C] border border-[#D4AF37]/20 rounded-xl p-3 shadow-lg">
                <span className="block text-2xl font-bold text-[#E0E0E0]">{String(item.value).padStart(2, '0')}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Interactive Scratch Reveal Section */}
          <div className="mb-16">
            <h3 className="font-serif text-xl text-[#D4AF37] mb-4">Scratch To Reveal The Evening</h3>
            <div className="relative w-[320px] h-[160px] mx-auto rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-[#D4AF37]/30">
              
              {/* Revealed Content Behind Foil */}
              <div className="absolute inset-0 bg-[#12141C] flex flex-col justify-center items-center p-4">
                <Calendar className="w-6 h-6 text-[#D4AF37] mb-1" />
                <h4 className="font-serif text-lg font-bold text-[#D4AF37]">Sunday, Dec 27, 2026</h4>
                <p className="text-xs text-gray-300 mt-1">Dress Code: Cocktail Glam & Elegance</p>
                <p className="text-xs text-amber-200/80 mt-2 font-medium">7:00 PM Onwards</p>
              </div>

              {/* Canvas Overlay Layer */}
              <canvas
                ref={canvasRef}
                width={320}
                height={160}
                className={`absolute inset-0 cursor-pointer transition-opacity duration-700 ${isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onMouseDown={() => (isDrawing.current = true)}
                onMouseUp={() => (isDrawing.current = false)}
                onMouseMove={handleScratch}
                onTouchStart={() => (isDrawing.current = true)}
                onTouchEnd={() => (isDrawing.current = false)}
                onTouchMove={handleScratch}
              />
            </div>
          </div>

          {/* Timeline / Our Story */}
          <div className="mb-16 text-left">
            <h3 className="font-serif text-2xl text-[#D4AF37] text-center mb-8">25 Years of Togetherness</h3>
            <div className="border-l-2 border-[#D4AF37]/40 pl-6 space-y-8 ml-4 sm:ml-12">
              {[
                { year: "2001", title: "The Wedding Day", desc: "Ramu & Beena tied the knot and started an incredible journey together." },
                { year: "2013", title: "Building Our Legacy", desc: "Over a decade of cherished milestones, laughter, and strong family bonds." },
                { year: "2026", title: "Silver Jubilee Celebration", desc: "Celebrating 25 wonderful years of unconditional love and partnership." }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#D4AF37] ring-4 ring-[#0B0C10]" />
                  <span className="text-xs text-[#D4AF37] font-semibold">{item.year}</span>
                  <h4 className="font-serif text-lg text-gray-200">{item.title}</h4>
                  <p className="text-sm text-gray-400 font-light mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Event Schedule Cards */}
          <div className="mb-16 text-left">
            <h3 className="font-serif text-2xl text-[#D4AF37] text-center mb-8">Evening Itinerary</h3>
            <div className="space-y-4">
              {[
                { icon: Wine, title: "Welcome Cocktails & Mocktails", time: "07:00 PM", detail: "Signature drinks & background lounge music" },
                { icon: GlassWater, title: "Silver Jubilee Toast & Cake Ceremony", time: "08:30 PM", detail: "Family toasts, cake cutting, and memories" },
                { icon: Sparkles, title: "Grand Gala Dinner & Dancing", time: "09:30 PM", detail: "Gourmet banquet & DJ dance floor" }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#12141C] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-[#D4AF37]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-gray-200">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#D4AF37] bg-amber-500/5 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Venue & Location Map */}
          <div className="mb-12">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2">The Venue</h3>
            <p className="text-sm text-gray-400 mb-4 flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4 text-[#D4AF37]" /> Barbil, Keonjhar District, Odisha
            </p>
            <div className="w-full h-64 rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-xl">
              <iframe
                title="Barbil Odisha Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29388.082729177573!2d85.3725!3d22.1167!2m3!1f0!1f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a201201509a25b1%3A0x7d6f58f553f1d8c1!2sBarbil%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 filter opacity-80 invert grayscale contrast-125"
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>

          <footer className="pt-8 border-t border-white/5 text-xs text-gray-500">
            Hosted with ❤️ by the Agrawal Family
          </footer>
        </motion.div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(
  <AnniversaryInvitation />
);