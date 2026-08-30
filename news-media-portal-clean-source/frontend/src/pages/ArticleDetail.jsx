import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleAPI, commentAPI } from '../services/api';
import './ArticleDetail.css';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await articleAPI.getArticleById(id);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await articleAPI.likeArticle(id);
      setArticle(response.data.article);
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentAPI.createComment(id, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) return <div className="article-loading">Loading...</div>;

  if (!article) return <div className="article-not-found">News not found</div>;

  return (
    <div className="article-detail">
      <div className="article-detail-container">
        <article className="article-main">
          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.title} className="article-main-image" />
          )}
          
          <div className="article-meta">
            <span className="article-category-badge">{article.category}</span>
            <span className="article-views-badge">👁️ {article.views}</span>
          </div>
          
          <h1>{article.title}</h1>
          
          <div className="article-author-info">
            <div className="author-avatar">
              {(article.authorName || article.author?.name || 'A')[0]}
            </div>
            <div>
              <p className="author-name">Written by: {article.authorName || article.author?.name || 'Admin'}</p>
              <p className="author-email">{article.author?.email || 'Reporter profile'}</p>
            </div>
          </div>
          
          <div className="article-content">
            <p>{article.description}</p>
            <hr />
            <p>{article.content}</p>
          </div>
          
          <div className="article-actions">
            <button onClick={handleLike} className="like-btn">
              ❤️ Like ({article.likes?.length || 0})
            </button>
          </div>
        </article>

        <section className="comments-section">
          <h2>Comments ({comments.length})</h2>
          
          {localStorage.getItem('token') ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                rows="4"
                className="comment-input"
              />
              <button type="submit" className="comment-submit">Post Comment</button>
            </form>
          ) : (
            <p className="login-prompt">To comment, please <a href="/login">login</a></p>
          )}
          
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-author">
                    <span className="comment-avatar">{comment.author?.name[0]}</span>
                    <div>
                      <p className="comment-author-name">{comment.author?.name}</p>
                      <p className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                  <button className="comment-like-btn">
                    👍 {comment.likes?.length || 0}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ArticleDetail;
