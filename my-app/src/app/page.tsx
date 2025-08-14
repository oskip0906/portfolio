import { useMemo } from "react"
import Introduction from "./components/introduction"
import Experiences from "./components/experiences"
import Interests from "./components/interests"
import Projects from "./components/projects"
import Contact from "./components/contact"
import NavBar from "./components/navbar"
import ScrollSeparator from "./components/scroll-separator"
import GlobeContainer from "./components/globe-container"

// Memoized snow effect component
const SnowEffect = () => {
  const snowflakes = useMemo(() => 
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
    })), []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map((snowflake) => (
        <div
          key={`snow-${snowflake.id}`}
          className="snow"
          style={{
            left: snowflake.left,
            animationDelay: snowflake.animationDelay,
            animationDuration: snowflake.animationDuration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
   
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Additional floating orbs */}
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-delayed"></div>

        {/* Animated grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] animate-grid-move"></div>

        {/* Pulsing gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-500/5 to-transparent animate-pulse-slow"></div>
      </div>

      {/* Snow Effect */}
      <SnowEffect />

      <NavBar />

      <main className="relative z-10 flex flex-col items-center w-full px-4 mt-16">
        <Introduction />
        <ScrollSeparator />
        <Experiences />
        <Projects />
        <Interests />
        <GlobeContainer/>
        <Contact />
      </main>

      <footer className="relative flex items-center justify-center text-sm text-gray-400 mt-20 mb-10">
        <div className="backdrop-blur-sm bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300">
          <p>&copy; {currentYear} Oscar Pang. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
