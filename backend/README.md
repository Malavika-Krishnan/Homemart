# HomeMart Backend API Service

HomeMart is a smart family shopping list backend application built with **Node.js**, **Express**, **TypeScript**, and **MongoDB** (via Mongoose).

## Features & Supported GitHub Issues

1. **API Documentation & Postman Collection** (Issue #1)
   - Comprehensive docs in `docs/`
   - Exportable Postman collection in `postman/Homemart_API_Collection.json`
2. **Backend Testing & Bug Fixes** (Issue #2)
   - Integration & unit tests with Jest, Supertest & MongoMemoryServer
3. **Database Optimization & Security** (Issue #3)
   - Indexed Mongoose schemas, text search index, rate limiting, and NoSQL protection
4. **Offline Synchronization Service** (Issue #4)
   - Batched sync operations, Last-Write-Wins (LWW) conflict resolution, and audit logging
5. **Notification API** (Issue #5)
   - Automated shopping reminders, purchase notifications, and read tracking
6. **Shopping Item API** (Issue #6)
   - Add/edit/delete items, quantity/priority updates, category filtering & text search
7. **Shopping List API** (Issue #7)
   - Create, update, list, and delete family shopping lists
8. **Family Management API** (Issue #8)
   - Household creation, permanent invite codes/links, role management (`ADMIN` / `MEMBER`)
9. **User Profile API** (Issue #9)
   - Retrieve & update profile, avatar URL, and change password
10. **User Authentication API** (Issue #10)
    - Registration, login, logout, permanent JWT authentication, and bcrypt password hashing

---

## Setup & Running Locally

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` or adjust configuration as needed:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/homemart_db
JWT_SECRET=super_secret_jwt_key_homemart_2026_permanent_token
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Test Suite
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
npm start
```
