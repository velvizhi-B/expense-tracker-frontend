// src/components/Reminders/ReminderForm.jsx
import React, { useState } from 'react';
import styles from './Reminder.module.scss';

const ReminderForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    due_date: '',
    repeat_cycle: 'monthly',
    status: 'pending',
    notes: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({
      title: '',
      amount: '',
      due_date: '',
      repeat_cycle: 'monthly',
      status: 'pending',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className={styles.input} required />
      <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" className={styles.input} required />
      <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className={styles.input} required />
      <select name="repeat_cycle" value={form.repeat_cycle} onChange={handleChange} className={styles.input}>
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
        <option value="yearly">Yearly</option>
      </select>
      <select name="status" value={form.status} onChange={handleChange} className={styles.input}>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </select>
      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className={styles.input} />
      <button type="submit" className={styles.button}>Add Reminder</button>
    </form>
  );
};

export default ReminderForm;
