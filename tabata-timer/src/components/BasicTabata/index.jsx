import React, { useEffect, useState } from "react";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useSound } from '../../hooks/useSound';
import defaultPrograms from '../DefaultPrograms/tabataPrograms.json'

export const BasicTabata = () => {

    const defaultProgramList = defaultPrograms.defaultPrograms || [];

    const [savedPrograms, setSavedPrograms] = useLocalStorage('tabataPrograms', defaultProgramList);
    const [currentProgram, setCurrentProgram] = useLocalStorage('currentProgram', savedPrograms[0] || defaultProgramList[0]);

    const [phase, setPhase] = useState('ready');
    const [timeLeft, setTimeLeft] = useState(currentProgram.workTime);
    const [cyclesLeft, setCyclesLeft] = useState(currentProgram.cycles);
    const [isRunning, setIsRunning] = useState(false);
    const [editProgram, setEditProgram] = useState({ ...currentProgram });
    const [mode, setMode] = useState('timer');

    const { playStart, playStop, playPhaseChange, playEnd } = useSound();

    const handleStart = () => {
        setIsRunning(true);
        setPhase('work');
        setTimeLeft(currentProgram.workTime);
        playStart();
    };

    const handlePause = () => {
        setIsRunning(false);
        playStop();
    };

    const handleReset = () => {
        setIsRunning(false);
        setPhase('ready');
        setTimeLeft(currentProgram.workTime);
        setCyclesLeft(currentProgram.cycles);
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
            setTimeLeft(currentProgram.workTime);
        } else {
            setTimeLeft(currentProgram.restTime);
        }
    };

    const handleSelectProgram = (program) => {
        setCurrentProgram(program);
        setMode('timer');
        handleReset();
    };

    const handleCreateNew = () => {
        const newProgram = {
            id: Date.now(),
            name: 'New Program',
            workTime: 20,
            restTime: 10,
            cycles: 8,
            warmup: 0,
            cooldown: 0
        };
        setEditProgram(newProgram);
        setMode('edit');
    };

    const handleEditProgram = (program) => {
        setEditProgram({ ...program });
        setMode('edit');
    };

    const handleSaveProgram = () => {
        const updatedPrograms = savedPrograms.filter(p => p.id !== editProgram.id);
        updatedPrograms.push(editProgram);
        setSavedPrograms(updatedPrograms);
        setCurrentProgram(editProgram);
        setMode('timer');
        handleReset();
    };

    const handleDeleteProgram = (programId) => {
        if (savedPrograms.length <= 1) {
            alert('Cannot delete the last program');
            return;
        }

        const updatedPrograms = savedPrograms.filter(p => p.id !== programId);
        setSavedPrograms(updatedPrograms);

        if (currentProgram.id === programId) {
            setCurrentProgram(updatedPrograms[0]);
            handleReset();
        }
    };

    const handleCancelEdit = () => {
        setMode('timer');
    };

    const handleInputChange = (field, value) => {
        setEditProgram(prev => ({
            ...prev,
            [field]: field === 'name' ? value : parseInt(value) || 0
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
    }, [isRunning, phase, cyclesLeft, currentProgram]);

    const formatTime = (seconds) => {
        return `${seconds}`.padStart(2, '0');
    };

    if (mode === 'select') {
        return (
            <div>
                <h2>Select Program</h2>

                {savedPrograms.map(program => (
                    <div key={program.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
                        <h3>{program.name}</h3>
                        <div>Work: {program.workTime}s | Rest: {program.restTime}s</div>
                        <div>Cycles: {program.cycles} | Warmup: {program.warmup}s | Cooldown: {program.cooldown}s</div>
                        <div>
                            <button onClick={() => handleSelectProgram(program)}>Select</button>
                            <button onClick={() => handleEditProgram(program)}>Edit</button>
                            <button onClick={() => handleDeleteProgram(program.id)}>Delete</button>
                        </div>
                    </div>
                ))}

                <div>
                    <button onClick={handleCreateNew}>Create New Program</button>
                    <button onClick={() => setMode('timer')}>Back to Timer</button>
                </div>
            </div>
        );
    }

    if (mode === 'edit') {
        return (
            <div>
                <h2>{editProgram.id ? 'Edit Program' : 'Create New Program'}</h2>

                <div>
                    <label>Program Name: </label>
                    <input
                        type="text"
                        value={editProgram.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                </div>

                <div>
                    <label>Work Time (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.workTime}
                        onChange={(e) => handleInputChange('workTime', e.target.value)}
                        min="1"
                    />
                </div>

                <div>
                    <label>Rest Time (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.restTime}
                        onChange={(e) => handleInputChange('restTime', e.target.value)}
                        min="1"
                    />
                </div>

                <div>
                    <label>Cycles: </label>
                    <input
                        type="number"
                        value={editProgram.cycles}
                        onChange={(e) => handleInputChange('cycles', e.target.value)}
                        min="1"
                    />
                </div>

                <div>
                    <label>Warmup (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.warmup}
                        onChange={(e) => handleInputChange('warmup', e.target.value)}
                        min="0"
                    />
                </div>

                <div>
                    <label>Cooldown (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.cooldown}
                        onChange={(e) => handleInputChange('cooldown', e.target.value)}
                        min="0"
                    />
                </div>

                <div>
                    <button onClick={handleSaveProgram}>Save Program</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            </div>
        );
    }


    return (
        <div>
            <h1>Tabata Timer</h1>
            <div>Current Program: {currentProgram.name}</div>

            <div>Phase: {phase.toUpperCase()}</div>

            <div>Time: {formatTime(timeLeft)}</div>

            <div>Cycles: {cyclesLeft} / {currentProgram.cycles}</div>

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

                <button onClick={handleReset}>
                    Reset
                </button>

                <button
                    onClick={() => setMode('select')}
                    disabled={isRunning}
                >
                    Select Program
                </button>
            </div>

            <div>
                <div>Work: {currentProgram.workTime}s</div>
                <div>Rest: {currentProgram.restTime}s</div>
                <div>Cycles: {currentProgram.cycles}</div>
                <div>Warmup: {currentProgram.warmup}s</div>
                <div>Cooldown: {currentProgram.cooldown}s</div>
            </div>
        </div>
    );
};