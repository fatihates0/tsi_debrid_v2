import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Layers, Download, Copy, RefreshCw, Trash2, CheckCircle2,
    Clock, AlertCircle, User as UserIcon, FileText, CheckSquare,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
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
    onBulkDelete,
    onOpenBulkDownload,
}) {
    const [selectedUuids, setSelectedUuids] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Reset pagination to first page when search or status filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Clear selection when downloaded list changes or items are removed
    useEffect(() => {
        const validUuids = new Set(downloads.map((d) => d.uuid));
        setSelectedUuids((prev) => prev.filter((uuid) => validUuids.has(uuid)));
    }, [downloads]);

    const totalItems = downloads.length;
    const totalPages = Math.ceil(totalItems / perPage) || 1;
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    const startIndex = (safePage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalItems);
    const paginatedDownloads = downloads.slice(startIndex, endIndex);

    const allSelected = downloads.length > 0 && downloads.every((d) => selectedUuids.includes(d.uuid));

    const handleSelectAllToggle = () => {
        if (allSelected) {
            setSelectedUuids([]);
        } else {
            setSelectedUuids(downloads.map((d) => d.uuid));
        }
    };

    const handleItemSelectToggle = (uuid) => {
        setSelectedUuids((prev) =>
            prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
        );
    };

    const selectedCompletedItems = downloads.filter(
        (d) => selectedUuids.includes(d.uuid) && d.status === 'completed' && d.download_url
    );

    const handleBulkDownload = () => {
        if (selectedCompletedItems.length === 0) return;
        if (onOpenBulkDownload) {
            onOpenBulkDownload(selectedCompletedItems);
        }
    };

    const handleConfirmBulkDelete = () => {
        if (selectedUuids.length === 0) return;
        if (confirm(`Seçilen ${selectedUuids.length} adet indirme kaydını silmek istediğinize emin misiniz?`)) {
            if (onBulkDelete) {
                onBulkDelete(selectedUuids);
            }
            setSelectedUuids([]);
        }
    };

    const statusTabs = [
        { id: 'all', label: 'Tüm Durumlar' },
        { id: 'completed', label: 'Hazır' },
        { id: 'downloading', label: 'İndirilenler' },
        { id: 'pending', label: 'Bekleyenler' },
        { id: 'failed', label: 'Hatalı Olanlar' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="soft-card rounded-3xl border border-white/[0.07] overflow-hidden"
        >
            {/* Header Toolbar */}
            <div className="p-5 sm:p-6 border-b border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/30">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Layers className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        İndirme Listesi
                        <span className="soft-badge-indigo px-2.5 py-0.5 rounded-full text-xs font-bold">
                            {downloads.length}
                        </span>
                    </h3>

                    {/* Bulk Actions Header Toolbar */}
                    <AnimatePresence>
                        {selectedCompletedItems.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={handleBulkDownload}
                                className="ml-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                                title="Seçilen Hazır Dosyaları Toplu İndir"
                            >
                                <Download className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Seçilenleri İndir ({selectedCompletedItems.length})</span>
                            </motion.button>
                        )}

                        {selectedUuids.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={handleConfirmBulkDelete}
                                className="ml-2 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                                title="Seçilenleri Toplu Sil"
                            >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                <span>Seçilenleri Sil ({selectedUuids.length})</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Dosya adı veya link ara..."
                            className="w-full soft-input rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-white/5 w-full sm:w-auto overflow-x-auto">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onStatusFilterChange(tab.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${statusFilter === tab.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
                        <tr>
                            <th className="py-4 px-4 w-10 text-center">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={handleSelectAllToggle}
                                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4 accent-indigo-600"
                                    title="Tümünü Seç / Kaldır"
                                />
                            </th>
                            <th className="py-4 px-6">Dosya Bilgisi</th>
                            <th className="py-4 px-6">Boyut / İlerleme</th>
                            <th className="py-4 px-6">Durum</th>
                            <th className="py-4 px-6">Tarih</th>
                            <th className="py-4 px-6 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        <AnimatePresence>
                            {paginatedDownloads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-slate-500">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-300">
                                                Herhangi bir indirme kaydı bulunamadı.
                                            </p>
                                            <p className="text-xs text-slate-400 max-w-sm">
                                                Yeni bir link ekleyerek önbelleğe alabilir veya anında indirebilirsiniz.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedDownloads.map((item) => {
                                    const statusCfg = getStatusConfig(item.status);
                                    const isSelected = selectedUuids.includes(item.uuid);
                                    return (
                                        <motion.tr
                                            key={item.uuid}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`transition group ${isSelected ? 'bg-indigo-500/[0.06]' : 'hover:bg-white/[0.02]'}`}
                                        >
                                            {/* Checkbox */}
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleItemSelectToggle(item.uuid)}
                                                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4 accent-indigo-600"
                                                />
                                            </td>

                                            {/* File Info */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1 max-w-md">
                                                    <span
                                                        className="font-bold text-slate-100 truncate text-xs group-hover:text-indigo-300 transition"
                                                        title={item.filename || 'Dönüştürülüyor...'}
                                                    >
                                                        {item.filename || 'Dosya bilgisi bekleniyor...'}
                                                    </span>
                                                    <span
                                                        className="text-[11px] font-mono text-slate-400 truncate opacity-80"
                                                        title={item.original_link}
                                                    >
                                                        {item.original_link}
                                                    </span>

                                                    {isSuperUser && item.user && (
                                                        <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-semibold mt-0.5">
                                                            <UserIcon className="w-3 h-3 text-indigo-400" />
                                                            <span>{item.user.name}</span>
                                                            <span className="text-slate-500">({item.user_ip || 'N/A'})</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Progress Bar */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1.5 w-36">
                                                    <div className="flex justify-between text-[11px] font-mono">
                                                        <span className="text-slate-200 font-bold">
                                                            {item.formatted_downloaded || '0 B'}
                                                        </span>
                                                        <span className="text-slate-400">
                                                            / {item.formatted_filesize || '0 B'}
                                                        </span>
                                                    </div>

                                                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-300 ${item.status === 'completed'
                                                                ? 'bg-emerald-400'
                                                                : item.status === 'failed'
                                                                    ? 'bg-rose-500'
                                                                    : 'bg-indigo-500 animate-pulse'
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
                                                        className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${statusCfg.badgeClass}`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                                                        {statusCfg.label}
                                                        {item.status === 'downloading' && (
                                                            <span>(%{item.progress_percentage})</span>
                                                        )}
                                                    </span>

                                                    {item.status === 'downloading' && item.formatted_eta && (
                                                        <span className="text-[10px] font-mono text-indigo-300 font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20" title="Tahmini Kalan Süre">
                                                            ⏱ {item.formatted_eta}
                                                        </span>
                                                    )}

                                                    {isSuperUser && item.user_count > 1 && (
                                                        <span
                                                            className="soft-badge-indigo px-2 py-0.5 rounded-full text-[9px] font-bold"
                                                            title={`${item.user_count} kullanıcı bu önbelleği paylaşıyor`}
                                                        >
                                                            {item.user_count}x Ortak
                                                        </span>
                                                    )}
                                                </div>

                                                {item.status === 'failed' && item.error_message && (
                                                    <p
                                                        className="text-[10px] text-rose-400 mt-1 max-w-[150px] truncate font-medium block"
                                                        title={item.error_message}
                                                    >
                                                        {item.error_message.replace(/^Real-Debrid Unrestrict Hatası/, 'Hata')}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Created Date */}
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
                                                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                                                                title="Doğrudan Yüksek Hızlı İndir"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                                <span>İndir</span>
                                                            </a>

                                                            <button
                                                                onClick={() => {
                                                                    const fullUrl = item.download_url.startsWith('http://') || item.download_url.startsWith('https://')
                                                                        ? item.download_url
                                                                        : window.location.origin + (item.download_url.startsWith('/') ? '' : '/') + item.download_url;
                                                                    onCopyLink(fullUrl, 'Doğrudan İndirme Bağlantısı');
                                                                }}
                                                                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition cursor-pointer"
                                                                title="İndirme Bağlantısını Kopyala"
                                                            >
                                                                <Copy className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {isSuperUser && item.status === 'failed' && (
                                                        <button
                                                            onClick={() => onRetry(item.uuid)}
                                                            className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                                                        >
                                                            <RefreshCw className="w-3.5 h-3.5" />
                                                            <span>Yeniden Dene</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => onDelete(item.uuid)}
                                                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
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

            {/* Pagination Controls Footer */}
            {totalItems > 0 && (
                <div className="p-4 sm:px-6 border-t border-white/[0.06] bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-4 flex-wrap">
                        <span>
                            Gösterilen: <strong className="text-slate-200">{startIndex + 1}</strong> - <strong className="text-slate-200">{endIndex}</strong> / <strong className="text-slate-200">{totalItems}</strong> kayıt
                        </span>

                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">Sayfa Başına:</span>
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={safePage === 1}
                                className="p-1.5 rounded-lg border border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                title="İlk Sayfa"
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                                className="p-1.5 rounded-lg border border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                title="Önceki Sayfa"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1 px-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                                    .reduce((acc, p, i, arr) => {
                                        if (i > 0 && p - arr[i - 1] > 1) {
                                            acc.push('...');
                                        }
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((item, idx) =>
                                        item === '...' ? (
                                            <span key={`dots-${idx}`} className="px-1 text-slate-600">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={item}
                                                onClick={() => setCurrentPage(item)}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${safePage === item
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'border border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        )
                                    )}
                            </div>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                                className="p-1.5 rounded-lg border border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                title="Sonraki Sayfa"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={safePage === totalPages}
                                className="p-1.5 rounded-lg border border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                title="Son Sayfa"
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
