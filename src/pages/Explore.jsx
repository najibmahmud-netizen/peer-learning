import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllSkills } from "../services/skillService"

export default function Explore() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Frontend', 'Backend', 'Data Science', 'Design', 'AI/ML', 'DevOps', 'Mobile']

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchAllSkills()
        if (Array.isArray(data)) {
          setSkills(data)
        }
      } catch (err) {
        console.error('Failed to load skills:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSkills()
  }, [])

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = 
      skill.title?.toLowerCase().includes(search.toLowerCase()) ||
      skill.description?.toLowerCase().includes(search.toLowerCase()) ||
      skill.tutorName?.toLowerCase().includes(search.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by skill, description, or tutor..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />

          
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-medium text-gray-500">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-500">
          Showing {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'}
        </p>
      </div>

      {/* Skills Grid Layout */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <Link
            key={skill.id}
            to={`/skill/${skill.id}`}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="h-44 bg-gray-100 relative overflow-hidden">
              <img 
                src={skill.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60"} 
                alt={skill.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {skill.category}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1.5">
                {skill.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                {skill.description || 'No description provided.'}
              </p>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-600 font-medium">{skill.tutorName || 'Moringa Tutor'}</span>
                <span className="text-blue-600 font-bold text-sm">
                  ksh{skill.price || '0'}<span className="text-gray-400 font-normal text-xs">/hr</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}