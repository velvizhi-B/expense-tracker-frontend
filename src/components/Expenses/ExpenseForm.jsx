import React, { useState } from "react";
import api from "../../services/api";
import styles from "./ExpenseForm.module.scss";
import { toast } from "react-toastify";
import LoadingSpinner from "../common/LoadingSpinner";

const ExpenseForm = ({
  onClose,
  onSuccess,
  initialData = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      amount: "",
      category: "",
      expense_date: "",
    }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { title, amount, category, expense_date } = formData;

    if (!title.trim() || title.length < 3) {
      toast.error("Title must be at least 3 characters.");
      return false;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount must be a positive number.");
      return false;
    }

    if (!category.trim()) {
      toast.error("Category is required.");
      return false;
    }

    if (!expense_date) {
      toast.error("Please select a valid date.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEdit && initialData?.id) {
        await api.put(`/expenses/${initialData.id}`, formData);
        toast.success("Expense updated successfully");
      } else {
        await api.post("/expenses", formData);
        toast.success("Expense added successfully");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Submit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={loading ? null : onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? "Edit Expense" : "Add Expense"}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <label>Amount</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <label>Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <label>Date</label>
          <input
            name="expense_date"
            type="date"
            value={formData.expense_date}
            onChange={handleChange}
            disabled={loading}
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

export default ExpenseForm;
