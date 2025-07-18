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


  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setProfile({ ...res.data, email: res.data.email }); // keep your form state

      setUser(res.data); // ✅ Update global user context — this updates Navbar
    } catch (err) {
      console.error("Failed to fetch profile", err);
      toast.error("Failed to fetch profile");
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
    try {
      await api.put("/auth/update-profile", {
        name: profile.name,
        phonenumber: profile.phonenumber,
        email: profile.email,
        address: profile.address,
        profileimage: profile.profileimage, // this is the Cloudinary URL
      });

      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Update failed");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await api.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      localStorage.removeItem("token");
      toast.success("Password changed. Please login again.");
      navigate("/login");
    } catch (err) {
      console.error("Password change failed", err);
      toast.error("Password change failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete("/auth/delete-account");
      localStorage.removeItem("token");
      toast.success("Your account has been deleted successfully");
      logout();
      navigate("/register");
    } catch (err) {
      console.error("Account deletion failed", err);
      toast.error("Failed to delete your account");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate("/login");
  };

  return (
    <div className={styles.profilePage}>
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
            onChange={handleChange}
            disabled={!editing}
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
            <button className={styles.saveBtn} onClick={handleUpdate}>
              Save
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

    <button className={styles.saveBtn} onClick={handlePasswordChange}>
      Update Password
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
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
