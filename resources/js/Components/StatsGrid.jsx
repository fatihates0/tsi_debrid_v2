import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, HardDrive, Sparkles } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function StatsGrid({ stats = {} }) {
    const statItems = [
        {
            title: 'Toplam İndirme',
            value: stats.total_downloads || 0,
            subtitle: 'İşlenen tüm talepler',
            icon: Download,
            iconColor: 'text-indigo-400',
            bgGlow: 'from-indigo-500/10 to-violet-500/5',
            borderColor: 'group-hover:border-indigo-500/30',
            valueColor: 'text-white',
        },
        {
            title: 'Önbellekte Hazır',
            value: stats.completed_downloads || 0,
            subtitle: 'Anında indirilebilir',
            icon: CheckCircle2,
            iconColor: 'text-emerald-400',
            bgGlow: 'from-emerald-500/10 to-teal-500/5',
            borderColor: 'group-hover:border-emerald-500/30',
            valueColor: 'gradient-text-emerald',
        },
        {
            title: 'Sunucu Önbelleği',
            value: formatBytes(stats.total_bytes_cached),
            subtitle: 'Disk üzerinde saklanan',
            icon: HardDrive,
            iconColor: 'text-sky-400',
            bgGlow: 'from-sky-500/10 to-blue-500/5',
            borderColor: 'group-hover:border-sky-500/30',
            valueColor: 'text-sky-400',
        },
        {
            title: 'Tasarruf Edilen RD',
            value: stats.total_saved_rd_requests || 0,
            subtitle: 'Engellenen API kotası',
            icon: Sparkles,
            iconColor: 'text-amber-400',
            bgGlow: 'from-amber-500/10 to-orange-500/5',
            borderColor: 'group-hover:border-amber-500/30',
            valueColor: 'gradient-text-amber',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
            {statItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{ y: -3 }}
                        className={`glass-panel rounded-3xl p-5 relative overflow-hidden group border border-white/10 ${item.borderColor} transition-all duration-300 shadow-xl`}
                    >
                        {/* Background subtle gradient glow */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${item.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                        />

                        <div className="flex items-start justify-between relative z-10">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                {item.title}
                            </span>
                            <div className="p-2 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
                            </div>
                        </div>

                        <div className="mt-3 relative z-10">
                            <div className={`text-2xl sm:text-3xl font-black ${item.valueColor} tracking-tight`}>
                                {item.value}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                                <span>{item.subtitle}</span>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
