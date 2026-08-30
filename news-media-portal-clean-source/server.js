require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./backend/config/db');
const User = require('./backend/models/User');
const Category = require('./backend/models/Category');
const authRoutes = require('./backend/routes/authRoutes');
const articleRoutes = require('./backend/routes/articleRoutes');
const commentRoutes = require('./backend/routes/commentRoutes');
const categoryRoutes = require('./backend/routes/categoryRoutes');
const adminRoutes = require('./backend/routes/adminRoutes');

const app = express();

const ensureDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  try {
    const existing = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existing) {
      const password = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'Admin',
        email: adminEmail.toLowerCase(),
        password,
        role: 'admin',
      });
      console.log(`Default admin created: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

const ensureDefaultCategories = async () => {
  try {
    const defaultCategories = ['Politics', 'Sports', 'Technology', 'Business', 'Entertainment', 'Health', 'Science'];
    for (const name of defaultCategories) {
      const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const exists = await Category.findOne({ slug });
      if (!exists) {
        await Category.create({ name, slug });
      }
    }
  } catch (error) {
    console.error('Error creating default categories:', error.message);
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Connect to Database
connectDB().then(async () => {
  await ensureDefaultAdmin();
  await ensureDefaultCategories();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
