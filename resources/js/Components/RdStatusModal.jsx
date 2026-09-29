import React from 'react';
import { motion } from 'framer-motion';
import { Crown, X, Network, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export default function RdStatusModal({ rdInfo = {}, onClose, onRefresh }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="glass-panel rounded-3xl max-w-md w-full p-6 border border-white/10 shadow-2xl space-y-5 relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Crown className="w-5 h-5 fill-amber-400/20" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-white">Real-Debrid Hesap Bilgisi</h3>
                            <p className="text-xs text-slate-400">Canlı sunucu & proxy bağlantı durumu</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3 relative z-10 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                        <span className="text-slate-400 font-medium">Hesap Türü</span>
                        <span className="font-bold text-amber-400 flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5" />
                            {rdInfo.type || 'Premium VIP'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                        <span className="text-slate-400 font-medium">Aktif Proxy IP</span>
                        <span className="font-mono font-bold text-indigo-300 flex items-center gap-1.5">
                            <Network className="w-3.5 h-3.5 text-indigo-400" />
                            {rdInfo.active_proxy || 'Doğrudan Bağlantı'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                        <span className="text-slate-400 font-medium">Bağlantı Sağlığı</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {rdInfo.success !== false ? 'Tam Operasyonel' : 'Bağlantı Hatası'}
                        </span>
                    </div>
                </div>

                <div className="pt-2 flex justify-end relative z-10">
                    <button
                        onClick={onRefresh}
                        className="w-full py-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                        <RefreshCw className={`w-4 h-4 ${rdInfo.loading ? 'animate-spin' : ''}`} />
                        <span>Durumu Şimdi Yenile</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
