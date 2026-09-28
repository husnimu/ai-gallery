# GALERI·FOTO — Aplikasi Galeri Foto Web Modern & Interaktif

> ⚡ **Dikembangkan dengan metode *Vibe Coding***: Proyek ini dirancang dan dibangun secara interaktif dan ekspresif berkolaborasi dengan AI, memadukan estetika visual modern dengan fungsionalitas galeri foto yang intuitif dan responsif.

Aplikasi galeri foto berbasis web dengan antarmuka modern dan responsif, fitur upload drag & drop, filter kategori dinamis, lightbox interaktif dengan navigasi keyboard, pencarian real-time, serta kemampuan manajemen foto yang lengkap.

---

## ✨ Fitur Unggulan

### 1. Desain Antarmuka Modern & Responsif
- **Gradient Premium**: Desain visual elegan dengan gradient ungu-pink yang konsisten di seluruh aplikasi.
- **Grid Layout Responsif**: Tata letak adaptif yang optimal di semua ukuran layar:
  - 📱 Mobile: 1 kolom
  - 📱 Tablet: 2 kolom
  - 💻 Desktop: 3-4 kolom
- **Hover Effects Interaktif**: Efek zoom halus dan overlay informasi saat hover pada foto.
- **Smooth Animations**: Transisi halus untuk semua interaksi pengguna dengan CSS transitions.
- **Custom Scrollbar**: Scrollbar custom dengan warna tema yang konsisten.
- **Sticky Header**: Header tetap di atas saat scroll untuk akses cepat ke fitur pencarian dan upload.

### 2. Sistem Upload Foto Canggih
- **Drag & Drop Interface**: Area drop zone intuitif dengan visual feedback saat drag aktif.
- **Multi-file Upload**: Upload beberapa foto sekaligus dalam satu sesi.
- **Preview Real-time**: Preview semua foto yang akan diupload sebelum konfirmasi.
- **Form Metadata Lengkap**:
  - Judul foto (auto-generate dari nama file jika kosong)
  - Pilihan kategori (Alam, Arsitektur, Hewan, Makanan, Perjalanan)
  - Deskripsi opsional
- **File Validation**: Filter otomatis untuk file gambar saja (PNG, JPG, WEBP).
- **Upload Badge**: Foto yang diupload ditandai dengan badge ungu "Upload" di pojok kiri atas.
- **Counter Badge**: Indikator jumlah foto yang telah diupload di tombol upload.

### 3. Filter & Pencarian Dinamis
- **Filter Kategori**: 6 kategori foto dengan tombol filter interaktif:
  - 🌿 Alam
  - 🏛️ Arsitektur
  - 🐾 Hewan
  - 🍽️ Makanan
  - ✈️ Perjalanan
  - 📸 Semua (tampilkan semua)
- **Pencarian Real-time**: Input pencarian yang memfilter foto berdasarkan:
  - Judul foto
  - Kategori
  - Deskripsi
- **Live Counter**: Menampilkan jumlah foto yang sedang ditampilkan dengan info filter aktif.
- **Empty State**: Tampilan informatif saat tidak ada foto yang cocok dengan filter.

### 4. Lightbox Viewer Interaktif
- **Full-screen Modal**: Tampilan foto dalam ukuran besar dengan backdrop blur.
- **Navigasi Keyboard**:
  - `←` (Arrow Left): Foto sebelumnya
  - `→` (Arrow Right): Foto berikutnya
  - `Esc`: Tutup lightbox
- **Navigasi Tombol**: Tombol previous/next dengan visual feedback.
- **Informasi Foto**: Menampilkan judul, deskripsi, dan kategori di bawah foto.
- **Delete dari Lightbox**: Tombol hapus tersedia untuk foto yang diupload.
- **Click Outside to Close**: Klik area di luar foto untuk menutup lightbox.

### 5. Manajemen Foto
- **Hapus Foto Upload**: Tombol hapus (ikon tempat sampah) muncul saat hover pada foto yang diupload.
- **Konfirmasi Hapus**: Dialog konfirmasi sebelum menghapus foto untuk mencegah aksi tidak sengaja.
- **Hapus dari Lightbox**: Kemampuan menghapus foto langsung dari mode lightbox.
- **Pemisahan Foto**: Foto default dan foto upload dikelola secara terpisah.

