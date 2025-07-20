// src/components/Expenses/ExpenseList.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import styles from "./ExpenseList.module.scss";
import ExpenseForm from "./ExpenseForm";
import ConfirmModal from "../Modals/ConfirmModal";
import { toast } from "react-toastify";
import LoadingSpinner from "../common/LoadingSpinner";

const ExpenseList = ({ onAddClick, refreshTrigger, onRefresh, onLoad }) => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loadingActionId, setLoadingActionId] = useState(null); // Edit/Delete loader
  const [actionType, setActionType] = useState(""); // "edit" or "delete"
  const [isAddLoading, setIsAddLoading] = useState(false); // Add Expense button loader

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const filtered = res.data
        .filter((item) => {
          const d = new Date(item.expense_date);
          return (
            d.getMonth() + 1 === currentMonth &&
            d.getFullYear() === currentYear
          );
        })
        .sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date))
        .slice(0, 20);

      setExpenses(filtered);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      onLoad && onLoad(); // Notify parent Dashboard
    }
  };

  const handleAddClick = () => {
    setIsAddLoading(true);
    setSelectedExpense(null);
    setIsEditing(false);
    setShowForm(true);
    setTimeout(() => setIsAddLoading(false), 300); // simulate modal open time
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedExpense(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    onRefresh(); // Refresh table + summary
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setLoadingActionId(itemToDelete);
    setActionType("delete");
    try {
      await api.delete(`/expenses/${itemToDelete}`);
      toast.success("Expense deleted successfully");
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete expense");
      console.error("Delete error:", err);
    } finally {
      setLoadingActionId(null);
      setItemToDelete(null);
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setItemToDelete(null);
  };

  return (
    <div className={styles.expenseSection}>
      <div className={styles.addButtonWrapper}>
        <button className={styles.addButton} onClick={handleAddClick} disabled={isAddLoading}>
          {isAddLoading ? <LoadingSpinner size="small" text="Opening..." /> : "+ Add Expense"}
        </button>
      </div>

      <div className={styles.header}>
        <h3>Recent Expenses</h3>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>₹{item.amount}</td>
              <td>{item.category}</td>
              <td>{item.expense_date}</td>
              <td>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setLoadingActionId(item.id);
                      setActionType("edit");
                      handleEdit(item);
                      setLoadingActionId(null);
                    }}
                    disabled={loadingActionId === item.id}
                  >
                    {loadingActionId === item.id && actionType === "edit" ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      "Edit"
                    )}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteClick(item.id)}
                    disabled={loadingActionId === item.id}
                  >
                    {loadingActionId === item.id && actionType === "delete" ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm && (
        <ConfirmModal
          message="This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {showForm && (
        <ExpenseForm
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          initialData={selectedExpense}
          isEdit={isEditing}
        />
      )}
    </div>
  );
};

export default ExpenseList;
