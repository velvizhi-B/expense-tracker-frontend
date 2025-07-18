// ✅ BillReminderList.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import BillReminderForm from "./BillReminderForm";
import styles from "./BillReminderList.module.scss";
import ConfirmModal from "../Modals/ConfirmModal"; // update the path based on your folder structure

const BillReminderList = ({ onAddClick, refreshTrigger }) => {
  const [reminders, setReminders] = useState([]);
  const [editReminder, setEditReminder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [bills, setBills] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchReminders = async () => {
    try {
      const res = await api.get("/bill-reminders");
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const filtered = res.data
        .filter((r) => {
          const d = new Date(r.due_date);
          return (
            d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
          );
        })
        .sort((a, b) => new Date(b.due_date) - new Date(a.due_date))
        .slice(0, 10);

      setReminders(filtered);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  useEffect(() => {
    fetchReminders();
    fetchUpcomingBills();
  }, [refreshTrigger]);

const fetchUpcomingBills = async () => {
  try {
    const res = await api.get("/bill-reminders");
    const today = new Date();

    const upcoming = res.data
      .filter((item) => item.status === "pending" && new Date(item.due_date) >= today)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)); // ✅ Sort ascending

    setBills(upcoming);
  } catch (err) {
    console.error("Error fetching upcoming bills:", err);
  }
};


  const handleEdit = (reminder) => {
    setEditReminder(reminder);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this reminder?")) {
      try {
        await api.delete(`/bill-reminders/${id}`);
        fetchReminders();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const closeEditForm = () => {
    setEditReminder(null);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    fetchReminders();
    fetchUpcomingBills(); // ✅ add this line
    setShowForm(false);
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/bill-reminders/${itemToDelete}`);
      setShowConfirm(false);
      setItemToDelete(null);
      fetchReminders(); // ✅ update table view
      fetchUpcomingBills(); // ✅ update alerts section
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowConfirm(false);
  };

  return (
    <div className={styles.section}>
      <h2>Bill Reminders</h2>
      <div className={styles.addBtnWrapper}>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + Add Reminder
        </button>
      </div>
      <div className={styles.header}>
        <h3>Recent Bill Reminders</h3>
        {/* <button onClick={() => setShowForm(true)}>+ Add Reminder</button> */}
      </div>

      <div className={styles.alerts}>
        <h4>🔔 Upcoming/Unpaid Bills</h4>
        {bills.length === 0 ? (
          <p>No unpaid bills 🎉</p>
        ) : (
          <ul>
            {bills.map((bill) => (
              <li key={bill.id}>
                {bill.title} - ₹{bill.amount} due on {bill.due_date}
              </li>
            ))}
          </ul>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>₹{r.amount}</td>
              <td>{r.due_date}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => handleEdit(r)}>Edit</button>
                <button onClick={() => handleDeleteClick(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className={styles.popupOverlay}>
          {/* <div className={styles.popupBox}> */}
          <BillReminderForm
            onClose={closeEditForm}
            onSuccess={handleFormSuccess}
            initialData={editReminder}
            isEdit={!!editReminder}
          />
          {/* </div> */}
        </div>
      )}
      {showConfirm && (
        <ConfirmModal
          message="This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default BillReminderList;
