import React from 'react';
import './EditMode.css'

export const EditMode = ({ 
    editProgram, 
    onInputChange, 
    onSaveProgram, 
    onCancelEdit 
}) => {
    return (
        <div className="edit-mode">
            <h1 className="edit-mode-title">{editProgram.id ? 'Edit Program' : 'Create New Program'}</h1>

            <div className="edit-mode-form">
                <div className="edit-mode-form-group">
                    <label>Program Name: </label>
                    <input
                        type="text"
                        value={editProgram.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                        className="edit-mode-form-input"
                    />
                </div>

                <div className="edit-mode-form-group">
                    <label>Work Time (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.workTime}
                        onChange={(e) => onInputChange('workTime', e.target.value)}
                        min="1"
                        className="edit-mode-form-input"
                    />
                </div>

                <div className="edit-mode-form-group">
                    <label>Rest Time (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.restTime}
                        onChange={(e) => onInputChange('restTime', e.target.value)}
                        min="1"
                        className="edit-mode-form-input"
                    />
                </div>

                <div className="edit-mode-form-group">
                    <label>Cycles: </label>
                    <input
                        type="number"
                        value={editProgram.cycles}
                        onChange={(e) => onInputChange('cycles', e.target.value)}
                        min="1"
                        className="edit-mode-form-input"
                    />
                </div>

                <div className="edit-mode-form-group">
                    <label>Warmup (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.warmup}
                        onChange={(e) => onInputChange('warmup', e.target.value)}
                        min="0"
                        className="edit-mode-form-input"
                    />
                </div>

                <div className="edit-mode-form-group">
                    <label>Cooldown (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.cooldown}
                        onChange={(e) => onInputChange('cooldown', e.target.value)}
                        min="0"
                        className="edit-mode-form-input"
                    />
                </div>

                <div className="edit-mode-actions">
                    <button onClick={onSaveProgram} className="edit-mode-btn edit-mode-btn-save">
                        Save Program
                    </button>
                    <button onClick={onCancelEdit} className="edit-mode-btn edit-mode-btn-cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};