import React, { useEffect, useState } from "react";
import api from "../../services/api";
import styles from "./Summary.module.scss";

const Summary = ({ refreshTrigger }) => {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    remaining_balance: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    try {
      const res = await api.get("/summary/");
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  return (
    <div className={styles.summary}>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Income</h3>
          <p>₹{summary.total_income.toLocaleString()}</p>
        </div>
        <div className={styles.card}>
          <h3>Total Expenses</h3>
          <p>₹{summary.total_expenses.toLocaleString()}</p>
        </div>
        <div
          className={`${styles.card} ${
            summary.remaining_balance >= 0 ? styles.positive : styles.negative
          }`}
        >
          <h3>Balance</h3>
          <p>₹{summary.remaining_balance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
