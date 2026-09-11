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

  // =========================
  // FETCH STORES
  // =========================
  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      // Search by name
      if (name.trim()) {
        params.append("name", name.trim());
      }

      // Search by address
      if (address.trim()) {
        params.append("address", address.trim());
      }

      // Sorting
      params.append("sortBy", sortBy);
      params.append("order", order);

      const queryString = `?${params.toString()}`;

      const data = await getUserStores(queryString);

      console.log("USER STORES RESPONSE:", data);

      /*
        Backend may return:

        [
          {...},
          {...}
        ]

        OR

        {
          stores: [...]
        }
      */

      if (Array.isArray(data)) {
        setStores(data);
      } else if (data && Array.isArray(data.stores)) {
        setStores(data.stores);
      } else {
        console.error("Unexpected stores response:", data);
        setStores([]);
        setError("Invalid stores data received from server");
      }
    } catch (error) {
      console.error("Fetch stores error:", error);

      setError(error.message || "Failed to load stores");
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH WHEN FILTER CHANGES
  // =========================
  useEffect(() => {
    fetchStores();
  }, [name, address, sortBy, order]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="user-dashboard">

      {/* =========================
          HEADER
      ========================= */}
      <header className="user-header">

        <div>
          <h1>Store Rating App</h1>

          <p>
            Find and rate stores
          </p>
        </div>

        <div className="user-header-buttons">

          <button
            type="button"
            className="change-password-header-button"
            onClick={() => navigate("/user/change-password")}
          >
            Change Password
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =========================
          WELCOME SECTION
      ========================= */}
      <section className="welcome-section">

        <h2>Stores</h2>

        <p>
          Search stores and submit your rating from 1 to 5.
        </p>

      </section>


      {/* =========================
          SEARCH & SORTING
      ========================= */}
      <section className="search-section">

        {/* Search by Name */}
        <div className="search-group">

          <label htmlFor="store-name">
            Search by Name
          </label>

          <input
            id="store-name"
            type="text"
            placeholder="Enter store name..."
            value={name}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />

        </div>


        {/* Search by Address */}
        <div className="search-group">

          <label htmlFor="store-address">
            Search by Address
          </label>

          <input
            id="store-address"
            type="text"
            placeholder="Enter store address..."
            value={address}
            autoComplete="off"
            onChange={(e) => setAddress(e.target.value)}
          />

        </div>


        {/* Sort By */}
        <div className="search-group">

          <label htmlFor="sort-by">
            Sort By
          </label>

          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >

            <option value="id">
              ID
            </option>

            <option value="name">
              Name
            </option>

            <option value="address">
              Address
            </option>

            {/* IMPORTANT:
                Backend uses "rating", not "overallRating"
            */}
            <option value="rating">
              Rating
            </option>

          </select>

        </div>


        {/* Order */}
        <div className="search-group">

          <label htmlFor="sort-order">
            Order
          </label>

          <select
            id="sort-order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >

            <option value="asc">
              Ascending
            </option>

            <option value="desc">
              Descending
            </option>

          </select>

        </div>

      </section>


      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}


      {/* =========================
          LOADING
      ========================= */}
      {loading ? (

        <div className="loading-container">
          <h2>Loading stores...</h2>
        </div>

      ) : stores.length === 0 ? (

        /* =========================
           NO STORES
        ========================= */
        <div className="no-stores">

          <h3>
            No stores found
          </h3>

          <p>
            Try searching with a different name or address.
          </p>

        </div>

      ) : (

        /* =========================
           STORES
        ========================= */
        <section className="stores-grid">

          {stores.map((store) => {

            /*
              Backend storeModel currently returns:

              id
              name
              email
              address
              owner_id
              rating
              created_at

              User store controller may additionally
              return userRating.
            */

            const overallRating =
              store.overallRating !== undefined
                ? store.overallRating
                : store.rating;

            return (

              <div
                className="store-card"
                key={store.id}
              >

                {/* Store Name */}
                <div className="store-card-header">

                  <h3>
                    {store.name}
                  </h3>

                </div>


                {/* Store Information */}
                <div className="store-info">

                  {/* Address */}
                  <p>
                    <strong>
                      Address:
                    </strong>{" "}
                    {store.address}
                  </p>


                  {/* Overall Rating */}
                  <p>
                    <strong>
                      Overall Rating:
                    </strong>{" "}

                    {overallRating !== null &&
                    overallRating !== undefined
                      ? Number(overallRating).toFixed(1)
                      : "No ratings yet"}
                  </p>


                  {/* User Rating */}
                  <p>
                    <strong>
                      My Rating:
                    </strong>{" "}

                    {store.userRating !== null &&
                    store.userRating !== undefined
                      ? `${store.userRating}/5`
                      : "Not rated yet"}
                  </p>

                </div>


                {/* Rating Button */}
                <button
                  type="button"
                  className="rate-button"
                  onClick={() =>
                    navigate(`/user/rate/${store.id}`)
                  }
                >

                  {store.userRating !== null &&
                  store.userRating !== undefined
                    ? "Modify Rating"
                    : "Submit Rating"}

                </button>

              </div>

            );
          })}

        </section>

      )}

    </div>
  );
}

export default UserDashboard;