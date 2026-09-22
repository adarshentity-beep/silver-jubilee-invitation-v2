let backgroundAudio = null;
let isMuted = false;

function getBackgroundAudio() {
  if (!backgroundAudio) {
    backgroundAudio = new Audio('/background-music.mp3');
    backgroundAudio.loop = true;
    backgroundAudio.preload = 'auto';
    backgroundAudio.volume = 0.28;
    backgroundAudio.muted = false;
  }

  return backgroundAudio;
}

export async function startBackgroundMusic(delayMs = 1200) {
  const audio = getBackgroundAudio();

  if (isMuted || document.hidden) return;

  setTimeout(async () => {
    // Check again after the delay in case the user muted
    // or switched tabs during those 1200ms.
    if (isMuted || document.hidden) return;

    try {
      if (audio.paused) {
        await audio.play();
      }
    } catch (error) {
      console.log('Background music could not start:', error);
    }
  }, delayMs);
}

export function muteBackgroundMusic() {
  isMuted = true;

  const audio = getBackgroundAudio();
  audio.muted = true;
  audio.pause();

  window.dispatchEvent(new Event('background-audio-state'));
}

export async function unmuteBackgroundMusic() {
  isMuted = false;

  const audio = getBackgroundAudio();
  audio.muted = false;

  if (document.hidden) return;

  try {
    await audio.play();
  } catch (error) {
    console.log('Background music could not resume:', error);
  }

  window.dispatchEvent(new Event('background-audio-state'));
}

export function isBackgroundMusicMuted() {
  return isMuted;
}

export function setupAudioVisibilityHandling(onMute) {
  const handleVisibilityChange = () => {
    const audio = getBackgroundAudio();

    if (document.hidden) {
      audio.pause();
      audio.muted = true;
      isMuted = true;

      if (onMute) {
        onMute(true);
      }

      window.dispatchEvent(new Event('background-audio-state'));
    }
  };

  const handlePageHide = () => {
    const audio = getBackgroundAudio();

    audio.pause();
    audio.muted = true;
    isMuted = true;
  };

  document.addEventListener(
    'visibilitychange',
    handleVisibilityChange
  );

  window.addEventListener(
    'pagehide',
    handlePageHide
  );

  return () => {
    document.removeEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    window.removeEventListener(
      'pagehide',
      handlePageHide
    );
  };
}