import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.scss";
import defaultAvatar from "../../assets/default-avatar.png";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNavLinks, setShowNavLinks] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    setShowNavLinks(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        showNavLinks
      ) {
        setShowNavLinks(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNavLinks]);

  // Token expired handling — logout and redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && user) {
      logout();
      navigate("/login");
    }
  }, [user, logout, navigate]);

  return (
  <nav className={styles.navbar}>
  <div className={styles.logo}>
    <Link to="/">💸 Expense Tracker</Link>
  </div>

  {/* ✅ Always show hamburger menu (even when not logged in) */}
  <button
    className={`${styles.hamburger} ${showNavLinks ? styles.open : ""}`}
    onClick={() => setShowNavLinks((prev) => !prev)}
    aria-label="Toggle Menu"
  >
    {showNavLinks ? <X /> : <Menu />}
  </button>

  {/* ✅ Mobile menu always rendered, just change content */}
  <div
    ref={menuRef}
    className={`${styles.centerLinks} ${showNavLinks ? styles.show : ""}`}
  >
    {user ? (
      <>
        <Link to="/dashboard" onClick={() => setShowNavLinks(false)}>Dashboard</Link>
        <Link to="/incomes" onClick={() => setShowNavLinks(false)}>Incomes</Link>
        <Link to="/bill-reminders" onClick={() => setShowNavLinks(false)}>Bill Reminders</Link>
        <Link to="/reports" onClick={() => setShowNavLinks(false)}>Reports</Link>
        <div className={styles.mobileUserMenu}>
          <span className={styles.username}>Hi, {user.name}</span>
          <button onClick={() => { navigate("/profile"); setShowNavLinks(false); }}>Profile Information</button>
          <button onClick={() => { navigate("/change-password"); setShowNavLinks(false); }}>Change Password</button>
          <button onClick={() => { handleLogout(); setShowNavLinks(false); }}>Logout</button>
        </div>
      </>
    ) : (
      <div className={styles.mobileUserMenu}>
        <button onClick={() => { navigate("/login"); setShowNavLinks(false); }}>Login</button>
        <button onClick={() => { navigate("/register"); setShowNavLinks(false); }}>Register</button>
      </div>
    )}
  </div>

  {/* Desktop right side */}
  <div className={styles.right}>
    {!user ? (
      <>
        <button onClick={() => navigate("/register")}>Register</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </>
    ) : (
      <div className={styles.profileWrapper} ref={dropdownRef}>
        <span className={styles.username}>Hi, {user.name}</span>
        <img
          src={user.profileimage || defaultAvatar}
          alt="Profile"
          className={styles.avatar}
          onClick={toggleDropdown}
        />
        {showDropdown && (
          <div className={styles.dropdown}>
            <button onClick={() => { navigate("/profile"); setShowDropdown(false); }}>Profile Information</button>
            <button onClick={() => { navigate("/change-password"); setShowDropdown(false); }}>Change Password</button>
            <button onClick={() => { handleLogout(); setShowDropdown(false); }}>Logout</button>
          </div>
        )}
      </div>
    )}
  </div>
</nav>

);

};

export default Navbar;
