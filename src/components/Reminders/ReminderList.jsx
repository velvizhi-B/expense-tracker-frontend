// src/components/Reminders/ReminderList.jsx
import React, { useState } from 'react';
import styles from './Reminder.module.scss';

const ReminderList = ({ reminders, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    amount: '',
    due_date: '',
    repeat_cycle: '',
    status: '',
    notes: ''
  });

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditForm({ ...r });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onEdit(editingId, editForm);
    setEditingId(null);
  };

  return (
    <ul>
      {reminders.map((r) =>
        editingId === r.id ? (
          <form key={r.id} onSubmit={handleUpdate} className={styles.editForm}>
            <input name="title" value={editForm.title} onChange={handleChange} className={styles.input} />
            <input type="number" name="amount" value={editForm.amount} onChange={handleChange} className={styles.input} />
            <input type="date" name="due_date" value={editForm.due_date} onChange={handleChange} className={styles.input} />
            <select name="repeat_cycle" value={editForm.repeat_cycle} onChange={handleChange} className={styles.input}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select name="status" value={editForm.status} onChange={handleChange} className={styles.input}>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
            <textarea name="notes" value={editForm.notes} onChange={handleChange} className={styles.input} />
            <button type="submit" className={styles.button}>Save</button>
            <button type="button" onClick={() => setEditingId(null)} className={styles.button}>Cancel</button>
          </form>
        ) : (
          <li key={r.id} className={styles.listItem}>
            {r.title} - ₹{r.amount} - {r.status} ({r.due_date})
            <div className={styles.actions}>
              <button onClick={() => startEdit(r)} className={styles.edit}>Edit</button>
              <button onClick={() => onDelete(r.id)} className={styles.delete}>Delete</button>
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default ReminderList;
