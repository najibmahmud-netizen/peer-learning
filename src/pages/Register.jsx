function Register() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 shadow rounded w-80">
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
        />

        <input
          className="border p-2 w-full mb-4"
          placeholder="Password"
          type="password"
        />

        <button className="bg-green-600 text-white w-full p-2">
          Register
        </button>
      </div>
    </div>
  )
}

export default Register