import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";
import "./Signup.css";
function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
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

      await signupUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        address: formData.address.trim(),
      });

      setSuccess("Account created successfully! Redirecting to login...");

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Store Rating App</h1>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />

            <small>20–60 characters</small>
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
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
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
            />

            <small>{formData.address.length}/400 characters</small>
          </div>

          {error && <p className="error-message">{error}</p>}

          {success && <p className="success-message">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;