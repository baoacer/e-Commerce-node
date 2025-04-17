# 🛒 eCommerce API

Dự án eCommerce RESTful API được xây dựng bằng Node.js, sử dụng MongoDB để lưu trữ dữ liệu, RabbitMQ để xử lý các tác vụ bất đồng bộ, Discord để ghi log và JWT để bảo mật.

## 🧰 Công nghệ sử dụng

- **Node.js** + **Express** – Xây dựng server và API
- **MongoDB** – Cơ sở dữ liệu NoSQL
- **RabbitMQ** – Hàng đợi tin nhắn để xử lý bất đồng bộ (product, v.v.)
- **JWT (JSON Web Token)** – Xác thực và phân quyền
- **Discord Webhook** – Gửi log và cảnh báo đến Discord
- **dotenv** – Quản lý biến môi trường
- **Cloudinary** - Upload Image
- **AWS-S3** - Quản lý, lưu trữ Images

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

### 3. Tạo Discord Bot (tutorial)
### 4. Đăng ký Cloudinary - upload ảnh
### 5. Đăng ký aws 

### 6. Chạy RabbitMQ + MongoDB (Docker)
```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
docker run --name shopDEV -p 27017:27017 -d mongo:latest
docker run -d --name redis-server -p 6379:6379 redis:latest
```
🐰 RabbitMQ Management UI có thể truy cập tại http://localhost:15672
Mặc định user: guest / pass: guest

### 7. Tạo file .env
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
DISCORD_TOKEN=<your token>
CHANNEL_DISCORD_ID=<your discord id>

# API - key
API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your cloudinary name>
CLOUDINARY_API_KEY=<your cloudinary api key >
CLOUDINARY_API_SECRET=<your cloudinary secret key>
CLOUDINARY_CLOUDINARY_URL=<your cloudinary url>

# AWS S3
AWS_BUCKET_NAME=<your aws bucket name>
AWS_BUCKET_ACCESS_KEY=<your aws users access key>
AWS_BUCKET_SECRET_KEY=<your users secret key>
AWS_BUCKET_REGION=<your bucket region>
```

### 8. Chạy server
```
npm run dev
```


## 📌 Ghi chú
Đảm bảo MongoDB, RabbitMQ và Redis đang chạy trước khi khởi động server
Discord Webhook cần được tạo trước, thêm vào biến môi trường để ghi log
JWT được sử dụng trong Authorization header dưới dạng `authorization` & API KEY `x-api-key`
USER-ID được truyền qua header `x-client-id`