### 6. 18 Foto Koleksi Default
Koleksi foto default dari berbagai kategori menggunakan Picsum Photos:
- **Alam** (4 foto): Pegunungan, air terjun, danau, hutan bambu
- **Arsitektur** (4 foto): Gedung modern, jembatan klasik, kuil kuno, menara tinggi
- **Hewan** (4 foto): Kucing, burung, anjing, kupu-kupu
- **Makanan** (3 foto): Hidangan lezat, dessert, kopi
- **Perjalanan** (3 foto): Pantai tropis, kota malam, gunung saat senja

---

## 🎨 Teknologi & Stack

### Frontend
- **React 18** - Library UI untuk membangun antarmuka pengguna
- **TypeScript** - Type safety dan developer experience yang lebih baik
- **Vite** - Build tool dan development server yang cepat
- **Tailwind CSS** - Utility-first CSS framework untuk styling

### Fitur Teknis
- **Responsive Design**: Mobile-first approach dengan breakpoint Tailwind
- **Component-based Architecture**: Komponen modular dan reusable
- **State Management**: React hooks (useState, useMemo, useCallback)
- **Image Optimization**: Lazy loading untuk performa optimal
- **URL Object Management**: Proper cleanup untuk object URLs dari file upload
- **Keyboard Navigation**: Full keyboard support untuk aksesibilitas

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js (versi 16 atau lebih baru)
- npm atau yarn

### Instalasi & Development

1. **Clone atau download repository**
```bash
cd galeri-foto
```

2. **Install dependensi**
```bash
npm install
```

3. **Jalankan development server**
```bash
npm run dev
```

Aplikasi akan berjalan di:
```
http://localhost:5173
```

### Build untuk Production

```bash
npm run build
```

File hasil build akan tersedia di folder `dist/`.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Struktur Direktori

```
galeri-foto/
├── public/                      # Aset statis
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Header dengan search & tombol upload
│   │   ├── Gallery.tsx         # Grid gallery dengan hover effects
│   │   ├── CategoryFilter.tsx  # Filter kategori interaktif
│   │   ├── Lightbox.tsx        # Modal lightbox viewer
│   │   └── UploadModal.tsx     # Modal upload dengan drag & drop
│   ├── data/
│   │   └── photos.ts           # Data foto default & tipe TypeScript
│   ├── App.tsx                 # Komponen utama aplikasi
│   ├── main.tsx                # Entry point React
│   └── index.css               # Global styles & Tailwind imports
├── index.html                  # HTML template
├── package.json                # Dependensi & scripts
├── tsconfig.json               # Konfigurasi TypeScript
├── vite.config.ts              # Konfigurasi Vite
├── tailwind.config.js          # Konfigurasi Tailwind CSS
└── README.md                   # Dokumentasi proyek
```

---

## 🎯 Panduan Penggunaan

### Upload Foto
1. Klik tombol **"Upload"** di header (ikon +)
2. Drag & drop foto ke area upload, atau klik untuk memilih file
3. Pilih beberapa foto sekaligus jika diperlukan
4. Isi metadata: judul, kategori, dan deskripsi
5. Klik tombol **"Upload"** untuk menambahkan ke galeri

### Filter & Pencarian
1. Gunakan tombol kategori untuk memfilter foto berdasarkan kategori
2. Ketik di kolom pencarian untuk mencari foto berdasarkan judul, kategori, atau deskripsi
3. Filter dan pencarian dapat dikombinasikan

### Melihat Foto
1. Klik foto mana saja untuk membuka lightbox
2. Gunakan tombol panah atau keyboard untuk navigasi
3. Tekan `Esc` atau klik di luar foto untuk menutup

### Menghapus Foto Upload
1. Hover pada foto yang diupload
2. Klik tombol hapus (ikon tempat sampah) di pojok kanan bawah
3. Konfirmasi penghapusan

---

## 🎨 Fitur Desain

