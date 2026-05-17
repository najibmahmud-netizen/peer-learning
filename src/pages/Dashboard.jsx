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
        setMySkills((prev) =>
          prev.map((s) => (s.id === skill.id ? updated : s))
        )
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
        setMySkills((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        )
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
    setFormData({
      title: '',
      category: 'Frontend',
      description: '',
      price: '',
      availability: 'open',
      image: '',
    })
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

      {/* Tabs */}
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

      
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">

            <form onSubmit={editingSkill ? handleEdit : handleCreate} className="space-y-4">

              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Title"
                className="input-field"
              />

              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                className="input-field"
              />

              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Price"
                className="input-field"
              />

              <button
                type="submit"
                disabled={formLoading}
                className="btn-primary w-full"
              >
                {formLoading ? 'Saving...' : editingSkill ? 'Update' : 'Create'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}