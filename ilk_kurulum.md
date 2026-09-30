# TSI Debrid v2 - İlk Kurulum Rehberi

Bu belge, TSI Debrid projesinin sunucuya veya yerel ortama kurulumunu, `.env` konfigürasyonunu ve Cron Job / Queue işlemlerini adım adım açıklar.

---

## 🚀 1. Kurulum Adımları

1. **Bağımlılıkları Yükleyin:**
   ```bash
   composer install --no-dev --optimize-autoloader
   npm install
   npm run build
   ```

2. **Çevre Dosyasını Oluşturun:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Veritabanı Oluşturun ve Sembolik Bağlantıyı Bağlayın:**
   ```bash
   # SQLite kullanıyorsanız dosyasını oluşturun:
   touch database/database.sqlite

   # Veritabanı tablolarını oluşturun:
   php artisan migrate --force

   # Dosya indirme erişimi için storage sembolik bağlantısını kurun:
   php artisan storage:link
   ```

---

## ⚙️ 2. `.env` Yapılandırma Bilgileri

.env dosyanızda düzenlemeniz gereken kritik değişkenler:

```ini
# Uygulama Temel Ayarları
APP_NAME="TSI Debrid"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://siteniz.com

# Real-Debrid API Anahtarı
REAL_DEBRID_API_TOKEN=your_real_debrid_api_token_here

# İndirmeye İzin Verilen Sunucu Host'ları (Virgülle ayırın, boş bırakırsanız tüm sunuculara izin verilir)
DEBRID_ALLOWED_HOSTS=mega.nz,turbobit.net,rapidgator.net,1fichier.com,ddownload.com

# Minimum Boş Disk Alanı (MB cinsinden). Disk alanı bu sınırın altına düşerse ilk önbelleklenen dosya otomatik silinir. (Örn: 5000 = 5 GB)
MIN_FREE_DISK_SPACE_MB=5000

# XenForo Entegrasyonu ve Veritabanı Bağlantısı
XENFORO_URL=https://xenforositeniz.com
XENFORO_DB_HOST=127.0.0.1
XENFORO_DB_PORT=3306
XENFORO_DB_DATABASE=xenforo_db_name
XENFORO_DB_USERNAME=xenforo_db_user
XENFORO_DB_PASSWORD=xenforo_db_pass
XENFORO_DB_PREFIX=xf_

# İzin Verilen XenForo Kullanıcı Grubu ID'leri (Virgülle ayırın)
XENFORO_ALLOWED_USER_GROUPS=3,4,5,11,20,23

# Admin (SuperUser) Giriş Bilgileri
SUPERUSER_USERNAME=admin
SUPERUSER_PASSWORD=guvenli_bir_parola

# Cron Job Güvenlik Anahtarı (Opsiyonel)
CRON_SECRET=guvenli_cron_token_123
```

> **Not:** Proxy IP ve port listeniz projedeki `proxy.txt` dosyasından otomatik okunur. `.env` içerisine proxy yazmanıza gerek yoktur.

---

## ⏱️ 3. Cron Job ve Queue Worker Kurulumu

### A. Arka Plan İndirme Kuyruğu (Queue Worker)
İndirmelerin arka planda Real-Debrid üzerinden sunucuya çekilmesi için `queue:work` komutunun sürekli çalışması gerekir.

Plesk / Supervisor veya Terminal üzerinden arka plan servisi ekleyin:
```bash
php artisan queue:work --daemon --tries=3
```

### B. 7 Günlük Önbellek Temizleme Cron Job
7 günden eski tamamlanmış önbellek dosyalarının otomatik silinmesi için aşağıdaki 2 yöntemden birini seçebilirsiniz:

**Yöntem 1: Sunucu Crontab (Önerilen)**
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

**Yöntem 2: Plesk / HTTP URL ile Tetikleme (Web Cron)**
Plesk veya harici bir cron servisinde (örn. cron-job.org) günde 1 kez aşağıdaki URL'ye GET isteği atın:
```http
https://siteniz.com/cron/clean-cache?key=CRON_SECRET_DEGERINIZ
```
