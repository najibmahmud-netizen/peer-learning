import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import SkillCard from '../components/SkillCard'

function ExploreSkills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'skills'))

        const skillsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setSkills(skillsData)
      } catch (error) {
        console.log(error)
      }

      setLoading(false)
    }

    fetchSkills()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-blue-700 mb-3">
            Explore Skills
          </h1>

          <p className="text-gray-600 text-lg">
            Discover skills shared by other students and book learning sessions.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading skills...</p>
        ) : skills.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-2xl font-semibold mb-2">
              No skills available yet
            </h2>

            <p className="text-gray-500">
              Be the first student to share a skill.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map(skill => (
              <SkillCard
                key={skill.id}
                title={skill.title}
                description={skill.description}
                category={skill.category}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}

export default ExploreSkills