import React, { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import axios from 'axios';

import Header from '../Components/Header';
import StatsGrid from '../Components/StatsGrid';
import LinkSubmissionForm from '../Components/LinkSubmissionForm';
import DownloadList from '../Components/DownloadList';
import SuperUserModal from '../Components/SuperUserModal';
import RdStatusModal from '../Components/RdStatusModal';
import ToastContainer from '../Components/ToastContainer';

export default function Dashboard({
    downloads: initialDownloads,
    stats: initialStats,
    isSuperUser,
    userStats: initialUserStats,
    rdInfo: initialRdInfo,
    allowedHosts = [],
}) {
    const { auth, flash } = usePage().props;

    const [downloads, setDownloads] = useState(initialDownloads?.data || []);
    const [stats, setStats] = useState(initialStats || {});
    const [userStats, setUserStats] = useState(initialUserStats || []);
    const [rdInfo, setRdInfo] = useState(initialRdInfo || { loading: false });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toasts, setToasts] = useState([]);
    const [showSuperUserModal, setShowSuperUserModal] = useState(false);
    const [showRdModal, setShowRdModal] = useState(false);
    const [polling, setPolling] = useState(true);

    const { data, setData, post, processing, reset } = useForm({
        link: '',
    });

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Flash notifications
    useEffect(() => {
        if (flash?.success) addToast(flash.success, 'success');
        if (flash?.error) addToast(flash.error, 'error');
        if (flash?.info) addToast(flash.info, 'info');
        if (flash?.warning) addToast(flash.warning, 'warning');
    }, [flash, addToast]);

    // Polling live list updates
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

    const refreshRdStatus = async () => {
        setRdInfo((prev) => ({ ...prev, loading: true }));
        try {
            const res = await axios.get('/rd-status');
            setRdInfo(res.data);
            addToast('Real-Debrid hesap & proxy durumu güncellendi.', 'info');
        } catch {
            setRdInfo({ success: false, message: 'RD Durumu alınamadı' });
            addToast('Real-Debrid durumu alınırken hata oluştu.', 'error');
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
                addToast('Bağlantı başarıyla eklendi, önbellek işleniyor!', 'success');
                fetchAjaxUpdates();
            },
            onError: (errs) => {
                const msg = errs.link || Object.values(errs)[0] || 'Bağlantı eklenemedi.';
                addToast(msg, 'error');
            },
        });
    };

    const handleDeleteDownload = async (uuid) => {
        if (!confirm('Bu indirmeyi silmek veya iptal etmek istediğinize emin misiniz?')) return;
        try {
            const res = await axios.delete(`/downloads/${uuid}`);
            if (res.data?.success) {
                addToast('İndirme kaydı silindi.', 'success');
                fetchAjaxUpdates();
            }
        } catch (err) {
            addToast(err.response?.data?.message || 'Silme işlemi başarısız.', 'error');
        }
    };

    const handleBulkDeleteDownload = async (uuids) => {
        if (!uuids || uuids.length === 0) return;
        try {
            const res = await axios.delete('/downloads/bulk-delete', {
                data: { uuids },
            });
            if (res.data?.success) {
                addToast(res.data.message || `${uuids.length} adet indirme kaydı silindi.`, 'success');
                fetchAjaxUpdates();
            }
        } catch (err) {
            addToast(err.response?.data?.message || 'Toplu silme işlemi başarısız oldu.', 'error');
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
        if (!confirm(`${userName} kullanıcısını ve tüm indirme verilerini silmek istediğinize emin misiniz?`))
            return;
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
        addToast(`${label} panoya kopyalandı! IDM ile doğrudan kullanabilirsiniz.`, 'success');
    };

    // Filter downloads list
    const filteredDownloads = downloads.filter((item) => {
        const matchesSearch =
            item.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.original_link?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.uuid?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans bg-grid-pattern relative">
            <Head title="Kontrol Paneli - TSI Debrid" />

            {/* Glowing Mesh Orbs */}
            <div className="fixed top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
            <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

            {/* Toasts */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Header Navbar */}
            <Header
                auth={auth}
                rdInfo={rdInfo}
                isSuperUser={isSuperUser}
                onRefreshRd={() => {
                    refreshRdStatus();
                    setShowRdModal(true);
                }}
                onOpenSuperUser={() => setShowSuperUserModal(true)}
            />

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8 relative z-10">
                {/* System Overview Stats Grid */}
                <StatsGrid stats={stats} isSuperUser={isSuperUser} />

                {/* Link Submission Card */}
                <LinkSubmissionForm
                    link={data.link}
                    allowedHosts={allowedHosts}
                    onChangeLink={(val) => setData('link', val)}
                    onSubmit={handleSubmitLink}
                    processing={processing}
                />

                {/* Downloads List Table */}
                <DownloadList
                    downloads={filteredDownloads}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    isSuperUser={isSuperUser}
                    onSearchChange={setSearchTerm}
                    onStatusFilterChange={setStatusFilter}
                    onCopyLink={copyToClipboard}
                    onRetry={handleRetryDownload}
                    onDelete={handleDeleteDownload}
                    onBulkDelete={handleBulkDeleteDownload}
                />
            </main>

            {/* Modals */}
            {showSuperUserModal && (
                <SuperUserModal
                    userStats={userStats}
                    onClose={() => setShowSuperUserModal(false)}
                    onDeleteUser={handleDeleteUser}
                />
            )}

            {showRdModal && (
                <RdStatusModal
                    rdInfo={rdInfo}
                    onClose={() => setShowRdModal(false)}
                    onRefresh={refreshRdStatus}
                />
            )}
        </div>
    );
}
