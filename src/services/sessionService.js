import { apiClient } from './apiClient'

export const createSession = async (sessionData) => {
  return await apiClient('/sessions', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  })
}

export const getSessionsByUser = async (userId) => {
  const sessions = await apiClient(`/sessions`)
  return sessions.filter(
    (s) => s.studentId === userId || s.tutorId === userId
  )
}