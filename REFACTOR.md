# Refactoring Roadmap

## Objective

Tujuan utama refactoring adalah meningkatkan maintainability, scalability, dan readability aplikasi tanpa mengubah business logic yang sudah berjalan. Fokus utama refactoring meliputi:

- Menghilangkan kode duplikat (Don't Repeat Yourself).
- Menyederhanakan struktur kode dan alur aplikasi.
- Mengorganisasi direktori berdasarkan fitur (Feature-Based Architecture).
- Memisahkan business logic dari presentation layer.
- Meningkatkan reusability komponen dan utility.

---

# High Priority

## 1. Feature-Based Directory Structure

Saat ini struktur project masih berpotensi tersebar berdasarkan jenis file (Pages, Components, Hooks, dll.). Seluruh kode sebaiknya dikelompokkan berdasarkan fitur agar lebih mudah dikelola.

### Before

```
resources/js/
├── Components/
├── Pages/
├── Hooks/
├── Layouts/
├── Services/
└── Utils/
```

### After

```
resources/js/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── project/
│   ├── rab/
│   ├── ai/
│   └── user/
│
└── shared/
    ├── components/
    ├── hooks/
    ├── layouts/
    ├── services/
    ├── utils/
    ├── constants/
    └── types/
```

---

## 2. Eliminate Duplicate Components

Identifikasi komponen yang memiliki tampilan maupun fungsi serupa untuk dijadikan reusable component.

Contoh:

- Card
- Badge
- Button
- Modal
- Alert
- Empty State
- Loading State

Daripada memiliki banyak implementasi berbeda, gunakan satu komponen yang dapat dikonfigurasi melalui props.

---

## 3. Shared Form Components

Seluruh komponen form sebaiknya berada pada satu tempat.

Contoh:

```
shared/components/forms/

InputField
SelectField
TextareaField
DatePicker
CurrencyInput
FormError
```

Dengan demikian setiap halaman menggunakan komponen yang sama sehingga konsisten.

---

## 4. Shared Table Component

Daripada setiap halaman membuat implementasi tabel sendiri, buat satu DataTable yang mendukung:

- Pagination
- Search
- Sorting
- Loading
- Empty State
- Actions

---

## 5. Shared Modal

Gabungkan berbagai modal yang memiliki struktur sama menjadi:

- ConfirmModal
- FormModal
- Dialog
- Drawer

---

## 6. Shared Layout Components

Komponen layout seperti:

- PageHeader
- Breadcrumb
- Section
- Container
- CardLayout

dapat digunakan kembali di seluruh halaman.

---

# Medium Priority

## 7. API Layer Separation

Seluruh request API sebaiknya dipisahkan dari komponen React.

### Before

```
DashboardPage.jsx

axios.get(...)
axios.post(...)
axios.put(...)
```

### After

```
features/project/api/

projectApi.ts

getProjects()
createProject()
updateProject()
deleteProject()
```

Komponen hanya bertanggung jawab untuk menampilkan data.

---

## 8. Custom Hooks

Logic yang sering digunakan berulang sebaiknya dipindahkan menjadi custom hook.

Contoh:

```
usePagination()
useSearch()
useDebounce()
useModal()
useProjects()
useUsers()
```

---

## 9. Shared Utilities

Seluruh helper dipindahkan ke satu lokasi.

Contoh:

```
shared/utils/

currency.ts
date.ts
string.ts
number.ts
download.ts
clipboard.ts
```

---

## 10. Shared Constants

Hilangkan magic string maupun magic number.

```
shared/constants/

roles.ts
status.ts
permissions.ts
routes.ts
colors.ts
```

---

## 11. Shared Types

Seluruh interface/type berada di satu lokasi.

```
shared/types/

User.ts
Project.ts
RAB.ts
Pagination.ts
Api.ts
```

---

# Backend Refactoring

## 12. Service Layer

Controller hanya menangani:

- Request
- Response
- Authorization
- Validation

Business logic dipindahkan ke Service.

```
Controller

↓

Service

↓

Model
```

---

## 13. Form Request

Seluruh validasi dipindahkan ke FormRequest.

Contoh:

```
StoreProjectRequest
UpdateProjectRequest
StoreRABRequest
```

---

## 14. API Resource

Response API dibuat konsisten menggunakan Laravel Resource.

Contoh:

```
ProjectResource
UserResource
RABResource
```

---

## 15. Query Scope

Query yang sering digunakan dipindahkan menjadi Scope.

Contoh:

```
Project::approved()

Project::active()

Project::finished()
```

---

## 16. Action Class

Business logic yang spesifik dipisahkan menjadi Action.

Contoh:

```
ApproveProjectAction

RejectProjectAction

GenerateRABAction

ExportPDFAction
```

---

## 17. Enum

Gunakan Enum daripada hardcoded string.

Contoh:

```
ProjectStatus

UserRole

ApprovalStatus
```

---

## 18. Repository (Optional)

Apabila query mulai kompleks, pertimbangkan Repository Pattern.

```
ProjectRepository

UserRepository

RABRepository
```

---

# Code Quality

## 19. Remove Duplicate Logic

Cari business logic yang muncul di banyak tempat, misalnya:

- Perhitungan total
- Format data
- Permission checking
- Export
- Import
- AI Prompt Builder

Pindahkan menjadi helper atau service.

---

## 20. Naming Consistency

Gunakan pola penamaan yang konsisten.

### Component

```
ProjectCard
ProjectTable
ProjectForm
ProjectModal
```

### Service

```
ProjectService
```

### Controller

```
ProjectController
```

### Hook

```
useProject()
```

---

## 21. Folder Responsibility

Pastikan setiap folder hanya memiliki satu tanggung jawab.

```
shared/
    components/
    hooks/
    utils/
    constants/
    layouts/

features/
    project/
    dashboard/
    rab/
    user/
```

Feature tidak boleh saling bergantung secara langsung. Jika ada kode yang digunakan oleh lebih dari satu fitur, pindahkan ke folder `shared`.

---

# Refactoring Priority

## Phase 1

- [ ] Menghilangkan kode duplikat.
- [ ] Membuat reusable component.
- [ ] Membuat shared utilities.
- [ ] Membuat shared constants.
- [ ] Memisahkan business logic ke Service.
- [ ] Memindahkan validasi ke FormRequest.

---

## Phase 2

- [ ] Menerapkan Feature-Based Directory.
- [ ] Memisahkan API Layer.
- [ ] Membuat Custom Hooks.
- [ ] Menyatukan seluruh komponen form.
- [ ] Menyatukan DataTable dan Modal.

---

## Phase 3

- [ ] Menggunakan Laravel Resource.
- [ ] Menggunakan Enum.
- [ ] Menambahkan Query Scope.
- [ ] Menambahkan Action Class.
- [ ] Menggunakan Repository Pattern (jika diperlukan).
- [ ] Standarisasi naming convention.

---

# Expected Outcome

Setelah proses refactoring selesai, project diharapkan memiliki karakteristik berikut:

- Tidak ada kode yang duplikat.
- Struktur direktori lebih jelas dan berbasis fitur.
- Komponen UI bersifat reusable.
- Business logic terpisah dari presentation layer.
- API layer terorganisasi dengan baik.
- Validasi terpusat menggunakan FormRequest.
- Kode lebih mudah dibaca, dipelihara, dan dikembangkan.
- Developer baru dapat memahami struktur project dengan lebih cepat.
- Skalabilitas aplikasi meningkat seiring bertambahnya fitur.