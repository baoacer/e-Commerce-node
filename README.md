# 🛒 eCommerce API

Dự án eCommerce RESTful API được xây dựng bằng Node.js, sử dụng MongoDB để lưu trữ dữ liệu, RabbitMQ để xử lý các tác vụ bất đồng bộ, Discord để ghi log và JWT để bảo mật.

## 🧰 Công nghệ sử dụng

- **Node.js** + **Express** – Xây dựng server và API
- **MongoDB** – Cơ sở dữ liệu NoSQL
- **RabbitMQ** – Hàng đợi tin nhắn để xử lý bất đồng bộ (product, v.v.)
- **JWT (JSON Web Token)** – Xác thực và phân quyền
- **Discord Webhook** – Gửi log và cảnh báo đến Discord
- **dotenv** – Quản lý biến môi trường

---

## 🔐 Tính năng bảo mật

- **Đăng ký / Đăng nhập** người dùng sử dụng JWT
- **Phân quyền người dùng** 
- **Middleware xác thực** JWT cho các route yêu cầu quyền truy cập

---

## ✉️ Message Queue với RabbitMQ

Ứng dụng sử dụng RabbitMQ để xử lý các tác vụ nền như:
- ...

---

## 📜 Discord Logging

Mỗi sự kiện quan trọng trong hệ thống (đăng nhập, đơn hàng mới, lỗi hệ thống, v.v.) sẽ được gửi đến một kênh Discord thông qua webhook để tiện theo dõi và giám sát hệ thống.

---

## 🚀 Cách chạy dự án

### 1. Clone project

```bash
git clone https://github.com/baoacer/e-Commerce-node.git
cd e-Commerce-node
```

### 2. Cài đặt package
```bash
npm install
```

### 3. Tạo file .env
```env
# Database
DEV_APP_PORT=3055
DEV_DB_HOST="localhost"
DEV_DB_PORT=27017
DEV_DB_NAME="shopDEV"
PRO_APP_PORT=3000
PRO_DB_HOST="localhost"
PRO_DB_PORT=27017
PRO_DB_NAME="shopPRO"

# Discord
DISCORD_TOKEN=MTMyMzQ1MDA0NTYwOTAyMTUxMg.GiZMT1.q38yN5y-AjK8kxFcaZGq3xdsuxMTLCwTqgKkLk
CHANNEL_DISCORD_ID=1323454892655771661

# API - key
API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMzE4NDk0NiwiZXhwIjoxNzAzMjcxMzQ2fQ.uYP3EnI3EeX7oXYAvdKrPUl4qCcfDgtFYknUZgSGuOY
```

### 4. Chạy RabbitMQ + MongoDB (Docker)
```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
docker run --name shopDEV -p 27017:27017 -d mongo:latest
```
🐰 RabbitMQ Management UI có thể truy cập tại http://localhost:15672
Mặc định user: guest / pass: guest

### 5. Chạy server
```
npm run dev
```


## 📌 Ghi chú
Đảm bảo MongoDB và RabbitMQ đang chạy trước khi khởi động server
Discord Webhook cần được tạo trước, thêm vào biến môi trường để ghi log
JWT được sử dụng trong Authorization header dưới dạng `authorization` & API KEY `x-api-key`
USER-ID được truyền qua header `x-client-id`
