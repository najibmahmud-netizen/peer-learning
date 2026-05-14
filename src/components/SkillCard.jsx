function SkillCard({ title, description }) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default SkillCard