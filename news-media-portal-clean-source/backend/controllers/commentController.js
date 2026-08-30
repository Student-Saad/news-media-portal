const Comment = require('../models/Comment');
const Article = require('../models/Article');

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { articleId } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      article: articleId,
    });

    await comment.save();
    await comment.populate('author', 'name avatar');

    article.comments.push(comment._id);
    await article.save();

    res.status(201).json({
      message: 'Comment created successfully',
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ article: articleId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    comment.updatedAt = Date.now();
    await comment.save();

    res.json({ message: 'Comment updated', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndRemove(req.params.id);
    
    await Article.findByIdAndUpdate(
      comment.article,
      { $pull: { comments: req.params.id } }
    );

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
      await comment.save();
      return res.json({ message: 'Comment unliked', comment });
    }

    comment.likes.push(req.user.id);
    await comment.save();
    res.json({ message: 'Comment liked', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
