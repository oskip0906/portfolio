import { readFile } from "fs/promises"
import path from "path"
import { type NextRequest } from "next/server"
import { getPortfolioDataDir } from "@/lib/portfolio-data"

const AUDIO_FILE_PATH = path.join(getPortfolioDataDir(), "song.mp3")
const AUDIO_CONTENT_TYPE = "audio/mpeg"

function toArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength)
  new Uint8Array(arrayBuffer).set(buffer)
  return arrayBuffer
}

function parseRangeHeader(rangeHeader: string, fileSize: number) {
  const matches = /bytes=(\d*)-(\d*)/.exec(rangeHeader)
  if (!matches) return null

  const start = matches[1] ? Number(matches[1]) : 0
  const end = matches[2] ? Number(matches[2]) : fileSize - 1

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start < 0 ||
    end < start ||
    end >= fileSize
  ) {
    return null
  }

  return { start, end }
}

export async function GET(request: NextRequest) {
  try {
    const file = await readFile(AUDIO_FILE_PATH)
    const fileSize = file.byteLength
    const rangeHeader = request.headers.get("range")

    if (rangeHeader) {
      const range = parseRangeHeader(rangeHeader, fileSize)

      if (!range) {
        return new Response("Invalid range request", {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        })
      }

      const chunk = file.subarray(range.start, range.end + 1)

      return new Response(toArrayBuffer(chunk), {
        status: 206,
        headers: {
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=0, must-revalidate",
          "Content-Length": String(chunk.byteLength),
          "Content-Range": `bytes ${range.start}-${range.end}/${fileSize}`,
          "Content-Type": AUDIO_CONTENT_TYPE,
        },
      })
    }

    return new Response(toArrayBuffer(file), {
      headers: {
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Content-Length": String(fileSize),
        "Content-Type": AUDIO_CONTENT_TYPE,
      },
    })
  } catch (error) {
    console.error("Failed to load audio file:", error)
    return new Response("Audio file not found", { status: 404 })
  }
}
