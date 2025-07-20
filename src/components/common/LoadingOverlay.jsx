// src/components/common/LoadingOverlay.jsx
import React from "react";
import styles from "./LoadingOverlay.module.scss";

const LoadingOverlay = ({ text = "Loading..." }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinnerBox}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
