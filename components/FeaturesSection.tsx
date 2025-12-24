import { Truck, Award, Shield, Headphones } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-2 bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="font-semibold">FAST SHIPPING</h3>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="font-semibold">BEST QUALITY PRODUCT</h3>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-semibold">100% SECURE PAYMENT</h3>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <Headphones className="h-8 w-8" />
            </div>
            <h3 className="font-semibold">BEST SERVICE</h3>
          </div>
        </div>
      </div>
    </section>
  )
}
