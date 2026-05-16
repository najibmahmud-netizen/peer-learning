import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { ArrowLeft, Calendar, Clock, User, DollarSign, CheckCircle, AlertCircle, Star } from 'lucide-react'

const API_URL = 'http://localhost:3000'

export default function SkillDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useUser()
  const [skill, setSkill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/skills/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSkill(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  const handleRequestSession = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (skill.tutorId === user.id) {
      setMessage('You cannot book your own skill.')
      return
    }

    if (skill.availability !== 'open') {
      setMessage('This skill is currently not available for booking.')
      return
    }

    setBooking(true)

    const sessionData = {
      skillId: skill.id,
      skillTitle: skill.title,
      tutorId: skill.tutorId,
      tutorName: skill.tutorName,
      studentId: user.id,
      studentName: user.name,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
    }

    try {
      const res = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      })

      if (res.ok) {
        setMessage('Session requested successfully! Check your dashboard.')
      } else {
        setMessage('Failed to request session. Please try again.')
      }
    } catch (err) {
      setMessage('Network error. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skill Not Found</h2>
        <p className="text-gray-500 mb-6">The skill you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/explore')} className="btn-primary">
          Back to Explore
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('/explore')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </button>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* MAIN CONTENT */}
        <div className="lg:col-span-2">

          <div className="rounded-2xl overflow-hidden mb-6">
            <img
              src={skill.image}
              alt={skill.title}
              className="w-full h-72 sm:h-96 object-cover"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="badge bg-primary-100 text-primary-700">{skill.category}</span>
            <span
              className={`badge ${
                skill.availability === 'open'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {skill.availability === 'open' ? 'Available' : 'Closed'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{skill.title}</h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">

            {/* PROFILE PHOTO REMOVED */}
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {skill.tutorName?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-gray-900">{skill.tutorName}</p>
              <p className="text-sm text-gray-500">Tutor</p>
            </div>

            <div className="ml-auto flex items-center gap-1 text-yellow-500">
              <Star className="w-5 h-5 fill-yellow-500" />
              <span className="font-semibold text-gray-900">4.8</span>
              <span className="text-sm text-gray-500">(12 reviews)</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Skill</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{skill.description}</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">What You'll Learn</h3>
            <ul className="space-y-2 mb-6">
              {['Core concepts and fundamentals', 'Hands-on practical exercises', 'Best practices and patterns', 'Real-world project application'].map(
                (item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* SIDEBAR (UNCHANGED) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="card p-6">

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">${skill.price}</span>
                  <span className="text-gray-500">/hour</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>1-hour sessions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>Flexible scheduling</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>1-on-1 tutoring</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span>Secure payment</span>
                </div>
              </div>

              <button
                onClick={handleRequestSession}
                disabled={booking || skill.availability !== 'open'}
                className={`w-full py-3 rounded-xl font-semibold text-center transition-colors ${
                  skill.availability === 'open'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {booking ? 'Requesting...' : skill.availability === 'open' ? 'Request Session' : 'Not Available'}
              </button>

              {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm flex items-start gap-2 ${
                  message.includes('success')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {message.includes('success') ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {message}
                </div>
              )}

              {!isAuthenticated && (
                <p className="mt-3 text-xs text-center text-gray-500">
                  You need to sign in to request a session.
                </p>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}