import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getRoomPayload } from "@/lib/get-room-payload"

export default async function ChooserPage() {
  const payload = await getRoomPayload()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-white bg-gradient-to-br from-[#0b0f1a] via-[#111827] to-[#020409]">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{payload.intro.name}</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Pick how you&apos;d like to explore
        </h1>
      </div>

      <div className="mt-12 grid w-full max-w-4xl gap-6 sm:grid-cols-2">
        <Link
          href="/teahouse"
          className="group flex flex-col items-center gap-4 rounded-[1.8rem] border border-white/12 bg-white/[0.06] p-10 text-center transition-all hover:-translate-y-1 hover:bg-white/[0.1]"
        >
          <span className="text-5xl">🧋</span>
          <h2 className="text-xl font-semibold text-white">3D Teahouse</h2>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-white/85 group-hover:text-white">
            Enter the teahouse <ArrowRight size={15} />
          </span>
        </Link>

        <Link
          href="/resume"
          className="group flex flex-col items-center gap-4 rounded-[1.8rem] border border-white/12 bg-white/[0.06] p-10 text-center transition-all hover:-translate-y-1 hover:bg-white/[0.1]"
        >
          <span className="text-5xl">📄</span>
          <h2 className="text-xl font-semibold text-white">Static Resume</h2>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-white/85 group-hover:text-white">
            View the resume page <ArrowRight size={15} />
          </span>
        </Link>
      </div>
    </div>
  )
}
