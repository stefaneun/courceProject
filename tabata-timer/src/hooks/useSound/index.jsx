import { useRef, useCallback } from 'react';

export const useSound = () => {
  const soundsRef = useRef({});

  const initSounds = useCallback(() => {
    soundsRef.current = {
      start: new Audio('/sounds/start.mp3'),
      stop: new Audio('/sounds/stop.mp3'), 
      phaseChange: new Audio('/sounds/beep.mp3'),
      end: new Audio('/sounds/end.mp3')
    };

    Object.values(soundsRef.current).forEach(audio => {
      audio.preload = 'auto';
      audio.volume = 0.7;
    });
  }, []);

  const playSound = useCallback((soundName) => {
    if (!soundsRef.current[soundName]) {
      initSounds();
    }

    try {
      const sound = soundsRef.current[soundName];
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.warn('Sound playback failed:', error);
      });
    } catch (error) {
      console.warn('Sound error:', error);
    }
  }, [initSounds]);

  return {
    playStart: () => playSound('start'),
    playStop: () => playSound('stop'),
    playPhaseChange: () => playSound('phaseChange'),
    playEnd: () => playSound('end')
  };
};