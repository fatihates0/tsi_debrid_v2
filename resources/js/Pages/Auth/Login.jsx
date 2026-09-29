import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Lock, User, Zap, Shield, ArrowRight, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans bg-grid-pattern">
            <Head title="Giriş Yap - TSI Debrid" />

            {/* Glowing Ambient Mesh Orbs */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: 6 }}
                        whileTap={{ scale: 0.94 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-sky-400 p-0.5 shadow-2xl shadow-indigo-500/35 mb-4 cursor-pointer"
                    >
                        <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                            <Zap className="w-8 h-8 text-indigo-400 fill-indigo-400/20" />
                        </div>
                    </motion.div>

                    <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                        TSI <span className="gradient-text-indigo">DEBRID</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1.5">
                        turkcesesindir.com topluluk hesabınız ile anında giriş yapın
                    </p>
                </div>

                {/* Main Glass Card Form */}
                <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />

                    <form onSubmit={submit} className="space-y-5 relative z-10">
                        {/* Error Banner */}
                        {errors.login && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs font-medium flex items-start gap-3 shadow-lg shadow-rose-950/20"
                            >
                                <Shield className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                                <span className="leading-relaxed">{errors.login}</span>
                            </motion.div>
                        )}

                        {/* Login Username/Email Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Kullanıcı Adı veya E-posta
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    placeholder="Kullanıcı adınızı girin"
                                    className="w-full glass-input rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full glass-input rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me Toggle */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded-md bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 transition"
                                />
                                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition font-medium">
                                    Beni oturumda hatırla
                                </span>
                            </label>
                        </div>

                        {/* Submit Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 px-4 rounded-2xl font-bold text-sm text-white gradient-button shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {processing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Giriş Yap</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Features & Security Badges */}
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-2.5 text-xs text-slate-400 relative z-10">
                        <div className="flex items-center gap-2.5 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>XenForo MySQL doğrudan güvenli kimlik doğrulama</span>
                        </div>
                        <div className="flex items-center gap-2.5 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span>Sıfır ek Real-Debrid API harcaması, akıllı önbellek</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
