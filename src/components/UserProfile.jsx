import { useState } from 'react'

import { useUser } from '../context/UserContext'
import { AuthInput, AuthAlert } from './AuthComponents'

export default function UserProfile() {
  const { user, login } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skills: user?.skills || [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      const updatedUser = { ...user, ...profileData }
      login(updatedUser)
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      skills: user?.skills || [],
    })
    setIsEditing(false)
    setError('')
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 md:px-8 py-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-16 h-16 rounded-full border-4 border-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                <User className="w-8 h-8" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-blue-100">{user.authMethod === 'google' ? 'Google Account' : 'Email Account'}</p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      
      <div className="p-6 md:p-8">
        {error && <AuthAlert type="error" message={error} onClose={() => setError('')} />}
        {successMessage && <AuthAlert type="success" message={successMessage} />}

        {isEditing ? (
        
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <AuthInput
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                icon={User}
              />

              <AuthInput
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                icon={Mail}
              />

              <AuthInput
                label="Phone"
                name="phone"
                type="tel"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                icon={Phone}
              />

              <AuthInput
                label="Location"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                disabled={isLoading}
                icon={MapPin}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                disabled={isLoading}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Phone</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.location && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Location</p>
                    <p className="font-medium text-gray-900">{user.location}</p>
                  </div>
                </div>
              )}
            </div>

            {user.bio && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">About</p>
                <p className="text-gray-700">{user.bio}</p>
              </div>
            )}

            {user.createdAt && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Joined</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}