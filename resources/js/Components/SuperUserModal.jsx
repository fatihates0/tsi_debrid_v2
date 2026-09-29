import React from 'react';
import { motion } from 'framer-motion';
import { Shield, X, Trash2, User, HardDrive, Network } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function SuperUserModal({ userStats = [], onClose, onDeleteUser }) {
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
                                SuperUser Sistem Yönetimi
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Kullanıcı bazlı önbellek kullanımı, disk kotaları ve hesap sıfırlama
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

                {/* Users Table */}
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
            </motion.div>
        </div>
    );
}
