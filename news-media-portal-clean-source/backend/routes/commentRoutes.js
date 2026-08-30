const express = require('express');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
} = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/article/:articleId', getComments);
router.post('/article/:articleId', auth, createComment);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);
router.post('/:id/like', auth, likeComment);

module.exports = router;
