# News Media Portal

A full-stack online news media portal built with Node.js, Express, MongoDB, and React.

The project supports:
- User registration and login
- Admin dashboard for category and article management
- News publishing with image upload support
- Category-based filtering and search
- Comments and likes
- Responsive design for desktop and mobile

## Tech stack

Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- Multer for image uploads

Frontend:
- React
- Vite
- React Router
- Axios

## Project structure

```bash
news-media-portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── uploads/
├── .env
├── .env.example
├── server.js
├── package.json
├── README.md
├── SETUP.md
├── QUICKSTART.md
└── .gitignore
```

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas or a local MongoDB instance

## Quick start

1. Clone the project

```bash
git clone https://github.com/Student-Saad/news-media-portal.git
cd news-media-portal
```

2. Install backend dependencies

```bash
npm install
```

3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

4. Create the environment file

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Then update the values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/news-portal
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
ADMIN_EMAIL=admin@newsportal.com
ADMIN_PASSWORD=admin123
```

If you use MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

5. Start the backend

```bash
npm start
```

The backend runs on:
- http://localhost:5000

6. Start the frontend

Open a new terminal:

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

The frontend runs on:
- http://localhost:5173

## Default admin account

```text
Email: admin@newsportal.com
Password: admin123
```

## Features

- User registration and login
- Admin category management
- Admin article publishing
- Public article listing with search and filters
- Published article visibility for users
- Likes and comments
- Image upload for news stories
- Responsive layout for mobile and desktop

## API overview

### Auth

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile
```

### Articles

```http
GET /api/articles
GET /api/articles/:id
POST /api/articles
PUT /api/articles/:id
DELETE /api/articles/:id
POST /api/articles/:id/like
```

### Categories

```http
GET /api/categories
POST /api/categories
DELETE /api/categories/:id
```

### Comments

```http
GET /api/comments/article/:articleId
POST /api/comments/article/:articleId
PUT /api/comments/:id
DELETE /api/comments/:id
```

### Admin analytics

```http
GET /api/admin/analytics
```

## Common setup problems

### MongoDB connection issue

Make sure your MongoDB service is running or your Atlas connection string is valid.

```bash
mongosh
```

### Port already in use

```bash
# Linux/macOS
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies missing

```bash
rm -rf node_modules frontend/node_modules package-lock.json frontend/package-lock.json
npm install
cd frontend && npm install
```

## Production build

Backend:
```bash
npm start
```

Frontend:
```bash
cd frontend
npm run build
```

## GitHub push instructions

After authenticating with GitHub on your machine, run:

```bash
git push -u origin main
```

If the repository is not yet linked, run:

```bash
git remote add origin https://github.com/Student-Saad/news-media-portal.git
git branch -M main
git push -u origin main
```

## License

This project is intended for learning and assignment/demo use.

## Notes

- The project includes a default admin account for testing.
- Uploaded article images are stored in the `uploads/` directory.
- The frontend uses local API calls to `http://localhost:5000/api` by default.
