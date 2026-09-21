import React, { useState, useEffect, useRef } from 'react';
import AtmosphereCanvas from './components/AtmosphereCanvas';
import OpeningGate from './components/OpeningGate';
import HeroScene from './components/HeroScene';
import ScratchReveal from './components/ScratchReveal';
import FinalCelebration from './components/FinalCelebration';

export default function App() {
  const [gateOpened, setGateOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const scrollContainerRef = useRef(null);
  const inactivityTimer = useRef(null);

  // Auto-scroll logic after 5 seconds of inactivity
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    inactivityTimer.current = setTimeout(() => {
      if (gateOpened && scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          top: window.innerHeight * 0.85,
          behavior: 'smooth',
        });
      }
    }, 5000); // 5 seconds inactivity timeout
  };

  useEffect(() => {
    const activityEvents = [
      'mousemove',
      'touchstart',
      'touchmove',
      'click',
      'wheel',
      'scroll',
      'keydown',
    ];

    activityEvents.forEach((evt) =>
      window.addEventListener(evt, resetInactivityTimer, { passive: true })
    );

    resetInactivityTimer();

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      activityEvents.forEach((evt) =>
        window.removeEventListener(evt, resetInactivityTimer)
      );
    };
  }, [gateOpened]);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Atmosphere Layer with Bubbles & Orbiting Spheres */}
      <AtmosphereCanvas />

      {/* Silver Architectural Opening Gate */}
      {!gateOpened && <OpeningGate onOpen={() => setGateOpened(true)} />}

      {/* Main Experience Flow */}
      {gateOpened && (
        <div
          ref={scrollContainerRef}
          className="relative z-10 h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
        >
          <div className="snap-start">
            <HeroScene />
          </div>
          <div className="snap-start">
            <ScratchReveal onRevealed={() => setRevealed(true)} />
          </div>
          {revealed && (
            <div className="snap-start">
              <FinalCelebration />
            </div>
          )}
        </div>
      )}
    </main>
  );
}