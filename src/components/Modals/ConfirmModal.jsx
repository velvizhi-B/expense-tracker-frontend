import React from "react";
import styles from "./ConfirmModal.module.scss";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

