<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Get a setting value by key.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember("setting_{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();

            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value by key.
     */
    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => (string) $value]
        );

        Cache::forget("setting_{$key}");
    }

    /**
     * Get all limit settings as key-value pairs with default fallbacks.
     */
    public static function getLimits(): array
    {
        $maxConcurrent = static::get('max_concurrent_links', null);
        $maxFilesize = static::get('max_filesize_mb', null);

        return [
            'max_concurrent_links' => $maxConcurrent !== null && $maxConcurrent !== '' ? (int) $maxConcurrent : null,
            'max_filesize_mb' => $maxFilesize !== null && $maxFilesize !== '' ? (int) $maxFilesize : null,
        ];
    }

    /**
     * Check if the user is allowed to add new concurrent download links.
     * Returns null if allowed, or error message string if blocked.
     */
    public static function checkConcurrentLimit(?User $user, int $newLinkCount = 1): ?string
    {
        if ($user?->isSuperUser()) {
            return null;
        }

        $maxConcurrent = static::get('max_concurrent_links', null);
        if ($maxConcurrent === null || $maxConcurrent === '') {
            return null;
        }

        $max = (int) $maxConcurrent;

        if ($max === 0) {
            return 'Sistem yöneticisi tarafından yeni bağlantı önbellekleme kapatılmıştır (Maksimum link sınırı: 0).';
        }

        if ($user && $max > 0) {
            $activeCount = DebridDownload::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'unrestricting', 'downloading'])
                ->count();

            if (($activeCount + $newLinkCount) > $max) {
                return "Aynı anda en fazla {$max} adet aktif önbellekleme yapabilirsiniz (Şu an {$activeCount} adet aktif işleminiz var).";
            }
        }

        return null;
    }

    /**
     * Check if a file size exceeds the allowed max filesize limit.
     * Returns null if allowed, or error message string if blocked.
     */
    public static function checkFilesizeLimit(?User $user, int $filesizeBytes): ?string
    {
        if ($user?->isSuperUser()) {
            return null;
        }

        $maxFilesizeMb = static::get('max_filesize_mb', null);
        if ($maxFilesizeMb === null || $maxFilesizeMb === '' || (int) $maxFilesizeMb <= 0) {
            return null;
        }

        $maxBytes = (int) $maxFilesizeMb * 1024 * 1024;
        if ($filesizeBytes > $maxBytes) {
            $fileMb = round($filesizeBytes / (1024 * 1024), 2);

            return "Dosya boyutu ({$fileMb} MB), sistem yöneticisi tarafından belirlenen maksimum sınırı ({$maxFilesizeMb} MB) aşıyor.";
        }

        return null;
    }
}
