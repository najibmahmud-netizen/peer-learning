
const API_URL = 'http://localhost:3000'


export const signUpWithEmail = async (userData) => {
  const { name, email, password } = userData

  
  const existingEmail = await fetch(`${API_URL}/users?email=${email}`)
  const existing = await existingEmail.json()

  if (existing.length > 0) {
    throw new Error('This email is already registered')
  }

  const newUser = {
    id: `email_${Date.now()}`,
    name,
    email,
    password, 
    picture: null,
    authMethod: 'email',
    createdAt: new Date().toISOString(),
  }

  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  })

  if (!response.ok) {
    throw new Error('Sign up failed')
  }

  return newUser
}


export const signInWithEmail = async (email, password) => {
  const response = await fetch(`${API_URL}/users?email=${email}`)
  const users = await response.json()

  if (users.length === 0 || users[0].password !== password) {
    throw new Error('Invalid email or password')
  }

  return users[0]
}


export const signInWithGoogle = async (userData) => {
  const googleUser = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    picture: userData.picture,
    authMethod: 'google',
  }

  
  
  const res = await fetch(`${API_URL}/users?id=${googleUser.id}`)
  const existing = await res.json()

  if (existing.length === 0) {
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleUser),
    })

    if (!response.ok) {
      throw new Error('Failed to create user')
    }
  }

  return existing.length > 0 ? existing[0] : googleUser
}


export const getUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`)
  if (!response.ok) {
    throw new Error('User not found')
  }
  return response.json()
}


export const updateUserProfile = async (userId, updates) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error('Failed to update profile')
  }

  return response.json()
}


export const checkEmailExists = async (email) => {
  const response = await fetch(`${API_URL}/users?email=${email}`)
  const users = await response.json()
  return users.length > 0
}


export const verifyCredentials = async (email, password) => {
  try {
    const user = await signInWithEmail(email, password)
    return user
  } catch (error) {
    throw error
  }
}
