import Introduction from "./components/sections/introduction"
import Experiences from "./components/sections/experiences"
import Interests from "./components/sections/interests"
import Projects from "./components/sections/projects"
import Contact from "./components/sections/contact"
import NavBar from "./components/navbar"
import ScrollSeparator from "./components/add-ons/scroll-separator"
import GlobeContainer from "./components/sections/globe-container"
import FadeInSection from "./components/add-ons/fade-in-section"

// Snow effect component
const SnowEffect = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`snow-${i}`}
          className="snow"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const currentYear = 2024;

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
        {/* Introduction - no extra spacing */}
        <section className="w-full">
          <Introduction />
        </section>
        
        {/* All other components wrapped in FadeInSection for scroll trigger */}
        <FadeInSection direction="up" rootMargin="0px 0px -300px 0px" className="w-full">
          <section className="pt-12 md:pt-16 w-full">
            <ScrollSeparator />
          </section>
        </FadeInSection>
        
        <FadeInSection direction="up" className="w-full" rootMargin="0px 0px -300px 0px">
          <section id="experiences" className="sm:pt-4 md:pt-8 w-full">
            <Experiences />
          </section>
        </FadeInSection>
        
        <FadeInSection direction="up" className="w-full" rootMargin="0px 0px -300px 0px">
          <section id="projects" className="sm:pt-4 md:pt-8 w-full">
            <Projects />
          </section>
        </FadeInSection>
        
        <FadeInSection direction="up" className="w-full" rootMargin="0px 0px -300px 0px">
          <section id="interests" className="sm:pt-4 md:pt-8 w-full">
            <Interests />
          </section>
        </FadeInSection>
        
        <FadeInSection direction="scale" className="w-full" rootMargin="0px 0px -300px 0px">
          <section id="globe" className="sm:pt-6 md:pt-10 w-full">
            <GlobeContainer/>
          </section>
        </FadeInSection>
        
        <FadeInSection direction="scale" className="w-full" rootMargin="0px 0px -300px 0px">
          <section id="contact" className="sm:pt-6 md:pt-10 w-full">
            <Contact />
          </section>
        </FadeInSection>
      </main>

      <div className="mb-8"></div>

    </div>
  )
}