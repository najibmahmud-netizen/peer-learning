import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../services/firebase'
import heroImage from '../assets/hero.png'

function CreateSkill() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      await addDoc(collection(db, 'skills'), {
        title,
        description,
        createdAt: new Date()
      })

      alert('Skill posted successfully')

      setTitle('')
      setDescription('')
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
      alert('Failed to post skill')
    }

    setLoading(false)
  }

  return (
    <div className='page-center'>
      <div className='create-layout'>
        <div className='create-info'>
          <h2 className='section-title'>Post a Skill</h2>
          <p className='text-gray-600 mb-6'>Share what you can teach and help other students learn from your experience.</p>
          <img
            src={heroImage}
            alt='Skill sharing illustration'
            className='booking-image'
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className='form-card'
        >
          <div className='form-group'>
            <label className='input-label' htmlFor='skillTitle'>Skill Title</label>
            <input
              id='skillTitle'
              type='text'
              placeholder='Skill Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='input-field'
            />
          </div>

          <div className='form-group'>
            <label className='input-label' htmlFor='skillDescription'>Skill Description</label>
            <textarea
              id='skillDescription'
              placeholder='Skill Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='textarea-field'
              rows='5'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn full-width'
          >
            {loading ? 'Posting...' : 'Post Skill'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateSkill