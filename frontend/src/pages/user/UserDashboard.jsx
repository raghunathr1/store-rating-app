import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserStores } from "../../services/api";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (name.trim()) {
        params.append("name", name.trim());
      }

      if (address.trim()) {
        params.append("address", address.trim());
      }

      params.append("sortBy", sortBy);
      params.append("order", order);

      const queryString = `?${params.toString()}`;

      const data = await getUserStores(queryString);

      setStores(data);
    } catch (error) {
      setError(error.message);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [name, address, sortBy, order]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="user-dashboard">

      {/* Header */}
      <header className="user-header">

        <div>
          <h1>Store Rating App</h1>
          <p>Find and rate stores</p>
        </div>

        <div className="user-header-buttons">

          <button
            className="change-password-header-button"
            onClick={() => navigate("/user/change-password")}
          >
            Change Password
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* Welcome */}
      <section className="welcome-section">

        <h2>Stores</h2>

        <p>
          Search stores and submit your rating from 1 to 5.
        </p>

      </section>

      {/* Search and Sorting */}
      <section className="search-section">

        <div className="search-group">

          <label>Search by Name</label>

          <input
            type="text"
            placeholder="Enter store name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

        </div>

        <div className="search-group">

          <label>Search by Address</label>

          <input
            type="text"
            placeholder="Enter store address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

        </div>

        <div className="search-group">

          <label>Sort By</label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="address">Address</option>
            <option value="overallRating">
              Rating
            </option>
          </select>

        </div>

        <div className="search-group">

          <label>Order</label>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

        </div>

      </section>

      {/* Error */}
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* Stores */}
      {loading ? (

        <h2>Loading stores...</h2>

      ) : stores.length === 0 ? (

        <div className="no-stores">

          <h3>No stores found</h3>

          <p>
            Try searching with a different name or address.
          </p>

        </div>

      ) : (

        <section className="stores-grid">

          {stores.map((store) => (

            <div
              className="store-card"
              key={store.id}
            >

              <div className="store-card-header">

                <h3>{store.name}</h3>

              </div>

              <div className="store-info">

                <p>
                  <strong>Address:</strong>{" "}
                  {store.address}
                </p>

                <p>
                  <strong>Overall Rating:</strong>{" "}

                  {store.overallRating !== null &&
                  store.overallRating !== undefined
                    ? Number(store.overallRating).toFixed(1)
                    : "No ratings yet"}
                </p>

                <p>
                  <strong>My Rating:</strong>{" "}

                  {store.userRating
                    ? `${store.userRating}/5`
                    : "Not rated yet"}
                </p>

              </div>

              <button
                className="rate-button"
                onClick={() =>
                  navigate(`/user/rate/${store.id}`)
                }
              >
                {store.userRating
                  ? "Modify Rating"
                  : "Submit Rating"}
              </button>

            </div>

          ))}

        </section>

      )}

    </div>
  );
}

export default UserDashboard;