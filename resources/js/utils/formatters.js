/**
 * Utility functions for TSI Debrid UI formatting and helpers
 */

export const formatBytes = (bytes = 0, decimals = 2) => {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    } catch {
        return dateString;
    }
};

export const getHosterName = (url) => {
    if (!url) return 'Bilinmeyen Sunucu';
    const lower = url.toLowerCase();
    if (lower.includes('mega.nz') || lower.includes('mega.co.nz')) return 'MEGA';
    if (lower.includes('rapidgator.net') || lower.includes('rg.to')) return 'Rapidgator';
    if (lower.includes('turbobit.net')) return 'Turbobit';
    if (lower.includes('1fichier.com')) return '1Fichier';
    if (lower.includes('ddownload.com')) return 'DDownload';
    if (lower.includes('katfile.com')) return 'Katfile';
    if (lower.includes('nitroflare.com')) return 'Nitroflare';
    if (lower.includes('filefactory.com')) return 'FileFactory';
    if (lower.includes('mediafire.com')) return 'Mediafire';
    
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        return domain;
    } catch {
        return 'Web Link';
    }
};

export const getStatusConfig = (status) => {
    switch (status) {
        case 'completed':
            return {
                label: 'Önbellekte Hazır',
                badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                dotClass: 'bg-emerald-400',
                icon: 'CheckCircle2',
            };
        case 'downloading':
            return {
                label: 'İndiriliyor',
                badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 animate-pulse',
                dotClass: 'bg-indigo-400',
                icon: 'RefreshCw',
            };
        case 'unrestricting':
            return {
                label: 'Link Dönüştürülüyor',
                badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                dotClass: 'bg-amber-400',
                icon: 'Clock',
            };
        case 'pending':
            return {
                label: 'Sıraya Alındı',
                badgeClass: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
                dotClass: 'bg-slate-400',
                icon: 'Clock',
            };
        case 'failed':
            return {
                label: 'Başarısız',
                badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                dotClass: 'bg-rose-400',
                icon: 'AlertCircle',
            };
        default:
            return {
                label: status || 'İşleniyor',
                badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
                dotClass: 'bg-slate-400',
                icon: 'Info',
            };
    }
};
