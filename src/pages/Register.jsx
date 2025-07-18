import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import styles from "./Register.module.scss";
import { uploadToCloudinary } from "../utils/cloudinary";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    email: "",
    address: "",
    profileimage: "",
    password: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const validateForm = () => {
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(formData.phonenumber)) {
      toast.error("Phone number must be 10 digits");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Upload image if provided
      if (imageFile) {
        const imageUrl = await uploadToCloudinary(imageFile);
        formData.profileimage = imageUrl;
      }

      const res = await api.post("/auth/register", formData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      const errorData = error?.response?.data;
      const msg = Array.isArray(errorData?.detail)
        ? errorData.detail.map((e) => e.msg).join(", ")
        : errorData?.detail || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Register</h2>
      <form onSubmit={handleRegister}>
        {/* Name */}
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="text"
            name="phonenumber"
            className={styles.input}
            value={formData.phonenumber}
            onChange={handleChange}
            required
            maxLength="10"
          />
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address */}
        <div className={styles.formGroup}>
          <label>Address</label>
          <input
            type="text"
            name="address"
            className={styles.input}
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Profile Image */}
        <div className={styles.formGroup}>
          <label>Profile Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.input}
          />
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
