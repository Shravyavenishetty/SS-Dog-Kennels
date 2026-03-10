import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ICONS = { success: CheckCircle, error: XCircle, info: Info };

export default function ToastContainer({ toasts, onDismiss }) {
    return (
        <div className="toast-container">
            {toasts.map(({ id, msg, type }) => {
                const Icon = ICONS[type] || Info;
                return (
                    <div key={id} className={`toast ${type}`}>
                        <Icon size={16} />
                        <span>{msg}</span>
                        <button className="toast-close" onClick={() => onDismiss(id)}><X size={14} /></button>
                    </div>
                );
            })}
        </div>
    );
}
