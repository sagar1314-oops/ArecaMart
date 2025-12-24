export function MarketHero() {
  return (
    <section className="relative w-full h-[250px] md:h-[300px] overflow-hidden mb-8 rounded-xl shadow-lg bg-green-900">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/market_rates_hero.png)'
        }}
      >
        {/* <div className="absolute inset-0 "></div> */}
      </div>
      {/* <div className="relative h-full container px-4 md:px-6 flex items-center justify-between">
        <div className="max-w-lg text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Market Prices
          </h1>
          <p className="text-lg md:text-xl text-green-50">
            Real-time updates and historical price trends for Arecanut.
          </p>
        </div>
        <div className="hidden md:block max-w-md text-right text-white">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <p className="text-sm font-medium text-green-200 mb-2">LIVE MARKET STATUS</p>
            <p className="text-2xl font-bold mb-1">Market is Open</p>
            <p className="text-sm text-green-100">Updates every 15 mins</p>
          </div>
        </div>
      </div> */}
    </section>
  )
}
