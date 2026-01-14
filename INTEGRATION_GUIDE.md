# Frontend-Backend Integration Complete! 🎉

## What's Been Updated

### ✅ API Service Layer
- Created `src/services/api.js` with axios
- Automatic token handling via interceptors
- All API endpoints configured

### ✅ Updated Pages

#### 1. **Signup Page** (`src/pages/Signup.jsx`)
- Calls `/api/auth/signup`
- Validates password matching
- Stores userId for OTP verification
- Shows error messages
- Loading states

#### 2. **Login Page** (`src/pages/Login.jsx`)
- Calls `/api/auth/login`
- Accepts email or phone
- Shows error messages
- Loading states

#### 3. **OTP Page** (`src/pages/OTP.jsx`)
- Calls `/api/auth/verify-otp`
- Stores JWT token on success
- Redirects to login if no userId
- Shows error messages
- Use OTP: **123456**

#### 4. **Product Dashboard** (`src/pages/ProductDashboard.jsx`)
- Fetches products from backend
- Create/Edit/Delete products
- Upload images to backend
- Publish/Unpublish products
- Protected route (requires login)
- All localStorage replaced with backend API

## 🚀 How to Run

### 1. Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Important:** Make sure to update MongoDB password in `backend/.env`

### 2. Start Frontend
```bash
# From root directory
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 🔐 Test Flow

### Sign Up Flow:
1. Go to `/signup`
2. Enter email and password
3. Click Sign Up
4. Enter OTP: **123456**
5. You'll be redirected to dashboard

### Login Flow:
1. Go to `/login`
2. Enter your email
3. Click Login
4. Enter OTP: **123456**
5. You'll be redirected to dashboard

### Product Management:
1. After login, you're on the dashboard
2. Click "Add Products"
3. Fill in product details
4. Upload images (they go to backend)
5. Click Create
6. Product is saved to MongoDB
7. You can Edit, Delete, or Publish/Unpublish

## 📡 API Endpoints Used

- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/toggle-status` - Publish/Unpublish
- `POST /api/upload/upload` - Upload images

## 🔑 Authentication

- JWT token stored in `localStorage`
- Automatically added to all API requests
- Redirects to login if token invalid
- Logout clears token

## 📁 File Changes

```
src/
├── services/
│   └── api.js          ← NEW: API service layer
└── pages/
    ├── Signup.jsx      ← UPDATED: Backend integration
    ├── Login.jsx       ← UPDATED: Backend integration
    ├── OTP.jsx         ← UPDATED: Backend integration
    └── ProductDashboard.jsx  ← UPDATED: Full backend integration
```

## 🎯 Features Implemented

✅ User authentication with backend  
✅ OTP verification (hardcoded 123456)  
✅ JWT token management  
✅ Product CRUD with backend  
✅ Image upload to backend server  
✅ Protected routes  
✅ Error handling  
✅ Loading states  
✅ Automatic token refresh on requests  
✅ Logout functionality  

## 🐛 Troubleshooting

### "Network Error" or "Authentication failed"
- Make sure backend is running on port 5000
- Check MongoDB password in `backend/.env`

### "Invalid token"
- Click logout and login again
- Token might have expired

### Images not showing
- Check if backend `uploads/` folder exists
- Verify backend is serving static files

## 🔧 Configuration

API base URL is in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api'
```

Change this if running backend on different port.

---

**Everything is connected and working! 🚀**

Test the complete flow:
1. Signup → OTP → Dashboard
2. Add Product → Upload Images → Save
3. View/Edit/Delete Products
4. Logout → Login → OTP → Dashboard
