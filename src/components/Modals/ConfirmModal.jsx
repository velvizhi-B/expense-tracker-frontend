import React from "react";
import styles from "./ConfirmModal.module.scss";
import LoadingSpinner from "../common/LoadingSpinner";

const ConfirmModal = ({ message, onConfirm, onCancel, loading }) => {
  const handleBackdropClick = (e) => {
    // Prevent clicks inside the modal from closing it
    e.stopPropagation();
  };

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modalBox} onClick={handleBackdropClick}>
        <h3>Are you sure?</h3>
        <p>{message}</p>

        <div className={styles.modalActions}>
          <button
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="16px" color="#fff" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete"
            )}
          </button>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
