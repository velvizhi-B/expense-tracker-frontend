import React, { useEffect, useState } from "react";
import api from "../../services/api";
import IncomeForm from "./IncomeForm";
import styles from "./IncomeList.module.scss";
import ConfirmModal from "../Modals/ConfirmModal";
import LoadingSpinner from "../common/LoadingSpinner";

const IncomeList = ({ onAddClick, refreshTrigger, setLoading }) => {
  const [incomes, setIncomes] = useState([]);
  const [editIncome, setEditIncome] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [loadingEditId, setLoadingEditId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (income) => {
    setLoadingEditId(income.id);
    setTimeout(() => {
      setEditIncome(income);
      setShowForm(true);
      setLoadingEditId(null);
    }, 400); // simulate loading delay
  };

  const handleDeleteClick = (id) => {
    setIncomeToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setLoadingDeleteId(incomeToDelete);
    try {
      await api.delete(`/incomes/${incomeToDelete}`);
      fetchIncomes();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setShowConfirm(false);
      setIncomeToDelete(null);
      setLoadingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setIncomeToDelete(null);
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

  return (
    <div className={styles.section}>
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
                  disabled={loadingEditId === item.id}
                >
                  {loadingEditId === item.id ? (
                    <LoadingSpinner size="16px" color="#fff" />
                  ) : (
                    "Edit"
                  )}
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteClick(item.id)}
                  disabled={loadingDeleteId === item.id}
                >
                  {loadingDeleteId === item.id ? (
                    <LoadingSpinner size="16px" color="#fff" />
                  ) : (
                    "Delete"
                  )}
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
          loading={loadingDeleteId !== null}
        />
      )}
    </div>
  );
};

export default IncomeList;
