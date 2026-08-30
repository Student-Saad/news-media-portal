const express = require('express');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCategories);
router.post('/', auth, adminOnly, createCategory);
router.delete('/:id', auth, adminOnly, deleteCategory);

module.exports = router;
