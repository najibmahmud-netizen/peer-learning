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
    <div className='page-center'>
      <div className='booking-layout'>
        <div className='booking-info'>
          <h2 className='section-title'>Book Tutoring Session</h2>
          <p className='text-gray-600 mb-6'>Reserve a peer-led session for the skill you want to learn, then manage it from your dashboard.</p>
          <img
            src={heroImage}
            alt='Peer learning session'
            className='booking-image'
          />
        </div>

        <form onSubmit={handleBooking} className='form-card'>
          <div className='form-group'>
            <label className='input-label' htmlFor='studentName'>Your Name</label>
            <input
              id='studentName'
              type='text'
              placeholder='Your Name'
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className='input-field'
            />
          </div>

          <div className='form-group'>
            <label className='input-label' htmlFor='skill'>Skill To Learn</label>
            <input
              id='skill'
              type='text'
              placeholder='Skill To Learn'
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className='input-field'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn full-width'
          >
            {loading ? 'Booking...' : 'Book Session'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookSession