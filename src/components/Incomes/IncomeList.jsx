// ✅ IncomeList.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import IncomeForm from "./IncomeForm";
import styles from "./IncomeList.module.scss";
import ConfirmModal from "../Modals/ConfirmModal"; // update the path based on your folder structure

const IncomeList = ({ onAddClick, refreshTrigger }) => {
  const [incomes, setIncomes] = useState([]);
  const [editIncome, setEditIncome] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

  useEffect(() => {
    fetchIncomes();
  }, [refreshTrigger]);

  const fetchIncomes = async () => {
    try {
      const res = await api.get("/incomes");
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const filtered = res.data
        .filter((i) => {
          const d = new Date(i.received_date);
          return (
            d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
          );
        })
        .sort((a, b) => new Date(b.received_date) - new Date(a.received_date))
        .slice(0, 20);

      setIncomes(filtered);
    } catch (err) {
      console.error("Error fetching incomes:", err);
    }
  };

  const handleEdit = (income) => {
    setEditIncome(income);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this income?")) {
      try {
        await api.delete(`/incomes/${id}`);
        fetchIncomes();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleCloseForm = () => {
    setEditIncome(null);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    fetchIncomes();
    setEditIncome(null);
    setShowForm(false);
  };

  const handleAddClick = () => {
    setEditIncome(null);
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setIncomeToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/incomes/${incomeToDelete}`);
      fetchIncomes();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setShowConfirm(false);
      setIncomeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setIncomeToDelete(null);
  };

  return (
    <div className={styles.section}>
      <h2>Incomes</h2>

      <div className={styles.addBtnWrapper}>
        <button className={styles.addBtn} onClick={handleAddClick}>
          + Add Income
        </button>
      </div>

      <div className={styles.header}>
        <h3>Recent Incomes</h3>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Source</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((item) => (
            <tr key={item.id}>
              <td>{item.source}</td>
              <td>₹{item.amount}</td>
              <td>{item.received_date}</td>
              <td className={styles.actionButtons}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteClick(item.id)}
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
          <div className={styles.popupBox}>
            <IncomeForm
              onClose={handleCloseForm}
              onSuccess={handleFormSuccess}
              initialData={editIncome}
              isEdit={!!editIncome}
            />
          </div>
        </div>
      )}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this income? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default IncomeList;
