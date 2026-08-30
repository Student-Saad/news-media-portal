import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleAPI, categoryAPI } from '../services/api';
import './CreateArticle.css';

function CreateArticle() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    authorName: JSON.parse(localStorage.getItem('user') || 'null')?.name || '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      const fetched = response.data || [];
      setCategories(fetched);
      if (fetched.length > 0) {
        setFormData((prev) => ({ ...prev, category: fetched[0].name }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });
      if (image) {
        payload.append('image', image);
      }
      await articleAPI.createArticle(payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-article">
      <div className="create-article-container">
        <h1>Write New News</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="article-form">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
          
          <textarea
            name="description"
            placeholder="Short summary"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="form-textarea"
          />
          
          <textarea
            name="content"
            placeholder="Full article content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
            className="form-textarea"
          />

          <input
            type="text"
            name="authorName"
            placeholder="Written by"
            value={formData.authorName}
            onChange={handleChange}
            className="form-input"
          />

          <div className="file-upload-wrapper">
            <label htmlFor="create-news-image" className="file-upload-label">Choose File</label>
            <span className="file-upload-name">{image ? image.name : 'No file selected'}</span>
            <input
              id="create-news-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-upload-input"
            />
          </div>
          
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateArticle;
