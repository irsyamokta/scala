# Clean Code Guidelines — Laravel & React

## Objective

Lakukan refactoring pada seluruh codebase untuk menghasilkan kode yang bersih, ringkas, konsisten, mudah dipahami, dan mudah dipelihara. Hilangkan pola penulisan kode yang tidak perlu, komentar berlebihan hasil generasi AI, abstraksi yang tidak memberikan manfaat nyata, serta struktur kode yang terkesan dibuat secara otomatis tanpa pertimbangan kebutuhan proyek.

Hasil refactoring harus mempertahankan karakteristik kode yang ditulis dan dipelihara oleh developer berpengalaman: sederhana, eksplisit, konsisten dengan arsitektur proyek, dan berorientasi pada kebutuhan aplikasi.

## 1. General Rules

- Pertahankan seluruh fungsionalitas, business logic, API contract, validasi, authorization, dan perilaku aplikasi yang sudah berjalan.
- Ikuti konvensi dan pola arsitektur yang sudah digunakan dalam proyek sebelum memperkenalkan pola baru.
- Utamakan solusi paling sederhana yang tetap memenuhi kebutuhan sistem.
- Hindari overengineering, abstraksi prematur, dan penambahan layer yang tidak memberikan manfaat jelas.
- Jangan mengubah kode hanya demi membuatnya terlihat berbeda atau lebih modern.
- Jangan menambahkan dependency, library, design pattern, atau utility baru tanpa kebutuhan yang jelas.
- Hindari duplikasi kode, tetapi jangan memaksakan abstraksi untuk logika yang kebetulan terlihat serupa.
- Pertahankan penamaan yang deskriptif dan sesuai dengan domain aplikasi.
- Jangan mengubah format response, struktur database, route, event, atau kontrak antarkomponen tanpa alasan yang kuat.
- Hindari perubahan di luar cakupan refactoring.
- Jangan mengorbankan keterbacaan demi membuat kode lebih pendek.

## 2. Remove AI Slop and Unnecessary Comments

Periksa seluruh file kode dan hapus komentar yang tidak memberikan informasi teknis atau kontekstual yang berarti.

### Remove comments such as:

- Komentar yang hanya mengulang nama fungsi atau isi kode.
- Komentar yang menjelaskan operasi sederhana yang sudah jelas dari implementasinya.
- Komentar generik seperti `// Initialize variables`, `// Handle the response`, atau `// Process the data`.
- Komentar yang menjelaskan setiap langkah kode secara berlebihan.
- Komentar berupa judul dekoratif, separator panjang, atau banner yang tidak diperlukan.
- Komentar yang menyebut bahwa kode baru saja dibuat, diperbaiki, dioptimalkan, atau direfactor.
- Komentar yang ditulis dengan gaya penjelasan tutorial atau dokumentasi AI.
- Komentar yang sudah tidak relevan dengan implementasi aktual.
- TODO atau FIXME yang tidak lagi relevan dan tidak memiliki tindak lanjut yang jelas.

### Preserve comments when they:

- Menjelaskan alasan di balik business rule yang tidak langsung terlihat dari kode.
- Mendokumentasikan perilaku yang tidak intuitif, workaround, atau batasan teknis tertentu.
- Menjelaskan keputusan arsitektur yang penting.
- Memenuhi kebutuhan dokumentasi API, PHPDoc, TypeScript, atau framework.
- Dibutuhkan oleh tooling, compiler, bundler, framework, atau static analyzer.
- Menjelaskan konfigurasi kompleks atau integrasi eksternal yang membutuhkan konteks tambahan.

Jangan menghapus seluruh komentar secara membabi buta. Pertahankan dokumentasi yang memang dibutuhkan dan hapus komentar yang tidak menambah informasi.

## 3. Laravel Backend

Periksa seluruh bagian backend Laravel, termasuk Controllers, Services, Models, Requests, Resources, Policies, Jobs, Events, Listeners, Middleware, Console Commands, dan file pendukung lainnya sesuai struktur proyek.

