

import { Eye, EyeOff, Check, X } from 'lucide-react'
import { useState } from 'react'

export function AuthInput({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  disabled = false,
  hint = null,
  icon: Icon = null,
  passwordStrength = null, 
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField && showPassword ? 'text' : type

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} ${isPasswordField ? 'pr-12' : ''} border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      
      {hint && !error && <p className="text-gray-500 text-sm mt-2">{hint}</p>}

      
      {passwordStrength && value && (
        <div className="mt-3 space-y-2">
          <div className="text-xs font-medium text-gray-600">Password requirements:</div>
          <div className="space-y-1 text-xs">
            <div
              className={`flex items-center gap-2 ${
                passwordStrength.feedback.length ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {passwordStrength.feedback.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              At least 8 characters
            </div>
            <div
              className={`flex items-center gap-2 ${
                passwordStrength.feedback.uppercase ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {passwordStrength.feedback.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              One uppercase letter
            </div>
            <div
              className={`flex items-center gap-2 ${
                passwordStrength.feedback.lowercase ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {passwordStrength.feedback.lowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              One lowercase letter
            </div>
            <div
              className={`flex items-center gap-2 ${
                passwordStrength.feedback.number ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {passwordStrength.feedback.number ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              One number
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export function AuthAlert({ type = 'error', message, onClose }) {
  const isError = type === 'error'

  return (
    <div
      className={`p-4 rounded-lg flex items-start gap-3 ${
        isError
          ? 'bg-red-50 border border-red-200'
          : type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-blue-50 border border-blue-200'
      }`}
    >
      {isError ? (
        <X className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isError ? 'text-red-600' : 'text-green-600'}`} />
      ) : (
        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isError ? 'text-red-600' : 'text-green-600'}`} />
      )}
      <p
        className={`text-sm ${
          isError ? 'text-red-700' : type === 'success' ? 'text-green-700' : 'text-blue-700'
        }`}
      >
        {message}
      </p>
      {onClose && (
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
          ×
        </button>
      )}
    </div>
  )
}


export function AuthFormContainer({
  children,
  title,
  subtitle,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Continue',
}) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{title}</h3>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {children}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </span>
          ) : (
            submitButtonText
          )}
        </button>
      </form>
    </div>
  )
}


 
 
export function SocialLoginButton({ provider = 'google', icon: Icon, onClick, isLoading = false }) {
  const providerNames = {
    google: 'Continue with Google',
    github: 'Continue with GitHub',
    microsoft: 'Continue with Microsoft',
  }

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:bg-gray-50 disabled:cursor-not-allowed"
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="font-medium text-gray-700">{providerNames[provider] || 'Continue'}</span>
    </button>
  )
}
