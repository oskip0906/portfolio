import { ReactNode } from 'react'

export interface Location {
  name: string
  coordinates: [number, number]
  photos: string[]
}

export interface Research {
  date: ReactNode
  description: string
  link: string
  name: string
  emote: string
  focus: string
  published_to: string
  abstract: string
  findings: string[]
}

export interface Project {
  date: ReactNode
  description: string
  link: string
  name: string
  emote: string
  type: string
  tech: string[]
  features: string[]
}

export interface Experience {
  title: string
  company: string
  date: ReactNode
  description: string
  image: string
  link: string
}

export interface Interest {
  name: string
  emote: string
  description: string
}

export interface Contact {
  image: string
  type: string
  value: string
}

export interface Intro {
  name: string
  title: string
  bio: string
  image: string
  email?: string | null
  resume?: string | null
}

export interface Memory {
  title: string
  date: string
  description: string
}
