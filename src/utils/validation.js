/**
 * Email validation using regex
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Password validation
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password),
    feedback: {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    },
  }
}

/**
 * Validate form data
 */
export const validateFormData = (formData, isSignUp = false) => {
  const errors = {}

  // Email validation
  if (!formData.email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required'
  } else if (isSignUp) {
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers'
    }
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  // Confirm password validation (only for sign up)
  if (isSignUp) {
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
  }

  return errors
}
