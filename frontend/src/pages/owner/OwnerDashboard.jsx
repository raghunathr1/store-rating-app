import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOwnerDashboard,
  getOwnerRaters,
} from "../../services/api";
import "./OwnerDashboard.css";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState([]);
  const [raters, setRaters] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingRaters, setLoadingRaters] = useState(true);

  const [error, setError] = useState("");

  // =========================
  // FETCH OWNER DASHBOARD
  // =========================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOwnerDashboard();

        setDashboard(data.stores || []);
      } catch (error) {
        setError(error.message);
        setDashboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // =========================
  // FETCH RATERS
  // =========================
  useEffect(() => {
    const fetchRaters = async () => {
      try {
        setLoadingRaters(true);

        const data = await getOwnerRaters();

        setRaters(data.raters || []);
      } catch (error) {
        setError(error.message);
        setRaters([]);
      } finally {
        setLoadingRaters(false);
      }
    };

    fetchRaters();
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="owner-dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="owner-dashboard">

      {/* ================= HEADER ================= */}
      <header className="owner-header">

        <div>
          <h1>Store Owner Dashboard</h1>

          <p>
            Manage your store ratings
          </p>
        </div>

        <div className="owner-header-buttons">

          <button
            onClick={() =>
              navigate("/user/change-password")
            }
          >
            Change Password
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </header>

      {/* ================= ERROR ================= */}
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* ================= STORE STATS ================= */}
      <section className="owner-stats">

        {dashboard.length === 0 ? (

          <div className="no-store">

            <h2>No Store Assigned</h2>

            <p>
              No store has been assigned to your
              account yet.
            </p>

          </div>

        ) : (

          dashboard.map((store) => (

            <div
              className="owner-store-section"
              key={store.id}
            >

              <h2>
                {store.name}
              </h2>

              <p className="store-address">
                {store.address}
              </p>

              <div className="stats-grid">

                {/* Average Rating */}
                <div className="owner-stat-card">

                  <h3>
                    Average Rating
                  </h3>

                  <p>
                    {store.average_rating !== null &&
                    store.average_rating !== undefined
                      ? Number(
                          store.average_rating
                        ).toFixed(1)
                      : "No ratings"}
                  </p>

                </div>

                {/* Total Ratings */}
                <div className="owner-stat-card">

                  <h3>
                    Total Ratings
                  </h3>

                  <p>
                    {store.total_ratings || 0}
                  </p>

                </div>

              </div>

            </div>

          ))

        )}

      </section>

      {/* ================= RATERS ================= */}
      <section className="raters-section">

        <div className="section-header">

          <div>

            <h2>
              Users Who Rated Your Store
            </h2>

            <p>
              View customers who submitted ratings
            </p>

          </div>

        </div>

        {/* Loading */}
        {loadingRaters ? (

          <h3>
            Loading ratings...
          </h3>

        ) : raters.length === 0 ? (

          /* No ratings */
          <div className="no-ratings">

            <h3>
              No ratings yet
            </h3>

            <p>
              Users who rate your store will
              appear here.
            </p>

          </div>

        ) : (

          /* Ratings table */
          <div className="raters-table-wrapper">

            <table className="raters-table">

              <thead>

                <tr>

                  <th>
                    User ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Rating
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {raters.map((rater) => (

                  <tr
                    key={rater.id}
                  >

                    <td>
                      {rater.id}
                    </td>

                    <td>
                      {rater.name}
                    </td>

                    <td>
                      {rater.email}
                    </td>

                    <td>
                      <strong>
                        {rater.rating}/5
                      </strong>
                    </td>

                    <td>
                      {rater.created_at
                        ? new Date(
                            rater.created_at
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default OwnerDashboard;