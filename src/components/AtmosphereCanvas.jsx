import React, { useEffect, useRef, useState } from 'react';

export default function AtmosphereCanvas() {
  const canvasRef = useRef(null);
  const [toastMsgVisible, setToastMsgVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;

    // --- 1. 3D ROTATING SILVER DISCO BALLS ---
    const discoBalls = [
      { x: width * 0.15, y: height * 0.22, radius: isMobile ? 35 : 55, speed: 0.012, rotation: 0 },
      { x: width * 0.85, y: height * 0.28, radius: isMobile ? 45 : 70, speed: -0.009, rotation: 0 },
      { x: width * 0.5, y: height * 0.12, radius: isMobile ? 25 : 42, speed: 0.015, rotation: 0 },
    ];

    // --- 2. FLOATING BUBBLES ---
    const bubbles = Array.from({ length: isMobile ? 12 : 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height + height,
      radius: Math.random() * 20 + 6,
      speedY: Math.random() * 0.7 + 0.3,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      opacity: Math.random() * 0.4 + 0.3,
    }));

    // --- 3. SWEEPING BALLROOM SPOTLIGHTS ---
    const spotlights = [
      { angle: -0.3, speed: 0.003, color: 'rgba(226, 232, 240, 0.06)' },
      { angle: 0.3, speed: -0.002, color: 'rgba(203, 213, 225, 0.04)' },
    ];

    // --- 4. DRIFTING SILVER RIBBONS & CONFETTI ---
    const ribbons = Array.from({ length: isMobile ? 8 : 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      length: Math.random() * 40 + 20,
      width: Math.random() * 3 + 1,
      speedY: Math.random() * 1.2 + 0.6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      color: Math.random() > 0.5 ? '#e2e8f0' : '#cbd5e1',
    }));

    // --- 5. GLITTER & SPARKLES ---
    const particles = Array.from({ length: isMobile ? 40 : 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      speedY: -Math.random() * 0.5 - 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: Math.random(),
      pulse: Math.random() * 0.02 + 0.008,
    }));

    // --- 6. ANIMATED TOASTING CHAMPAGNE GLASSES ---
    const toastState = {
      progress: 0,
      direction: 1,
      pauseTimer: 0,
      sparkles: [],
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // --- SPOTLIGHTS ---
      spotlights.forEach((spot) => {
        spot.angle += spot.speed;
        if (spot.angle > 0.5 || spot.angle < -0.5) spot.speed *= -1;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(width / 2, -50);
        const beamX1 = width / 2 + Math.tan(spot.angle - 0.2) * height;
        const beamX2 = width / 2 + Math.tan(spot.angle + 0.2) * height;
        ctx.lineTo(beamX1, height);
        ctx.lineTo(beamX2, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(width / 2, 0, width / 2, height);
        grad.addColorStop(0, spot.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });

      // --- 3D ROTATING SILVER DISCO BALLS ---
      discoBalls.forEach((ball) => {
        ball.rotation += ball.speed;
        ctx.save();
        ctx.translate(ball.x, ball.y);

        // Hanger string
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -ball.y);
        ctx.lineTo(0, 0);
        ctx.stroke();

        // Outer Glow Aura
        const aura = ctx.createRadialGradient(0, 0, ball.radius * 0.7, 0, 0, ball.radius * 1.5);
        aura.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        aura.addColorStop(0.5, 'rgba(203, 213, 225, 0.15)');
        aura.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, ball.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Sphere clip
        ctx.beginPath();
        ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.clip();

        // 3D Spherical Facet Calculation
        const rows = 12;
        const cols = 20;

        for (let i = 0; i < rows; i++) {
          const lat = (Math.PI * (i + 0.5)) / rows - Math.PI / 2;
          const y = Math.sin(lat) * ball.radius;
          const rowRadius = Math.cos(lat) * ball.radius;

          for (let j = 0; j < cols; j++) {
            const lon = (2 * Math.PI * j) / cols + ball.rotation;
            const x = Math.sin(lon) * rowRadius;
            const z = Math.cos(lon) * rowRadius;

            if (z > 0) {
              const facetW = (2 * Math.PI * rowRadius) / cols;
              const facetH = (Math.PI * ball.radius) / rows;

              const lightFactor = (x / ball.radius) * -0.4 + (y / ball.radius) * -0.4 + (z / ball.radius) * 0.8;
              const brightness = Math.max(0.1, Math.min(1, lightFactor));

              let color;
              if (brightness > 0.82) color = '#ffffff';
              else if (brightness > 0.65) color = '#f1f5f9';
              else if (brightness > 0.45) color = '#cbd5e1';
              else if (brightness > 0.28) color = '#94a3b8';
              else color = '#475569';

              ctx.fillStyle = color;
              ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
              ctx.lineWidth = 0.6;

              ctx.fillRect(x - facetW / 2, y - facetH / 2, facetW * 0.9, facetH * 0.9);
              ctx.strokeRect(x - facetW / 2, y - facetH / 2, facetW * 0.9, facetH * 0.9);
            }
          }
        }

        // Sheen
        const sheen = ctx.createRadialGradient(
          -ball.radius * 0.35,
          -ball.radius * 0.35,
          ball.radius * 0.1,
          0,
          0,
          ball.radius
        );
        sheen.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        sheen.addColorStop(1, 'rgba(15, 23, 42, 0.4)');
        ctx.fillStyle = sheen;
        ctx.beginPath();
        ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // --- BUBBLES ---
      bubbles.forEach((b) => {
        b.y -= b.speedY;
        b.x += Math.sin(time * b.wobbleSpeed) * 0.8;

        if (b.y < -30) {
          b.y = height + 30;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);

        const bGrad = ctx.createRadialGradient(
          b.x - b.radius * 0.3,
          b.y - b.radius * 0.3,
          b.radius * 0.1,
          b.x,
          b.y,
          b.radius
        );
        bGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        bGrad.addColorStop(0.7, 'rgba(226, 232, 240, 0.1)');
        bGrad.addColorStop(1, 'rgba(255, 255, 255, 0.5)');

        ctx.fillStyle = bGrad;
        ctx.strokeStyle = `rgba(226, 232, 240, ${b.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
        ctx.restore();
      });

      // --- DRIFTING RIBBONS ---
      ribbons.forEach((r) => {
        r.y += r.speedY;
        r.rot += r.rotSpeed;
        r.x += Math.sin(time + r.y * 0.01) * 0.5;

        if (r.y > height + 50) {
          r.y = -50;
          r.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.rot);
        ctx.fillStyle = r.color;
        ctx.fillRect(-r.width / 2, -r.length / 2, r.width, r.length);
        ctx.restore();
      });

      // --- GLITTER & PARTICLES ---
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(time * p.pulse) * 0.02;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241, 245, 249, ${Math.max(0.1, Math.min(1, p.alpha))})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
        ctx.restore();
      });

      // --- TOASTING CHAMPAGNE GLASSES ---
      const glassY = height * 0.88;
      const glassCenterX = width * (isMobile ? 0.85 : 0.92);
      const distOffset = 40;

      if (toastState.direction === 1) {
        toastState.progress += 0.015;
        if (toastState.progress >= 1) {
          toastState.progress = 1;
          toastState.direction = 2;
          setToastMsgVisible(true);
          for (let i = 0; i < 15; i++) {
            toastState.sparkles.push({
              x: glassCenterX,
              y: glassY - 20,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 1,
            });
          }
        }
      } else if (toastState.direction === 2) {
        toastState.pauseTimer += 0.02;
        if (toastState.pauseTimer > 3) {
          toastState.direction = 3;
          toastState.pauseTimer = 0;
          setToastMsgVisible(false);
        }
      } else if (toastState.direction === 3) {
        toastState.progress -= 0.01;
        if (toastState.progress <= 0) {
          toastState.progress = 0;
          toastState.direction = 4;
        }
      } else if (toastState.direction === 4) {
        toastState.pauseTimer += 0.02;
        if (toastState.pauseTimer > 4) {
          toastState.direction = 1;
          toastState.pauseTimer = 0;
        }
      }

      const offset = (1 - toastState.progress) * distOffset;

      const drawGlass = (gx, gy, tilt) => {
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(tilt);
        ctx.strokeStyle = 'rgba(241, 245, 249, 0.95)';
        ctx.lineWidth = 1.5;

        // Bowl
        ctx.beginPath();
        ctx.moveTo(-8, -25);
        ctx.lineTo(-6, 0);
        ctx.quadraticCurveTo(0, 10, 6, 0);
        ctx.lineTo(8, -25);
        ctx.closePath();
        ctx.stroke();

        // Liquid
        ctx.fillStyle = 'rgba(226, 232, 240, 0.35)';
        ctx.fillRect(-5, -15, 10, 12);

        // Stem & Base
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.lineTo(0, 25);
        ctx.moveTo(-10, 25);
        ctx.lineTo(10, 25);
        ctx.stroke();
        ctx.restore();
      };

      drawGlass(glassCenterX - offset - 10, glassY, toastState.progress * 0.15);
      drawGlass(glassCenterX + offset + 10, glassY, -toastState.progress * 0.15);

      toastState.sparkles.forEach((sp, idx) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 0.03;
        if (sp.life > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${sp.life})`;
          ctx.fillRect(sp.x, sp.y, 2.5, 2.5);
        } else {
          toastState.sparkles.splice(idx, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      />
      {toastMsgVisible && (
        <div className="fixed bottom-24 right-6 md:right-12 z-20 bg-slate-900/90 border border-slate-300/40 px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.2)] backdrop-blur-md transition-opacity duration-500">
          <p className="font-serif-luxury text-xs md:text-sm text-slate-100 tracking-wider">
            🥂 "Cheers to 25 Beautiful Years!"
          </p>
        </div>
      )}
    </>
  );
}