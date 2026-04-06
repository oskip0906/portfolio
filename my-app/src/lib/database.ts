import { ReactNode } from 'react'

// Type definitions for specific content types
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
  focus: string
  published_to: string
}

export interface Project {
  date: ReactNode
  description: string
  link: string
  name: string
  type: string
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
