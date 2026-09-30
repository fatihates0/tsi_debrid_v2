import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownToLine, Zap, Globe, ShieldCheck, X, AlertCircle, CheckCircle2, Layers } from 'lucide-react';
import { getHosterName } from '../utils/formatters';

export default function LinkSubmissionForm({
    link,
    allowedHosts = [],
    onChangeLink,
    onSubmit,
    processing,
}) {
    // Extract all valid HTTP/HTTPS URLs from the input text
    const parsedUrls = useMemo(() => {
        if (!link || !link.trim()) return [];
        return link
            .split(/[\r\n\s,]+/)
            .map((l) => l.trim())
            .filter((l) => l.startsWith('http://') || l.startsWith('https://'));
    }, [link]);

    // Check host validity for each URL
    const hostStats = useMemo(() => {
        if (parsedUrls.length === 0) {
            return { validCount: 0, invalidCount: 0, hosters: [] };
        }

        const hosters = new Set();
        let valid = 0;
        let invalid = 0;

        parsedUrls.forEach((url) => {
            const name = getHosterName(url);
            if (name && name !== 'Web Link') hosters.add(name);

            if (!allowedHosts || allowedHosts.length === 0) {
                valid++;
            } else {
                try {
                    const parsedHost = new URL(url).hostname.toLowerCase();
                    const isAllowed = allowedHosts.some(
                        (allowed) =>
                            parsedHost === allowed.toLowerCase() ||
                            parsedHost.endsWith('.' + allowed.toLowerCase())
                    );
                    if (isAllowed) valid++;
                    else invalid++;
                } catch {
                    invalid++;
                }
            }
        });

        return {
            validCount: valid,
            invalidCount: invalid,
            hosters: Array.from(hosters),
        };
    }, [parsedUrls, allowedHosts]);

    const isSubmitDisabled =
        processing ||
        parsedUrls.length === 0 ||
        (allowedHosts.length > 0 && hostStats.invalidCount > 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="soft-card rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                        <ArrowDownToLine className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            İndirme Bağlantısı Ekle
                        </h2>
                        <p className="text-xs text-slate-400 font-medium">
                            Tek bir link veya alt alta birden fazla indirme bağlantısı yapıştırabilirsiniz
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {parsedUrls.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-2 flex-wrap self-start sm:self-auto"
                        >
                            <span
                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${hostStats.invalidCount === 0
                                    ? 'soft-badge-emerald'
                                    : 'soft-badge-rose'
                                    }`}
                            >
                                {hostStats.invalidCount === 0 ? (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>
                                            {parsedUrls.length > 1
                                                ? `${parsedUrls.length} Bağlantı Algılandı`
                                                : `Algılandı: ${hostStats.hosters.join(', ') || 'Web Link'}`}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                        <span>{hostStats.invalidCount} İzin Verilmeyen Bağlantı Var</span>
                                    </>
                                )}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="relative flex-1">
                        <textarea
                            rows={parsedUrls.length > 1 ? Math.min(6, Math.max(3, parsedUrls.length)) : 3}
                            value={link}
                            onChange={(e) => onChangeLink(e.target.value)}
                            placeholder={`https://mega.nz/file/...\nhttps://mega.nz/file/...\nhttps://mega.nz/file/...`}
                            className={`w-full soft-input rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition pr-10 resize-y min-h-[90px] font-mono leading-relaxed ${parsedUrls.length > 0 && hostStats.invalidCount > 0
                                ? 'border-rose-500/50 focus:border-rose-500'
                                : ''
                                }`}
                            required
                        />
                        {link && (
                            <button
                                type="button"
                                onClick={() => onChangeLink('')}
                                className="absolute right-3.5 top-3.5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                                title="Metni Temizle"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="px-8 py-3.5 h-[52px] rounded-2xl font-bold text-sm text-white soft-gradient-primary transition flex items-center justify-center gap-2.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer self-start"
                    >
                        {processing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Zap className="w-4 h-4 fill-white" />
                                <span>
                                    {parsedUrls.length > 1
                                        ? `İndirmeleri Başlat (${parsedUrls.length})`
                                        : 'İndirmeyi Başlat'}
                                </span>
                            </>
                        )}
                    </button>
                </div>

                {/* Validation Warning for Disallowed Links */}
                {parsedUrls.length > 0 && hostStats.invalidCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-2.5"
                    >
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                            Yapıştırılan {parsedUrls.length} bağlantının {hostStats.invalidCount} tanesi izin verilen sunucu listesinde bulunmuyor. İzin verilen sunucular: {allowedHosts.join(', ')}
                        </span>
                    </motion.div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 px-1 pt-1">
                    {/* Allowed Hosts Tags */}
                    {allowedHosts && allowedHosts.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                            <span className="text-slate-400 font-semibold">İzin Verilen Sunucular:</span>
                            {allowedHosts.map((host, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-mono font-bold border border-white/5"
                                >
                                    {host}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Önbellekteki dosyalar sınırsız hızla 7 gün saklanır</span>
                        </div>
                    )}
                </div>
            </form>
        </motion.div>
    );
}
