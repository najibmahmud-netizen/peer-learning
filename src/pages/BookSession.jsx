import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../services/firebase'
import heroImage from '../assets/hero.png'

function BookSession() {
  const navigate = useNavigate()
  const [studentName, setStudentName] = useState('')
  const [skill, setSkill] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBooking = async (e) => {
    e.preventDefault()

    if (!studentName || !skill) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      await addDoc(collection(db, 'sessions'), {
        studentName,
        skill,
        createdAt: new Date()
      })

      alert('Session booked successfully')
      setStudentName('')
      setSkill('')
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
      alert(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0d1527] text-slate-200 antialiased flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Visual Info Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Book Tutoring Session
            </h1>
            <p className="mt-3 text-slate-400 text-base max-w-md leading-relaxed">
              Reserve a peer-led session for the skill you want to learn, then manage it from your dashboard.
            </p>
          </div>
          
          {/* Framed Image Container */}
          <div className="relative rounded-2xl border border-slate-800 bg-[#152238] p-6 flex items-center justify-center overflow-hidden shadow-xl aspect-square max-w-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <img
              src={heroImage}
              alt="Peer learning session"
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl opacity-90 transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Right Column: Interactive Form Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#152238] p-8 shadow-2xl backdrop-blur-sm relative">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
            Session Details
          </h2>
          
          <form onSubmit={handleBooking} className="space-y-5">
            {/* Full Name Input Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="studentName">
                Your Name
              </label>
              <input
                id="studentName"
                type="text"
                placeholder="Your Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#0d1527] px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none ring-offset-[#152238] transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Skill Target Input Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="skill">
                Skill To Learn
              </label>
              <input
                id="skill"
                type="text"
                placeholder="Skill To Learn"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#0d1527] px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none ring-offset-[#152238] transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Layout-aligned Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? 'Booking...' : 'Book Session'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default BookSession
