import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import heroImage from '../assets/hero.png'

function Dashboard() {
  const [skills, setSkills] = useState([])
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET SKILLS
        const skillsSnap = await getDocs(collection(db, 'skills'))
        const skillsData = skillsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setSkills(skillsData)

        // GET SESSIONS
        const sessionsSnap = await getDocs(collection(db, 'sessions'))
        const sessionsData = sessionsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setSessions(sessionsData)

      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="dashboard-page">
      <section className="dashboard-header lg:grid lg:grid-cols-[1fr_360px] lg:items-center gap-10">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back — Manage your skills, learning sessions, and progress here.
          </p>

          <div className="dashboard-actions mt-6">
            <button type="button" className="btn" onClick={() => navigate('/create-skill')}>
              Add Skill
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/book-session')}>
              Book Session
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src={heroImage}
            alt="Peer learning illustration"
            className="max-w-sm rounded-3xl shadow-2xl border border-white/80"
          />
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <h2>My Skills</h2>
          <p className="stat-number">{skills.length}</p>
          <p className="stat-label">Skills you are teaching</p>
        </article>

        <article className="panel-card">
          <h2>Sessions</h2>
          <p className="stat-number">{sessions.length}</p>
          <p className="stat-label">Booked learning sessions</p>
        </article>

        <article className="panel-card">
          <h2>Completed</h2>
          <p className="stat-number">0</p>
          <p className="stat-label">Finished sessions</p>
        </article>
      </section>

      <section className="skills-section">
        <div className="section-heading">
          <h2> Skills Available</h2>
          <p>Browse what other learners can teach and reserve a session.</p>
        </div>

        {skills.length === 0 ? (
          <p className="empty-state">No skills posted yet.</p>
        ) : (
          <div className="skill-grid">
            {skills.map(skill => (
              <article key={skill.id} className="skill-card">
                <div>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/book-session')}>
                  Book this skill
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard