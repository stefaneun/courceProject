import React, { useEffect, useState } from "react";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useSound } from '../../hooks/useSound';

export const BasicTabata = () => {
    const [program, setProgram] = useLocalStorage('currentProgram', {
        name: 'Default program',
        workTime: 20,
        restTime: 10,
        cycles: 8,
        warmup: 0,
        cooldown: 0
    });

    const [phase, setPhase] = useState('ready');
    const [timeLeft, setTimeLeft] = useState(program.workTime);
    const [cyclesLeft, setCyclesLeft] = useState(program.cycles);
    const [isRunning, setIsRunning] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editProgram, setEditProgram] = useState({ ...program });

    const { playStart, playStop, playPhaseChange, playEnd } = useSound();

    const handleStart = () => {
        setIsRunning(true);
        setPhase('work');
        setTimeLeft(program.workTime);
        playStart();
    };

    const handlePause = () => {
        setIsRunning(false);
        playStop();
    };

    const handleReset = () => {
        setIsRunning(false);
        setPhase('ready');
        setTimeLeft(program.workTime);
        setCyclesLeft(program.cycles);
        playStop();
    };

    const handleFinish = () => {
        setIsRunning(false);
        setPhase('finished');
        playEnd();
    };

    const handlePhaseChange = (newPhase) => {
        setPhase(newPhase);
        playPhaseChange();
        
        if (newPhase === 'work') {
            setTimeLeft(program.workTime);
        } else {
            setTimeLeft(program.restTime);
        }
        
    };

    const handleEdit = () => {
        setEditProgram({ ...program });
        setIsEditing(true);
    };

    const handleSave = () => {
        setProgram(editProgram);
        setIsEditing(false);
        handleReset(); 
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditProgram({ ...program });
    };

    const handleInputChange = (field, value) => {
        setEditProgram(prev => ({
            ...prev,
            [field]: parseInt(value) || 0
        }));
    };

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (phase === 'work') {
                        handlePhaseChange('rest');
                    } else if (phase === 'rest') {
                        const newCycles = cyclesLeft - 1;
                        setCyclesLeft(newCycles);
                        
                        if (newCycles <= 0) {
                            handleFinish();
                            return 0;
                        } else {
                            handlePhaseChange('work');
                        }
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, phase, cyclesLeft, program]);

    const handleSkipPhase = () => {
        if (phase === 'work') {
            handlePhaseChange('rest');
        } else if (phase === 'rest') {
            const newCycles = cyclesLeft - 1;
            setCyclesLeft(newCycles);
            
            if (newCycles <= 0) {
                handleFinish();
            } else {
                handlePhaseChange('work');
            }
        }
    };

    const formatTime = (seconds) => {
        return `${seconds}`.padStart(2, '0');
    };

    if (isEditing) {
        return (
            <div>
                <h1>Edit Program</h1>
                <div>
                    <label>Program Name:</label>
                    <input 
                        type="text" 
                        value={editProgram.name}
                        onChange={(e) => setEditProgram(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>
                <div>
                    <label>Work Time (seconds):</label>
                    <input 
                        type="number" 
                        value={editProgram.workTime}
                        onChange={(e) => handleInputChange('workTime', e.target.value)}
                        min="1"
                    />
                </div>
                <div>
                    <label>Rest Time (seconds):</label>
                    <input 
                        type="number" 
                        value={editProgram.restTime}
                        onChange={(e) => handleInputChange('restTime', e.target.value)}
                        min="1"
                    />
                </div>
                <div>
                    <label>Cycles:</label>
                    <input 
                        type="number" 
                        value={editProgram.cycles}
                        onChange={(e) => handleInputChange('cycles', e.target.value)}
                        min="1"
                    />
                </div>
                <div>
                    <label>Warmup (seconds):</label>
                    <input 
                        type="number" 
                        value={editProgram.warmup}
                        onChange={(e) => handleInputChange('warmup', e.target.value)}
                        min="0"
                    />
                </div>
                <div>
                    <label>Cooldown (seconds):</label>
                    <input 
                        type="number" 
                        value={editProgram.cooldown}
                        onChange={(e) => handleInputChange('cooldown', e.target.value)}
                        min="0"
                    />
                </div>
                <div>
                    <button onClick={handleSave}>Save Program</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>Tabata Timer</h1>
            <div>
                {program.name}
            </div>
            
            <div>
                {phase.toUpperCase()}
            </div>
            
            <div>
                {formatTime(timeLeft)}
            </div>
            
            <div>
                Cycles: {cyclesLeft} / {program.cycles}
            </div>

            <div>
                <button 
                    onClick={handleStart}
                    disabled={isRunning || phase === 'finished'}
                >
                    Start
                </button>

                <button 
                    onClick={handlePause}
                    disabled={!isRunning}
                >
                    Pause
                </button>

                <button 
                    onClick={handleReset}
                >
                    Reset
                </button>

                <button 
                    onClick={handleEdit}
                    disabled={isRunning}
                >
                    Edit Program
                </button>
            </div>

            <div>
                <button 
                    onClick={handleSkipPhase}
                    disabled={!isRunning}
                >
                    Skip Phase
                </button>
            </div>

            <div>
                <div>Work: {program.workTime} sec</div>
                <div>Rest: {program.restTime} sec</div>
                <div>Cycles: {program.cycles}</div>
                <div>Warmup: {program.warmup} sec</div>
                <div>Cooldown: {program.cooldown} sec</div>
            </div>
        </div>
    );
};