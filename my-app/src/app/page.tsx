"use client"
import Introduction from "./components/sections/introduction"
import Timeline from "./components/timeline"

export default function Home() {
  return (
    <div className="w-full pb-4 pt-12 md:pt-10">
      <div className="flex justify-center">
        <Introduction />
      </div>
      <Timeline />
    </div>
  )
}
