"use client"
import { useRouter } from "next/navigation"
import ExpandedMap from "../components/expanded-map"

export default function GlobePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen mt-2 sm:mt-4">
      <ExpandedMap
        isOpen={true}
        onClose={() => router.push("/")}
      />
    </div>
  )
}
