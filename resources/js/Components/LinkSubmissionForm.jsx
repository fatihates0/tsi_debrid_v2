import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownToLine, Zap, Globe, Sparkles, Check, X, ShieldCheck } from 'lucide-react';
import { getHosterName } from '../utils/formatters';

export default function LinkSubmissionForm({
    link,
    useRemote,
    onChangeLink,
    onChangeRemote,
    onSubmit,
    processing,
}) {
    const hosterName = useMemo(() => {
        if (!link || !link.trim()) return null;
        return getHosterName(link);
    }, [link]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden group"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-violet-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
                        <ArrowDownToLine className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                            Yeni İndirme Bağlantısı Ekle
                        </h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Mega, Rapidgator, Turbobit, 1Fichier ve tüm premium servisler desteklenir
                        </p>
                    </div>
                </div>

                {/* Hoster Pill Badge */}
                <AnimatePresence>
                    {hosterName && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-sm"
                        >
                            <Globe className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                            <span>Algılandı: {hosterName}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 relative z-10">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => onChangeLink(e.target.value)}
                            placeholder="https://mega.nz/file/... veya https://rapidgator.net/file/..."
                            className="w-full glass-input rounded-2xl px-5 py-4 text-sm text-white placeholder-slate-500 focus:outline-none transition pr-10"
                            required
                        />
                        {link && (
                            <button
                                type="button"
                                onClick={() => onChangeLink('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={processing || !link?.trim()}
                        className="px-8 py-4 rounded-2xl font-bold text-sm text-white gradient-button shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition flex items-center justify-center gap-2.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {processing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Zap className="w-4 h-4 fill-white" />
                                <span>İndirmeyi Başlat</span>
                            </>
                        )}
                    </motion.button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 px-1 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                        <input
                            type="checkbox"
                            checked={useRemote}
                            onChange={(e) => onChangeRemote(e.target.checked)}
                            className="w-4 h-4 rounded-md bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950 transition"
                        />
                        <span className="group-hover:text-slate-200 transition font-medium">
                            Uzaktan Trafik (Remote Traffic = 1) kullan (Önerilen)
                        </span>
                    </label>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Önbellekteki dosyalar sınırsız hızla 7 gün saklanır</span>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
