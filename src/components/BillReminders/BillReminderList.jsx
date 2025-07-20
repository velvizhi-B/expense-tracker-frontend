import React, { useEffect, useState } from "react";
import api from "../../services/api";
import BillReminderForm from "./BillReminderForm";
import styles from "./BillReminderList.module.scss";
import ConfirmModal from "../Modals/ConfirmModal";
import LoadingOverlay from "../common/LoadingOverlay"; // ✅ import
import LoadingSpinner from "../common/LoadingSpinner";
import { toast } from "react-toastify";

const BillReminderList = ({ onAddClick, refreshTrigger }) => {
  const [reminders, setReminders] = useState([]);
  const [editReminder, setEditReminder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [bills, setBills] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ loading state
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const fetchUpcomingBills = async () => {
    try {
      const res = await api.get("/bill-reminders");
      const today = new Date();

      const upcoming = res.data
        .filter(
          (item) =>
            item.status === "pending" && new Date(item.due_date) >= today
        )
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

      setBills(upcoming);
    } catch (err) {
      console.error("Error fetching upcoming bills:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const isInit = refreshTrigger === "init";

      if (isInit) setLoading(true);

      await Promise.all([fetchReminders(), fetchUpcomingBills()]);

      if (isInit) setLoading(false);
    };

    fetchAll();
  }, [refreshTrigger]);

  const handleEdit = (reminder) => {
    setEditReminder(reminder);
    setShowForm(true);
  };

  const closeEditForm = () => {
    setEditReminder(null);
    setShowForm(false);
  };

  const handleFormSuccess = async () => {
    await fetchReminders();
    await fetchUpcomingBills();
    setShowForm(false);
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/bill-reminders/${itemToDelete}`);
      setItemToDelete(null);
      // toast.success("Deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      // toast.error("Failed to delete");
    } finally {
      // 🔁 Await both fetch calls
      await fetchReminders();
      await fetchUpcomingBills();
      setDeleteLoading(false); // ✅ reset loading state
      setShowConfirm(false); // ✅ close confirm modal
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowConfirm(false);
  };

  return (
    <div className={styles.section}>
      {loading && <LoadingOverlay text="Loading Bill Reminders..." />}

      {/* ✅ spinner */}
      <h2>Bill Reminders</h2>
      <div className={styles.addBtnWrapper}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(true)}
          disabled={showForm || formLoading} // ✅ Disable during form open or form submitting
        >
          {formLoading ? (
            <>
              <LoadingSpinner size="small" color="#fff" /> &nbsp; Adding...
            </>
          ) : (
            "+ Add Reminder"
          )}
        </button>
      </div>
      <div className={styles.header}>
        <h3>Recent Bill Reminders</h3>
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
                <button
                  onClick={() => handleDeleteClick(r.id)}
                  disabled={deleteLoading && itemToDelete === r.id} // Optional: prevent double-click
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div className={styles.popupOverlay}>
          <BillReminderForm
            onClose={closeEditForm}
            onSuccess={handleFormSuccess}
            initialData={editReminder}
            isEdit={!!editReminder}
            setFormLoading={setFormLoading} // ✅ pass loading state
          />
        </div>
      )}
      {showConfirm && (
        <ConfirmModal
          message="Do you really want to delete this reminder?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default BillReminderList;
