# Admin Dashboard ADBCreative Team

## 🚀 Overview
Admin Dashboard ini dikembangkan oleh **ADBCreative Team** menggunakan 
**Next.js** dan **Tailwind CSS**. Dashboard ini dirancang untuk memberikan 
pengalaman manajemen data yang efisien dengan berbagai fitur interaktif 
seperti kalender, grafik analitik, dan autentikasi pengguna.

## 📌 Features
- 🔐 **Authentication** menggunakan Clerk
- 📅 **FullCalendar** untuk manajemen jadwal
- 📊 **ApexCharts & Recharts** untuk visualisasi data
- 🌍 **Vector Map** untuk tampilan peta interaktif
- 📁 **Drag & Drop Upload** menggunakan react-dropzone
- 🎨 **Styled with Tailwind CSS** untuk tampilan yang modern dan responsif

## 🛠️ Installation
### 1. Clone repository ini
```sh
git clone https://github.com/AbyanDimas/My-Project.git
cd admin-dashboard-adbcreative-team
```

### 2. Install dependencies
```sh
npm install
```

### 3. Setup environment variables
Buat file `.env` dan tambahkan konfigurasi berikut:
```env
DATABASE_URL="your_database_url"
NEXT_PUBLIC_CLERK_FRONTEND_API="your_clerk_api_key"
JWT_SECRET="your_jwt_secret"
```

### 4. Generate Prisma Client
```sh
npx prisma generate
```

### 5. Jalankan aplikasi dalam mode development
```sh
npm run dev
```

## 🔧 Scripts
| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Menjalankan aplikasi dalam mode development |
| `npm run build` | Build aplikasi untuk production |
| `npm run start` | Menjalankan aplikasi dalam mode production |
| `npm run lint` | Mengecek kesalahan kode menggunakan ESLint |

## 📂 Project Structure
```
admin-dashboard-adbcreative-team/
├── components/      # Komponen reusable
├── pages/           # Halaman utama aplikasi
├── public/          # File statis
├── styles/          # Styling dan Tailwind config
├── utils/           # Helper functions
└── prisma/          # Prisma database schema
```

## 🤝 Contributing
Kontribusi sangat diterima! Jika ingin berkontribusi, silakan fork repo 
ini dan buat pull request.

## 📜 License
Proyek ini dilindungi di bawah lisensi MIT.

---
💡 **ADBCreative Team** - Membangun solusi digital yang inovatif!


