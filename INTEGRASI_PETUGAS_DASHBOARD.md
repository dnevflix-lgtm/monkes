# 📋 Dokumentasi Integrasi Dashboard Petugas dengan Database

## ✅ Fitur yang Sudah Terintegrasi

### 1. **RINGKASAN (Summary) - Menu Utama**
Dashboard menampilkan statistik kesehatan warga real-time dari database:

**Data yang Ditampilkan:**
- ✅ Total warga terdaftar (Pria/Wanita)
- ✅ Total pemeriksaan kesehatan (Pria/Wanita)
- ✅ Indikasi kesehatan (%) - Hipertensi, Diabetes, Hiperkolesterol, Asam Urat tinggi, dll
- ✅ Donat chart status kesehatan (Normal, Waspada, Tinggi, Rendah)
- ✅ Rata-rata hasil pemeriksaan (BP, Gula Darah, Kolesterol, Asam Urat)

**Fungsi Terkait:**
```javascript
async function renderRingkasan()
async function listAllWarga()  // Ambil semua data warga dari database
```

---

### 2. **DAFTAR WARGA - Menu Warga**
Tabel daftar semua warga dengan filter dan status kesehatan:

**Fitur yang Tersedia:**
- ✅ Tampilan tabel lengkap warga + status kesehatan terbaru
- ✅ Filter pencarian berdasarkan:
  - Nama warga (real-time search)
  - Jenis kelamin
  - Status tekanan darah
  - Status gula darah
  - Status kolesterol
  - Status asam urat
- ✅ Tampilan status dengan indikator dot (Rendah/Normal/Waspada/Tinggi)
- ✅ Tombol "Lihat" untuk melihat detail lengkap warga termasuk riwayat pemeriksaan

**Fungsi Terkait:**
```javascript
async function renderDaftarWarga()  // Render daftar + filter
async function showWargaDetail(name)  // Tampilkan modal detail warga
async function bpStatus()  // Helper: check status tekanan darah
async function gulaStatus()  // Helper: check status gula darah
async function kolStatus()  // Helper: check status kolesterol
async function uaStatus()  // Helper: check status asam urat
```

---

### 3. **MANAJEMEN DATA - Menu Data Management**

#### 📌 Tab 1: Tambah Data Pemeriksaan
Petugas dapat menambahkan data pemeriksaan kesehatan warga langsung:

**Fitur:**
- ✅ Autocomplete nama warga (dari database)
- ✅ Form lengkap: Tanggal, Waktu, Tekanan Darah, Gula Darah (+ tipe), Kolesterol, Asam Urat
- ✅ Validasi input (minimal 1 parameter harus diisi)
- ✅ Data otomatis tersimpan ke database (Google Sheets via server)
- ✅ Notifikasi sukses/gagal

**Fungsi Terkait:**
```javascript
async function prepManajemen()  // Persiapan tab manajemen
async function mgmtAddRecord()  // Tambah data pemeriksaan baru
async function saveWargaData()  // Simpan ke database
```

#### 📌 Tab 2: Hapus Data
Petugas dapat menghapus data pemeriksaan atau warga:

**Fitur:**
- ✅ Pilih warga dari dropdown
- ✅ Pilih tanggal pemeriksaan spesifik dari list
- ✅ Hapus data pemeriksaan individual
- ✅ Tombol untuk hapus seluruh data warga (confirm dialog)

**Fungsi Terkait:**
```javascript
async function mdelLoadRecords()  // Load list pemeriksaan warga
async function mgmtDeleteRecord()  // Hapus 1 data pemeriksaan
async function mgmtDeleteWarga()  // Hapus semua data warga
async function deleteWarga()  // API delete ke server
```

---

## 🔄 Alur Data (Data Flow)

```
┌─────────────────────────┐
│  Dashboard Petugas      │
└────────┬────────────────┘
         │
         ├─ Ringkasan → listAllWarga() → Database (Google Sheets)
         │                ↓
         │         Hitung statistik & render
         │
         ├─ Daftar Warga → listAllWarga() → Apply Filter → Render Table
         │                              ↓
         │                      Show Detail via Modal
         │
         └─ Manajemen Data → Tambah/Hapus Records
                         ↓
                saveWargaData() → POST ke /api/database
                         ↓
                   Server Node.js
                         ↓
                 POST ke Google Apps Script
                         ↓
                  Database Google Sheets
```

---

## 🛠️ Fungsi Helper untuk Status Kesehatan

Semua fungsi ini menggunakan logic sederhana (bukan dari CSV) agar cepat:

```javascript
bpStatus(sys, dia)       // Return: {cls, label} untuk Tekanan Darah
gulaStatus(val, type)    // Return: {cls, label} untuk Gula Darah
kolStatus(val)           // Return: {cls, label} untuk Kolesterol
uaStatus(val, gender)    // Return: {cls, label} untuk Asam Urat

// Contoh return value:
// {cls: 'normal', label: 'Normal'}
// {cls: 'tinggi', label: 'Tinggi'}
// {cls: 'rendah', label: 'Rendah'}
// {cls: 'waspada', label: 'Waspada'}
```

---

## 📡 API Endpoints yang Digunakan

Semua endpoint di `/api/database` (proxied ke Google Apps Script):

| Action | Deskripsi |
|--------|-----------|
| `getAllWarga` | Ambil semua warga + records |
| `getWarga` | Ambil 1 warga by nama |
| `saveProfile` | Simpan/update profil warga |
| `deleteWarga` | Hapus warga & semua records |
| `addRecord` | Tambah data pemeriksaan |

---

## ✨ Checklist Integrasi Lengkap

- [x] Helper functions untuk status checking (BP, Gula, Kolesterol, Asam Urat)
- [x] Render Ringkasan dengan statistik realtime
- [x] Render Daftar Warga dengan filter
- [x] Modal detail warga dengan riwayat lengkap
- [x] Tab Tambah Data Pemeriksaan dengan autocomplete
- [x] Tab Hapus Data (delete pemeriksaan/warga)
- [x] Integrasi dengan database via /api/database
- [x] Validasi input lengkap
- [x] Toast notification untuk feedback user

---

## 🚀 Cara Testing

1. **Jalankan server:**
   ```bash
   node server.js
   ```

2. **Buka aplikasi:**
   ```
   http://localhost:3000
   ```

3. **Login sebagai Petugas:**
   - Username: `admin`
   - Password: `sehat123`

4. **Test setiap menu:**
   - Ringkasan → lihat statistik
   - Daftar Warga → filter & lihat detail
   - Manajemen Data → tambah/hapus record

---

## 📝 Catatan Penting

- Semua data disimpan di Google Sheets melalui Google Apps Script
- Perubahan di database akan langsung terlihat di dashboard
- Status kesehatan dihitung secara real-time saat load data
- Autocomplete nama warga di-update setiap kali tab manajemen dibuka

