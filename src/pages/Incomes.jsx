import React, { useState } from "react";
import IncomeList from "../components/Incomes/IncomeList";
import IncomeForm from "../components/Incomes/IncomeForm";
import LoadingOverlay from "../components/common/LoadingOverlay";
import LoadingSpinner from "../components/common/LoadingSpinner";
import styles from "../components/Incomes/IncomeList.module.scss";

const Incomes = () => {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleAddClick = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setShowForm(true);
      setButtonLoading(false);
    }, 500);
  };

  const handleCloseForm = () => setShowForm(false);

  const handleSuccess = () => {
    setShowForm(false);
    setRefresh((prev) => !prev);
  };

  return (
    <div className={styles.section}>
      <h2>Incomes</h2>

      {loading && <LoadingOverlay text="Loading incomes..." />}

      <div className={styles.addBtnWrapper}>
        <button
          onClick={handleAddClick}
          disabled={buttonLoading}
          className={styles.addBtn}
        >
          {buttonLoading ? (
            <span className={styles.btnContent}>
              <LoadingSpinner size="small" />
              <span>Opening...</span>
            </span>
          ) : (
            "Add Income"
          )}
        </button>
      </div>

      <IncomeList
        onAddClick={handleAddClick}
        refreshTrigger={refresh}
        setLoading={setLoading}
      />

      {showForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <IncomeForm onClose={handleCloseForm} onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Incomes;
