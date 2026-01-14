# Productr Backend

Node.js + MongoDB backend for Productr application

## Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file with your MongoDB connection string and JWT secret

4. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP

### Products
- `POST /api/products` - Create product
- `GET /api/products` - Get all products for logged-in user
- `GET /api/products/:id` - Get specific product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/toggle-status` - Toggle publish/unpublish

## Database Models

- **User** - Email, phone, password, OTP verification
- **Product** - Product details, status, images, user reference
