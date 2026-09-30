import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, HardDrive, Sparkles, Server } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function StatsGrid({ stats = {}, isSuperUser = false }) {
    const items = [
        {
            title: 'Toplam İndirme',
            value: stats.total_downloads || 0,
            unit: 'İşlem',
            subtitle: 'İşlenen talepler',
            icon: Download,
            iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            valColor: 'text-slate-100',
        },
        {
            title: 'Önbellekte Hazır',
            value: stats.completed_downloads || 0,
            unit: 'Dosya',
            subtitle: 'Anında indirmeye hazır',
            icon: CheckCircle2,
            iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            valColor: 'text-emerald-400',
        },
        {
            title: 'Sunucu Önbelleği',
            value: formatBytes(stats.total_bytes_cached),
            unit: '',
            subtitle: 'Disk üzerinde saklanan',
            icon: HardDrive,
            iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
            valColor: 'text-sky-300',
        },
        {
            title: 'Tasarruf Edilen RD',
            value: stats.total_saved_rd_requests || 0,
            unit: 'İstek',
            subtitle: 'Engellenen API trafiği',
            icon: Sparkles,
            iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            valColor: 'text-amber-300',
        },
    ];

    if (isSuperUser) {
        items.push({
            title: 'Boş Disk Alanı',
            value: formatBytes(stats.free_disk_space),
            unit: '',
            subtitle: stats.total_disk_space ? `Toplam: ${formatBytes(stats.total_disk_space)}` : 'Sunucu kullanılabilir alan',
            icon: Server,
            iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
            valColor: 'text-violet-300',
        });
    }

    const gridCols = isSuperUser
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
        : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4';

    return (
        <div className={`grid ${gridCols} gap-3 sm:gap-3.5`}>
            {items.map((item, index) => {
                const IconComponent = item.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                        className="soft-card-hover rounded-2xl p-4 sm:p-4.5 relative overflow-hidden flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                {item.title}
                            </span>
                            <div className={`p-1.5 rounded-xl border shrink-0 ${item.iconBg}`}>
                                <IconComponent className="w-3.5 h-3.5" />
                            </div>
                        </div>

                        <div className="mt-2.5">
                            <div className="flex items-baseline gap-1.5">
                                <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${item.valColor}`}>
                                    {item.value}
                                </span>
                                {item.unit && (
                                    <span className="text-[11px] font-semibold text-slate-400">
                                        {item.unit}
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
                                {item.subtitle}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