### Color Palette
- **Primary**: Purple 500 (`#a855f7`) → Pink 500 (`#ec4899`)
- **Background**: Gray 50 (`#f9fafb`)
- **Text**: Gray 800 (`#1f2937`)
- **Accent**: Purple gradient untuk CTA buttons

### Typography
- **Font Family**: System fonts (sans-serif)
- **Headings**: Bold, Gray 800
- **Body**: Regular, Gray 600-700

### Spacing & Layout
- **Max Width**: 7xl (80rem / 1280px)
- **Padding**: Responsive (4px → 6px → 8px)
- **Grid Gap**: 16px (4px spacing unit)
- **Border Radius**: 12px untuk cards, 9999px untuk buttons

---

## 📱 Responsivitas

| Breakpoint | Layout | Fitur |
| :--- | :--- | :--- |
| **Mobile** (< 640px) | 1 kolom grid | Header compact, search full-width |
| **Tablet** (640px - 1024px) | 2 kolom grid | Search & upload button visible |
| **Desktop** (> 1024px) | 3-4 kolom grid | Full header dengan semua fitur |

---

## 🔧 Customization

### Menambah Kategori Baru
Edit file `src/data/photos.ts`:
```typescript
export const categories = ['Semua', 'Alam', 'Arsitektur', 'Hewan', 'Makanan', 'Perjalanan', 'Kategori Baru'];
```

### Mengubah Warna Tema
Edit file `src/index.css` atau gunakan Tailwind classes di komponen:
```typescript
// Contoh mengubah gradient button
className="bg-gradient-to-r from-blue-500 to-cyan-500"
```

### Menambah Foto Default
Tambahkan objek foto baru di `src/data/photos.ts`:
```typescript
{
  id: 19,
  src: 'https://picsum.photos/seed/custom/600/400',
  title: 'Judul Foto',
  category: 'Alam',
  description: 'Deskripsi foto',
}
```

---

## 🌟 Fitur yang Dapat Ditambahkan

Ide pengembangan untuk versi selanjutnya:
- [ ] Integrasi dengan API penyimpanan cloud (AWS S3, Cloudinary)
- [ ] Fitur tagging dan multiple categories per foto
- [ ] Slideshow mode dengan auto-play
- [ ] Download foto individual atau batch
- [ ] Fitur like/favorite dengan heart animation
- [ ] Share ke media sosial
- [ ] EXIF data viewer
- [ ] Image compression sebelum upload
- [ ] Dark mode toggle
- [ ] Infinite scroll atau pagination
- [ ] Sort by date, name, or category
- [ ] Export galeri sebagai ZIP
- [ ] Watermark otomatis untuk foto upload

---

## 🎓 Pembelajaran & Konsep

Proyek ini mendemonstrasikan:
- **React Hooks**: useState, useMemo, useCallback untuk state management
- **TypeScript**: Type safety untuk props, state, dan data structures
- **Component Architecture**: Pemisahan concern dalam komponen modular
- **Event Handling**: Drag & drop, keyboard events, click events
- **File API**: FileReader, URL.createObjectURL, blob handling
- **Responsive Design**: Mobile-first dengan Tailwind breakpoints
- **Accessibility**: Keyboard navigation, semantic HTML
- **Performance**: Lazy loading, memoization, cleanup effects

---

## 📄 Lisensi

Proyek ini dibuat untuk tujuan edukasi dan demonstrasi. Bebas digunakan dan dimodifikasi.

---

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan fork repository dan buat pull request dengan perubahan Anda.

---

## 👨‍💻 Developer

Dikembangkan dengan ❤️ menggunakan **React**, **TypeScript**, dan **Tailwind CSS**.

---

## 🙏 Acknowledgments

- **Picsum Photos** - Penyedia gambar placeholder berkualitas tinggi
- **Tailwind CSS** - Framework CSS utility-first yang luar biasa
- **React Team** - Library UI yang powerful dan fleksibel
- **Vite** - Build tool modern yang super cepat

---

<div align="center">

**Dibuat dengan ⚡ Vibe Coding & ❤️ Passion**

[⬆ kembali ke atas](#galerifoto--aplikasi-galeri-foto-web-modern--interaktif)

</div>
