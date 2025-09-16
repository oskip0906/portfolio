import { ReactNode } from 'react'
import { supabase } from './supabase'

// Comprehensive table row interface
export interface ComprehensiveRow {
  id: string
  content_type: 'location' | 'project' | 'experience' | 'interest' | 'contact' | 'intro'
  data: any
  created_at?: string
  updated_at?: string
}

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

// Database functions
export async function getContacts(): Promise<Contact[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('comprehensive')
      .select('data')
      .eq('content_type', 'contact')

    if (error) {
      console.error('Error fetching contacts:', error)
      return []
    }

    return data?.[0]?.data || []
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return []
  }
}

export async function getExperiences(): Promise<Experience[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('comprehensive')
      .select('data')
      .eq('content_type', 'experience')

    if (error) {
      console.error('Error fetching experiences:', error)
      return []
    }

    return data?.[0]?.data || []
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
}

export async function getInterests(): Promise<Interest[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('comprehensive')
      .select('data')
      .eq('content_type', 'interest')

    if (error) {
      console.error('Error fetching interests:', error)
      return []
    }

    return data?.[0]?.data || []
  } catch (error) {
    console.error('Error fetching interests:', error)
    return []
  }
}

export async function getIntro(): Promise<Intro | null> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('comprehensive')
      .select('data')
      .eq('content_type', 'intro')
      .limit(1)

    if (error) {
      console.error('Error fetching intro:', error)
      return null
    }

    // Return the first item's data, or null if no data exists
    return data?.[0]?.data || null
  } catch (error) {
    console.error('Error fetching intro:', error)
    return null
  }
}

export async function getLocations(): Promise<Location[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('comprehensive')
      .select('data')
      .eq('content_type', 'location')

    if (error) {
      console.error('Error fetching locations:', error)
      return []
    }

    return data?.[0]?.data || []
  } catch (error) {
    console.error('Error fetching locations:', error)
    return []
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('comprehensive')
      .select('data')
      .eq('content_type', 'project')

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }

    return data?.[0]?.data || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}


 