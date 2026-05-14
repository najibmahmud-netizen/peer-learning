import heroImage from '../assets/hero.png'

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">

      {/* HERO SECTION */}
      <div className="max-w-6xl w-full grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center mt-20">
        <div className="lg:text-left text-center">
          <h1 className="text-5xl font-bold text-blue-700 mb-4">
            Peer Learning Platform
          </h1>

          <p className="text-gray-700 text-lg mb-6">
            A community-driven platform where students teach, learn, and grow together.
            Share your skills, discover new knowledge, and book learning sessions with peers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-100"
            >
              Login
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src={heroImage}
            alt="Students learning together"
            className="w-full max-w-md rounded-3xl shadow-2xl border border-white/70"
          />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Learn Skills</h2>
          <p className="text-gray-600">
            Browse skills shared by other students and learn at your own pace.
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2"> Teach Others</h2>
          <p className="text-gray-600">
            Post the skills you know and help other students grow.
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2"> Book Sessions</h2>
          <p className="text-gray-600">
            Schedule one-on-one or group learning sessions easily.
          </p>
        </div>

      </div>

      {/* FOOTER NOTE */}
      <p className="text-sm text-gray-500 mt-16">
        Built for student peer learning and collaboration 
      </p>

    </div>
  )
}

export default Home