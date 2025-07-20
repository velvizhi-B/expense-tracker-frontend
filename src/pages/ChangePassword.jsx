import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import styles from "./ChangePassword.module.scss";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import LoadingOverlay from "../components/common/LoadingOverlay";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // simulate slight delay to show overlay
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setButtonLoading(true);

    if (formData.new_password !== formData.confirm_new_password) {
      setError("New passwords do not match");
      setButtonLoading(false);
      return;
    }

    try {
      await api.post(
        "/auth/change-password",
        {
          old_password: formData.current_password,
          new_password: formData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Password changed successfully!");
      toast.success("Password changed successfully!");

      setFormData({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
      });

      logout();
      navigate("/login");
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to change password";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setButtonLoading(false);
    }
  };

  if (pageLoading) return <LoadingOverlay text="Loading Change Password..." />;

  return (
    <div className={styles.container}>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Current Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword.current ? "text" : "password"}
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            required
          />
          <span
            className={styles.eyeIcon}
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, current: !prev.current }))
            }
          >
            {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <label>New Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword.new ? "text" : "password"}
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            required
          />
          <span
            className={styles.eyeIcon}
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, new: !prev.new }))
            }
          >
            {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <label>Confirm New Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword.confirm ? "text" : "password"}
            name="confirm_new_password"
            value={formData.confirm_new_password}
            onChange={handleChange}
            required
          />
          <span
            className={styles.eyeIcon}
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
          >
            {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={buttonLoading}>
          {buttonLoading ? (
            <span className={styles.spinnerWrapper}>
              <LoadingSpinner size="small" text="Changing Password..." color="#fff" />
              {/* <span className={styles.btnText}>Changing...</span> */}
            </span>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
