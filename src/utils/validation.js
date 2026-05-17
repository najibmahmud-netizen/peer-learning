
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}


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


export const validateFormData = (formData, isSignUp = false) => {
  const errors = {}

  
  if (!formData.email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }

  
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

  
  if (isSignUp) {
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
  }

  return errors
}