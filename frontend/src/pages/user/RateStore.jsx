import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserStores, submitRating } from "../../services/api";
import "./RateStore.css";

function RateStore() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [rating, setRating] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH STORE
  // =========================
  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUserStores();

        // Backend returns direct array
        const selectedStore = data.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedStore) {
          throw new Error("Store not found");
        }

        setStore(selectedStore);

        if (
          selectedStore.userRating !== null &&
          selectedStore.userRating !== undefined
        ) {
          setRating(String(selectedStore.userRating));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  // =========================
  // SUBMIT / MODIFY RATING
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!rating) {
      setError("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);

      await submitRating(Number(id), Number(rating));

      setSuccess(
        store.userRating
          ? "Rating updated successfully!"
          : "Rating submitted successfully!"
      );

      setStore((prev) => ({
        ...prev,
        userRating: Number(rating),
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="rate-store-page">
        <h2>Loading store...</h2>
      </div>
    );
  }

  // =========================
  // ERROR / STORE NOT FOUND
  // =========================
  if (error && !store) {
    return (
      <div className="rate-store-page">
        <p className="error-message">{error}</p>

        <button onClick={() => navigate("/user/dashboard")}>
          Back to Stores
        </button>
      </div>
    );
  }

  return (
    <div className="rate-store-page">

      {/* Header */}
      <header className="rate-store-header">

        <div>
          <h1>Rate Store</h1>
          <p>Submit or modify your rating</p>
        </div>

        <button onClick={() => navigate("/user/dashboard")}>
          Back to Stores
        </button>

      </header>

      {/* Store Card */}
      <section className="rate-store-card">

        <h2>{store.name}</h2>

        <p className="store-address">
          <strong>Address:</strong>{" "}
          {store.address}
        </p>

        {/* Overall Rating */}
        <div className="overall-rating">

          <span>Overall Rating</span>

          <strong>
            {store.overallRating !== null &&
            store.overallRating !== undefined
              ? Number(store.overallRating).toFixed(1)
              : "No ratings yet"}
          </strong>

        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit}>

          <div className="rating-section">

            <label>Your Rating</label>

            <div className="rating-options">

              {[1, 2, 3, 4, 5].map((value) => (

                <label
                  key={value}
                  className={
                    Number(rating) === value
                      ? "rating-option selected"
                      : "rating-option"
                  }
                >

                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={Number(rating) === value}
                    onChange={(e) =>
                      setRating(e.target.value)
                    }
                  />

                  <span>{value}</span>

                </label>

              ))}

            </div>

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
            className="submit-rating-button"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : store.userRating
              ? "Modify Rating"
              : "Submit Rating"}
          </button>

        </form>

      </section>

    </div>
  );
}

export default RateStore;