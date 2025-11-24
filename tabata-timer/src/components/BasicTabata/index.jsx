import React, { useEffect, useState } from "react";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useSound } from '../../hooks/useSound';
import defaultPrograms from '../DefaultPrograms/tabataPrograms.json';
import { TimerMode } from '../TimerMode';
import { SelectMode } from '../SelectMode';
import { EditMode } from '../EditMode';

import { Modal } from '../ui/Modal';
import './styles.css';

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
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const { playStart, playStop, playPhaseChange, playEnd } = useSound();

    const handleReset = () => {
        setIsRunning(false);
        setPhase('ready');
        setTimeLeft(currentProgram.workTime);
        setCyclesLeft(currentProgram.cycles);
        playStop();
    };

    useEffect(() => {
        setIsRunning(false);
        setPhase('ready');
        setTimeLeft(currentProgram.workTime);
        setCyclesLeft(currentProgram.cycles);
    }, [currentProgram]);

    const showModal = (title, message, onConfirm = null) => {
        setModal({
            isOpen: true,
            title,
            message,
            onConfirm
        });
    };

    const closeModal = () => {
        setModal({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null
        });
    };

    const handleStart = () => {
        setIsRunning(true);
        if (currentProgram.warmup > 0) {
            setPhase('warmup');
            setTimeLeft(currentProgram.warmup);
        } else {
            setPhase('work');
            setTimeLeft(currentProgram.workTime);
        }
        playStart();
    };

    const handlePause = () => {
        setIsRunning(false);
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
        showModal('Success', 'Program saved successfully!');
    };

    const handleDeleteProgram = (programId) => {
        if (savedPrograms.length <= 1) {
            showModal('Cannot Delete', 'You cannot delete the last program. Please create a new program first.');
            return;
        }

        const programToDelete = savedPrograms.find(p => p.id === programId);
        showModal(
            'Confirm Delete',
            `Are you sure you want to delete "${programToDelete.name}"?`,
            () => {
                const updatedPrograms = savedPrograms.filter(p => p.id !== programId);
                setSavedPrograms(updatedPrograms);

                if (currentProgram.id === programId) {
                    setCurrentProgram(updatedPrograms[0]);
                }
                closeModal();
            }
        );
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
                    if (phase === 'warmup') {
                        setPhase('work');
                        setTimeLeft(currentProgram.workTime);
                        playPhaseChange();
                    } else if (phase === 'work') {
                        handlePhaseChange('rest');
                    } else if (phase === 'rest') {
                        const newCycles = cyclesLeft - 1;
                        setCyclesLeft(newCycles);

                        if (newCycles <= 0) {
                            if (currentProgram.cooldown > 0) {
                                setPhase('cooldown');
                                setTimeLeft(currentProgram.cooldown);
                                playPhaseChange();
                            } else {
                                handleFinish();
                            }
                        } else {
                            handlePhaseChange('work');
                        }
                    } else if (phase === 'cooldown') {
                        
                        handleFinish();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, phase, cyclesLeft, currentProgram]);

    const renderMode = () => {
        switch (mode) {
            case 'select':
                return (
                    <SelectMode
                        savedPrograms={savedPrograms}
                        onSelectProgram={handleSelectProgram}
                        onEditProgram={handleEditProgram}
                        onDeleteProgram={handleDeleteProgram}
                        onCreateNew={handleCreateNew}
                        onBackToTimer={() => setMode('timer')}
                    />
                );
            case 'edit':
                return (
                    <EditMode
                        editProgram={editProgram}
                        onInputChange={handleInputChange}
                        onSaveProgram={handleSaveProgram}
                        onCancelEdit={handleCancelEdit}
                    />
                );
            case 'timer':
            default:
                return (
                    <TimerMode
                        currentProgram={currentProgram}
                        phase={phase}
                        timeLeft={timeLeft}
                        cyclesLeft={cyclesLeft}
                        isRunning={isRunning}
                        onStart={handleStart}
                        onPause={handlePause}
                        onReset={handleReset}
                        onSelectProgram={() => setMode('select')}
                    />
                );
        }
    };

    return (
        <div className="tabata-container">
            {renderMode()}

            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                onConfirm={modal.onConfirm}
            >
                <p>{modal.message}</p>
                {!modal.onConfirm && (
                    <div className="modal-actions">
                        <button onClick={closeModal} className="btn btn-primary">
                            OK
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};