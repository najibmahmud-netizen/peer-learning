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
  passwordStrength = null,
}) {
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordField = type === 'password'
  const inputType = isPasswordField && showPassword ? 'text' : type

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 ${
            isPasswordField ? 'pr-16' : ''
          } border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300'
          }`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-2">
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-gray-500 text-sm mt-2">
          {hint}
        </p>
      )}

      {passwordStrength && value && (
        <div className="mt-3 space-y-2">
          <div className="text-xs font-medium text-gray-600">
            Password requirements:
          </div>

          <div className="space-y-1 text-xs">
            <div
              className={`flex items-center gap-2 ${
                passwordStrength.feedback.length
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              <span>
                {passwordStrength.feedback.length ? '✓' : '✗'}
              </span>
              At least 8 characters
            </div>

            <div
              className={`flex items-center gap-2 ${
                passwordStrength.feedback.uppercase
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              <span>
                {passwordStrength.feedback.uppercase ? '✓' : '✗'}
              </span>
              One uppercase letter
            </div>

            <div
              className={`flex items-center gap-2 ${
                passwordStrength.feedback.lowercase
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              <span>
                {passwordStrength.feedback.lowercase ? '✓' : '✗'}
              </span>
              One lowercase letter
            </div>

            <div
              className={`flex items-center gap-2 ${
                passwordStrength.feedback.number
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              <span>
                {passwordStrength.feedback.number ? '✓' : '✗'}
              </span>
              One number
            </div>
          </div>
        </div>
      )}
    </div>
  )
}