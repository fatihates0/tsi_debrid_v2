import React, { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import {
    Zap, Crown, Network, HardDrive, Download, RefreshCw, Trash2,
    CheckCircle2, AlertTriangle, XCircle, Info, ExternalLink, Copy,
    LogOut, User as UserIcon, Shield, Search, Filter, Layers, Server,
    ChevronRight, ArrowDownToLine, Clock, Sparkles, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function Dashboard({ downloads: initialDownloads, stats: initialStats, isSuperUser, userStats: initialUserStats, rdInfo: initialRdInfo }) {
    const { auth, flash } = usePage().props;
    const [downloads, setDownloads] = useState(initialDownloads?.data || []);
    const [stats, setStats] = useState(initialStats || {});
    const [userStats, setUserStats] = useState(initialUserStats || []);
    const [rdInfo, setRdInfo] = useState(initialRdInfo || { loading: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toasts, setToasts] = useState([]);
    const [showSuperUserModal, setShowSuperUserModal] = useState(false);
    const [selectedCopyLink, setSelectedCopyLink] = useState(null);
    const [polling, setPolling] = useState(true);

    const { data, setData, post, processing, reset, errors } = useForm({
        link: '',
        use_remote: true,
    });

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    // Handle initial flash messages
    useEffect(() => {
        if (flash?.success) addToast(flash.success, 'success');
        if (flash?.error) addToast(flash.error, 'error');
        if (flash?.info) addToast(flash.info, 'info');
        if (flash?.warning) addToast(flash.warning, 'warning');
    }, [flash, addToast]);

    // Live AJAX Polling
    const fetchAjaxUpdates = useCallback(async () => {
        try {
            const res = await axios.get('/downloads/ajax-list');
            if (res.data?.success) {
                setDownloads(res.data.data || []);
                if (res.data.stats) {
                    setStats(res.data.stats);
                }
            }
        } catch (err) {
            console.error('Polling error:', err);
        }
    }, []);

    // Refresh Real-Debrid status
    const refreshRdStatus = async () => {
        setRdInfo((prev) => ({ ...prev, loading: true }));
        try {
            const res = await axios.get('/rd-status');
            setRdInfo(res.data);
            addToast('Real-Debrid hesap durumu güncellendi.', 'info');
        } catch (err) {
            setRdInfo({ success: false, message: 'RD Durumu alınamadı' });
        }
    };

    useEffect(() => {
        if (!polling) return;
        const interval = setInterval(fetchAjaxUpdates, 2500);
        return () => clearInterval(interval);
    }, [polling, fetchAjaxUpdates]);

    const handleSubmitLink = (e) => {
        e.preventDefault();
        if (!data.link.trim()) return;

        post('/downloads', {
            onSuccess: () => {
                reset('link');
                fetchAjaxUpdates();
            },
            onError: (errs) => {
                const msg = errs.link || Object.values(errs)[0] || 'Bağlantı eklenemedi.';
                addToast(msg, 'error');
            }
        });
    };

    const handleDeleteDownload = async (uuid) => {
        if (!confirm('Bu indirmeyi silmek veya iptal etmek istediğinize emin misiniz?')) return;
        try {
            const res = await axios.delete(`/downloads/${uuid}`);
            if (res.data?.success) {
                addToast('İndirme silindi.', 'success');
                fetchAjaxUpdates();
            }
        } catch (err) {
            addToast(err.response?.data?.message || 'Silme işlemi başarısız.', 'error');
        }
    };

    const handleRetryDownload = async (uuid) => {
        try {
            const res = await axios.post(`/downloads/${uuid}/retry`);
            if (res.data?.success) {
                addToast('İndirme yeniden başlatıldı!', 'success');
                fetchAjaxUpdates();
            }
        } catch (err) {
            addToast(err.response?.data?.message || 'Yeniden başlatılamadı.', 'error');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`${userName} kullanıcısını ve tüm indirme verilerini silmek istediğinize emin misiniz?`)) return;
        try {
            const res = await axios.delete(`/users/${userId}`);
            if (res.data?.success) {
                addToast(res.data.message, 'success');
                setUserStats((prev) => prev.filter((u) => u.id !== userId));
                fetchAjaxUpdates();
            }
        } catch (err) {
            addToast(err.response?.data?.message || 'Kullanıcı silinemedi.', 'error');
        }
    };

    const copyToClipboard = (text, label = 'Bağlantı') => {
        navigator.clipboard.writeText(text);
        addToast(`${label} panoya kopyalandı!`, 'success');
    };

    const formatBytes = (bytes) => {
        bytes = bytes || 0;
        if (bytes <= 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + (units[i] || 'B');
    };

    // Filter downloads
    const filteredDownloads = downloads.filter((item) => {
        const matchesSearch = item.filename?.toLowerCase().includes(searchTerm.toLowerCase())
            || item.original_link?.toLowerCase().includes(searchTerm.toLowerCase())
            || item.uuid?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Head title="Kontrol Paneli - TSI Debrid" />

            {/* Toast Container */}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 text-xs font-medium ${
                                toast.type === 'success' ? 'bg-slate-900/95 border-emerald-500/30 text-emerald-300 shadow-emerald-950/40' :
                                toast.type === 'error' ? 'bg-slate-900/95 border-rose-500/30 text-rose-300 shadow-rose-950/40' :
                                toast.type === 'warning' ? 'bg-slate-900/95 border-amber-500/30 text-amber-300 shadow-amber-950/40' :
                                'bg-slate-900/95 border-indigo-500/30 text-indigo-300 shadow-indigo-950/40'
                            }`}
                        >
                            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />}
                            {toast.type === 'error' && <XCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />}
                            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />}
                            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />}
                            <div className="flex-1 leading-relaxed">{toast.message}</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* TOP HEADER */}
            <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20">
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                                TSI <span className="gradient-text">DEBRID v2</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* RD Status Badge */}
                        <button
                            onClick={refreshRdStatus}
                            className="glass-card hover:bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-indigo-500/20 flex items-center gap-2.5 text-xs transition group"
                            title="Yenilemek için tıklayın"
                        >
                            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                            <div className="flex flex-col items-start text-left">
                                <span className="font-bold text-white leading-tight">
                                    {rdInfo.loading ? 'Sorgulanıyor...' : (rdInfo.success ? 'Real-Debrid Premium' : 'RD Bağlantı Hatası')}
                                </span>
                                {isSuperUser && (
                                    <span className="text-[10px] font-mono text-indigo-300/80 flex items-center gap-1">
                                        <Network className="w-2.5 h-2.5 text-indigo-400" />
                                        <span>IP: {rdInfo.active_proxy || 'Doğrudan'}</span>
                                    </span>
                                )}
                            </div>
                            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition ${rdInfo.loading ? 'animate-spin' : ''}`} />
                        </button>

                        {/* SuperUser Admin Button */}
                        {isSuperUser && (
                            <button
                                onClick={() => setShowSuperUserModal(true)}
                                className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-2 transition"
                            >
                                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Kullanıcı Yönetimi</span>
                            </button>
                        )}

                        {/* User Profile & Logout */}
                        {auth.user && (
                            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                                <div className="flex items-center gap-2.5">
                                    {auth.user.avatar_url ? (
                                        <img src={auth.user.avatar_url} alt="" className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
                                            {auth.user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="hidden sm:flex flex-col text-left">
                                        <span className="text-xs font-bold text-white leading-tight">{auth.user.name}</span>
                                        <span className="text-[10px] text-slate-400">turkcesesindir.com</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.post('/logout')}
                                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                    title="Çıkış Yap"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN CONTAINER */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
                {/* SYSTEM STATS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <Download className="w-12 h-12 text-indigo-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam İndirme</span>
                        <div className="text-2xl font-black text-white mt-1">{stats.total_downloads || 0}</div>
                        <div className="text-[11px] text-indigo-400 font-medium mt-1">İşlenen tüm talepler</div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Önbellekte Hazır</span>
                        <div className="text-2xl font-black text-emerald-400 mt-1">{stats.completed_downloads || 0}</div>
                        <div className="text-[11px] text-emerald-400/80 font-medium mt-1">Anında indirilebilir</div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <HardDrive className="w-12 h-12 text-sky-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sunucu Önbelleği</span>
                        <div className="text-2xl font-black text-sky-400 mt-1">{formatBytes(stats.total_bytes_cached)}</div>
                        <div className="text-[11px] text-sky-400/80 font-medium mt-1">Disk üzerinde saklanan</div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                            <Sparkles className="w-12 h-12 text-amber-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasarruf Edilen RD</span>
                        <div className="text-2xl font-black text-amber-400 mt-1">{stats.total_saved_rd_requests || 0}</div>
                        <div className="text-[11px] text-amber-400/80 font-medium mt-1">Engellenen API kotası</div>
                    </div>
                </div>

                {/* LINK SUBMISSION CARD */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                            <ArrowDownToLine className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Yeni İndirme Bağlantısı Ekle</h2>
                            <p className="text-xs text-slate-400">
                                Mega, Rapidgator, Turbobit veya desteklenen herhangi bir indirme linkini yapıştırın
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitLink} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="url"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                    placeholder="https://mega.nz/file/... veya https://rapidgator.net/file/..."
                                    className="w-full glass-input rounded-2xl px-5 py-4 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-4 rounded-2xl font-bold text-sm text-white gradient-bg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:opacity-95 transition flex items-center justify-center gap-2.5 shrink-0 disabled:opacity-50"
                            >
                                {processing ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4 fill-white" />
                                        <span>İndirmeyi Başlat</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.use_remote}
                                    onChange={(e) => setData('use_remote', e.target.checked)}
                                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>Uzaktan Trafik (Remote Traffic = 1) kullan (Önerilen)</span>
                            </label>
                            <span className="text-[11px] text-slate-500 hidden sm:inline">
                                Önbellekteki dosyalar sınırsız hızla 7 gün saklanır
                            </span>
                        </div>
                    </form>
                </div>

                {/* DOWNLOADS LIST TABLE */}
                <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl space-y-0">
                    {/* Filter & Search Bar */}
                    <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-400" />
                                İndirme Listesi ({filteredDownloads.length})
                            </h3>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Search */}
                            <div className="relative flex-1 sm:w-64">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Dosya adı veya link ara..."
                                    className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="glass-input rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none bg-slate-900 border-white/10"
                            >
                                <option value="all">Tüm Durumlar</option>
                                <option value="completed">Tamamlananlar</option>
                                <option value="downloading">İndirilenler</option>
                                <option value="pending">Bekleyenler</option>
                                <option value="failed">Hatalı olanlar</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-white/5">
                                <tr>
                                    <th className="py-4 px-6">Dosya Bilgisi</th>
                                    <th className="py-4 px-6">Boyut / İlerleme</th>
                                    <th className="py-4 px-6">Durum</th>
                                    <th className="py-4 px-6">Tarih</th>
                                    <th className="py-4 px-6 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredDownloads.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-500">
                                            İndirme kaydı bulunamadı.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDownloads.map((item) => (
                                        <tr key={item.uuid} className="hover:bg-white/[0.02] transition group">
                                            {/* File Info */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1 max-w-md">
                                                    <span className="font-bold text-white truncate text-xs" title={item.filename || 'Dönüştürülüyor...'}>
                                                        {item.filename || 'Dosya bilgisi bekleniyor...'}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-slate-400 truncate opacity-70" title={item.original_link}>
                                                        {item.original_link}
                                                    </span>
                                                    {isSuperUser && item.user && (
                                                        <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-semibold">
                                                            <UserIcon className="w-3 h-3" />
                                                            {item.user.name} ({item.user_ip || 'N/A'})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Size / Progress */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1.5 w-36">
                                                    <div className="flex justify-between text-[11px] font-mono">
                                                        <span>{item.formatted_downloaded || '0 B'}</span>
                                                        <span className="text-slate-400">{item.formatted_filesize || '0 B'}</span>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                                        <div
                                                            className={`h-full transition-all duration-300 ${
                                                                item.status === 'completed' ? 'bg-emerald-500' :
                                                                item.status === 'failed' ? 'bg-rose-500' :
                                                                'bg-indigo-500 animate-pulse'
                                                            }`}
                                                            style={{ width: `${item.progress_percentage || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    {item.status === 'completed' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Önbellekte Hazır
                                                        </span>
                                                    )}
                                                    {item.status === 'downloading' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1 animate-pulse">
                                                            <RefreshCw className="w-3 h-3 animate-spin" /> İndiriliyor (%{item.progress_percentage})
                                                        </span>
                                                    )}
                                                    {item.status === 'unrestricting' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                                            <Clock className="w-3 h-3 animate-spin" /> Link Dönüştürülüyor
                                                        </span>
                                                    )}
                                                    {item.status === 'pending' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> Sıraya Alındı
                                                        </span>
                                                    )}
                                                    {item.status === 'failed' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1" title={item.error_message}>
                                                            <AlertCircle className="w-3 h-3" /> Başarısız
                                                        </span>
                                                    )}

                                                    {item.user_count > 1 && (
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300" title={`${item.user_count} kullanıcı bu önbelleği paylaşıyor`}>
                                                            {item.user_count}x Ortak
                                                        </span>
                                                    )}
                                                </div>
                                                {item.status === 'failed' && item.error_message && (
                                                    <p className="text-[10px] text-rose-400/80 mt-1 max-w-xs truncate" title={item.error_message}>
                                                        {item.error_message}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Created At */}
                                            <td className="py-4 px-6 text-slate-400 text-[11px] font-mono">
                                                {new Date(item.created_at).toLocaleString('tr-TR')}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {item.status === 'completed' && item.download_url && (
                                                        <>
                                                            <a
                                                                href={item.download_url}
                                                                download
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                                <span>İndir (IDM)</span>
                                                            </a>
                                                            <button
                                                                onClick={() => copyToClipboard(window.location.origin + item.download_url, 'İndirme Bağlantısı')}
                                                                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                                                                title="Direkt İndirme Linkini Kopyala"
                                                            >
                                                                <Copy className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {isSuperUser && item.status === 'failed' && (
                                                        <button
                                                            onClick={() => handleRetryDownload(item.uuid)}
                                                            className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold text-xs flex items-center gap-1 transition"
                                                        >
                                                            <RefreshCw className="w-3.5 h-3.5" />
                                                            <span>Yeniden Dene</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDeleteDownload(item.uuid)}
                                                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                                        title="Sil / İptal Et"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* SUPERUSER ADMIN MODAL */}
            {showSuperUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-3xl max-w-4xl w-full p-6 border border-white/10 shadow-2xl space-y-6 max-h-[90vh] flex flex-col"
                    >
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">SuperUser Sistem Yönetimi</h3>
                                    <p className="text-xs text-slate-400">Kullanıcı bazlı disk kullanımı ve hesap kontrolü</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSuperUserModal(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-white transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-white/5">
                                    <tr>
                                        <th className="py-3 px-4">Kullanıcı</th>
                                        <th className="py-3 px-4">E-posta</th>
                                        <th className="py-3 px-4">Önbellek Dosya Sayısı</th>
                                        <th className="py-3 px-4">Toplam Disk Kullanımı</th>
                                        <th className="py-3 px-4">Son IP</th>
                                        <th className="py-3 px-4 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {userStats.map((u) => (
                                        <tr key={u.id} className="hover:bg-white/[0.02]">
                                            <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                                                {u.avatar_url && <img src={u.avatar_url} className="w-6 h-6 rounded-full" alt="" />}
                                                {u.name}
                                            </td>
                                            <td className="py-3 px-4 text-slate-400">{u.email}</td>
                                            <td className="py-3 px-4 font-mono">{u.total_cached || 0} adet</td>
                                            <td className="py-3 px-4 font-mono text-sky-400 font-bold">{formatBytes(u.total_bytes)}</td>
                                            <td className="py-3 px-4 font-mono text-slate-400">{u.last_ip}</td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold text-[11px] transition"
                                                >
                                                    Kullanıcıyı Sil
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
