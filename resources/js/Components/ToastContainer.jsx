import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts = [], onRemove }) {
    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.85, x: 30 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3.5 text-xs font-medium ${
                            toast.type === 'success'
                                ? 'bg-slate-900/95 border-emerald-500/30 text-emerald-200 shadow-emerald-950/40'
                                : toast.type === 'error'
                                ? 'bg-slate-900/95 border-rose-500/30 text-rose-200 shadow-rose-950/40'
                                : toast.type === 'warning'
                                ? 'bg-slate-900/95 border-amber-500/30 text-amber-200 shadow-amber-950/40'
                                : 'bg-slate-900/95 border-indigo-500/30 text-indigo-200 shadow-indigo-950/40'
                        }`}
                    >
                        <div className="p-1 rounded-lg shrink-0 mt-0.5">
                            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {toast.type === 'error' && <XCircle className="w-4 h-4 text-rose-400" />}
                            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                            {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400" />}
                        </div>

                        <div className="flex-1 leading-relaxed pt-0.5">{toast.message}</div>

                        {onRemove && (
                            <button
                                onClick={() => onRemove(toast.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white transition shrink-0"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
