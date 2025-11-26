import { useRef, useCallback, useEffect } from 'react';

export const useSound = () => {
    const soundsRef = useRef({});
    const isInitializedRef = useRef(false);

    const initSounds = useCallback(() => {
        if (isInitializedRef.current) return;
        
        try {
            soundsRef.current = {
                start: new Audio('/sounds/start.mp3'),
                stop: new Audio('/sounds/stop.mp3'), 
                phaseChange: new Audio('/sounds/beep.mp3'),
                end: new Audio('/sounds/end.mp3')
            };

            Object.values(soundsRef.current).forEach(audio => {
                audio.preload = 'auto';
                audio.volume = 0.7;
                
                audio.addEventListener('error', (e) => {
                    console.error(`Error loading sound ${audio.src}:`, e);
                });
            });

            isInitializedRef.current = true;
        } catch (error) {
            console.error('Error initializing sounds:', error);
        }
    }, []);

    const playSound = useCallback((soundName) => {
        try {
            if (!isInitializedRef.current) {
                initSounds();
            }

            const sound = soundsRef.current[soundName];
            if (!sound) {
                console.error(`Sound "${soundName}" not found`);
                return;
            }

            sound.currentTime = 0;
            sound.play().catch(error => {
                console.error(`Sound playback failed for "${soundName}":`, error);
                if (!error.message.includes('user didn\'t interact') && 
                    !error.message.includes('not allowed')) {
                    console.error('Non-user-gesture sound error:', error);
                }
            });
        } catch (error) {
            console.error(`Unexpected error playing sound "${soundName}":`, error);
        }
    }, [initSounds]);

    useEffect(() => {
        initSounds();
    }, [initSounds]);

    return {
        playStart: () => playSound('start'),
        playStop: () => playSound('stop'),
        playPhaseChange: () => playSound('phaseChange'),
        playEnd: () => playSound('end')
    };
};