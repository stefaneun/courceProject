import React from 'react';
import './SelectMode.css'

export const SelectMode = ({ 
    savedPrograms, 
    onSelectProgram, 
    onEditProgram, 
    onDeleteProgram, 
    onCreateNew, 
    onBackToTimer 
}) => {
    return (
        <div className="select-mode">
            <h1 className="select-mode-title">Select Program</h1>

            <div className="select-mode-programs-list">
                {savedPrograms.map(program => (
                    <div key={program.id} className="select-mode-program-card">
                        <h3 className='select-mode-program-title'>{program.name}</h3>
                        <div className="select-mode-program-details">
                            <div>Work: {program.workTime}s | Rest: {program.restTime}s</div>
                            <div>Cycles: {program.cycles} | Warmup: {program.warmup}s | Cooldown: {program.cooldown}s</div>
                        </div>
                        <div className="select-mode-program-actions">
                            <button 
                                onClick={() => onSelectProgram(program)}
                                className="select-mode-btn select-mode-btn-select"
                            >
                                Select
                            </button>
                            <button 
                                onClick={() => onEditProgram(program)}
                                className="select-mode-btn select-mode-btn-edit"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => onDeleteProgram(program.id)}
                                className="select-mode-btn select-mode-btn-delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="select-mode-actions">
                <button onClick={onCreateNew} className="select-mode-btn select-mode-btn-create">
                    Create New Program
                </button>
                <button onClick={onBackToTimer} className="select-mode-btn select-mode-btn-back">
                    Back to Timer
                </button>
            </div>
        </div>
    );
};