# 🚀 সেটআপ ও ইনস্টলেশন গাইড

## প্রয়োজনীয়তা
- Node.js (v14+)
- npm বা yarn
- MongoDB (স্থানীয় বা MongoDB Atlas)
- পোর্ট 5000 এবং 5173 উপলব্ধ থাকতে হবে

---

## ধাপ ১: প্রজেক্ট সেটআপ

### ১.১ ব্যাকএন্ড ইনস্টলেশন

```bash
# ডাউনলোড করা প্রজেক্টে নেভিগেট করুন
cd news-media-portal

# ডিপেন্ডেন্সি ইনস্টল করুন (ইতিমধ্যে করা আছে)
npm install

# .env ফাইল সেটআপ করুন
# নিম্নোক্ত কন্টেন্ট সহ একটি .env ফাইল তৈরি করুন:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/news-portal
# JWT_SECRET=your_secure_secret_key_here
# NODE_ENV=development
```

### ১.২ ফ্রন্টএন্ড ইনস্টলেশন

```bash
cd frontend
npm install
```

---

## ধাপ ২: MongoDB সেটআপ

### স্থানীয় MongoDB ইনস্টল করুন (অথবা MongoDB Atlas ব্যবহার করুন)

#### Windows-এ MongoDB ইনস্টল করুন:
1. https://www.mongodb.com/try/download/community থেকে ডাউনলোড করুন
2. ডিফল্ট সেটিংস সহ ইনস্টল করুন
3. MongoDB Compass এ সংযোগ করুন

#### Linux-এ MongoDB ইনস্টল করুন:
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb

# সার্ভার চালু করুন
sudo systemctl start mongod
```

#### macOS-এ MongoDB ইনস্টল করুন:
```bash
# Homebrew ব্যবহার করে
brew tap mongodb/brew
brew install mongodb-community

# সার্ভার চালু করুন
brew services start mongodb-community
```

---

## ধাপ ৩: সার্ভার চালু করুন

### ব্যাকএন্ড সার্ভার চালু করুন

```bash
# প্রজেক্টের মূল ডিরেক্টরিতে
npm run dev
```

আপনি এই আউটপুট দেখবেন:
```
Server running on http://localhost:5000
```

### ফ্রন্টএন্ড ডেভেলপমেন্ট সার্ভার চালু করুন

নতুন টার্মিনালে:
```bash
cd frontend
npm run dev
```

আপনি এই আউটপুট দেখবেন:
```
VITE v5.0.0  ready in 123 ms

➜  Local:   http://localhost:5173
➜  press h to show help
```

---

## ধাপ ৪: অ্যাপ্লিকেশন অ্যাক্সেস করুন

ব্রাউজারে খুলুন:
```
http://localhost:5173
```

---

## 📝 প্রথম পরীক্ষা

### ১. রেজিস্টার করুন
- **নাম**: John Doe
- **ইমেইল**: john@example.com
- **পাসওয়ার্ড**: password123

### ২. লগইন করুন
- রেজিস্ট্রেশনের পরে স্বয়ংক্রিয়ভাবে ড্যাশবোর্ডে পাঠানো হয়
- লগআউট করুন এবং লগইন পৃষ্ঠা থেকে আবার লগইন করুন

### ৩. নিউজ তৈরি করুন
- ড্যাশবোর্ড থেকে "নিউজ লিখুন" এ ক্লিক করুন
- শিরোনাম, বিবরণ এবং কন্টেন্ট লিখুন
- "প্রকাশ করুন" বাটনে ক্লিক করুন

### ৪. হোমপেজে নিউজ দেখুন
- হোমপেজে প্রকাশিত নিউজ দেখা যাবে
- ক্যাটাগরি এবং সার্চ ফিল্টার ব্যবহার করুন

### ৫. মন্তব্য করুন
- যেকোনো নিউজে ক্লিক করুন
- নিচে মন্তব্য সেকশনে মন্তব্য লিখুন
- "মন্তব্য করুন" বাটনে ক্লিক করুন

---

## 🔧 পরিবেশ ভেরিয়েবল

### ব্যাকএন্ড (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/news-portal
JWT_SECRET=change_this_to_a_secure_key_in_production
NODE_ENV=development
```

### ফ্রন্টএন্ড (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🐛 সমস্যা সমাধান

### সমস্যা: MongoDB কানেক্ট হচ্ছে না
**সমাধান**:
```bash
# MongoDB সার্ভার চেক করুন
mongosh  # MongoDB শেল খুলুন

# অথবা MongoDB compass ব্যবহার করুন
```

### সমস্যা: পোর্ট ইতিমধ্যে ব্যবহৃত হচ্ছে
**সমাধান**:
```bash
# 5000 পোর্ট ব্যবহারকারী প্রক্রিয়া খুঁজুন এবং বন্ধ করুন
# Linux/macOS:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### সমস্যা: মডিউল পাওয়া যাচ্ছে না
**সমাধান**:
```bash
# ডিপেন্ডেন্সি পুনরায় ইনস্টল করুন
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 প্রোডাকশনের জন্য বিল্ড

### ব্যাকএন্ড প্রোডাকশন
```bash
npm start
```

### ফ্রন্টএন্ড প্রোডাকশন বিল্ড
```bash
cd frontend
npm run build
```

---

## 🚀 আরও তথ্য

- ব্যাকএন্ড API ডকুমেন্টেশন: README.md দেখুন
- ফ্রন্টএন্ড প্রজেক্ট: `frontend/` ফোল্ডারে
- ব্যাকএন্ড প্রজেক্ট: `backend/` ফোল্ডারে

---

**Happy Coding! 🎉**
