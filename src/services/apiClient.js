const API_URL = 'http://localhost:3000'

export const apiClient = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)

      throw new Error(
        errorData?.message || `API Error: ${response.status}`
      )
    }

    return await response.json()
  } catch (error) {
    throw new Error(error.message || 'Network error')
  }
}