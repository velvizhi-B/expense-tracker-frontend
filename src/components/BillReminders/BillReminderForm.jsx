import React, { useState } from "react";
import styles from "./BillReminderForm.module.scss";
import api from "../../services/api";

const BillReminderForm = ({ onClose, onSuccess, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      amount: "",
      due_date: "",
      repeat_cycle: "monthly",
      status: "pending",
      notes: "",
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
        await api.put(`/bill-reminders/${initialData.id}`, formData);
      } else {
        await api.post("/bill-reminders", formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Bill Reminder submit error:", err);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? "Edit Bill Reminder" : "Add Bill Reminder"}</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Title</label>
          <input name="title" value={formData.title} onChange={handleChange} required />

          <label>Amount</label>
          <input name="amount" type="number" value={formData.amount} onChange={handleChange} required />

          <label>Due Date</label>
          <input name="due_date" type="date" value={formData.due_date} onChange={handleChange} required />

          <label>Repeat Cycle</label>
          <select name="repeat_cycle" value={formData.repeat_cycle} onChange={handleChange}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="none">None</option>
          </select>

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>

          <label>Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} />

          <div className={styles.buttons}>
            <button type="submit">{isEdit ? "Update" : "Add"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillReminderForm;
