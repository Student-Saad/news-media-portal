import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI, categoryAPI } from '../services/api';
import './Home.css';

function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
    const interval = setInterval(() => {
      fetchArticles();
    }, 20000);
    return () => clearInterval(interval);
  }, [category, search, page]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await articleAPI.getArticles({
        category: category || undefined,
        search: search || undefined,
        page,
        limit: 10,
      });
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>Online News Media Portal</h1>
        <p>Get the latest news and updates</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : articles.length === 0 ? (
        <div className="no-articles">No news found</div>
      ) : (
        <div className="articles-grid">
          {articles.map((article) => (
            <Link to={`/article/${article._id}`} key={article._id} className="article-card">
              {article.imageUrl && (
                <img src={article.imageUrl} alt={article.title} className="article-image" />
              )}
              <div className="article-content">
                <span className="article-category">{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <div className="article-footer">
                  <span className="article-author">Written by: {article.authorName || article.author?.name || 'Admin'}</span>
                  <span className="article-views">👁️ {article.views}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="page-number">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
