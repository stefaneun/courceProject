import React, { useEffect, useState } from "react";

export const BasicTabata = () => {
    const [phase, setPhase] = useState('work');
    const [timeLeft, setTimeLeft] = useState(20);
    const [cyclesLeft, setCyclesLeft] = useState(8);
    const [isRunning, setIsRunning] = useState(false);

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
            console.log('Тренировка завершена!');
            setIsRunning(false);
        }
    }, [cyclesLeft, phase, timeLeft]);

    const getPhaseColor = () => {
        return phase === 'work' ? '#ff4444' : '#44ff44';
    };

    const getPhaseText = () => {
        return phase === 'work' ? ' РАБОТА' : ' ОТДЫХ';
    };


    return (
        <>
            <h1>Tabata Timer</h1>
            <div>
                {getPhaseText()}
            </div>
            <div>
                {timeLeft}
            </div>
            <div>
                Циклов осталось: {cyclesLeft}
            </div>

            <div>
                <button
                    onClick={() => setIsRunning(true)}
                    disabled={isRunning}
                >
                    Старт
                </button>

                <button
                    onClick={() => setIsRunning(false)}
                    disabled={!isRunning}
                >
                    Пауза
                </button>

                <button
                    onClick={() => {
                        setIsRunning(false);
                        setPhase('work');
                        setTimeLeft(20);
                        setCyclesLeft(8);
                    }}
                >
                    Сброс
                </button>

            </div>
        </>
    )


};