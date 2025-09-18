"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ExpandedMap from "../components/expanded-map"

export default function GlobePage() {
  const router = useRouter()

  const handleClose = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ExpandedMap isOpen={true} onClose={handleClose} />
    </div>
  )
}