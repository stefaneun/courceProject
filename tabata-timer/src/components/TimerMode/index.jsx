import React from 'react';
import './TimerMode.css';
import { formatTime } from '../utils/tabataUtils';

export const TimerMode = ({
    currentProgram,
    phase,
    timeLeft,
    readyTimeDisplay, 
    cyclesLeft,
    isRunning,
    onStart,
    onPause,
    onReset,
    onSelectProgram
}) => {
   
    const getDisplayTime = () => {
        if (phase === 'ready') {
            return readyTimeDisplay;
        }
        return timeLeft;
    };

    const getTimeDisplayClass = () => {
        if (phase === 'ready') {
            return 'timer-mode-time-display-ready';
        }
        return 'timer-mode-time-display';
    };

    const getPhaseInfo = () => {
        if (phase === 'ready') {
            if (currentProgram.warmup > 0) {
                return {
                    message: 'Ready to start with warmup',
                    description: `First: ${currentProgram.warmup}s warmup`
                };
            } else {
                return {
                    message: 'Ready to start',
                    description: `First: ${currentProgram.workTime}s work`
                };
            }
        }
        return {
            message: `Phase: ${phase.toUpperCase()}`,
            description: ''
        };
    };

    const phaseInfo = getPhaseInfo();

    return (
        <div className="timer-mode">
            <h1 className='timer-mode-title'>Tabata Timer</h1>
            
            <div className="timer-mode-current-program">
                Current Program: <span>{currentProgram.name}</span>
            </div>

            <div className={`timer-mode-phase-display timer-mode-phase-${phase}`}>
                {phaseInfo.message}
                {phaseInfo.description && (
                    <div className="timer-mode-phase-description">
                        {phaseInfo.description}
                    </div>
                )}
            </div>

            <div className={getTimeDisplayClass()}>
                {phase === 'ready' ? 'READY' : formatTime(getDisplayTime())}
            </div>

            <div className="timer-mode-cycles-display">
                Cycles: {cyclesLeft} / {currentProgram.cycles}
            </div>

            <div className="timer-mode-controls">
                <button
                    onClick={onStart}
                    disabled={isRunning || phase === 'finished'}
                    className="timer-mode-btn timer-mode-btn-start"
                >
                    {phase === 'ready' ? 'Start' : 'Resume'}
                </button>

                <button
                    onClick={onPause}
                    disabled={!isRunning}
                    className="timer-mode-btn timer-mode-btn-pause"
                >
                    Pause
                </button>

                <button onClick={onReset} className="timer-mode-btn timer-mode-btn-reset">
                    Reset
                </button>

                <button
                    onClick={onSelectProgram}
                    disabled={isRunning}
                    className="timer-mode-btn timer-mode-btn-select"
                >
                    Select Program
                </button>
            </div>

            <div className="timer-mode-program-details">
                <div>Work: {currentProgram.workTime}s</div>
                <div>Rest: {currentProgram.restTime}s</div>
                <div>Cycles: {currentProgram.cycles}</div>
                <div>Warmup: {currentProgram.warmup}s</div>
                <div>Cooldown: {currentProgram.cooldown}s</div>
            </div>
        </div>
    );
};