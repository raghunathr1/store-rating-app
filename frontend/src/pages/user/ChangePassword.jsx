import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/api";
import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
      return "Password must be between 8 and 16 characters";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    const passwordError = validatePassword(newPassword);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!confirmPassword) {
      setError("Confirm password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      setLoading(true);

      await changePassword(currentPassword, newPassword);

      setSuccess("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">

      {/* Header */}
      <header className="change-password-header">

        <div>
          <h1>Change Password</h1>
          <p>Update your account password</p>
        </div>

        <button
          onClick={() => navigate("/user/dashboard")}
        >
          Back to Dashboard
        </button>

      </header>

      {/* Form Card */}
      <section className="change-password-card">

        <form onSubmit={handleSubmit}>

          {/* Current Password */}
          <div className="form-group">

            <label>Current Password</label>

            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
            />

          </div>

          {/* New Password */}
          <div className="form-group">

            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />

            <small>
              8–16 characters, at least one uppercase
              letter and one special character
            </small>

          </div>

          {/* Confirm Password */}
          <div className="form-group">

            <label>Confirm New Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

          </div>

          {/* Error */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="change-password-button"
            disabled={loading}
          >
            {loading
              ? "Changing..."
              : "Change Password"}
          </button>

        </form>

      </section>

    </div>
  );
}

export default ChangePassword;