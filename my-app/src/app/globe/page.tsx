"use client"
import { useRouter } from "next/navigation"
import ExpandedMap from "../components/expanded-map"

export default function GlobePage() {
  const router = useRouter()

  return (
    <div className="w-full flex justify-center py-[1vh] sm:py-[2vh] md:py-[3vh]">
      <ExpandedMap
        isOpen={true}
        onClose={() => router.push("/")}
      />
    </div>
  )
}
