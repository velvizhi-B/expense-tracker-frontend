import { useState } from 'react';
import styles from './Login.module.scss';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.access_token;

      localStorage.setItem('token', token);
      login(token);
      navigate('/dashboard');
    } catch (error) {
      const errorData = error?.response?.data;

      if (Array.isArray(errorData?.detail)) {
        const messages = errorData.detail.map((e) => e.msg).join(', ');
        setErr(messages);
      } else if (typeof errorData?.detail === 'string') {
        setErr(errorData.detail);
      } else {
        setErr('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formBox}>
        <h2 className={styles.formTitle}>Login</h2>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.passwordWrapper}`}>
            <label className={styles.label}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {err && <p className={styles.errorMessage}>{err}</p>}

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
