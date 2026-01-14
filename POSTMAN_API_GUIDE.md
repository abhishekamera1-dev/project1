# Productr API - Postman Testing Guide

**Base URL:** `http://localhost:5000/api`

---

## 1. Health Check

**GET** `http://localhost:5000/api/health`

No headers or body needed.

---

## 2. User Signup

**POST** `http://localhost:5000/api/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Signup successful. Please verify OTP. Use 123456",
  "userId": "678c1234567890abcdef1234",
  "otp": "123456"
}
```

**Save the `userId` for the next step!**

---

## 3. Verify OTP

**POST** `http://localhost:5000/api/auth/verify-otp`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "userId": "678c1234567890abcdef1234",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "678c1234567890abcdef1234"
}
```

**Save the `token` - you'll need it for all product APIs!**

---

## 4. Login (Alternative to Signup)

**POST** `http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "emailOrPhone": "test@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent. Use 123456",
  "userId": "678c1234567890abcdef1234",
  "otp": "123456"
}
```

Then use the Verify OTP endpoint (step 3) to get your token.

---

## 5. Create Product

**POST** `http://localhost:5000/api/products`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "productName": "CakeZone Walnut Brownie",
  "productType": "food",
  "quantityStock": 100,
  "mrp": 250,
  "sellingPrice": 200,
  "brandName": "CakeZone",
  "images": [],
  "exchangeReturn": "Yes"
}
```

**Response:**
```json
{
  "message": "Product created",
  "product": {
    "_id": "678c5678901234abcdef5678",
    "productName": "CakeZone Walnut Brownie",
    "productType": "food",
    "quantityStock": 100,
    "mrp": 250,
    "sellingPrice": 200,
    "brandName": "CakeZone",
    "images": [],
    "exchangeReturn": "Yes",
    "status": "unpublished",
    "userId": "678c1234567890abcdef1234",
    "createdAt": "2026-01-14T00:00:00.000Z",
    "updatedAt": "2026-01-14T00:00:00.000Z"
  }
}
```

---

## 6. Get All Products

**GET** `http://localhost:5000/api/products`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

No body needed.

**Response:**
```json
[
  {
    "_id": "678c5678901234abcdef5678",
    "productName": "CakeZone Walnut Brownie",
    "productType": "food",
    "quantityStock": 100,
    "mrp": 250,
    "sellingPrice": 200,
    "brandName": "CakeZone",
    "images": [],
    "exchangeReturn": "Yes",
    "status": "unpublished",
    "userId": "678c1234567890abcdef1234",
    "createdAt": "2026-01-14T00:00:00.000Z",
    "updatedAt": "2026-01-14T00:00:00.000Z"
  }
]
```

---

## 7. Get Single Product

**GET** `http://localhost:5000/api/products/PRODUCT_ID`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Example: `http://localhost:5000/api/products/678c5678901234abcdef5678`

---

## 8. Update Product

**PUT** `http://localhost:5000/api/products/PRODUCT_ID`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "productName": "Updated Product Name",
  "quantityStock": 150,
  "sellingPrice": 180
}
```

---

## 9. Delete Product

**DELETE** `http://localhost:5000/api/products/PRODUCT_ID`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Example: `http://localhost:5000/api/products/678c5678901234abcdef5678`

---

## 10. Toggle Publish/Unpublish

**PATCH** `http://localhost:5000/api/products/PRODUCT_ID/toggle-status`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Example: `http://localhost:5000/api/products/678c5678901234abcdef5678/toggle-status`

---

## 11. Upload Images

**POST** `http://localhost:5000/api/upload/upload`

**Headers:**
```
(Don't set Content-Type - Postman will set it automatically for form-data)
```

**Body (form-data):**
- Key: `images`
- Type: File
- Value: Select your image file(s)
- You can add multiple files with the same key name `images`

**Response:**
```json
{
  "message": "Images uploaded successfully",
  "files": [
    "/uploads/product-1705180000000-123456789.jpg",
    "/uploads/product-1705180000000-987654321.jpg"
  ]
}
```

---

## 12. Delete Image

**DELETE** `http://localhost:5000/api/upload/delete/FILENAME`

Example: `http://localhost:5000/api/upload/delete/product-1705180000000-123456789.jpg`

---

## Quick Testing Flow:

### Step 1: Signup
```
POST http://localhost:5000/api/auth/signup
Body: {"email": "test@example.com", "password": "password123"}
→ Copy userId
```

### Step 2: Verify OTP
```
POST http://localhost:5000/api/auth/verify-otp
Body: {"userId": "PASTE_USERID_HERE", "otp": "123456"}
→ Copy token
```

### Step 3: Create Product
```
POST http://localhost:5000/api/products
Header: Authorization: Bearer PASTE_TOKEN_HERE
Body: {"productName": "Test Product", "productType": "food", "quantityStock": 10, "mrp": 100, "sellingPrice": 80, "brandName": "TestBrand", "exchangeReturn": "Yes"}
→ Copy product _id
```

### Step 4: Get All Products
```
GET http://localhost:5000/api/products
Header: Authorization: Bearer PASTE_TOKEN_HERE
```

### Step 5: Update Product
```
PUT http://localhost:5000/api/products/PASTE_PRODUCT_ID_HERE
Header: Authorization: Bearer PASTE_TOKEN_HERE
Body: {"productName": "Updated Name", "quantityStock": 20}
```

### Step 6: Delete Product
```
DELETE http://localhost:5000/api/products/PASTE_PRODUCT_ID_HERE
Header: Authorization: Bearer PASTE_TOKEN_HERE
```

---

## Important Notes:

1. **OTP is always:** `123456`
2. **Replace YOUR_TOKEN_HERE** with the actual token from step 2
3. **Replace PRODUCT_ID** with actual product ID from responses
4. **MongoDB password:** Make sure to update in `backend/.env` file
5. **Backend must be running** on port 5000

---

## Common Errors:

### Error: "bad auth: authentication failed"
- MongoDB password is wrong in `.env` file

### Error: "Unauthorized" or "Invalid token"
- Token is missing or expired
- Get a new token by doing Signup → Verify OTP

### Error: "User already exists"
- Use a different email or use the Login endpoint instead

---

**Happy Testing! 🚀**
