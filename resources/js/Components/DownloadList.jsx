import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Layers, Download, Copy, RefreshCw, Trash2, CheckCircle2,
    Clock, AlertCircle, User as UserIcon, ExternalLink, HardDrive, FileText
} from 'lucide-react';
import { formatDate, getStatusConfig } from '../utils/formatters';

export default function DownloadList({
    downloads = [],
    searchTerm,
    statusFilter,
    isSuperUser,
    onSearchChange,
    onStatusFilterChange,
    onCopyLink,
    onRetry,
    onDelete,
}) {
    const statusTabs = [
        { id: 'all', label: 'Tüm Durumlar' },
        { id: 'completed', label: 'Önbellekte Hazır' },
        { id: 'downloading', label: 'İndirilenler' },
        { id: 'pending', label: 'Bekleyenler' },
        { id: 'failed', label: 'Hatalı Olanlar' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl space-y-0"
        >
            {/* Header Toolbar & Filters */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40">
                <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Layers className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        İndirme Listesi
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {downloads.length}
                        </span>
                    </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Dosya adı veya link ara..."
                            className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                    </div>

                    {/* Filter Tabs / Select */}
                    <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/5 w-full sm:w-auto overflow-x-auto">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onStatusFilterChange(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                                    statusFilter === tab.id
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Table & Mobile Cards */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                        <tr>
                            <th className="py-4 px-6">Dosya Bilgisi</th>
                            <th className="py-4 px-6">Boyut / İlerleme</th>
                            <th className="py-4 px-6">Durum</th>
                            <th className="py-4 px-6">Tarih</th>
                            <th className="py-4 px-6 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence>
                            {downloads.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-slate-600">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-400">
                                                Herhangi bir indirme kaydı bulunamadı.
                                            </p>
                                            <p className="text-xs text-slate-500 max-w-sm">
                                                Yukarıdaki alandan yeni bir link ekleyerek önbelleğe alabilir veya doğrudan indirebilirsiniz.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                downloads.map((item) => {
                                    const statusCfg = getStatusConfig(item.status);
                                    return (
                                        <motion.tr
                                            key={item.uuid}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition group"
                                        >
                                            {/* File Information */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1 max-w-md">
                                                    <span
                                                        className="font-bold text-white truncate text-xs group-hover:text-indigo-300 transition"
                                                        title={item.filename || 'Dönüştürülüyor...'}
                                                    >
                                                        {item.filename || 'Dosya bilgisi bekleniyor...'}
                                                    </span>
                                                    <span
                                                        className="text-[11px] font-mono text-slate-400 truncate opacity-70"
                                                        title={item.original_link}
                                                    >
                                                        {item.original_link}
                                                    </span>

                                                    {/* Admin User Badge */}
                                                    {isSuperUser && item.user && (
                                                        <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-semibold mt-0.5">
                                                            <UserIcon className="w-3 h-3 text-indigo-400" />
                                                            <span>{item.user.name}</span>
                                                            <span className="text-slate-500">({item.user_ip || 'N/A'})</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Download Size & Progress Bar */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1.5 w-36">
                                                    <div className="flex justify-between text-[11px] font-mono">
                                                        <span className="text-white font-bold">
                                                            {item.formatted_downloaded || '0 B'}
                                                        </span>
                                                        <span className="text-slate-400">
                                                            / {item.formatted_filesize || '0 B'}
                                                        </span>
                                                    </div>

                                                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-300 ${
                                                                item.status === 'completed'
                                                                    ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                                                                    : item.status === 'failed'
                                                                    ? 'bg-rose-500'
                                                                    : 'animate-shimmer'
                                                            }`}
                                                            style={{ width: `${item.progress_percentage || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex items-center gap-1.5 ${statusCfg.badgeClass}`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                                                        {statusCfg.label}
                                                        {item.status === 'downloading' && (
                                                            <span>(%{item.progress_percentage})</span>
                                                        )}
                                                    </span>

                                                    {/* Multi-user Shared Cache indicator */}
                                                    {item.user_count > 1 && (
                                                        <span
                                                            className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                                            title={`${item.user_count} kullanıcı bu önbelleği paylaşıyor`}
                                                        >
                                                            {item.user_count}x Ortak
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Error message detail if failed */}
                                                {item.status === 'failed' && item.error_message && (
                                                    <p
                                                        className="text-[10px] text-rose-400/90 mt-1 max-w-xs truncate font-medium"
                                                        title={item.error_message}
                                                    >
                                                        {item.error_message}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-6 text-slate-400 text-[11px] font-mono">
                                                {formatDate(item.created_at)}
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {item.status === 'completed' && item.download_url && (
                                                        <>
                                                            <a
                                                                href={item.download_url}
                                                                download
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition"
                                                                title="Doğrudan Yüksek Hızlı İndir"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                                <span>İndir (IDM)</span>
                                                            </a>

                                                            <button
                                                                onClick={() =>
                                                                    onCopyLink(
                                                                        window.location.origin + item.download_url,
                                                                        'Doğrudan İndirme Bağlantısı'
                                                                    )
                                                                }
                                                                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition"
                                                                title="İndirme Bağlantısını Kopyala"
                                                            >
                                                                <Copy className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {isSuperUser && item.status === 'failed' && (
                                                        <button
                                                            onClick={() => onRetry(item.uuid)}
                                                            className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold text-xs flex items-center gap-1 transition"
                                                        >
                                                            <RefreshCw className="w-3.5 h-3.5" />
                                                            <span>Yeniden Dene</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => onDelete(item.uuid)}
                                                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
                                                        title="Sil veya İptal Et"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
