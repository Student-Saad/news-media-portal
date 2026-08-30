import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, articleAPI, categoryAPI } from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalCategories: 0,
    publishedArticles: 0,
    draftArticles: 0,
    recentArticles: [],
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [articleForm, setArticleForm] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    authorName: JSON.parse(localStorage.getItem('user') || 'null')?.name || 'Admin',
    isPublished: true,
    image: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setArticleForm((prev) => ({ ...prev, image: file }));
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [categoryRes, articleRes, analyticsRes] = await Promise.all([
        categoryAPI.getCategories(),
        articleAPI.getArticles({ limit: 50 }),
        adminAPI.getAnalytics(),
      ]);

      setCategories(categoryRes.data);
      setArticles(articleRes.data.articles || []);
      setStats(analyticsRes.data || stats);
      if (categoryRes.data.length > 0) {
        setArticleForm((prev) => ({ ...prev, category: categoryRes.data[0].name }));
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticleForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      await categoryAPI.createCategory({ name: categoryName });
      setCategoryName('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Category creation failed');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoryAPI.deleteCategory(id);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Category delete failed');
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(articleForm).forEach(([key, value]) => {
        if (key === 'image') return;
        if (key === 'isPublished') {
          payload.append(key, String(value));
          return;
        }
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });
      if (articleForm.image) {
        payload.append('image', articleForm.image);
      }

      await articleAPI.createArticle(payload);
      setArticleForm({
        title: '',
        description: '',
        content: '',
        category: categories[0]?.name || '',
        authorName: JSON.parse(localStorage.getItem('user') || 'null')?.name || 'Admin',
        isPublished: true,
        image: null,
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'News create failed');
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      await articleAPI.deleteArticle(id);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Article delete failed');
    }
  };

  if (loading) return <div className="admin-loading">Loading admin panel...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-shell">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button className="logout-button" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/admin/login');
          }}>
            Logout
          </button>
        </div>

        <div className="analytics-grid">
          <div className="metric-card">
            <span>Total Users</span>
            <strong>{stats.totalUsers}</strong>
          </div>
          <div className="metric-card">
            <span>Published News</span>
            <strong>{stats.publishedArticles}</strong>
          </div>
          <div className="metric-card">
            <span>Draft News</span>
            <strong>{stats.draftArticles}</strong>
          </div>
          <div className="metric-card">
            <span>Categories</span>
            <strong>{stats.totalCategories}</strong>
          </div>
        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            <h2>Add Category</h2>
            <form onSubmit={handleCategorySubmit} className="admin-form">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
              />
              <button type="submit">Save Category</button>
            </form>

            <div className="category-list">
              {categories.map((category) => (
                <div key={category._id} className="category-item">
                  <span>{category.name}</span>
                  <button type="button" onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <h2>Add News</h2>
            <form onSubmit={handleArticleSubmit} className="admin-form admin-article-form">
              <input name="title" value={articleForm.title} onChange={handleArticleChange} placeholder="Headline" required />
              <textarea name="description" value={articleForm.description} onChange={handleArticleChange} placeholder="Short summary" rows="3" required />
              <textarea name="content" value={articleForm.content} onChange={handleArticleChange} placeholder="Full article content" rows="6" required />
              <input name="authorName" value={articleForm.authorName} onChange={handleArticleChange} placeholder="Written by" required />
              <div className="file-upload-wrapper">
                <label htmlFor="admin-news-image" className="file-upload-label">Choose File</label>
                <span className="file-upload-name">{articleForm.image ? articleForm.image.name : 'No file selected'}</span>
                <input
                  id="admin-news-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-upload-input"
                />
              </div>
              <select name="category" value={articleForm.category} onChange={handleArticleChange}>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <label className="publish-toggle">
                <input type="checkbox" name="isPublished" checked={articleForm.isPublished} onChange={handleArticleChange} />
                Publish immediately
              </label>
              <button type="submit">Publish News</button>
            </form>
          </section>
        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            <h2>Category Performance</h2>
            <div className="breakdown-list">
              {stats.categoryBreakdown.length ? stats.categoryBreakdown.map((item) => (
                <div key={item._id} className="breakdown-item">
                  <span>{item._id}</span>
                  <strong>{item.count}</strong>
                </div>
              )) : <p>No published categories yet.</p>}
            </div>
          </section>

          <section className="admin-panel">
            <h2>Recent News</h2>
            <div className="article-admin-list">
              {stats.recentArticles.length ? stats.recentArticles.map((article) => (
                <div key={article._id} className="article-admin-item">
                  <div>
                    <strong>{article.title}</strong>
                    <p>{article.category} • Written by {article.authorName || article.author?.name || 'Admin'}</p>
                  </div>
                </div>
              )) : <p>No recent articles.</p>}
            </div>
          </section>
        </div>

        <section className="admin-panel article-management">
          <h2>News Management</h2>
          <div className="article-admin-list">
            {articles.map((article) => (
              <div key={article._id} className="article-admin-item">
                <div>
                  <strong>{article.title}</strong>
                  <p>{article.category}</p>
                </div>
                <button type="button" onClick={() => handleDeleteArticle(article._id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
