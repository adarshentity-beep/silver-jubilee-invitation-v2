import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import {
  muteBackgroundMusic,
  unmuteBackgroundMusic,
  setupAudioVisibilityHandling,
  isBackgroundMusicMuted,
} from '../../utils/audio';

export default function AudioController() {
  const [isMuted, setIsMuted] = useState(
    isBackgroundMusicMuted()
  );

  useEffect(() => {
    const cleanup = setupAudioVisibilityHandling(() => {
      setIsMuted(true);
    });

    const syncState = () => {
      setIsMuted(isBackgroundMusicMuted());
    };

    window.addEventListener(
      'background-audio-state',
      syncState
    );

    return () => {
      cleanup();
      window.removeEventListener(
        'background-audio-state',
        syncState
      );
    };
  }, []);

  const handleToggle = async () => {
    if (isMuted) {
      await unmuteBackgroundMusic();
      setIsMuted(false);
    } else {
      muteBackgroundMusic();
      setIsMuted(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="fixed top-6 right-6 z-[100] p-3 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-200 hover:text-white hover:border-slate-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all cursor-pointer"
      title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
      aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-slate-300" />
      ) : (
        <Volume2 className="w-5 h-5 text-slate-200" />
      )}
    </button>
  );
}