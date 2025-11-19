import React, { useEffect, useState } from "react";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useSound } from '../../hooks/useSound';
// import { formatTime } from '../../utils/tabataUtils';

export const BasicTabata = () => {

    const [program, setProgram] = useLocalStorage('currentProgram', {
        name: 'Default program',
        workTime: 20,
        restTime: 10,
        cycles: 8,
        warmup: 0,
        cooldown: 0
    });

    const [phase, setPhase] = useState('work');
    const [timeLeft, setTimeLeft] = useState(20);
    const [cyclesLeft, setCyclesLeft] = useState(8);
    const [isRunning, setIsRunning] = useState(false);

    const { playStart, playStop, playPhaseChange, playEnd } = useSound();

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (phase === 'work') {
                        setPhase('rest');
                        return 10;
                    } else {
                        setPhase('work');
                        setCyclesLeft(prev => prev - 1);
                        return 20;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, phase, cyclesLeft]);

    useEffect(() => {
        if (cyclesLeft <= 0 && phase === 'work' && timeLeft <= 1) {
            console.log('END!');
            setIsRunning(false);
        }
    }, [cyclesLeft, phase, timeLeft]);

    const getPhaseText = () => {
        return phase === 'work' ? ' WORK' : ' REST';
    };

    return (
        <>
            <div>Train Timer</div>
            <div>
                {getPhaseText()}
            </div>
            <div>
                {timeLeft}
            </div>
            <div>
                Cycles left: {cyclesLeft}
            </div>

            <div>
                <button
                    onClick={() => setIsRunning(true)}
                    disabled={isRunning}
                >
                    Start
                </button>

                <button
                    onClick={() => setIsRunning(false)}
                    disabled={!isRunning}
                >
                    Pause
                </button>

                <button
                    onClick={() => {
                        setIsRunning(false);
                        setPhase('work');
                        setTimeLeft(20);
                        setCyclesLeft(8);
                    }}
                >
                    Reset
                </button>

            </div>
        </>
    )


};