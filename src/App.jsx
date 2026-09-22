import React, { useState, useEffect, useRef } from 'react';
import AtmosphereCanvas from './components/AtmosphereCanvas';
import OpeningGate from './components/OpeningGate';
import HeroScene from './components/HeroScene';
import ScratchReveal from './components/ScratchReveal';
import FinalCelebration from './components/FinalCelebration';
import AudioController from './components/AudioController'; // 👈 1. Import it here

export default function App() {
  const [gateOpened, setGateOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const scrollContainerRef = useRef(null);
  const celebrationRef = useRef(null);
  const inactivityTimer = useRef(null);

  const handleReveal = () => {
    setRevealed(true);
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    inactivityTimer.current = setTimeout(() => {
      if (gateOpened && scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          top: window.innerHeight * 0.85,
          behavior: 'smooth',
        });
      }
    }, 8500);
  };

  useEffect(() => {
    const activityEvents = ['mousemove', 'touchstart', 'touchmove', 'click', 'wheel', 'scroll', 'keydown'];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetInactivityTimer, { passive: true }));
    resetInactivityTimer();

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetInactivityTimer));
    };
  }, [gateOpened]);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <AtmosphereCanvas />
      
      {/* 👈 2. Render the audio controller once the gate opens or right away */}
      {gateOpened && <AudioController />}

      {!gateOpened && <OpeningGate onOpen={() => setGateOpened(true)} />}

      {gateOpened && (
        <div
          ref={scrollContainerRef}
          className="relative z-10 h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
        >
          <div className="snap-start h-screen w-full flex items-center justify-center">
            <HeroScene />
          </div>
          <div className="snap-start h-screen w-full flex items-center justify-center">
            <ScratchReveal onRevealed={handleReveal} />
          </div>
          {revealed && (
            <div ref={celebrationRef} className="snap-start h-screen w-full flex items-center justify-center">
              <FinalCelebration />
            </div>
          )}
        </div>
      )}
    </main>
  );
}