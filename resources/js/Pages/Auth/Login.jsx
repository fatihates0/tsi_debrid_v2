import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Lock, User, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <Head title="Giriş Yap - TSI Debrid" />

            {/* Glowing background shapes */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 p-0.5 shadow-2xl shadow-indigo-500/30 mb-4">
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                            <Zap className="w-8 h-8 text-indigo-400 fill-indigo-400/20" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                        TSI <span className="gradient-text">DEBRID</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        turkcesesindir.com topluluk hesabı ile giriş yapın
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-2xl backdrop-blur-2xl">
                    <form onSubmit={submit} className="space-y-5">
                        {/* Errors summary */}
                        {errors.login && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-start gap-2.5"
                            >
                                <Shield className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                                <span>{errors.login}</span>
                            </motion.div>
                        )}

                        {/* Login field */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Kullanıcı Adı veya E-posta
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    placeholder="Kullanıcı adınız"
                                    className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                                />
                                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition">
                                    Beni hatırla
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white gradient-bg shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:opacity-95 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
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

                    {/* Features List */}
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-2 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>XenForo MySQL doğrudan güvenli kimlik doğrulama</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Sıfır ek Real-Debrid API harcaması, akıllı önbellek</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
