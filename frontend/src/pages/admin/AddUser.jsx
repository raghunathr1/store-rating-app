import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../services/api";
import "./AddUser.css";

function AddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const address = formData.address.trim();

    if (!name) {
      return "Name is required";
    }

    if (name.length < 20 || name.length > 60) {
      return "Name must be between 20 and 60 characters";
    }

    if (!email) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    if (!password) {
      return "Password is required";
    }

    if (password.length < 8 || password.length > 16) {
      return "Password must be between 8 and 16 characters";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character";
    }

    if (!address) {
      return "Address is required";
    }

    if (address.length > 400) {
      return "Address cannot exceed 400 characters";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await addUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        address: formData.address.trim(),
        role: formData.role,
      });

      setSuccess("User created successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-page">
      <header className="add-user-header">
        <div>
          <h1>Add User</h1>
          <p>Create a new user account</p>
        </div>

        <button onClick={() => navigate("/admin/users")}>
          Back to Users
        </button>
      </header>

      <section className="add-user-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
            />

            <small>
              Name must be between 20 and 60 characters
            </small>
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />

            <small>
              8–16 characters, one uppercase letter and one special character
            </small>
          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              name="address"
              placeholder="Enter address"
              rows="4"
              value={formData.address}
              onChange={handleChange}
            />

            <small>
              {formData.address.length}/400 characters
            </small>
          </div>

          <div className="form-group">
            <label>Role</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Normal User</option>
              <option value="admin">Administrator</option>
              <option value="owner">Store Owner</option>
            </select>
          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="create-user-button"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AddUser;