import Introduction from "./components/introduction";
import Experiences from "./components/experiences";
import Interests from "./components/interests";
import Projects from "./components/projects";
import Contact from "./components/contact";
import NavBar from "./components/navbar";

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">

      <NavBar />
      
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start w-full mt-10 px-4">
        <Introduction />
        <Experiences />
        <Projects />
        <Interests />
        <Contact />
      </main>

      <footer className="items-center justify-center text-sm text-gray-500 mt-16 mb-16">
        <p>&copy; {new Date().getFullYear()} Oscar Pang. All rights reserved.</p>
      </footer>
    </div>
  );

}