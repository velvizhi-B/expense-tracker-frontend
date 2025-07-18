import React, { useState } from "react";
import api from "../../services/api";
import styles from "./ExpenseForm.module.scss";
import { toast } from "react-toastify";


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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit && initialData?.id) {
        await api.put(`/expenses/${initialData.id}`, formData); // ✅ Edit
        toast.success("Expense updated successfully");
      } else {
        await api.post("/expenses", formData); // ✅ Create
        toast.success("Expense added successfully");
      }

      onSuccess(); // refresh
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Submit failed:", err);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Add Expense</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Amount</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <label>Date</label>
          <input
            name="expense_date"
            type="date"
            value={formData.expense_date}
            onChange={handleChange}
            required
          />

          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
