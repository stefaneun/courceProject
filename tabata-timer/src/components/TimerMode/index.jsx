import React from 'react';
import './styles.css'

export const TimerMode = ({ 
    currentProgram, 
    phase, 
    timeLeft, 
    cyclesLeft, 
    isRunning, 
    onStart, 
    onPause, 
    onReset, 
    onSelectProgram 
}) => {
    const formatTime = (seconds) => {
        return `${seconds}`.padStart(2, '0');
    };

    return (
        <div className="container">
            <h1>Tabata Timer</h1>
            <div className="current-program">Current Program: <span>{currentProgram.name}</span></div>

            <div className={`phase-display ${phase}`}>Phase: <span>{phase.toUpperCase()}</span></div>

            <div className="time-display">{formatTime(timeLeft)}</div>

            <div className="cycles-display">Cycles: {cyclesLeft} / {currentProgram.cycles}</div>

            <div className="controls">
                <button
                    onClick={onStart}
                    disabled={isRunning || phase === 'finished'}
                    className="btn btn-start"
                >
                    Start
                </button>

                <button
                    onClick={onPause}
                    disabled={!isRunning}
                    className="btn btn-pause"
                >
                    Pause
                </button>

                <button onClick={onReset} className="btn btn-reset">
                    Reset
                </button>

                <button
                    onClick={onSelectProgram}
                    disabled={isRunning}
                    className="btn btn-select"
                >
                    Select Program
                </button>
            </div>

            <div className="program-details">
                <div>Work: {currentProgram.workTime}s</div>
                <div>Rest: {currentProgram.restTime}s</div>
                <div>Cycles: {currentProgram.cycles}</div>
                <div>Warmup: {currentProgram.warmup}s</div>
                <div>Cooldown: {currentProgram.cooldown}s</div>
            </div>
        </div>
    );
};