export function AuthFeatures({ features }) {
  return (
    <div className="space-y-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur">
            {feature.icon && <feature.icon className="w-6 h-6 text-blue-200" strokeWidth={1.5} />}
          </div>
          <div>
            <p className="font-semibold text-lg">{feature.title}</p>
            <p className="text-blue-100 text-sm mt-1">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}


export function AuthSidebar({ title, subtitle, features, children }) {
  return (
    <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white flex-col justify-center">
      <div className="mb-10">
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur">
          {children ? children : <div className="text-2xl"></div>}
        </div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-blue-100 leading-relaxed text-lg">{subtitle}</p>
      </div>

      {features && <AuthFeatures features={features} />}

      
      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-blue-100 text-sm">
          Join thousands of Moringa students taking control of their learning journey
        </p>
      </div>
    </div>
  )
}