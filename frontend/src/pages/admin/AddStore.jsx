import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStore, getUsers } from "../../services/api";
import "./AddStore.css";

function AddStore() {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [loadingOwners, setLoadingOwners] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH STORE OWNERS
  // =========================
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoadingOwners(true);
        setError("");

        const data = await getUsers("?role=owner");

        setOwners(data);
      } catch (error) {
        setError(error.message);
        setOwners([]);
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchOwners();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================
  // FORM VALIDATION
  // =========================
  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const address = formData.address.trim();

    // Store Name
    if (!name) {
      return "Store name is required";
    }

    if (name.length < 20 || name.length > 60) {
      return "Store name must be between 20 and 60 characters";
    }

    // Store Email
    if (!email) {
      return "Store email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    // Store Address
    if (!address) {
      return "Store address is required";
    }

    if (address.length > 400) {
      return "Address cannot exceed 400 characters";
    }

    // Store Owner
    if (!formData.owner_id) {
      return "Please select a store owner";
    }

    return "";
  };

  // =========================
  // CREATE STORE
  // =========================
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

      await addStore({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        owner_id: Number(formData.owner_id),
      });

      setSuccess("Store created successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-store-page">

      {/* Header */}
      <header className="add-store-header">

        <div>
          <h1>Add Store</h1>
          <p>Create a new store</p>
        </div>

        <button
          onClick={() => navigate("/admin/stores")}
        >
          Back to Stores
        </button>

      </header>

      {/* Form Card */}
      <section className="add-store-card">

        <form onSubmit={handleSubmit}>

          {/* Store Name */}
          <div className="form-group">

            <label>Store Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter store name"
              value={formData.name}
              onChange={handleChange}
            />

            <small>
              Store name must be between 20 and 60 characters
            </small>

          </div>

          {/* Store Email */}
          <div className="form-group">

            <label>Store Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter store email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          {/* Store Address */}
          <div className="form-group">

            <label>Store Address</label>

            <textarea
              name="address"
              placeholder="Enter store address"
              rows="4"
              value={formData.address}
              onChange={handleChange}
            />

            <small>
              {formData.address.length}/400 characters
            </small>

          </div>

          {/* Store Owner */}
          <div className="form-group">

            <label>Store Owner</label>

            <select
              name="owner_id"
              value={formData.owner_id}
              onChange={handleChange}
              disabled={loadingOwners}
            >

              <option value="">
                {loadingOwners
                  ? "Loading owners..."
                  : "Select Store Owner"}
              </option>

              {owners.map((owner) => (
                <option
                  key={owner.id}
                  value={owner.id}
                >
                  {owner.name} - {owner.email}
                </option>
              ))}

            </select>

            {!loadingOwners && owners.length === 0 && (
              <small>
                No store owner found. Please create an owner first.
              </small>
            )}

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
            disabled={loading}
            className="create-store-button"
          >
            {loading ? "Creating..." : "Create Store"}
          </button>

        </form>

      </section>

    </div>
  );
}

export default AddStore;