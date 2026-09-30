import React from 'react';
import { router } from '@inertiajs/react';
import { Zap, Crown, Network, RefreshCw, Shield, LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header({ auth, rdInfo, isSuperUser, onRefreshRd, onOpenSuperUser }) {
    return (
        <header className="border-b border-white/[0.06] bg-[#090d16]/80 backdrop-blur-2xl sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                {/* Brand Logo */}
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500/30 via-violet-500/20 to-sky-500/30 p-0.5 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 flex items-center justify-center cursor-pointer"
                    >
                        <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                            <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/30" />
                        </div>
                    </motion.div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                TSI <span className="text-indigo-400 font-extrabold">DEBRID</span>
                            </h1>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                Soft v2.5
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium hidden sm:block">
                            Kotasız Bağlantı İndirme Portalı
                        </p>
                    </div>
                </div>

                {/* Right Navigation Actions */}
                <div className="flex items-center gap-3">
                    {/* Real-Debrid Status Pill Button */}
                    <button
                        onClick={onRefreshRd}
                        className="soft-card-hover px-4 py-2 rounded-2xl flex items-center gap-3 text-xs transition cursor-pointer"
                        title="Hesap ve proxy durumunu yenile"
                    >
                        <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="font-semibold text-slate-200 leading-tight">
                                {rdInfo.loading
                                    ? 'Sorgulanıyor...'
                                    : rdInfo.success
                                        ? 'Real-Debrid Premium'
                                        : 'RD Bağlantı Hatası'}
                            </span>
                            {isSuperUser && (
                                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                    <Network className="w-3 h-3 text-indigo-400" />
                                    <span>IP: {rdInfo.active_proxy || 'Doğrudan'}</span>
                                </span>
                            )}
                        </div>
                        <RefreshCw
                            className={`w-3.5 h-3.5 text-slate-400 ml-1 transition ${rdInfo.loading ? 'animate-spin text-indigo-400' : 'hover:text-slate-200'
                                }`}
                        />
                    </button>

                    {/* Admin SuperUser Button */}
                    {isSuperUser && (
                        <button
                            onClick={onOpenSuperUser}
                            className="px-4 py-2 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                        >
                            <Shield className="w-4 h-4 text-indigo-400" />
                            <span className="hidden sm:inline">Kullanıcı Yönetimi</span>
                        </button>
                    )}

                    {/* Profile & Logout */}
                    {auth?.user && (
                        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                            <div className="flex items-center gap-2.5">
                                {auth.user.avatar_url ? (
                                    <img
                                        src={auth.user.avatar_url}
                                        alt=""
                                        className="w-9 h-9 rounded-full border border-indigo-500/30 object-cover ring-2 ring-indigo-500/10"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                                        {auth.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="hidden md:flex flex-col text-left">
                                    <span className="text-xs font-bold text-slate-200 leading-tight">
                                        {auth.user.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400">turkcesesindir.com</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.post('/logout')}
                                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                title="Çıkış Yap"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
