# Productr Backend - Complete API Documentation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure Environment Variables:**
   
   Edit the `.env` file and replace `<db_password>` with your actual MongoDB password:
   ```
   MONGODB_URI=mongodb+srv://raoabhi210_db_user:YOUR_ACTUAL_PASSWORD@cluster0.3gzf8rn.mongodb.net/productr?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=productr_super_secret_jwt_key_2026_change_this_in_production
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication

#### 1. **Sign Up**
- **POST** `/api/auth/signup`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Signup successful. Please verify OTP. Use 123456",
    "userId": "507f1f77bcf86cd799439011",
    "otp": "123456"
  }
  ```

#### 2. **Login**
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "emailOrPhone": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "OTP sent. Use 123456",
    "userId": "507f1f77bcf86cd799439011",
    "otp": "123456"
  }
  ```

#### 3. **Verify OTP**
- **POST** `/api/auth/verify-otp`
- **Body:**
  ```json
  {
    "userId": "507f1f77bcf86cd799439011",
    "otp": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "message": "OTP verified successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "507f1f77bcf86cd799439011"
  }
  ```

---

### Products (Protected Routes - Requires Authentication)

**Note:** All product endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 4. **Create Product**
- **POST** `/api/products`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "productName": "CakeZone Walnut Brownie",
    "productType": "food",
    "quantityStock": 100,
    "mrp": 250,
    "sellingPrice": 200,
    "brandName": "CakeZone",
    "images": ["/uploads/product-123456.jpg"],
    "exchangeReturn": "Yes"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Product created",
    "product": { ... }
  }
  ```

#### 5. **Get All Products (for logged-in user)**
- **GET** `/api/products`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    {
      "_id": "507f1f77bcf86cd799439011",
      "productName": "CakeZone Walnut Brownie",
      "productType": "food",
      "quantityStock": 100,
      "mrp": 250,
      "sellingPrice": 200,
      "brandName": "CakeZone",
      "images": ["/uploads/product-123456.jpg"],
      "exchangeReturn": "Yes",
      "status": "unpublished",
      "createdAt": "2026-01-14T00:00:00.000Z",
      "updatedAt": "2026-01-14T00:00:00.000Z"
    }
  ]
  ```

#### 6. **Get Single Product**
- **GET** `/api/products/:id`
- **Headers:** `Authorization: Bearer <token>`

#### 7. **Update Product**
- **PUT** `/api/products/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (all fields optional)
  ```json
  {
    "productName": "Updated Name",
    "quantityStock": 150,
    "status": "published"
  }
  ```

#### 8. **Delete Product**
- **DELETE** `/api/products/:id`
- **Headers:** `Authorization: Bearer <token>`

#### 9. **Toggle Publish Status**
- **PATCH** `/api/products/:id/toggle-status`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "message": "Product status updated",
    "product": { ... }
  }
  ```

---

### File Upload

#### 10. **Upload Product Images**
- **POST** `/api/upload/upload`
- **Content-Type:** `multipart/form-data`
- **Body:** Form data with `images` field (supports up to 10 images)
- **Response:**
  ```json
  {
    "message": "Images uploaded successfully",
    "files": [
      "/uploads/product-1705180000000-123456789.jpg",
      "/uploads/product-1705180000000-987654321.jpg"
    ]
  }
  ```

#### 11. **Delete Image**
- **DELETE** `/api/upload/delete/:filename`
- **Example:** `/api/upload/delete/product-1705180000000-123456789.jpg`

---

### Health Check

#### 12. **Health Check**
- **GET** `/api/health`
- **Response:**
  ```json
  {
    "message": "Backend is running"
  }
  ```

---

## 🔐 Authentication Flow

1. **Sign Up** → User registers with email & password → Receives userId and OTP (123456)
2. **Verify OTP** → User sends userId and OTP → Receives JWT token
3. **Access Protected Routes** → User includes JWT token in Authorization header

**OR**

1. **Login** → User sends email/phone → Receives userId and OTP (123456)
2. **Verify OTP** → User sends userId and OTP → Receives JWT token
3. **Access Protected Routes** → User includes JWT token in Authorization header

---

## 📝 Notes

- **Hardcoded OTP:** For development purposes, the OTP is always `123456`
- **Image Uploads:** Images are stored in the `uploads/` directory
- **File Size Limit:** Maximum 5MB per image
- **Supported Image Formats:** jpeg, jpg, png, gif, webp
- **Token Expiry:** JWT tokens expire in 7 days
- **OTP Expiry:** OTP expires in 10 minutes

---

## 🗂️ Project Structure

```
backend/
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── models/
│   ├── User.js          # User schema
│   └── Product.js       # Product schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── products.js      # Product CRUD routes
│   └── upload.js        # Image upload routes
├── uploads/             # Uploaded images directory
├── .env                 # Environment variables
├── server.js            # Main application file
└── package.json         # Dependencies

```

---

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests
- **Nodemon** - Development auto-reload

---

## 🚨 Important Security Notes

1. **Change the JWT_SECRET** in production to a strong, random string
2. **Replace <db_password>** in MongoDB URI with your actual password
3. **Never commit .env** files to version control
4. **Use HTTPS** in production
5. **Implement rate limiting** for production
6. **Set up proper CORS** origins in production

---

## ✅ Backend Features Completed

✅ User authentication (signup, login, OTP verification)  
✅ JWT-based authorization  
✅ Product CRUD operations  
✅ Image upload functionality  
✅ Publish/unpublish products  
✅ User-specific product filtering  
✅ Error handling and validation  
✅ MongoDB integration  
✅ Hardcoded OTP (123456) for easy testing  

---

## 🔄 Next Steps

1. Replace `<db_password>` in `.env` with your MongoDB password
2. Start the backend: `npm run dev`
3. Test the APIs using Postman or integrate with your frontend
4. Update frontend to call these API endpoints

---

**Backend is ready! 🎉**
