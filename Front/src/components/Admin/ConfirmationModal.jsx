import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <dialog open={isOpen} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{message}</h3>
                <div className="modal-action">
                    <button className="btn btn-primary" onClick={onConfirm}>Igen</button>
                    <button className="btn btn-ghost" onClick={onCancel}>Mégse</button>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmationModal;