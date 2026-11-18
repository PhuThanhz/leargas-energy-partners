# LÉARGAS Energy Partners — Backend & Admin Portal Guide

## 1. Khởi chạy Database trên MySQL Workbench

1. Mở ứng dụng **MySQL Workbench**.
2. Kết nối vào MySQL Server của bạn (Localhost hoặc VPS).
3. Mở file [backend/db/schema.sql](file:///Users/huynhthanhphu/LEARGAS-ENERGY-PARTNERS/backend/db/schema.sql) và nhấn **Execute (⚡)**.
4. Schema `leargas_db` cùng 4 bảng (`users`, `posts`, `enquiries`, `media_files`) và tài khoản quản trị mặc định sẽ được khởi tạo hoàn chỉnh.

## 2. Khởi chạy Backend Java Spring Boot

Đảm bảo bạn đang cài đặt Java 21 và Maven:

```bash
cd backend
mvn spring-boot:run
```

Backend sẽ khởi động tại cổng `http://localhost:8080`:

- **Swagger / OpenAPI Documentation:** `http://localhost:8080/swagger-ui.html`
- **REST Endpoints:**
  - `POST /api/auth/login` — Đăng nhập & cấp JWT Token
  - `GET /api/posts` — Danh sách bài viết phân trang chuẩn `Pageable`
  - `POST /api/enquiries` — Nhận đăng ký tư vấn từ khách hàng
  - `GET /api/admin/dashboard/stats` — Thống kê KPI pipeline
  - `GET /api/admin/posts` — Quản trị bài viết CMS
  - `GET /api/admin/enquiries` — Quản trị lead đối tác CRM

## 3. Truy cập Admin Dashboard Portal trên Frontend

- Đường dẫn đăng nhập: `http://localhost:3000/admin/login` (hoặc port dev hiện tại)
- Tài khoản quản trị mặc định:
  - **Username:** `admin`
  - **Password:** `admin123`
- Tính năng bao gồm:
  - **Executive Overview (`/admin/dashboard`):** Thống kê số lượng bài viết, số lead mới cần xử lý, tỷ lệ phản hồi.
  - **Articles CMS (`/admin/posts`):** Tạo mới, chỉnh sửa và xuất bản bài viết phân tích thị trường.
  - **Enquiries CRM (`/admin/enquiries`):** Quản lý hồ sơ đối tác, cập nhật trạng thái liên hệ (`NEW` ➔ `CONTACTED` ➔ `QUALIFIED`) và ghi chú tư vấn.
  - **Settings (`/admin/settings`):** Kiểm tra trạng thái kết nối trực tiếp với Spring Boot & MySQL.
