"use client"
import { useRouter } from "next/navigation"
import ExpandedMap from "../components/expanded-map"

export default function GlobePage() {
  const router = useRouter()

  return (
    <div className="w-full flex justify-center py-8">
      <ExpandedMap
        isOpen={true}
        onClose={() => router.push("/")}
      />
    </div>
  )
}
