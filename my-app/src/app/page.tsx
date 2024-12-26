import Introduction from "../components/introduction";
import Experiences from "../components/experiences";
import Interests from "../components/interests";
import Projects from "../components/projects";
import Contact from "../components/contact";

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-10 bg-gray-900">
      
      <main className="flex flex-col gap-16 row-start-2 items-center sm:items-start w-full">
        <Introduction />
        <Experiences />
        <Projects />
        <Interests />
        <Contact />
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-xs text-gray-500 mt-20">
        <p>&copy; {new Date().getFullYear()} Shenglong Pang. All rights reserved.</p>
      </footer>
    </div>
  );

}