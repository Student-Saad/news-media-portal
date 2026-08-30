const User = require('../models/User');
const Article = require('../models/Article');
const Category = require('../models/Category');

exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalArticles, totalCategories, publishedArticles, draftArticles] = await Promise.all([
      User.countDocuments(),
      Article.countDocuments(),
      Category.countDocuments(),
      Article.countDocuments({ isPublished: true }),
      Article.countDocuments({ isPublished: false }),
    ]);

    const recentArticles = await Article.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const categoryBreakdown = await Article.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const stats = {
      totalUsers,
      totalArticles,
      totalCategories,
      publishedArticles,
      draftArticles,
      recentArticles,
      categoryBreakdown,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
