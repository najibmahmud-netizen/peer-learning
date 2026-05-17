import { Link } from 'react-router-dom'

export default function Home() {
  const features = [
    {
      
      title: 'Learn New Skills',
      desc: 'Access a curated library of skills taught by your peers at Moringa School.',
    },
    {
     
      title: 'Peer Tutoring',
      desc: 'Connect directly with students who have mastered the topics you want to learn.',
    },
    {
    
      title: 'Fast Booking',
      desc: 'Book tutoring sessions in seconds with our streamlined scheduling system.',
    },
  ]

  const stats = [
    { value: '150+', label: 'Active Skills' },
    { value: '80+', label: 'Peer Tutors' },
    { value: '500+', label: 'Sessions Held' },
    { value: '4.8', label: 'Avg Rating',  },
  ]

  return (
    <div>
      
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-sm font-medium mb-6">
              
              Moringa School — Module 3 Project
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Learn Together.<br />
              <span className="text-primary-300">Grow Together.</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 leading-relaxed max-w-2xl">
              A peer-to-peer learning platform where Moringa students teach and learn from each other. 
              Share your expertise, book sessions, and accelerate your growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
              >
                Explore Skills
      
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700/50 text-white border border-primary-400/30 rounded-xl font-semibold hover:bg-primary-700/70 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-gray-900">
                  {stat.value}
                  {stat.icon && <stat.icon className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                </div>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to share knowledge and book learning sessions with fellow students.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="card p-8 text-center">
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start learning?</h2>
          <p className="text-primary-100 text-lg mb-8">
            Join hundreds of Moringa students already sharing knowledge on the platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              to="/explore"
              className="px-8 py-3 bg-primary-700 text-white border border-primary-500 rounded-xl font-semibold hover:bg-primary-800 transition-colors"
            >
              Browse Skills
            </Link>
          </div>
          
        </div>
      </section>
    </div>
  )
}