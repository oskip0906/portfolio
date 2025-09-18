import Introduction from "./components/sections/introduction"
import Experiences from "./components/sections/experiences"
import Interests from "./components/sections/interests"
import Projects from "./components/sections/projects"
import Contact from "./components/sections/contact"
import NavBar from "./components/navbar"
import GlobeContainer from "./components/sections/globe-container"

export default function Home() {

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Simple Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>


      <NavBar />

      <main className="relative z-10 flex flex-col items-center w-full px-4 mt-16 content-container">
        <Introduction />

        <div className="sm:pt-8 md:pt-16 w-full">
          <Experiences />
        </div>

        <div className="sm:pt-4 md:pt-8 w-full">
          <Projects />
        </div>

        <div className="sm:pt-4 md:pt-8 w-full">
          <Interests />
        </div>

        <div className="sm:pt-6 md:pt-10 w-full">
          <GlobeContainer/>
        </div>

        <div className="sm:pt-6 md:pt-10 w-full">
          <Contact />
        </div>
      </main>

      <div className="mb-8"></div>

    </div>
  )
}