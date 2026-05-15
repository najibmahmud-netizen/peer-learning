/**
 * useAuth Hook
 * Custom hook for authentication-related functionality
 * Extends the UserContext with additional auth methods
 */

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

  /**
   * Sign up with email and password
   */
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

  /**
   * Sign in with email and password
   */
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

  /**
   * Sign in with Google
   */
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

  /**
   * Check if email exists
   */
  const emailExists = async (email) => {
    try {
      return await checkEmailExists(email)
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  /**
   * Update user profile
   */
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

  /**
   * Sign out
   */
  const signOut = () => {
    setError(null)
    logout()
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Methods
    signUp,
    signIn,
    signInGoogle,
    signOut,
    emailExists,
    updateProfile,

    // Utilities
    clearError: () => setError(null),
  }
}

export default useAuth
