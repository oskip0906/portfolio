import { ReactNode } from 'react'

// Type definitions for specific content types
export interface Location {
  name: string
  coordinates: [number, number]
  photos: string[]
}

export interface Project {
  date: ReactNode
  description: string
  image: string
  link: string
  name: string
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
}
