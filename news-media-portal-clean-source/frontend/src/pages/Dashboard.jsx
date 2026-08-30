import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
      setFormData({ name: response.data.name, bio: response.data.bio });
    } catch (error) {
      console.error('Error fetching profile:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.updateProfile(formData);
      setUser(response.data.user);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        
        {user && (
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">{user.name[0]}</div>
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <span className="profile-role">{user.role}</span>
              </div>
            </div>

            {!editMode ? (
              <div className="profile-details">
                <p><strong>Biography:</strong> {user.bio || 'No biography added yet'}</p>
                <button onClick={() => setEditMode(true)} className="edit-btn">
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <textarea
                  name="bio"
                  placeholder="Biography"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                />
                <div className="form-buttons">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" onClick={() => setEditMode(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
