// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import ExpenseForm from "../components/Expenses/ExpenseForm";
import ExpenseList from "../components/Expenses/ExpenseList";
import Summary from "../components/Dashboard/Summary";
import LoadingOverlay from "../components/common/LoadingOverlay";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0); // Single refresh counter
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [expensesLoaded, setExpensesLoaded] = useState(false);

  const isLoading = !summaryLoaded || !expensesLoaded;
  const handleAddClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
    setShowForm(false);
    setSummaryLoaded(false); // Reset loading state on refresh
    setExpensesLoaded(false);
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingOverlay text="Loading dashboard..." />}

      <h1 className={styles.heading}>Expense Tracker Dashboard</h1>

      <Summary
        refreshTrigger={refreshCounter}
        onLoad={() => setSummaryLoaded(true)}
      />

      <ExpenseList
        refreshTrigger={refreshCounter}
        onAddClick={handleAddClick}
        onRefresh={handleRefresh}
        onLoad={() => setExpensesLoaded(true)}
      />

      {showForm && (
        <ExpenseForm onClose={handleCloseForm} onSuccess={handleRefresh} />
      )}
    </div>
  );
};

export default Dashboard;