### Controllers

- Pastikan controller berfokus pada penanganan HTTP request dan response.
- Hindari controller yang terlalu panjang atau memuat business logic kompleks apabila proyek sudah menggunakan service layer.
- Jangan memindahkan seluruh logika ke service hanya demi mengikuti pola tertentu.
- Hapus variabel perantara yang tidak memberikan manfaat terhadap keterbacaan.
- Hindari nested conditionals yang tidak diperlukan.
- Gunakan dependency injection sesuai konvensi proyek.
- Pertahankan status HTTP, redirect, response format, dan penanganan error yang sudah berlaku.

### Services and Business Logic

- Pertahankan pemisahan tanggung jawab yang memang dibutuhkan.
- Hindari membuat service, helper, interface, atau repository baru untuk operasi sederhana yang sudah ditangani secara memadai oleh Laravel.
- Jangan membuat wrapper method yang hanya meneruskan parameter ke satu fungsi lain tanpa memberikan manfaat.
- Hindari terlalu banyak method kecil yang justru memecah alur logika tanpa meningkatkan keterbacaan.
- Hapus duplikasi nyata tanpa mengubah aturan bisnis.
- Pastikan transaksi database, integritas relasi, dan urutan operasi tetap benar.

### Models and Eloquent

- Gunakan relasi Eloquent yang sesuai dengan struktur database.
- Hindari query berulang, N+1 query, dan pengambilan data yang tidak diperlukan.
- Gunakan eager loading secara tepat.
- Pertahankan casts, accessors, mutators, scopes, observers, dan model events yang masih digunakan.
- Hindari penambahan abstraksi query yang hanya membungkus operasi Eloquent sederhana.
- Jangan mengubah perilaku mass assignment atau mengurangi perlindungan terhadap akses data.

### Validation and Authorization

- Pertahankan validasi input dan aturan business logic.
- Gunakan Form Request jika sesuai dengan pola proyek.
- Pertahankan policy, gate, middleware, dan pemeriksaan hak akses.
- Jangan menghapus validasi atau authorization hanya karena dianggap redundan tanpa memastikan seluruh jalur eksekusi.
- Pastikan operasi sensitif tetap terlindungi.

### Error Handling

- Hapus penanganan exception yang redundan atau hanya menangkap exception untuk melemparkannya kembali tanpa perubahan.
- Jangan menelan exception secara diam-diam.
- Pertahankan logging yang relevan untuk debugging dan audit.
- Jangan mengubah pesan error, status HTTP, atau mekanisme rollback secara sembarangan.
- Hindari penggunaan fallback yang menyembunyikan kesalahan data atau kegagalan sistem.

### Database and Performance

- Pertahankan migration dan struktur database kecuali perubahan skema memang menjadi bagian dari tugas.
- Jangan mengubah migration yang sudah diterapkan di lingkungan produksi hanya demi merapikan kode.
- Hindari query duplikat dan operasi database yang tidak diperlukan.
- Pastikan perubahan tidak menyebabkan query tambahan atau kehilangan integritas data.
- Jangan menjalankan perintah destruktif terhadap database.

## 4. React Frontend

Periksa seluruh codebase React, termasuk components, pages, hooks, contexts, state management, API clients, utility functions, dan styling.

### Components

- Buat komponen dengan tanggung jawab yang jelas.
- Hindari komponen terlalu besar apabila pemisahan dapat meningkatkan keterbacaan dan penggunaan ulang.
- Jangan memecah setiap elemen JSX menjadi komponen terpisah tanpa alasan yang jelas.
- Hindari komponen wrapper yang hanya meneruskan props tanpa memberikan manfaat.
- Hilangkan prop yang tidak digunakan dan state yang tidak diperlukan.
- Hindari conditional rendering yang terlalu kompleks.
- Pertahankan struktur UI, responsive behavior, accessibility, dan interaksi pengguna.

### React Hooks and State

