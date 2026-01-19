"use client"
import { redirect } from "next/navigation"

const AlertIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
)

const SunIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" strokeWidth="2" />
    <path
      strokeWidth="2"
      d="M12 1v6M12 17v6M23 12h-6M7 12H1M20.485 3.515l-4.242 4.242M7.757 15.728l-4.242 4.242M20.485 20.485l-4.242-4.242M7.757 8.272l-4.242-4.242"
    />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const VolcanoIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L8 12h8L12 2zm-4 10l-3 8h14l-3-8H8z" />
  </svg>
)

const CloudIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M7 18H5.5C3.567 18 2 16.433 2 14.5 2 13.104 2.936 11.91 4.26 11.608A5 5 0 1119.6 13.29" />
  </svg>
)

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)

const MapSkeleton = () => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-96 sm:h-[500px] lg:h-[600px] relative overflow-hidden p-4 sm:p-6 animate-pulse">
    <div className="w-4/5 h-4/5 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl" />
    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white rounded-lg p-3 sm:p-4">
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-sm" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const BulletinSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 sm:p-6 border border-border shadow-sm">
    <div className="flex items-center gap-3 mb-4 sm:mb-6">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div>
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div>
        <Skeleton className="h-3 w-12 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border-l-4 border-gray-200">
        <Skeleton className="h-3 w-28 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
)

export default function Home() {
  redirect("/carte")
}

// export default function WeatherApp() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [loading, setLoading] = useState(true)
//
//   useEffect(() => {
//     // Simulate initial load
//     const timer = setTimeout(() => {
//       setLoading(false)
//     }, 1500)
//     return () => clearTimeout(timer)
//   }, [])
//
//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
//
//       {/* Main Content */}
//       <main className="w-full px-4 sm:px-6 py-4 sm:py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//           {/* Map Section */}
//           <div className="lg:col-span-2 animate-slide-in-left">
//             <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm">
//               <div className="p-4 sm:p-6 border-b border-border">
//                 {loading ? (
//                   <>
//                     <Skeleton className="h-7 w-48 mb-2" />
//                     <Skeleton className="h-4 w-64" />
//                   </>
//                 ) : (
//                   <>
//                     <h2 className="text-xl sm:text-2xl font-black text-foreground">Carte de Vigilance</h2>
//                     <p className="text-muted-foreground text-xs sm:text-sm mt-1 font-bold">
//                       État de vigilance météorologique en cours
//                     </p>
//                   </>
//                 )}
//               </div>
//
//               {loading ? (
//                 <MapSkeleton />
//               ) : (
//                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-96 sm:h-[500px] lg:h-[600px] flex items-center justify-center relative overflow-hidden p-4 sm:p-6">
//                   <img
//                     src="https://raw.githubusercontent.com/pyronix-dev/upwork/main/map_base_transparent.png"
//                     alt="Carte de Martinique"
//                     className="w-4/5 h-4/5 object-contain drop-shadow-lg animate-fade-in-up hover:scale-105 transition-transform duration-500"
//                     style={{ animationDelay: "0.2s" }}
//                   />
//
//                   {/* Legend */}
//                   <div
//                     className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white rounded-lg p-3 sm:p-4 shadow-lg animate-slide-in-left hover:shadow-xl transition-shadow"
//                     style={{ animationDelay: "0.3s" }}
//                   >
//                     <div className="space-y-2 text-xs sm:text-sm">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 bg-green-500 rounded-sm animate-pulse-gentle"></div>
//                         <span className="text-foreground font-bold">Vert</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 bg-yellow-400 rounded-sm animate-pulse-gentle"></div>
//                         <span className="text-foreground font-bold">Jaune</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 bg-orange-500 rounded-sm animate-pulse-gentle"></div>
//                         <span className="text-foreground font-bold">Orange</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 bg-red-500 rounded-sm animate-pulse-gentle"></div>
//                         <span className="text-foreground font-bold">Rouge</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 bg-purple-600 rounded-sm animate-pulse-gentle"></div>
//                         <span className="text-foreground font-bold">Violet</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 bg-gray-500 rounded-sm animate-pulse-gentle"></div>
//                         <span className="text-foreground font-bold">Gris</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//
//           {/* Sidebar */}
//           <div className="space-y-4 sm:space-y-6 animate-slide-in-right">
//             {loading ? (
//               <BulletinSkeleton />
//             ) : (
//               /* Weather Bulletin */
//               <div
//                 className="bg-white rounded-2xl p-4 sm:p-6 border border-border shadow-sm hover:shadow-lg transition-shadow"
//                 style={{ animationDelay: "0.1s" }}
//               >
//                 <div className="flex items-center gap-3 mb-4 sm:mb-6">
//                   <div className="text-primary animate-float flex-shrink-0">
//                     <SunIcon />
//                   </div>
//                   <div>
//                     <h3 className="text-lg sm:text-xl font-black text-foreground">Bulletin Météo</h3>
//                     <p className="text-xs sm:text-sm text-muted-foreground font-bold">Martinique</p>
//                   </div>
//                 </div>
//
//                 <div className="space-y-4 sm:space-y-6">
//                   {/* Situation */}
//                   <div className="group">
//                     <p className="text-xs font-black text-primary uppercase tracking-wide mb-2 group-hover:scale-105 transition-transform origin-left">
//                       Situation
//                     </p>
//                     <p className="text-xs sm:text-sm text-foreground leading-relaxed font-bold">
//                       Situation météorologique pour la matinée du vendredi. Belle journée en perspective avec un
//                       ensoleillement généreux.
//                     </p>
//                   </div>
//
//                   {/* En Mer */}
//                   <div className="group">
//                     <p className="text-xs font-black text-primary uppercase tracking-wide mb-2 group-hover:scale-105 transition-transform origin-left">
//                       En Mer
//                     </p>
//                     <p className="text-xs sm:text-sm text-foreground leading-relaxed font-bold">
//                       Vent de travers dans le canal de la Dominique, mer formée.
//                     </p>
//                   </div>
//
//                   {/* Conseil */}
//                   <div
//                     className="bg-blue-50 rounded-lg p-3 sm:p-4 border-l-4 border-primary hover:bg-blue-100 transition-colors animate-slide-in-right"
//                     style={{ animationDelay: "0.2s" }}
//                   >
//                     <p className="text-xs font-black text-primary uppercase tracking-wide mb-2">Conseil de Vigilance</p>
//                     <p className="text-xs sm:text-sm text-foreground font-bold">
//                       Journée idéale pour les activités en plein air.
//                     </p>
//                   </div>
//
//                   {/* Note */}
//                   <p className="text-xs text-muted-foreground border-t border-border pt-3 sm:pt-4 leading-relaxed font-bold hover:text-foreground transition-colors">
//                     La Martinique enregistre en moyenne 2800 mm de pluie par an sur les hauteurs.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
