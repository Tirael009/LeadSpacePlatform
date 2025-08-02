import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaKey, 
  FaEye, 
  FaEyeSlash, 
  FaBuilding,
  FaPhone,
  FaIdCard
} from 'react-icons/fa';
import styles from './Register.module.scss';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'lender' | 'publisher'>('lender');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    taxId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!acceptTerms) newErrors.terms = 'You must accept the terms';
    
    if (userType === 'company' && !formData.company) {
      newErrors.company = 'Company name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Здесь будет логика регистрации
      console.log('Registration data:', { userType, ...formData });
      navigate('/verify-email'); // Перенаправление на страницу подтверждения
    }
  };

  return (
    <div className={styles.registerContainer}>
      <motion.div 
        className={styles.registerCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.registerHeader}>
          <h2 className={styles.title}>
            Join <span className={styles.logoHighlight}>LeadSpace</span>
          </h2>
          <p className={styles.subtitle}>
            Create your account to start managing leads
          </p>
        </div>

        <div className={styles.userTypeToggle}>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className={`${styles.toggleButton} ${userType === 'lender' ? styles.active : ''}`}
            onClick={() => setUserType('lender')}
          >
            I'm a Lender
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className={`${styles.toggleButton} ${userType === 'publisher' ? styles.active : ''}`}
            onClick={() => setUserType('publisher')}
          >
            I'm a Publisher
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.twoColumns}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName" className={styles.inputLabel}>
                <FaUser size={14} /> First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="John"
              />
              {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastName" className={styles.inputLabel}>
                <FaUser size={14} /> Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Doe"
              />
              {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>
              <FaEnvelope size={14} /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="your@email.com"
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div className={styles.twoColumns}>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>
                <FaKey size={14} /> Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="••••••••"
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
              {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.inputLabel}>
                <FaKey size={14} /> Confirm Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
            </div>
          </div>

          {userType === 'lender' && (
            <div className={styles.inputGroup}>
              <label htmlFor="company" className={styles.inputLabel}>
                <FaBuilding size={14} /> Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Your company name"
              />
              {errors.company && <span className={styles.errorMessage}>{errors.company}</span>}
            </div>
          )}

          <div className={styles.twoColumns}>
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.inputLabel}>
                <FaPhone size={14} /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="+1 (___) ___-____"
              />
            </div>

            {userType === 'lender' && (
              <div className={styles.inputGroup}>
                <label htmlFor="taxId" className={styles.inputLabel}>
                  <FaIdCard size={14} /> Tax ID
                </label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Company tax ID"
                />
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.rememberMe}>
              <input 
                type="checkbox" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span>I agree to the <Link to="/terms" className={styles.forgotPassword}>Terms of Service</Link> and <Link to="/privacy" className={styles.forgotPassword}>Privacy Policy</Link></span>
            </label>
            {errors.terms && <div className={styles.errorMessage}>{errors.terms}</div>}
          </div>

          <motion.button
            type="submit"
            className={styles.registerButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Account
          </motion.button>
        </form>

        <div className={styles.loginPrompt}>
          Already have an account?{' '}
          <Link to="/login" className={styles.signupLink}>
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;