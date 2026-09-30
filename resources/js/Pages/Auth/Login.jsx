import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Lock, User, Zap, Shield, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
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
        <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <Head title="Giriş Yap - TSI Debrid" />

            {/* Soft Ambient Radial Orbs */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/10 mb-4 cursor-pointer">
                        <Zap className="w-8 h-8 text-indigo-400 fill-indigo-400/20" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                        TSI <span className="text-indigo-400 font-extrabold">DEBRID</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1.5">
                        turkcesesindir.com hesabınızla hızlı ve güvenli giriş yapın
                    </p>
                </div>

                {/* Login Card */}
                <div className="soft-card rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <form onSubmit={submit} className="space-y-5 relative z-10">
                        {/* Errors */}
                        {errors.login && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-start gap-2.5"
                            >
                                <Shield className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                                <span>{errors.login}</span>
                            </motion.div>
                        )}

                        {/* Login Field */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Kullanıcı Adı veya E-posta
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    placeholder="Kullanıcı adınızı girin"
                                    className="w-full soft-input rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full soft-input rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
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

                        {/* Remember Me */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500 transition"
                                />
                                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition font-medium">
                                    Beni oturumda hatırla
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 px-4 rounded-2xl font-bold text-sm text-white soft-gradient-primary transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {processing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Giriş Yap</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Features Badges */}
                    <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-2 text-xs text-slate-400 relative z-10">
                        <div className="flex items-center gap-2.5 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>XenForo MySQL doğrudan güvenli doğrulama</span>
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
