import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserShield, 
  FaKey, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaQuestionCircle,
  FaBuilding,
  FaUser
} from 'react-icons/fa';
import styles from './Login.module.scss';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'lender' | 'publisher'>(location.state?.userType || 'lender');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    // Проверяем state из навигации (после регистрации)
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setEmail(location.state.email || '');
      setUserType(location.state.userType || 'lender');
      
      // Очищаем сообщение через 5 секунд
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    if (failedAttempts >= 3) {
      setShowCaptcha(true);
    }
  }, [failedAttempts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showCaptcha && !isCaptchaVerified) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    setError('');
    const isAuthenticated = await login(email, password);

    if (isAuthenticated) {
      setFailedAttempts(0);
      setShowCaptcha(false);
      setIsCaptchaVerified(false);
      navigate(`/${userType}/dashboard`);
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      setError('Invalid email or password');
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    setError('Social login is not implemented yet');
  };

  const handleCaptchaVerify = () => {
    setIsCaptchaVerified(true);
    setError('');
  };

  return (
    <div className={styles.loginContainer}>
      <motion.div 
        className={styles.loginCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={styles.loginHeader}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className={styles.title}>Welcome to LeadSpace</h2>
            <p className={styles.subtitle}>
              Access your account to manage leads and payments
            </p>
          </motion.div>
        </div>

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}

        <div className={styles.userTypeToggle}>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.toggleButton} ${userType === 'lender' ? styles.active : ''}`}
            onClick={() => setUserType('lender')}
          >
            <FaBuilding /> Lender Login
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.toggleButton} ${userType === 'publisher' ? styles.active : ''}`}
            onClick={() => setUserType('publisher')}
          >
            <FaUser /> Publisher Login
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>
              <FaUserShield /> Email Address
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
              <FaKey /> Password
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

          {showCaptcha && (
            <motion.div
              className={styles.captchaContainer}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p>Verify you're not a robot</p>
              <div 
                className={styles.captchaBox}
                onClick={handleCaptchaVerify}
              >
                {isCaptchaVerified ? (
                  <span className={styles.captchaVerified}>✓ Verified</span>
                ) : (
                  <span>Click to verify</span>
                )}
              </div>
            </motion.div>
          )}

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
            disabled={showCaptcha && !isCaptchaVerified}
          >
            Log In
          </motion.button>
        </form>

        <div className={styles.socialLogin}>
          <div className={styles.divider}>
            <span>OR CONTINUE WITH</span>
          </div>
          
          <div className={styles.socialButtons}>
            <motion.button
              className={styles.socialButton}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialLogin('google')}
            >
              <FaGoogle /> Google
            </motion.button>
          </div>
        </div>

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
        
        <button 
          className={styles.helpButton}
          onClick={() => setIsHelpModalOpen(true)}
        >
          <FaQuestionCircle /> Need Help?
        </button>
      </motion.div>

      {/* Help Modal */}
      <AnimatePresence>
        {isHelpModalOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsHelpModalOpen(false)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={styles.closeButton}
                onClick={() => setIsHelpModalOpen(false)}
              >
                &times;
              </button>
              <h3>Need Help?</h3>
              <p>Our support team is ready to assist you with any issues.</p>
              <div className={styles.contactInfo}>
                <p><strong>Email:</strong> support@leadspace.com</p>
                <p><strong>Phone:</strong> +1 (800) 123-4567</p>
                <p><strong>Hours:</strong> 24/7</p>
              </div>
              <p className={styles.additionalHelp}>
                For faster assistance, please include your account email and a description of your issue.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;