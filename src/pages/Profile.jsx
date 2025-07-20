import React, { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./Profile.module.scss";
import defaultAvatar from "../assets/default-avatar.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../utils/cloudinary";
import ConfirmModal from "../components/Modals/ConfirmModal";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import LoadingOverlay from "../components/common/LoadingOverlay";
import Spinner from "../components/common/LoadingSpinner"; // if used inside buttons

const Profile = () => {
  const { logout } = useAuth();
  const { setUser } = useAuth(); // Destructure this from context

  const [profile, setProfile] = useState({
    name: "",
    phonenumber: "",
    email: "",
    profileimage: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState({
    update: false,
    password: false,
    delete: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setPageLoading(true); // show overlay
      const res = await api.get("/auth/profile");
      setProfile({ ...res.data, email: res.data.email });
      setUser(res.data);
    } catch (err) {
      toast.error("Failed to fetch profile");
    } finally {
      setPageLoading(false); // hide overlay
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    // Show preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profileimage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(profile.phonenumber)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      setButtonLoading((prev) => ({ ...prev, update: true }));
      await api.put("/auth/update-profile", {
        name: profile.name,
        phonenumber: profile.phonenumber,
        email: profile.email,
        address: profile.address,
        profileimage: profile.profileimage,
      });
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setButtonLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handlePasswordChange = async () => {
    try {
      setButtonLoading((prev) => ({ ...prev, password: true }));
      await api.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      localStorage.removeItem("token");
      toast.success("Password changed. Please login again.");
      navigate("/login");
    } catch (err) {
      toast.error("Password change failed");
    } finally {
      setButtonLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const handleDelete = async () => {
    try {
      setButtonLoading((prev) => ({ ...prev, delete: true }));
      await api.delete("/auth/delete-account");
      localStorage.removeItem("token");
      toast.success("Your account has been deleted successfully");
      logout();
      navigate("/register");
    } catch (err) {
      toast.error("Failed to delete your account");
    } finally {
      setButtonLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate("/login");
  };

  return (
    <div className={styles.profilePage}>
      {pageLoading && <LoadingOverlay text="Loading Profile..." />}

      <div className={styles.card}>
        <img
          src={profile.profileimage || defaultAvatar}
          alt="Profile"
          className={styles.avatar}
        />

        {editing && (
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const imageUrl = await uploadToCloudinary(file);
                setProfile((prev) => ({ ...prev, profileimage: imageUrl }));
              }
            }}
          />
        )}

        <div className={styles.profileInfo}>
          <label>Name</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!editing}
          />
          <label>Phone Number</label>
          <input
            name="phonenumber"
            value={profile.phonenumber}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setProfile((prev) => ({ ...prev, phonenumber: value }));
              }
            }}
            disabled={!editing}
            placeholder="Enter 10-digit number"
          />

          <label>Email</label>
          <input value={profile.email} disabled />

          <label>Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            disabled={!editing}
          />

          {editing ? (
            <button
              className={styles.saveBtn}
              onClick={handleUpdate}
              disabled={buttonLoading.update}
            >
              {buttonLoading.update ? (
                <Spinner size="small" text="Saving..." />
              ) : (
                "Save"
              )}
            </button>
          ) : (
            <button className={styles.editBtn} onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {showPasswordForm && (
        <div className={styles.card}>
          <h3>Change Password</h3>

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword.current ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
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

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword.new ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

          <button
            className={styles.saveBtn}
            onClick={handlePasswordChange}
            disabled={buttonLoading.password}
          >
            {buttonLoading.password ? (
              <Spinner size="small" text="Updating Password..." />
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      )}

      <div className={styles.actionsCombined}>
        <button
          className={styles.saveBtn}
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          Change Password
        </button>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => setShowConfirmModal(true)}
        >
          Delete Account
        </button>

        {showConfirmModal && (
          <ConfirmModal
            message="This action cannot be undone. Your account will be permanently deleted."
            onConfirm={handleDelete}
            onCancel={() => setShowConfirmModal(false)}
            loading={buttonLoading.delete}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
