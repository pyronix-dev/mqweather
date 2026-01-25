// Developed by Omar Rafik (OMX) - omx001@proton.me
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {}
      <p 
        className="text-sm md:text-base tracking-[0.3em] uppercase mb-8 md:mb-12"
        style={{ color: '#d4d4a0' }}
      >
        Page non trouvee
      </p>

      {}
      <h1 
        className="text-[120px] sm:text-[180px] md:text-[240px] lg:text-[300px] font-serif font-light leading-none animate-shimmer select-none"
        style={{ 
          fontFamily: 'Georgia, "Times New Roman", serif',
          letterSpacing: '-0.02em'
        }}
      >
        404
      </h1>

      {}
      <p 
        className="text-lg sm:text-xl md:text-2xl text-center mt-8 md:mt-12 italic font-light max-w-md"
        style={{ 
          color: '#e5e5e5',
          fontFamily: 'Georgia, "Times New Roman", serif'
        }}
      >
        Cette page a ete deplacee
        <br />
        ou
        <br />
        n&apos;existe pas.
      </p>

      {}
      <Link 
        href="/"
        className="mt-12 md:mt-16 px-8 py-4 bg-white text-black font-semibold text-sm tracking-wider rounded-full hover:bg-gray-100 transition-colors duration-300 uppercase"
      >
        Retour a l&apos;accueil
      </Link>
    </div>
  )
}