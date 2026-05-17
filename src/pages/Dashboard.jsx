import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { fetchAllSkills, createSkill } from "../services/skillService"
import { getBookings } from '../utils/sessionManager' // Import memory tracker

export default function Dashboard() {
  const { user } = useUser()
  const [mySkills, setMySkills] = useState([])
  const [myBookings, setMyBookings] = useState([]) // New state for dynamic bookings tracking
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('teach')
  
  // Keep your existing Form States here...
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Frontend')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const loadDashboard = async () => {
    try {
      const allSkills = await fetchAllSkills()
      if (Array.isArray(allSkills)) {
        const filtered = allSkills.filter((skill) => skill.tutorId === user?.id)
        setMySkills(filtered)
      }
      
      // Load active session bookings instantly from runtime memory
      const activeBookings = getBookings()
      setMyBookings(activeBookings)

    } catch (err) {
      console.error('Dashboard load failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [user?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newSkillData = {
      title, category, description, price,
      tutorId: user?.id || 'mock-id',
      tutorName: user?.name || 'Current User'
    }
    try {
      await createSkill(newSkillData)
      await loadDashboard()
      setShowForm(false)
      setTitle(''); setDescription(''); setPrice('')
    } catch (err) {
      setMySkills(prev => [{ id: String(Date.now()), ...newSkillData }, ...prev])
      setShowForm(false)
      setTitle(''); setDescription(''); setPrice('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Top Header Control Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your skills and track your sessions.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm">
          {showForm ? 'Cancel' : '+ Add New Skill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 max-w-2xl">
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Skill Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Advanced React" className="w-full px-3 py-2 border rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                <option>Frontend</option><option>Backend</option><option>Data Science</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Hourly Rate (Ksh)</label>
              <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 2000" className="w-full px-3 py-2 border rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} rows="3" placeholder="Describe it..." className="w-full px-3 py-2 border rounded-lg text-sm bg-white" />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium self-start">Save Skill</button>
          </div>
        </form>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-3 border-b border-gray-100 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('teach')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'teach' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
          }`}
        >
          Skills I Teach ({mySkills.length})
        </button>
        <button
          onClick={() => setActiveTab('booked')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'booked' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
          }`}
        >
          Sessions Booked ({myBookings.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'teach' ? (
        mySkills.length === 0 ? (
          <div className="py-6 text-sm text-gray-400">No skills created yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mySkills.map((skill) => (
              <div key={skill.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <span className="inline-block bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-3">
                  {skill.category}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-1">{skill.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{skill.description}</p>
                <div className="mt-4 pt-3 border-t text-xs text-blue-600 font-bold">ksh {skill.price}/hr</div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Render Bookings clean when activeTab is 'booked' */
        myBookings.length === 0 ? (
          <div className="py-6 text-sm text-gray-400">No active session schedules found.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBookings.map((booking) => (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={booking.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60"} 
                    alt={booking.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {booking.category}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-gray-900 mb-1">{booking.title}</h3>
                  <p className="text-xs text-gray-500 mb-4">Tutor: <span className="font-medium text-gray-700">{booking.tutorName}</span></p>
                  
                  <div className="pt-3 border-t border-gray-100 text-xs flex justify-between items-center mt-auto">
                    <span>Status: <span className="text-green-600 font-semibold">Confirmed</span></span>
                    <span className="font-bold text-gray-900 text-sm">ksh {booking.price}/hr</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}