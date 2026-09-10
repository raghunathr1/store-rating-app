import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await getAdminDashboard();

        setStats(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Store Rating Management System</p>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </header>

      {error && <p className="error-message">{error}</p>}

      <section className="stats-container">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Stores</h3>
          <p>{stats.totalStores}</p>
        </div>

        <div className="stat-card">
          <h3>Total Ratings</h3>
          <p>{stats.totalRatings}</p>
        </div>
      </section>

      <section className="admin-actions">
        <h2>Management</h2>

        <div className="action-buttons">
          <button onClick={() => navigate("/admin/users")}>
            Manage Users
          </button>

          <button onClick={() => navigate("/admin/stores")}>
            Manage Stores
          </button>

          <button onClick={() => navigate("/admin/users/add")}>
            Add User
          </button>

          <button onClick={() => navigate("/admin/stores/add")}>
            Add Store
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;