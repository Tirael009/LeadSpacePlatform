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
  FaIdCard,
  FaGlobe,
  FaInfoCircle,
  FaLink,
  FaChartBar,
  FaGraduationCap,
  FaShieldAlt,
  FaGoogle,
  FaLinkedinIn,
  FaRocket,
  FaHandshake,
  FaLock,
  FaShieldVirus
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import styles from './Register.module.scss';
import { countries } from '@/utils/countries';
import { createUser } from '@/api/directus';

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
    taxId: '',
    country: '',
    referralCode: '',
    hearAboutUs: '',
    website: '',
    monthlyVolume: '',
    experience: '',
    entityType: '',
    licenseNumber: '',
    integrationPref: ''
  });
  const [verticals, setVerticals] = useState<string[]>([]);
  const [leadTypes, setLeadTypes] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Опции для селекторов
  const hearAboutOptions = [
    'Google Search', 'Social Media', 'Referral', 
    'Industry Conference', 'Blog/Article', 'Other'
  ];
  
  const volumeOptions = [
    '0-100 leads', '100-500 leads', '500-1000 leads', 
    '1000-5000 leads', '5000+ leads'
  ];
  
  const verticalOptions = [
    'Mortgages', 'Personal Loans', 'Auto Loans', 
    'Credit Cards', 'Student Loans', 'Crypto', 
    'Insurance', 'Debt Consolidation', 'Other'
  ];
  
  const experienceOptions = [
    'Beginner (just starting)', 
    'Intermediate (some experience)', 
    'Advanced (run campaigns regularly)',
    'Agency (manage multiple clients)'
  ];
  
  const entityOptions = [
    'Sole Proprietorship', 'LLC', 'Corporation',
    'Partnership', 'Non-profit', 'Government Entity'
  ];
  
  const leadTypeOptions = [
    'Hot Leads (ready to buy)',
    'Warm Leads (considering options)',
    'Cold Leads (information gathering)',
    'Email Leads'
  ];
  
  const integrationOptions = [
    'API Integration', 'Email', 'CSV/Excel', 'Webhook'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleVerticalChange = (vertical: string) => {
    setVerticals(prev => 
      prev.includes(vertical)
        ? prev.filter(v => v !== vertical)
        : [...prev, vertical]
    );
  };

  const handleLeadTypeChange = (type: string) => {
    setLeadTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
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
    if (!formData.country) newErrors.country = 'Country is required';
    
    if (userType === 'publisher') {
      if (!formData.website) newErrors.website = 'Website or traffic source is required';
      if (!formData.experience) newErrors.experience = 'Experience level is required';
      if (verticals.length === 0) newErrors.verticals = 'At least one vertical must be selected';
    }
    
    if (userType === 'lender') {
      if (!formData.company) newErrors.company = 'Company name is required';
      if (!formData.entityType) newErrors.entityType = 'Legal entity type is required';
      if (leadTypes.length === 0) newErrors.leadTypes = 'At least one lead type must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegisterError('');
    
    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: userType,
      company: formData.company,
      website: formData.website,
      phone: formData.phone,
      country: formData.country,
      tax_id: formData.taxId,
      license_number: formData.licenseNumber,
      integration_preference: formData.integrationPref,
      monthly_volume: formData.monthlyVolume,
      experience: formData.experience,
      hear_about_us: formData.hearAboutUs,
      referral_code: formData.referralCode,
      verticals: verticals.join(', '),
      lead_types: leadTypes.join(', ')
    };

    try {
      await createUser(userData);
      
      // Перенаправляем на страницу входа с предзаполненным email
      navigate('/login', {
        state: {
          email: formData.email,
          userType: userType,
          message: "Registration successful! Please login"
        }
      });
    } catch (error) {
      console.error('Registration failed:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setRegisterError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <motion.div 
        className={styles.registerCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={styles.registerHeader}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className={styles.title}>
              <FaRocket style={{ marginRight: '12px' }} />
              Create Your LeadSpace Account
            </h2>
            <p className={styles.subtitle}>
              Connect with the best lenders and publishers in the industry. 
              Start managing your leads efficiently and grow your business.
            </p>
          </motion.div>
        </div>

        <div className={styles.socialAuth}>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.socialButton} ${styles.googleButton}`}
          >
            <FaGoogle /> Sign up with Google
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.socialButton} ${styles.linkedinButton}`}
          >
            <FaLinkedinIn /> Sign up with LinkedIn
          </motion.button>
          <div className={styles.authDivider}>
            <span>or continue with email</span>
          </div>
        </div>

        <div className={styles.userTypeToggle}>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.toggleButton} ${userType === 'lender' ? styles.active : ''}`}
            onClick={() => setUserType('lender')}
          >
            <FaBuilding size={18} /> I'm a Lender
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.toggleButton} ${userType === 'publisher' ? styles.active : ''}`}
            onClick={() => setUserType('publisher')}
          >
            <FaUser size={18} /> I'm a Publisher
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          {registerError && <div className={styles.errorMessage}>{registerError}</div>}

          <div className={styles.twoColumns}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName" className={styles.inputLabel}>
                <FaUser /> First Name
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
                <FaUser /> Last Name
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
              <FaEnvelope /> Email
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
                <FaKey /> Password
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
              <div className={styles.inputHint}>
                <FaInfoCircle /> Must be at least 8 characters
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.inputLabel}>
                <FaKey /> Confirm Password
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

          <div className={styles.twoColumns}>
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.inputLabel}>
                <FaPhone /> Phone Number
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
              <div className={styles.inputHint}>
                <FaInfoCircle /> For account verification and support
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="country" className={styles.inputLabel}>
                <FaGlobe /> Country / Location
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={styles.inputField}
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className={styles.selectArrow} />
              </div>
              {errors.country && <span className={styles.errorMessage}>{errors.country}</span>}
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <FaHandshake size={20} />
            {userType === 'publisher' ? 'Publisher Details' : 'Lender Details'}
          </div>

          {userType === 'publisher' && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="website" className={styles.inputLabel}>
                  <FaLink /> Website or Traffic Source
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="https://example.com or Facebook Ads"
                />
                {errors.website && <span className={styles.errorMessage}>{errors.website}</span>}
                <div className={styles.inputHint}>
                  <FaInfoCircle /> Where will you be sending traffic from?
                </div>
              </div>

              <div className={styles.twoColumns}>
                <div className={styles.inputGroup}>
                  <label htmlFor="monthlyVolume" className={styles.inputLabel}>
                    <FaChartBar /> Estimated Monthly Volume
                  </label>
                  <div className={styles.selectWrapper}>
                    <select
                      id="monthlyVolume"
                      name="monthlyVolume"
                      value={formData.monthlyVolume}
                      onChange={handleChange}
                      className={styles.inputField}
                    >
                      <option value="">Select volume range</option>
                      {volumeOptions.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <FiChevronDown className={styles.selectArrow} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="experience" className={styles.inputLabel}>
                    <FaGraduationCap /> Experience Level
                  </label>
                  <div className={styles.selectWrapper}>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={styles.inputField}
                    >
                      <option value="">Select your experience</option>
                      {experienceOptions.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <FiChevronDown className={styles.selectArrow} />
                  </div>
                  {errors.experience && <span className={styles.errorMessage}>{errors.experience}</span>}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <FaShieldAlt /> Verticals of Interest
                </label>
                <div className={styles.checkboxGrid}>
                  {verticalOptions.map((vertical, idx) => (
                    <label key={idx} className={`${styles.checkboxOption} ${verticals.includes(vertical) ? styles.active : ''}`}>
                      <input
                        type="checkbox"
                        checked={verticals.includes(vertical)}
                        onChange={() => handleVerticalChange(vertical)}
                      />
                      <span>{vertical}</span>
                    </label>
                  ))}
                </div>
                {errors.verticals && <div className={styles.errorMessage}>{errors.verticals}</div>}
              </div>
            </>
          )}

          {userType === 'lender' && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="company" className={styles.inputLabel}>
                  <FaBuilding /> Company Name
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

              <div className={styles.twoColumns}>
                <div className={styles.inputGroup}>
                  <label htmlFor="entityType" className={styles.inputLabel}>
                    <FaBuilding /> Legal Entity Type
                  </label>
                  <div className={styles.selectWrapper}>
                    <select
                      id="entityType"
                      name="entityType"
                      value={formData.entityType}
                      onChange={handleChange}
                      className={styles.inputField}
                    >
                      <option value="">Select entity type</option>
                      {entityOptions.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <FiChevronDown className={styles.selectArrow} />
                  </div>
                  {errors.entityType && <span className={styles.errorMessage}>{errors.entityType}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="taxId" className={styles.inputLabel}>
                    <FaIdCard /> Tax ID
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
                  <div className={styles.inputHint}>
                    <FaInfoCircle /> For invoicing and legal purposes
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="licenseNumber" className={styles.inputLabel}>
                  <FaShieldAlt /> License Number
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Financial license number"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <FaShieldAlt /> Preferred Lead Types
                </label>
                <div className={styles.checkboxGrid}>
                  {leadTypeOptions.map((type, idx) => (
                    <label key={idx} className={`${styles.checkboxOption} ${leadTypes.includes(type) ? styles.active : ''}`}>
                      <input
                        type="checkbox"
                        checked={leadTypes.includes(type)}
                        onChange={() => handleLeadTypeChange(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                {errors.leadTypes && <div className={styles.errorMessage}>{errors.leadTypes}</div>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="integrationPref" className={styles.inputLabel}>
                  <FaShieldAlt /> Integration Preference
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    id="integrationPref"
                    name="integrationPref"
                    value={formData.integrationPref}
                    onChange={handleChange}
                    className={styles.inputField}
                  >
                    <option value="">Select preferred method</option>
                    {integrationOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <FiChevronDown className={styles.selectArrow} />
                </div>
              </div>
            </>
          )}

          <div className={styles.twoColumns}>
            <div className={styles.inputGroup}>
              <label htmlFor="hearAboutUs" className={styles.inputLabel}>
                How did you hear about us?
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="hearAboutUs"
                  name="hearAboutUs"
                  value={formData.hearAboutUs}
                  onChange={handleChange}
                  className={styles.inputField}
                >
                  <option value="">Select an option</option>
                  {hearAboutOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
                <FiChevronDown className={styles.selectArrow} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="referralCode" className={styles.inputLabel}>
                Referral Code (optional)
              </label>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Enter referral code"
              />
            </div>
          </div>

          <div className={styles.securitySection}>
            <div className={styles.sectionTitle}>
              <FaLock size={20} />
              Account Security
            </div>
            
            <div className={styles.inputGroup}>
              <div className={styles.termsCheckbox}>
                <input 
                  type="checkbox" 
                  id="enable2FA"
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                />
                <label htmlFor="enable2FA">
                  Enable Two-Factor Authentication (2FA) for enhanced security
                </label>
              </div>
            </div>
            
            <div className={styles.securityBadge}>
              <FaShieldVirus /> Your information is encrypted and securely stored
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.termsCheckbox}>
              <input 
                type="checkbox" 
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the <Link to="/terms" className={styles.forgotPassword}>Terms of Service</Link> and <Link to="/privacy" className={styles.forgotPassword}>Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <div className={styles.errorMessage}>{errors.terms}</div>}
          </div>

          <motion.button
            type="submit"
            className={styles.registerButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.spinner} />
            ) : (
              'Create Account'
            )}
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