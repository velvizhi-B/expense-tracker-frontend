// src/components/common/LoadingSpinner.jsx
import React from "react";
import styles from "./LoadingSpinner.module.scss";
import clsx from "clsx"; // If you use clsx (or just string template)

const LoadingSpinner = ({ size = "medium", text = "", color = "#ffffffff" }) => {
  return (
    <div className={styles.spinnerWrapper}>
      <div
        className={clsx(styles.spinner, styles[size])}
        style={{ borderTopColor: color }}
      />
      {text && <span>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
