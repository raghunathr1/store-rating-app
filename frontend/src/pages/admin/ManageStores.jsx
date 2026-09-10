import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStores } from "../../services/api";
import "./ManageStores.css";

function ManageStores() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (name.trim()) {
        params.append("name", name.trim());
      }

      if (email.trim()) {
        params.append("email", email.trim());
      }

      if (address.trim()) {
        params.append("address", address.trim());
      }

      params.append("sortBy", sortBy);
      params.append("order", order);

      const queryString = `?${params.toString()}`;

      const data = await getAdminStores(queryString);

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
  }, [name, email, address, sortBy, order]);

  return (
    <div className="manage-stores-page">

      {/* Header */}
      <header className="manage-stores-header">
        <div>
          <h1>Manage Stores</h1>
          <p>View and manage all stores</p>
        </div>

        <div className="header-buttons">

          <button
            onClick={() => navigate("/admin/dashboard")}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/stores/add")}
          >
            Add Store
          </button>

        </div>
      </header>

      {/* Filters */}
      <section className="filters-section">

        {/* Name */}
        <div className="filter-group">
          <label>Search by Name</label>

          <input
            type="text"
            placeholder="Enter store name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="filter-group">
          <label>Search by Email</label>

          <input
            type="text"
            placeholder="Enter store email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="filter-group">
          <label>Search by Address</label>

          <input
            type="text"
            placeholder="Enter store address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label>Sort By</label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Order */}
        <div className="filter-group">
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

      {/* Loading */}
      {loading ? (
        <h2>Loading stores...</h2>
      ) : (
        <section className="stores-table-section">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Store Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>

              {stores.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No stores found
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id}>

                    <td>
                      {store.id}
                    </td>

                    <td>
                      {store.name}
                    </td>

                    <td>
                      {store.email}
                    </td>

                    <td>
                      {store.address}
                    </td>

                    <td>
                      {store.rating !== null &&
                      store.rating !== undefined
                        ? Number(store.rating).toFixed(1)
                        : "No ratings"}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </section>
      )}

    </div>
  );
}

export default ManageStores;