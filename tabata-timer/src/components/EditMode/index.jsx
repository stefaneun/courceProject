import React from 'react';

export const EditMode = ({ 
    editProgram, 
    onInputChange, 
    onSaveProgram, 
    onCancelEdit 
}) => {
    return (
        <div className="edit-mode">
            <h2>{editProgram.id ? 'Edit Program' : 'Create New Program'}</h2>

            <div className="edit-form">
                <div className="form-group">
                    <label>Program Name: </label>
                    <input
                        type="text"
                        value={editProgram.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Work Time (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.workTime}
                        onChange={(e) => onInputChange('workTime', e.target.value)}
                        min="1"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Rest Time (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.restTime}
                        onChange={(e) => onInputChange('restTime', e.target.value)}
                        min="1"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Cycles: </label>
                    <input
                        type="number"
                        value={editProgram.cycles}
                        onChange={(e) => onInputChange('cycles', e.target.value)}
                        min="1"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Warmup (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.warmup}
                        onChange={(e) => onInputChange('warmup', e.target.value)}
                        min="0"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Cooldown (seconds): </label>
                    <input
                        type="number"
                        value={editProgram.cooldown}
                        onChange={(e) => onInputChange('cooldown', e.target.value)}
                        min="0"
                        className="form-input"
                    />
                </div>

                <div className="edit-actions">
                    <button onClick={onSaveProgram} className="btn btn-save">
                        Save Program
                    </button>
                    <button onClick={onCancelEdit} className="btn btn-cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};