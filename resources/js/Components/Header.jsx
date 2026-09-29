import React from 'react';
import { router } from '@inertiajs/react';
import { Zap, Crown, Network, RefreshCw, Shield, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header({ auth, rdInfo, isSuperUser, onRefreshRd, onOpenSuperUser }) {
    return (
        <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
                {/* Logo & Branding */}
                <div className="flex items-center gap-3.5">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/25 cursor-pointer"
                    >
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                            <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                        </div>
                    </motion.div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                                TSI <span className="gradient-text-indigo">DEBRID</span>
                            </h1>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tracking-wide">
                                v2.0
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                            Yüksek Hızlı Önbellek & Debrid İndirme Portalı
                        </p>
                    </div>
                </div>

                {/* Header Action Items */}
                <div className="flex items-center gap-3">
                    {/* RD Status Badge Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onRefreshRd}
                        className="glass-panel-interactive px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs transition group"
                        title="Real-Debrid hesap durumunu yenile"
                    >
                        <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="font-bold text-white leading-tight">
                                {rdInfo.loading
                                    ? 'Sorgulanıyor...'
                                    : rdInfo.success
                                    ? 'Real-Debrid Premium'
                                    : 'RD Bağlantı Hatası'}
                            </span>
                            {isSuperUser && (
                                <span className="text-[10px] font-mono text-indigo-300/80 flex items-center gap-1">
                                    <Network className="w-2.5 h-2.5 text-indigo-400" />
                                    <span>IP: {rdInfo.active_proxy || 'Doğrudan'}</span>
                                </span>
                            )}
                        </div>
                        <RefreshCw
                            className={`w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition ml-1 ${
                                rdInfo.loading ? 'animate-spin' : ''
                            }`}
                        />
                    </motion.button>

                    {/* SuperUser Admin Panel Trigger */}
                    {isSuperUser && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onOpenSuperUser}
                            className="px-3.5 py-2 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-950/40"
                        >
                            <Shield className="w-4 h-4 text-indigo-400" />
                            <span className="hidden sm:inline">Kullanıcı Yönetimi</span>
                        </motion.button>
                    )}

                    {/* User Profile Info & Logout */}
                    {auth?.user && (
                        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                            <div className="flex items-center gap-2.5">
                                {auth.user.avatar_url ? (
                                    <img
                                        src={auth.user.avatar_url}
                                        alt={auth.user.name}
                                        className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover ring-2 ring-indigo-500/20"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 border border-indigo-400/30 flex items-center justify-center text-xs font-black text-white shadow-md">
                                        {auth.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="hidden md:flex flex-col text-left">
                                    <span className="text-xs font-bold text-white leading-tight">
                                        {auth.user.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        turkcesesindir.com
                                    </span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => router.post('/logout')}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
                                title="Güvenli Çıkış Yap"
                            >
                                <LogOut className="w-4 h-4" />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
