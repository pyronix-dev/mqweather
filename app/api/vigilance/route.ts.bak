import { NextResponse } from "next/server"
import JSZip from "jszip"

const METEO_FRANCE_API_KEY = process.env.METEO_FRANCE_API_KEY
const METEO_FRANCE_OAUTH_KEY = process.env.METEO_FRANCE_OAUTH_KEY

// Color ID mapping from Météo France API
// 1 = Vert (Green), 2 = Jaune (Yellow), 3 = Orange, 4 = Rouge (Red), 5 = Violet (Purple)
const COLOR_ID_MAP: Record<number, string> = {
  1: "vert",
  2: "jaune",
  3: "orange",
  4: "rouge",
  5: "violet",
}

// Map URLs from GitHub
const MAP_URLS: Record<string, string> = {
  gris: "https://raw.githubusercontent.com/pyronix-dev/upwork/main/map_gris.png",
  vert: "https://raw.githubusercontent.com/pyronix-dev/upwork/main/map_vert.png",
  jaune: "https://raw.githubusercontent.com/pyronix-dev/upwork/main/map_jaune.png",
  orange: "https://raw.githubusercontent.com/pyronix-dev/upwork/main/map_orange.png",
  rouge: "https://raw.githubusercontent.com/pyronix-dev/upwork/main/map_rouge.png",
  violet: "https://raw.githubusercontent.com/pyronix-dev/upwork/main/map_violet.png",
}

interface VigilanceData {
  colorId: number
  colorName: string
  mapUrl: string
  lastUpdate: string
  phenomena: string[]
  rawData?: string
}

async function tryFetchWithToken(endpoint: string, token: string): Promise<Response | null> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (response.ok) {
      return response
    }
    console.log(`[v0] Token failed with status: ${response.status}`)
    return null
  } catch (error) {
    console.log(`[v0] Token fetch error:`, error)
    return null
  }
}

async function fetchAndParseVigilanceData(): Promise<VigilanceData> {
  if (!METEO_FRANCE_API_KEY && !METEO_FRANCE_OAUTH_KEY) {
    console.log("[v0] No API keys configured, returning error status")
    return {
      colorId: -1,
      colorName: "erreur",
      mapUrl: MAP_URLS.gris,
      lastUpdate: new Date().toISOString(),
      phenomena: [],
    }
  }

  const endpoints = [
    "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/flux/dernier",
    "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/controle/dernier",
  ]

  const tokens: { name: string; value: string }[] = []
  if (METEO_FRANCE_API_KEY) {
    tokens.push({ name: "API_KEY", value: METEO_FRANCE_API_KEY })
  }
  if (METEO_FRANCE_OAUTH_KEY) {
    tokens.push({ name: "OAUTH_KEY", value: METEO_FRANCE_OAUTH_KEY })
  }

  for (const endpoint of endpoints) {
    for (const token of tokens) {
      try {
        console.log(`[v0] Trying ${token.name} on endpoint: ${endpoint}`)
        const response = await tryFetchWithToken(endpoint, token.value)

        if (!response) {
          continue // Try next token
        }

        console.log(`[v0] Success with ${token.name}`)
        const contentType = response.headers.get("content-type")
        console.log(`[v0] Content-Type: ${contentType}`)

        // Get the response as array buffer for ZIP processing
        const arrayBuffer = await response.arrayBuffer()
        const zip = new JSZip()
        const zipContents = await zip.loadAsync(arrayBuffer)

        const allFiles = Object.keys(zipContents.files)
        console.log(`[v0] ZIP files found:`, allFiles)

        // TFFF is the ICAO code for Fort-de-France, Martinique
        const txtFiles = allFiles.filter((f) => f.toLowerCase().endsWith(".txt"))
        console.log(`[v0] TXT files found:`, txtFiles)

        // Look for Martinique file (TFFF = Fort-de-France airport code)
        const martiniqueTxtFile = txtFiles.find((f) => f.includes("TFFF") || f.toLowerCase().includes("martinique"))

        if (martiniqueTxtFile) {
          console.log(`[v0] Found Martinique TXT file: ${martiniqueTxtFile}`)
          const file = zipContents.files[martiniqueTxtFile]
          const content = await file.async("string")
          console.log(`[v0] File content:\n${content}`)

          // Parse the TXT content for vigilance data
          const vigilanceData = parseVigilanceTxtContent(content)
          if (vigilanceData) {
            return vigilanceData
          }
        } else {
          console.log(`[v0] No Martinique TXT file found, checking all TXT files...`)
          // Fallback: check all TXT files for Martinique data
          for (const txtFile of txtFiles) {
            const file = zipContents.files[txtFile]
            const content = await file.async("string")

            if (content.toLowerCase().includes("martinique") || content.includes("972")) {
              console.log(`[v0] Found Martinique data in: ${txtFile}`)
              console.log(`[v0] File content:\n${content}`)

              const vigilanceData = parseVigilanceTxtContent(content)
              if (vigilanceData) {
                return vigilanceData
              }
            }
          }
        }
      } catch (error) {
        console.error(`[v0] Error with ${token.name} on ${endpoint}:`, error)
      }
    }
  }

  // All tokens failed
  console.log("[v0] All tokens failed, returning error status")
  return {
    colorId: -1,
    colorName: "erreur",
    mapUrl: MAP_URLS.gris,
    lastUpdate: new Date().toISOString(),
    phenomena: [],
  }
}

