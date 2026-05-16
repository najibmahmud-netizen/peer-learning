import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import {
  BookOpen, Plus, Trash2, Edit3, CheckCircle, XCircle, Clock,
  Calendar, User, AlertCircle, X, Save, Loader2
} from 'lucide-react'

const API_URL = 'http://localhost:3000'

export default function Dashboard() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('teaching')
  const [mySkills, setMySkills] = useState([])
  const [mySessions, setMySessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Frontend',
    description: '',
    price: '',
    availability: 'open',
    image: '',
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const categories = ['Frontend', 'Backend', 'Data Science', 'Design', 'AI/ML', 'DevOps', 'Mobile']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, sessionsRes] = await Promise.all([
          fetch(`${API_URL}/skills?tutorId=${user.id}`),
          fetch(`${API_URL}/sessions?studentId=${user.id}`),
        ])
        const skillsData = await skillsRes.json()
        const sessionsData = await sessionsRes.json()
        setMySkills(skillsData)
        setMySessions(sessionsData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user.id])

  // ─── CREATE ───
  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    if (!formData.title.trim() || !formData.description.trim() || !formData.price) {
      setFormError('Please fill in all required fields.')
      setFormLoading(false)
      return
    }

    const newSkill = {
      ...formData,
      price: Number(formData.price),
      tutorId: user.id,
      tutorName: user.name,
      tutorPicture: user.picture,
      image: formData.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    }

    try {
      const res = await fetch(`${API_URL}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      })
      if (res.ok) {
        const created = await res.json()
        setMySkills((prev) => [...prev, created])
        resetForm()
        setShowForm(false)
      } else {
        setFormError('Failed to create skill.')
      }
    } catch (err) {
      setFormError('Network error. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  
  const handleDelete = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return

    try {
      const res = await fetch(`${API_URL}/skills/${skillId}`, { method: 'DELETE' })
      if (res.ok) {
        setMySkills((prev) => prev.filter((s) => s.id !== skillId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  
  const toggleAvailability = async (skill) => {
    const newStatus = skill.availability === 'open' ? 'closed' : 'open'
    try {
      const res = await fetch(`${API_URL}/skills/${skill.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: newStatus }),
      })
      if (res.ok) {
        const updated = await res.json()
        setMySkills((prev) => prev.map((s) => (s.id === skill.id ? updated : s)))
      }
    } catch (err) {
      console.error(err)
    }
  }

  
  const handleEdit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      const res = await fetch(`${API_URL}/skills/${editingSkill.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setMySkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        resetForm()
        setEditingSkill(null)
        setShowForm(false)
      } else {
        setFormError('Failed to update skill.')
      }
    } catch (err) {
      setFormError('Network error.')
    } finally {
      setFormLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', category: 'Frontend', description: '', price: '', availability: 'open', image: '' })
    setFormError('')
  }

  const openEdit = (skill) => {
    setEditingSkill(skill)
    setFormData({
      title: skill.title,
      category: skill.category,
      description: skill.description,
      price: skill.price,
      availability: skill.availability,
      image: skill.image,
    })
    setShowForm(true)
  }

  const openCreate = () => {
    setEditingSkill(null)
    resetForm()
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your skills and track your sessions.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" />
          Add New Skill
        </button>
      </div>

      
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        <button
          onClick={() => setActiveTab('teaching')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'teaching'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Skills I Teach ({mySkills.length})
        </button>
        <button
          onClick={() => setActiveTab('booked')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'booked'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sessions Booked ({mySessions.length})
        </button>
      </div>

      
      {activeTab === 'teaching' && (
        <div>
          {mySkills.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No skills yet</h3>
              <p className="text-gray-500 mb-4">Share your expertise by adding your first skill.</p>
              <button onClick={openCreate} className="btn-primary">Add Your First Skill</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySkills.map((skill) => (
                <div key={skill.id} className="card">
                  <div className="relative h-44">
                    <img src={skill.image} alt={skill.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => openEdit(skill)}
                        className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge bg-primary-100 text-primary-700">{skill.category}</span>
                      <button
                        onClick={() => toggleAvailability(skill)}
                        className={`badge cursor-pointer transition-colors ${
                          skill.availability === 'open'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {skill.availability === 'open' ? (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Open</>
                        ) : (
                          <><XCircle className="w-3 h-3 mr-1" /> Closed</>
                        )}
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{skill.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{skill.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-bold">${skill.price}<span className="text-gray-400 text-sm font-normal">/hr</span></span>
                      <span className="text-xs text-gray-400">ID: {skill.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      
      {activeTab === 'booked' && (
        <div>
          {mySessions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No sessions booked</h3>
              <p className="text-gray-500">Browse skills and book your first tutoring session.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mySessions.map((session) => (
                <div key={session.id} className="card p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{session.skillTitle}</h3>
                      <span
                        className={`badge ${
                          session.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : session.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><User className="w-4 h-4 text-gray-400" /> Tutor: {session.tutorName}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-400" /> {session.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" /> {session.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.status === 'pending' && (
                      <span className="text-sm text-yellow-600 flex items-center gap-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Awaiting confirmation
                      </span>
                    )}
                    {session.status === 'confirmed' && (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Confirmed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditingSkill(null); resetForm(); }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={editingSkill ? handleEdit : handleCreate} className="p-6 space-y-5">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Advanced React Patterns"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what students will learn..."
                  rows={4}
                  className="input-field resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($/hr) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="25"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="input-field"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1">Leave empty for a default image.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingSkill(null); resetForm(); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> {editingSkill ? 'Update' : 'Create'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
