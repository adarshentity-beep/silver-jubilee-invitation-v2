// utils/audio.js
let bgMusic = null;

export const playBackgroundMusic = (src = '/background-music.mp3', targetVolume = 0.4) => {
  if (!bgMusic) {
    bgMusic = new Audio(src);
    bgMusic.loop = true;
    bgMusic.volume = 0; // Start muted for smooth fade-in
  }

  // User click gesture fulfills browser autoplay requirements
  bgMusic.play().then(() => {
    // Fade-in over ~1.5 seconds (15 steps of 100ms)
    const fadeInterval = setInterval(() => {
      if (bgMusic.volume < targetVolume) {
        bgMusic.volume = Math.min(bgMusic.volume + targetVolume / 15, targetVolume);
      } else {
        clearInterval(fadeInterval);
      }
    }, 100);
  }).catch((err) => {
    console.warn("Audio play prevented:", err);
  });
};