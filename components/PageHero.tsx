interface PageHeroProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  backgroundPosition?: string
  backgroundSize?: string
}

export function PageHero({ title, description, imageSrc, imageAlt, backgroundPosition = "center", backgroundSize = "cover" }: PageHeroProps) {
  return (
    <section className="relative w-full h-[250px] md:h-[300px] overflow-hidden mb-8 rounded-xl shadow-lg bg-green-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-no-repeat"
        style={{ 
          backgroundImage: `url(${imageSrc})`,
          backgroundPosition: backgroundPosition,
          backgroundSize: backgroundSize
        }}
      >
        {/* Gradient Overlay - darker on left, lighter on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-800/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full container px-4 md:px-6 flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
