import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDetails } from "../../services/api";
import "./UserDetails.css";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUserDetails(id);

        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="user-details-page">
        <h2>Loading user details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-details-page">
        <p className="error-message">{error}</p>

        <button onClick={() => navigate("/admin/users")}>
          Back to Users
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-details-page">
        <h2>User not found</h2>

        <button onClick={() => navigate("/admin/users")}>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="user-details-page">
      <header className="user-details-header">
        <div>
          <h1>User Details</h1>
          <p>View complete user information</p>
        </div>

        <button onClick={() => navigate("/admin/users")}>
          Back to Users
        </button>
      </header>

      <section className="user-details-card">
        <h2>Personal Information</h2>

        <div className="details-grid">
          <div className="detail-item">
            <span>User ID</span>
            <strong>{user.id}</strong>
          </div>

          <div className="detail-item">
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="detail-item">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>

          <div className="detail-item full-width">
            <span>Address</span>
            <strong>{user.address}</strong>
          </div>
        </div>
      </section>

      {user.role === "owner" && user.store && (
        <section className="store-details-card">
          <h2>Store Information</h2>

          <div className="details-grid">
            <div className="detail-item">
              <span>Store Name</span>
              <strong>{user.store.name}</strong>
            </div>

            <div className="detail-item">
              <span>Store Email</span>
              <strong>{user.store.email}</strong>
            </div>

            <div className="detail-item full-width">
              <span>Store Address</span>
              <strong>{user.store.address}</strong>
            </div>

            <div className="detail-item">
              <span>Average Rating</span>
              <strong>
                {user.store.average_rating ?? "No ratings"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Total Ratings</span>
              <strong>
                {user.store.total_ratings ?? 0}
              </strong>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default UserDetails;