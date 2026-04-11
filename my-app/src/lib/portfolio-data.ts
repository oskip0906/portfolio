import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'

export function getPortfolioDataDir(): string {
  const repoSibling = path.join(process.cwd(), '..', 'data')
  const inApp = path.join(process.cwd(), 'data')
  if (existsSync(repoSibling)) return repoSibling
  if (existsSync(inApp)) return inApp
  return repoSibling
}

export async function readPortfolioJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(getPortfolioDataDir(), filename)
  const raw = await readFile(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

export function parseDates(dateString: string): { startDate: Date; endDate: Date } {
  const parts = dateString.split(' - ')
  const startDateStr = parts[0].trim()
  const endDateStr = parts[1]?.trim()

  const startDate = new Date(startDateStr + ' 01')

  let endDate: Date
  if (!endDateStr) {
    endDate = startDate
  } else if (endDateStr.toLowerCase() === 'present') {
    endDate = new Date()
  } else {
    endDate = new Date(endDateStr + ' 01')
  }

  return {
    startDate: isNaN(startDate.getTime()) ? new Date(0) : startDate,
    endDate: isNaN(endDate.getTime()) ? new Date(0) : endDate,
  }
}

export function sortByContentDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const { startDate: startA, endDate: endA } = parseDates(a.date)
    const { startDate: startB, endDate: endB } = parseDates(b.date)
    const startDiff = startB.getTime() - startA.getTime()
    if (startDiff !== 0) return startDiff
    return endB.getTime() - endA.getTime()
  })
}

export function sortTimelineByDateAsc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => String(a.date).localeCompare(String(b.date)))
}
