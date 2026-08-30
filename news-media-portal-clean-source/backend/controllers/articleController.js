const Article = require('../models/Article');
const User = require('../models/User');
const Category = require('../models/Category');

exports.createArticle = async (req, res) => {
  try {
    const { title, description, content, category, isPublished, authorName } = req.body;

    if (!title || !description || !content || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedCategory = category.trim();
    const categoryExists = await Category.findOne({
      name: { $regex: `^${normalizedCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });

    if (!categoryExists) {
      return res.status(400).json({ message: `Category "${normalizedCategory}" does not exist. Add it from admin panel first.` });
    }

    const resolvedAuthorName = (authorName || req.user?.name || 'Admin').trim();

    const article = new Article({
      title,
      description,
      content,
      category: normalizedCategory,
      author: req.user.id,
      authorName: resolvedAuthorName,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : false,
    });

    await article.save();
    await article.populate('author', 'name email avatar');

    res.status(201).json({
      message: 'Article created successfully',
      article,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    let query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await Article.find(query)
      .populate('author', 'name email avatar')
      .populate('comments')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email avatar bio')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' },
      });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { title, description, content, category, isPublished, authorName } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this article' });
    }

    article.title = title || article.title;
    article.description = description || article.description;
    article.content = content || article.content;
    article.category = category || article.category;
    article.authorName = authorName ? authorName.trim() : article.authorName || article.author?.name || 'Admin';
    article.isPublished = isPublished !== undefined ? isPublished : article.isPublished;
    article.updatedAt = Date.now();

    await article.save();
    res.json({ message: 'Article updated', article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }

    await Article.findByIdAndRemove(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const likeIndex = article.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      article.likes.splice(likeIndex, 1);
      await article.save();
      return res.json({ message: 'Article unliked', article });
    }

    article.likes.push(req.user.id);
    await article.save();
    res.json({ message: 'Article liked', article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
