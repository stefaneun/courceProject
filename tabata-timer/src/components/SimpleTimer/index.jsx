import React, { useEffect, useState } from "react";

export const SimpleTimer = () => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    console.log('time is over');
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [isRunning]);

   
    return (
        <div>
            <div>Time left: {timeLeft}</div>
            <button onClick={() => setIsRunning(true)} disabled={isRunning}>
                Start
            </button>
            <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
                Stop
            </button>
            <button onClick={() => {
                setTimeLeft(5);
                setIsRunning(false);
            }}>
                Reset
            </button>
        </div>
    );
};