- Hapus `useEffect`, `useMemo`, `useCallback`, dan `useState` yang tidak diperlukan.
- Jangan menggunakan `useEffect` untuk menghitung nilai yang dapat diperoleh langsung dari props atau state.
- Jangan menambahkan memoization tanpa alasan performa yang jelas.
- Hindari duplikasi state yang sebenarnya dapat diturunkan dari state lain.
- Pertahankan dependency array hooks secara benar.
- Jangan mengabaikan aturan React Hooks atau menonaktifkan lint rules hanya untuk menghilangkan peringatan.
- Pertahankan perilaku asynchronous operations dan cleanup yang diperlukan.

### JSX and Rendering

- Hapus fragment, wrapper, conditional, dan variabel perantara yang tidak diperlukan.
- Hindari nested ternary yang menyulitkan pembacaan.
- Gunakan `map()` dengan key yang stabil dan sesuai identitas data.
- Jangan menggunakan array index sebagai key jika data dapat berubah urutan atau mengalami penambahan dan penghapusan.
- Hindari inline logic yang terlalu panjang di dalam JSX.
- Pertahankan form behavior, event handlers, loading states, empty states, dan error states.
- Jangan mengubah teks antarmuka atau alur interaksi tanpa kebutuhan.

### API and Data Handling

- Hindari duplikasi request dan transformasi data.
- Pertahankan API contract antara React dan Laravel.
- Pastikan loading, success, empty, dan error states tetap ditangani.
- Hindari penggunaan `any` apabila proyek menggunakan TypeScript dan tipe yang tepat dapat didefinisikan.
- Hapus fallback yang tidak relevan atau menutupi data yang tidak valid.
- Pertahankan autentikasi, pengelolaan token, dan mekanisme penanganan sesi yang sudah berjalan.

### Styling and UI

- Ikuti sistem styling yang sudah digunakan dalam proyek, seperti Tailwind CSS, CSS Modules, atau pendekatan lainnya.
- Hindari penambahan class, inline style, atau CSS yang menduplikasi aturan yang sudah tersedia.
- Hapus styling yang tidak digunakan setelah memastikan tidak ada ketergantungan dinamis.
- Jangan membuat ulang design system apabila proyek sudah memilikinya.
- Hindari perubahan visual yang tidak diminta.
- Pertahankan konsistensi spacing, typography, warna, responsive breakpoints, dan komponen UI yang sudah ada.

## 5. Naming and Code Structure

- Gunakan nama variabel, fungsi, komponen, dan file yang jelas serta sesuai konteks.
- Hindari nama generik seperti `data`, `result`, `item`, `temp`, atau `handler` apabila nama yang lebih spesifik dapat digunakan.
- Nama generik tetap diperbolehkan jika konteksnya sudah jelas dan ruang lingkupnya kecil.
- Hindari nama berlebihan yang mengulang konteks secara tidak perlu.
- Hapus variabel yang tidak digunakan dan parameter yang tidak diperlukan.
- Pertahankan konsistensi penamaan berdasarkan konvensi bahasa, framework, dan proyek.
- Hindari boolean flags atau parameter yang membuat fungsi memiliki terlalu banyak tanggung jawab.
- Jangan membuat struktur folder atau memindahkan file hanya demi preferensi pribadi.

## 6. Anti-Patterns to Avoid

Jangan memperkenalkan pola berikut selama refactoring:

- Overengineering dan premature abstraction.
- Unnecessary design patterns.
- Excessive helper, service, repository, interface, atau custom hook.
- Excessive defensive programming tanpa risiko nyata yang perlu ditangani.
- Repeated null checks atau fallback yang tidak relevan.
- Deeply nested conditions.
- Excessive configuration for simple behavior.
- Generic utility functions yang hanya digunakan sekali dan tidak meningkatkan keterbacaan.
- Duplicate state dan duplicate derived data.
- Unnecessary `try-catch`, `useEffect`, memoization, atau type casting.
- Silent error suppression.
- Broad search-and-replace yang berisiko mengubah perilaku aplikasi.
- Menonaktifkan lint rules atau mengubah konfigurasi pemeriksaan kode untuk menyembunyikan masalah.
- Menambahkan komentar, dokumentasi, atau abstraksi hanya untuk membuat perubahan tampak lebih lengkap.
- Mengubah implementasi yang sudah sederhana dan benar hanya karena ada alternatif lain.

