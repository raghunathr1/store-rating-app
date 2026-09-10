import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../services/api";
import "./ManageUsers.css";

function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");

  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
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

      if (role) {
        params.append("role", role);
      }

      params.append("sortBy", sortBy);
      params.append("order", order);

      const queryString = `?${params.toString()}`;

      const data = await getUsers(queryString);

      setUsers(data);
    } catch (error) {
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [name, email, address, role, sortBy, order]);

  return (
    <div className="manage-users-page">
      {/* Header */}
      <header className="manage-users-header">
        <div>
          <h1>Manage Users</h1>
          <p>View and manage all users</p>
        </div>

        <div className="header-buttons">
          <button onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/admin/users/add")}>
            Add User
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="filters-section">
        <div className="filter-group">
          <label>Search by Name</label>

          <input
            type="text"
            placeholder="Enter name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Search by Email</label>

          <input
            type="text"
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Search by Address</label>

          <input
            type="text"
            placeholder="Enter address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Filter by Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">Normal User</option>
            <option value="owner">Store Owner</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

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
            <option value="role">Role</option>
          </select>
        </div>

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
      {error && <p className="error-message">{error}</p>}

      {/* Users Table */}
      {loading ? (
        <h2>Loading users...</h2>
      ) : (
        <section className="users-table-section">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>{user.address}</td>

                    <td>
                      <span
                        className={`role-badge ${user.role}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          navigate(`/admin/users/${user.id}`)
                        }
                      >
                        View Details
                      </button>
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

export default ManageUsers;