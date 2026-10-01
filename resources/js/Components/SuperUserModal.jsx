import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, X, Trash2, Users, Sliders, Save, CheckCircle, Info } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function SuperUserModal({
    userStats = [],
    systemLimits = {},
    onClose,
    onDeleteUser,
    onUpdateSettings,
}) {
    const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'users'
    const [limits, setLimits] = useState({
        max_concurrent_links: systemLimits.max_concurrent_links ?? '',
        max_filesize_mb: systemLimits.max_filesize_mb ?? '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const payload = {
                max_concurrent_links: limits.max_concurrent_links !== '' ? parseInt(limits.max_concurrent_links, 10) : null,
                max_filesize_mb: limits.max_filesize_mb !== '' ? parseInt(limits.max_filesize_mb, 10) : null,
            };

            await onUpdateSettings(payload);
            setSaveMessage({ type: 'success', text: 'Limitleme ayarları başarıyla kaydedildi!' });
        } catch (err) {
            setSaveMessage({ type: 'error', text: 'Ayarlar kaydedilirken bir hata oluştu.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(null), 4000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="glass-panel rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 max-h-[90vh] flex flex-col relative overflow-hidden"
            >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                    <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-white tracking-tight">
                                SuperUser Yönetim Paneli
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Önbellek ve dosya boyutu limitleri, kullanıcı hesap yönetimi ve kotaları
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Navigation Buttons */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 relative z-10">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                            activeTab === 'settings'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Sliders className="w-4 h-4" />
                        <span>Sistem Limitleme Ayarları</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                            activeTab === 'users'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>Kullanıcı Listesi & Kotalar ({userStats.length})</span>
                    </button>
                </div>

                {/* Tab Content 1: System Settings */}
                {activeTab === 'settings' && (
                    <div className="space-y-6 relative z-10 flex-1 overflow-y-auto pr-1">
                        <form onSubmit={handleSaveSettings} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Setting 1: Max Concurrent Links */}
                                <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3 relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                            <span>Eşzamanlı Önbellekleme Sınırı</span>
                                        </label>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                            Adet Sınırı
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={limits.max_concurrent_links}
                                        onChange={(e) => setLimits((prev) => ({ ...prev, max_concurrent_links: e.target.value }))}
                                        placeholder="Boş bırakılırsa sınırsız olur (0 = Hiç önbelleyemez)"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition font-mono"
                                    />
                                    <div className="flex items-start gap-1.5 text-[11px] text-slate-400 leading-relaxed">
                                        <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                        <span>
                                            Kullanıcıların aynı anda yürütülmekte olan maksimum önbellek/indirme sayısı.
                                            <strong className="text-amber-300 ml-1">"0" girilirse kullanıcılar hiçbir yeni bağlantı önbelleyemez.</strong>
                                        </span>
                                    </div>
                                </div>

                                {/* Setting 2: Max Filesize Limit */}
                                <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3 relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                            <span>Maksimum Dosya Boyutu Sınırı</span>
                                        </label>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
                                            MB Cinsinden
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={limits.max_filesize_mb}
                                        onChange={(e) => setLimits((prev) => ({ ...prev, max_filesize_mb: e.target.value }))}
                                        placeholder="Boş veya 0 yazılırsa sınırsız olur (Örn: 5000 = 5GB)"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition font-mono"
                                    />
                                    <div className="flex items-start gap-1.5 text-[11px] text-slate-400 leading-relaxed">
                                        <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                                        <span>
                                            Kullanıcıların önbellekleyebileceği tekil dosya boyutu sınırı (MB).
                                            <strong className="text-slate-300 ml-1">Örn: 5000 yazarsanız 5 GB üzeri dosyalar engellenir.</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status notification */}
                            {saveMessage && (
                                <div
                                    className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                        saveMessage.type === 'success'
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    }`}
                                >
                                    <CheckCircle className="w-4 h-4 shrink-0" />
                                    <span>{saveMessage.text}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tab Content 2: Users Table */}
                {activeTab === 'users' && (
                    <div className="overflow-y-auto flex-1 relative z-10 rounded-2xl border border-white/5">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950/90 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10 sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="py-3.5 px-4">Kullanıcı</th>
                                    <th className="py-3.5 px-4">E-posta</th>
                                    <th className="py-3.5 px-4">Önbellek Adedi</th>
                                    <th className="py-3.5 px-4">Disk Kullanımı</th>
                                    <th className="py-3.5 px-4">Son IP</th>
                                    <th className="py-3.5 px-4 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-slate-900/30">
                                {userStats.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/[0.03] transition">
                                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                                            {u.avatar_url ? (
                                                <img src={u.avatar_url} className="w-7 h-7 rounded-full object-cover border border-white/10" alt="" />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                                                    {u.name?.charAt(0)}
                                                </div>
                                            )}
                                            <span>{u.name}</span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{u.email}</td>
                                        <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                                            {u.total_cached || 0} adet
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-sky-400 font-bold">
                                            {formatBytes(u.total_bytes)}
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                                            {u.last_ip || 'N/A'}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={() => onDeleteUser(u.id, u.name)}
                                                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 transition flex items-center gap-1.5 ml-auto"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Kullanıcıyı Sil</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
