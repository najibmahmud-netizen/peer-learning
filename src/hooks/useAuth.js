

import { useState } from 'react'
import { useUser } from '../context/UserContext'
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  checkEmailExists,
  updateUserProfile,
} from '../services/authService'

export const useAuth = () => {
  const { user, login, logout, isAuthenticated } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  
  const signUp = async (name, email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const newUser = await signUpWithEmail({ name, email, password })
      login(newUser)
      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  
  const signIn = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const authUser = await signInWithEmail(email, password)
      login(authUser)
      return authUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  
  const signInGoogle = async (googleData) => {
    setIsLoading(true)
    setError(null)

    try {
      const authUser = await signInWithGoogle(googleData)
      login(authUser)
      return authUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  
  const emailExists = async (email) => {
    try {
      return await checkEmailExists(email)
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  
  const updateProfile = async (updates) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedUser = await updateUserProfile(user.id, updates)
      login(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  
  const signOut = () => {
    setError(null)
    logout()
  }

  return {
    
    user,
    isAuthenticated,
    isLoading,
    error,

    
    signUp,
    signIn,
    signInGoogle,
    signOut,
    emailExists,
    updateProfile,

    
    clearError: () => setError(null),
  }
}

export default useAuth
