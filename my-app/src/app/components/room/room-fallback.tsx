"use client"

import Link from "next/link"
import { ExternalLink, Mail, MoveRight } from "lucide-react"
import ColorPicker from "../color-picker"
import SpotifyPlayer from "../spotify-player"
import { useBackground } from "@/app/contexts/background-context"
import type { RoomHomePayload } from "./room-manifest"

export default function RoomFallback({
  payload,
  reason,
}: {
  payload: RoomHomePayload
  reason?: string
}) {
  const { roomTheme } = useBackground()
  const primaryObjects = payload.objects
  const emailContact = payload.contacts.find((c) => c.type.toLowerCase() === "email")

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/55 backdrop-blur-xl">
            {payload.notes.roomTitle}
          </div>
          <div className="flex items-center gap-3">
            <ColorPicker variant="hud" />
            <SpotifyPlayer variant="hud" />
          </div>
        </div>

        <section
          className="grid gap-6 rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-5 shadow-[0_32px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:grid-cols-[1.25fr_0.75fr]"
          style={{ boxShadow: `0 32px 80px ${roomTheme.shadowColor}` }}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-white/45">
                Cinematic fallback
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                {payload.intro.name}&apos;s work, staged like a room tour even when WebGL steps aside.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                {payload.notes.roomSubtitle}
              </p>
              <p className="max-w-2xl text-sm leading-6 text-white/55">
                {reason ?? payload.notes.fallbackReason}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {payload.intro.resume && (
                <a
                  href={payload.intro.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-950 transition-transform hover:-translate-y-0.5"
                  style={{ background: roomTheme.uiAccent }}
                >
                  Resume
                  <ExternalLink size={14} />
                </a>
              )}
              {emailContact && (
                <a
                  href={`mailto:${emailContact.value.replace(/^mailto:/i, "")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm text-white/82 transition-colors hover:bg-white/10"
                >
                  Email
                  <Mail size={14} />
                </a>
              )}
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-black/[0.18] p-4 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.22em] text-white/40">Bio</p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-white/72">
                {payload.intro.bio.replaceAll(";", " ")}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-[1.8rem] border border-white/10 bg-black/[0.22] p-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={payload.intro.image}
                alt={payload.intro.name}
                className="aspect-[4/5] w-full object-cover"
                loading="eager"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">Role</p>
              <p className="mt-2 text-xl font-medium text-white">{payload.intro.title}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {primaryObjects.map((object) => (
            <article
              key={object.id}
              className="flex h-full flex-col rounded-[1.8rem] border border-white/10 bg-white/[0.08] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">{object.subtitle}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">{object.label}</h2>
                </div>
                <span
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/62"
                  style={{ background: roomTheme.uiAccentSoft }}
                >
                  {object.shortcut}
                </span>
              </div>

              <p className="text-sm leading-6 text-white/72">{object.preview}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {object.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/58"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-sm text-white/62">
                {object.highlights.map((highlight) => (
                  <p key={highlight}>{highlight}</p>
                ))}
              </div>

              <div className="mt-auto pt-6">
                {object.route ? (
                  <Link
                    href={object.route}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-white/80"
                  >
                    {object.routeLabel ?? "Open section"}
                    <MoveRight size={14} />
                  </Link>
                ) : object.externalHref ? (
                  <a
                    href={object.externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-white/80"
                  >
                    {object.externalLabel ?? "Open link"}
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