function parseVigilanceTxtContent(content: string): VigilanceData | null {
  try {
    const lines = content.split("\n").map((l) => l.trim())
    let maxColorId = 1 // Default to green (vert)
    const phenomena: string[] = []

    for (const line of lines) {
      const lowerLine = line.toLowerCase()

      // Look for color level indicators in the text
      // Common patterns in Météo France vigilance files:
      // - Direct color mentions: "VIGILANCE JAUNE", "NIVEAU ORANGE"
      // - Numeric codes: "NIV=2", "COULEUR 3"

      // Check for explicit vigilance level colors
      if (
        lowerLine.includes("vigilance rouge") ||
        lowerLine.includes("niveau rouge") ||
        lowerLine.includes("alerte rouge")
      ) {
        maxColorId = Math.max(maxColorId, 4)
        console.log(`[v0] Found ROUGE in line: ${line}`)
      } else if (
        lowerLine.includes("vigilance orange") ||
        lowerLine.includes("niveau orange") ||
        lowerLine.includes("alerte orange")
      ) {
        maxColorId = Math.max(maxColorId, 3)
        console.log(`[v0] Found ORANGE in line: ${line}`)
      } else if (
        lowerLine.includes("vigilance jaune") ||
        lowerLine.includes("niveau jaune") ||
        lowerLine.includes("alerte jaune")
      ) {
        maxColorId = Math.max(maxColorId, 2)
        console.log(`[v0] Found JAUNE in line: ${line}`)
      } else if (
        lowerLine.includes("vigilance verte") ||
        lowerLine.includes("vigilance vert") ||
        lowerLine.includes("niveau vert")
      ) {
        maxColorId = Math.max(maxColorId, 1)
        console.log(`[v0] Found VERT in line: ${line}`)
      } else if (lowerLine.includes("vigilance violet") || lowerLine.includes("niveau violet")) {
        maxColorId = Math.max(maxColorId, 5)
        console.log(`[v0] Found VIOLET in line: ${line}`)
      }

      // Look for numeric patterns
      const numericMatch = line.match(/(?:couleur|color|niveau|level|niv|vig)[:\s=]*(\d)/i)
      if (numericMatch) {
        const colorId = Number.parseInt(numericMatch[1])
        if (colorId >= 1 && colorId <= 5) {
          maxColorId = Math.max(maxColorId, colorId)
          console.log(`[v0] Found numeric color ${colorId} in line: ${line}`)
        }
      }

      // Extract phenomena mentioned
      const phenomenaKeywords = [
        "vent",
        "pluie",
        "orage",
        "inondation",
        "cyclone",
        "houle",
        "submersion",
        "chaleur",
        "canicule",
        "froid",
        "neige",
        "verglas",
        "avalanche",
        "vague",
      ]
      for (const keyword of phenomenaKeywords) {
        if (lowerLine.includes(keyword) && !phenomena.includes(keyword)) {
          phenomena.push(keyword)
        }
      }
    }

    console.log(`[v0] Final color ID: ${maxColorId}, phenomena: ${phenomena.join(", ")}`)

    const colorName = COLOR_ID_MAP[maxColorId] || "vert"
    return {
      colorId: maxColorId,
      colorName,
      mapUrl: MAP_URLS[colorName] || MAP_URLS.vert,
      lastUpdate: new Date().toISOString(),
      phenomena,
      rawData: content,
    }
  } catch (e) {
    console.error(`[v0] Error parsing vigilance TXT content:`, e)
    return null
  }
}

export async function GET() {
  try {
    const vigilanceData = await fetchAndParseVigilanceData()

    return NextResponse.json(vigilanceData, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
      },
    })
  } catch (error) {
    console.error("[v0] Vigilance API error:", error)

    return NextResponse.json(
      {
        colorId: -1,
        colorName: "erreur",
        mapUrl: MAP_URLS.gris,
        lastUpdate: new Date().toISOString(),
        phenomena: [],
      },
      { status: 200 },
    )
  }
}
