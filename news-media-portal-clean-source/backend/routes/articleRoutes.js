const express = require('express');
const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
} = require('../controllers/articleController');
const upload = require('../config/upload');
const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getArticles);
router.get('/:id', getArticleById);
router.post('/', auth, editorOrAdmin, upload.single('image'), createArticle);
router.put('/:id', auth, upload.single('image'), updateArticle);
router.delete('/:id', auth, deleteArticle);
router.post('/:id/like', auth, likeArticle);

module.exports = router;