## 7. Refactoring Workflow

Lakukan refactoring secara bertahap dan berdasarkan kondisi nyata codebase.

1. Inspect the project. Identifikasi struktur direktori, framework version, dependencies, konvensi penamaan, pola arsitektur, dan tooling yang digunakan.
2. Identify unnecessary code. Temukan komentar berlebihan, kode tidak terpakai, duplikasi, abstraksi yang tidak dibutuhkan, dan kompleksitas yang dapat dihindari.
3. Understand dependencies. Periksa hubungan antarmodul, route, API, database, komponen React, hooks, serta penggunaan kode yang akan diubah.
4. Refactor incrementally. Ubah bagian yang memang memerlukan perbaikan tanpa melakukan rewrite besar-besaran.
5. Preserve behavior. Pastikan business logic, API contract, authorization, validasi, dan UI behavior tetap konsisten.
6. Run checks. Jalankan test, lint, formatter, type checker, dan build menggunakan perintah yang tersedia dalam proyek.
7. Review the diff. Periksa perubahan yang tidak relevan, penghapusan kode yang masih digunakan, serta perubahan perilaku yang tidak disengaja.
8. Report results. Rangkum bagian yang diperbaiki, pemeriksaan yang dijalankan, hasil pengujian, dan masalah yang belum terselesaikan.

Jangan menganggap proses selesai hanya karena kode berhasil diformat atau komentar sudah dihapus.

## 8. Constraints

- Jangan melakukan rewrite seluruh aplikasi.
- Jangan mengubah fitur, business rules, database schema, API response, atau tampilan secara sengaja.
- Jangan menghapus file atau fungsi sebelum memastikan bahwa kode tersebut tidak digunakan.
- Jangan menghapus komentar yang diwajibkan oleh tooling atau kontrak dokumentasi.
- Jangan menambahkan dependency tanpa kebutuhan.
- Jangan mengubah file environment, credentials, secrets, atau konfigurasi deployment yang tidak berkaitan dengan refactoring.
- Jangan menjalankan migration, seeder, atau operasi destruktif tanpa kebutuhan dan otorisasi yang jelas.
- Jangan menyatakan test berhasil apabila test tidak benar-benar dijalankan.
- Jika menemukan masalah yang berpotensi memerlukan perubahan perilaku, laporkan terlebih dahulu atau batasi perubahan pada bagian yang aman.

## 9. Definition of Done

Refactoring dinyatakan selesai apabila:

- Komentar yang tidak perlu telah dihapus.
- Kode tidak terpakai dan duplikasi yang terverifikasi telah dibersihkan.
- Struktur kode tetap mengikuti arsitektur dan konvensi proyek.
- Implementasi Laravel tetap mempertahankan business logic, keamanan, validasi, dan integritas data.
- Implementasi React tetap mempertahankan perilaku UI, state management, dan integrasi API.
- Tidak ada abstraksi baru yang tidak diperlukan.
- Tidak ada perubahan fitur yang tidak disengaja.
- Test, lint, type checking, dan build yang relevan telah dijalankan jika tersedia.
- Seluruh perubahan dapat dijelaskan berdasarkan manfaat teknis yang nyata.

## Final Instruction

Prioritize clarity, simplicity, consistency, and maintainability. Remove unnecessary code rather than replacing it with a different abstraction. Prefer straightforward implementations that match the existing project conventions.

The objective is not to make the code artificially minimal, nor to make it appear human-written through superficial stylistic changes. The objective is to produce maintainable production code in which every meaningful abstraction, comment, conditional, dependency, and state transition serves a clear purpose.

Inspect first, make targeted changes, preserve behavior, and verify the result.
