// src/pages/Dashboard.jsx
import React, { useState } from "react";
import ExpenseForm from "../components/Expenses/ExpenseForm";
import ExpenseList from "../components/Expenses/ExpenseList";
import Summary from "../components/Dashboard/Summary";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0); // Single refresh counter for everything

  const handleAddClick = () => setShowForm(true);

  const handleCloseForm = () => setShowForm(false);

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1); // Trigger refresh
    setShowForm(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Expense Tracker Dashboard</h1>

      <Summary refreshTrigger={refreshCounter} />

      <ExpenseList
        refreshTrigger={refreshCounter}
        onAddClick={handleAddClick}
        onRefresh={handleRefresh} // 🔁 Central refresh callback
      />

      {showForm && (
        <ExpenseForm onClose={handleCloseForm} onSuccess={handleRefresh} />
      )}
    </div>
  );
};

export default Dashboard;
