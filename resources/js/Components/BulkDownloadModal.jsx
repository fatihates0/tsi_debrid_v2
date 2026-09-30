import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check, X, Layers } from 'lucide-react';

export default function BulkDownloadModal({ items = [], onClose, onCopyAll }) {
    const [copied, setCopied] = useState(false);

    const linksText = items
        .map((item) => {
            const url = item.download_url || '';
            if (!url) return '';
            return url.startsWith('http://') || url.startsWith('https://')
                ? url
                : window.location.origin + (url.startsWith('/') ? '' : '/') + url;
        })
        .filter(Boolean)
        .join('\n');

    const handleCopy = () => {
        navigator.clipboard.writeText(linksText);
        setCopied(true);
        if (onCopyAll) {
            onCopyAll(linksText, items.length);
        }
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="glass-panel rounded-3xl max-w-xl w-full p-6 border border-white/10 shadow-2xl space-y-5 relative overflow-hidden text-slate-100"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Download className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                                Toplu İndirme Bağlantıları
                                <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                    {items.length} Dosya
                                </span>
                            </h3>
                            <p className="text-xs text-slate-400">
                                Tüm bağlantıları kopyalayarak IDM veya indirme yöneticinize aktarabilirsiniz
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                        title="Kapat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Textarea Area */}
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Doğrudan İndirme Linkleri (Alt Alta):</span>
                        <span className="text-[11px] font-mono text-emerald-400">IDM / JDownloader Uyumlu</span>
                    </div>

                    <textarea
                        readOnly
                        rows={Math.min(10, Math.max(5, items.length))}
                        value={linksText}
                        onClick={(e) => e.target.select()}
                        className="w-full soft-input rounded-2xl p-4 text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none leading-relaxed resize-y bg-slate-950/90 border border-white/10 selection:bg-emerald-500/30"
                    />
                </div>

                {/* Action Footer Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition text-xs font-bold cursor-pointer"
                    >
                        Kapat
                    </button>

                    <button
                        type="button"
                        onClick={handleCopy}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-white" />
                                <span>Tüm Linkler Kopyalandı!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Tüm Linkleri Kopyala ({items.length})</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
