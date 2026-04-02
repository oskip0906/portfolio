"use client"
import Introduction from "./components/sections/introduction"
import Timeline from "./components/timeline"

export default function Home() {
  return (
    <div className="w-full pb-8 pt-12 sm:pt-16 md:pt-12">
      <div className="flex justify-center">
        <Introduction />
      </div>
      <Timeline />
    </div>
  )
}
