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
     * Get configured max link capacity for a user.
     * Returns null if unlimited (e.g. superuser or setting not configured).
     */
    public static function getMaxLimit(?User $user): ?int
    {
        if ($user?->isSuperUser()) {
            return null;
        }

        $maxConcurrent = static::get('max_concurrent_links', null);
        if ($maxConcurrent === null || $maxConcurrent === '') {
            return null;
        }

        return (int) $maxConcurrent;
    }

    /**
     * Get remaining available link slots in download list for a user.
     * Returns null if unlimited.
     */
    public static function getRemainingQuota(?User $user): ?int
    {
        $max = static::getMaxLimit($user);
        if ($max === null) {
            return null;
        }

        if ($max === 0) {
            return 0;
        }

        if (! $user) {
            return 0;
        }

        $currentCount = DebridDownload::where('user_id', $user->id)->count();

        return max(0, $max - $currentCount);
    }

    /**
     * Check if the user is allowed to add new download links to their download list.
     * Returns null if allowed, or error message string if blocked.
     */
    public static function checkConcurrentLimit(?User $user, int $newLinkCount = 1): ?string
    {
        $max = static::getMaxLimit($user);
        if ($max === null) {
            return null;
        }

        if ($max === 0) {
            return 'Sistem yöneticisi tarafından yeni bağlantı ekleme kapatılmıştır (Maksimum link sınırı: 0).';
        }

        if ($user && $max > 0) {
            $currentCount = DebridDownload::where('user_id', $user->id)->count();

            if (($currentCount + $newLinkCount) > $max) {
                return "İndirme listenizde maksimum {$max} adet link barındırabilirsiniz (Şu an listenizde {$currentCount} adet link bulunuyor). Yeni link ekleyebilmek için önce listenizden link silmelisiniz.";
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
