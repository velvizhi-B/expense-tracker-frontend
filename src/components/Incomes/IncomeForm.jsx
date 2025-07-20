import React, { useState, useEffect } from "react";
import api from "../../services/api";
import styles from "./IncomeForm.module.scss";
import LoadingSpinner from "../common/LoadingSpinner";

const IncomeForm = ({
  onClose,
  onSuccess,
  initialData = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    received_date: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        amount: "",
        source: "",
        received_date: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      if (isEdit && initialData?.id) {
        await api.put(`/incomes/${initialData.id}`, formData);
      } else {
        await api.post("/incomes", formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Income submit error:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? "Edit Income" : "Add Income"}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Amount</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          <label>Source</label>
          <input
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
          />

          <label>Date</label>
          <input
            name="received_date"
            type="date"
            value={formData.received_date}
            onChange={handleChange}
            required
          />

          <div className={styles.buttons}>
            <button type="submit" disabled={loading}>
              {loading ? (
                <span className={styles.spinnerWrapper}>
                  <LoadingSpinner size="small" />
                  <span>Saving...</span>
                </span>
              ) : (
                "Save"
              )}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;
