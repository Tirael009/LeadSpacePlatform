import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserShield, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Login.module.scss';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'lender' | 'publisher'>(location.state?.userType || 'lender');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(email, password)) {
      navigate(`/${userType}/dashboard`);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <motion.div 
        className={styles.loginCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.loginHeader}>
          <h2 className={styles.title}>
            Welcome Back to <span className={styles.logoHighlight}>LeadSpace</span>
          </h2>
          <p className={styles.subtitle}>
            Access your account to manage leads and payments
          </p>
        </div>

        <div className={styles.userTypeToggle}>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className={`${styles.toggleButton} ${userType === 'lender' ? styles.active : ''}`}
            onClick={() => setUserType('lender')}
          >
            Lender Login
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className={`${styles.toggleButton} ${userType === 'publisher' ? styles.active : ''}`}
            onClick={() => setUserType('publisher')}
          >
            Publisher Login
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>
              <FaUserShield size={14} /> Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.inputLabel}>
              <FaKey size={14} /> Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={styles.rememberForgot}>
            <label className={styles.rememberMe}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <motion.button
            type="submit"
            className={styles.loginButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In
          </motion.button>
        </form>

        <div className={styles.signupPrompt}>
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            state={{ userType }}
            className={styles.signupLink}
          >
            Sign up as {userType === 'lender' ? 'Lender' : 'Publisher'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;