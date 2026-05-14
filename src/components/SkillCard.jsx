function SkillCard({ title, description, category }) {
  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-[#152238] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
        
        <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
            {category}
            </span>             
          <span className="text-blue-500 font-semibold group-hover:underline cursor-pointer">View Details &rarr;</span>
        </div>
      </div>
    </div>
  )
}

export default SkillCard
