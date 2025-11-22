import React from 'react';
import './styles.css'

export const SelectMode = ({ 
    savedPrograms, 
    onSelectProgram, 
    onEditProgram, 
    onDeleteProgram, 
    onCreateNew, 
    onBackToTimer 
}) => {
    return (
        <div className="container">
            <h1>Select Program</h1>

            <div className="programs-list">
                {savedPrograms.map(program => (
                    <div key={program.id} className="program-card">
                        <h3>{program.name}</h3>
                        <div className="program-details">
                            <div>Work: {program.workTime}s | Rest: {program.restTime}s</div>
                            <div>Cycles: {program.cycles} | Warmup: {program.warmup}s | Cooldown: {program.cooldown}s</div>
                        </div>
                        <div className="program-actions">
                            <button 
                                onClick={() => onSelectProgram(program)}
                                className="btn btn-select"
                            >
                                Select
                            </button>
                            <button 
                                onClick={() => onEditProgram(program)}
                                className="btn btn-edit"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => onDeleteProgram(program.id)}
                                className="btn btn-delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="select-actions">
                <button onClick={onCreateNew} className="btn btn-create">
                    Create New Program
                </button>
                <button onClick={onBackToTimer} className="btn btn-back">
                    Back to Timer
                </button>
            </div>
        </div>
    );
};