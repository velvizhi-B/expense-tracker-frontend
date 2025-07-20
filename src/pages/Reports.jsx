import React, { useState } from "react";
import styles from "./Reports.module.scss";
import api from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner"; // ✅ Import spinner

const Reports = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(""); // full-pdf, full-excel, range-pdf, range-excel

  const downloadFile = async (url, fileName, btnId) => {
    setLoadingBtn(btnId);
    try {
      const res = await api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download file:", err);
      alert("Download failed");
    } finally {
      setLoadingBtn("");
    }
  };

  const handleDownload = (type, format) => {
    const base = type === "full" ? "/reports/full" : "/reports/range";
    let url = `${base}?format=${format}`;

    if (type === "range") {
      if (!fromDate || !toDate) {
        alert("Please select both dates");
        return;
      }
      url += `&from_date=${fromDate}&to_date=${toDate}`;
    }

    const fileName = `${type}_report.${format === "excel" ? "xlsx" : "pdf"}`;
    const btnId = `${type}-${format}`;
    downloadFile(url, fileName, btnId);
  };

  const renderButton = (type, format, label) => {
    const btnId = `${type}-${format}`;
    const isLoading = loadingBtn === btnId;

    return (
      <button
        onClick={() => handleDownload(type, format)}
        disabled={isLoading}
        className={styles.downloadBtn}
      >
        {isLoading ? (
          <span className={styles.btnContent}>
            <LoadingSpinner size="small" color="#fff" />
            <span>Downloading...</span>
          </span>
        ) : (
          label
        )}
      </button>
    );
  };

  return (
    <div className={styles.reportsPage}>
      <h2>Reports</h2>

      <div className={styles.section}>
        <h3>📥 Full Report</h3>
        {renderButton("full", "pdf", "Download PDF")}
        {renderButton("full", "excel", "Download Excel")}
      </div>

      <div className={styles.section}>
        <h3>📅 Datewise Report</h3>
        <div className={styles.dateInputs}>
          <div className={styles.inputGroup}>
            <label htmlFor="from">From</label>
            <input
              id="from"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="to">To</label>
            <input
              id="to"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {renderButton("range", "pdf", "Download PDF")}
        {renderButton("range", "excel", "Download Excel")}
      </div>
    </div>
  );
};

export default Reports;
