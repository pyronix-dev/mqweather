import { NextResponse } from "next/server"
import JSZip from "jszip"

const METEO_FRANCE_API_KEY = process.env.METEO_FRANCE_API_KEY
const METEO_FRANCE_APPLICATION_ID = process.env.METEO_FRANCE_APPLICATION_ID
const TOKEN_URL = "https://portail-api.meteofrance.fr/token"

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
  gris: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_gris.png",
  vert: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_vert.png",
  jaune: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_jaune.png",
  orange: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_orange.png",
  rouge: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_rouge.png",
  violet: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_violet.png",
  erreur: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/error.png",
}

// In-memory token cache (simple version)
// In a real serverless env, this might reset on cold starts, but it helps for hot invocations
let cachedToken: string | null = null
let tokenExpiration: number = 0

async function getOAuthToken(): Promise<string | null> {
  const start = performance.now()
  // Return cached token if valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiration - 60000) {
    console.log(`[v0] Token Check: Cached token valid. (Time: ${(performance.now() - start).toFixed(2)}ms)`)
    return cachedToken
  }

  if (!METEO_FRANCE_APPLICATION_ID) {
    console.error("[v0] No METEO_FRANCE_APPLICATION_ID configured")
    return null
  }

  try {
    console.log("[v0] Requesting new OAuth2 token...")
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${METEO_FRANCE_APPLICATION_ID}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error(`[v0] Token request failed: ${response.status} ${await response.text()}`)
      return null
    }

    const data = await response.json()
    cachedToken = data.access_token
    // Set expiration (usually 3600s). Default to 1 hour if not provided
    const expiresIn = data.expires_in || 3600
    tokenExpiration = Date.now() + (expiresIn * 1000)

    console.log(`[v0] New OAuth2 token obtained. (Time: ${(performance.now() - start).toFixed(2)}ms)`)
    return cachedToken
  } catch (error) {
    console.error("[v0] Error fetching token:", error)
    return null
  }
}

async function tryFetchWithToken(endpoint: string, token: string): Promise<Response | null> {
  const start = performance.now()
  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    console.log(`[v0] Data Fetch (${endpoint.split('/').pop()}): ${(performance.now() - start).toFixed(2)}ms`)

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
  // Strategy: 
  // 1. Try static API Key first (if available) - simplest
  // 2. Try OAuth2 flow (auto-renew)

  // 1. Static Key
  if (METEO_FRANCE_API_KEY) {
    const endpoints = [
      "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/flux/dernier",
    ]
    for (const endpoint of endpoints) {
      console.log(`[v0] Trying Static API_KEY on: ${endpoint}`)
      const response = await tryFetchWithToken(endpoint, METEO_FRANCE_API_KEY)
      if (response) return await processResponse(response)
    }
  }

  // 2. OAuth2 Flow
  const token = await getOAuthToken()
  if (token) {
    const endpoint = "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/flux/dernier"
    console.log(`[v0] Trying OAuth2 Token on: ${endpoint}`)

    let response = await tryFetchWithToken(endpoint, token)

    // Retry logic for 401 (Invalid Token) - force refresh
    if (!response || response.status === 401) {
      console.log("[v0] Token might be expired (401), refreshing...")
      cachedToken = null // Clear cache
      const newToken = await getOAuthToken()
      if (newToken) {
        response = await tryFetchWithToken(endpoint, newToken)
      }
    }

    if (response && response.ok) {
      return await processResponse(response)
    }
  }

  // All failed
  console.log("[v0] All methods failed, returning error status")
  return {
    colorId: -1,
    colorName: "erreur",
    mapUrl: MAP_URLS.erreur,
    lastUpdate: new Date().toISOString(),
    phenomena: [],
  }
}

async function processResponse(response: Response): Promise<VigilanceData> {
  const start = performance.now()
  console.log(`[v0] Success with token. Starting processing...`)
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
      console.log(`[v0] Processing Complete. (Time: ${(performance.now() - start).toFixed(2)}ms)`)
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
  throw new Error("No valid data found in response")
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
        mapUrl: MAP_URLS.erreur,
        lastUpdate: new Date().toISOString(),
        phenomena: [],
      },
      { status: 200 },
    )
  }
}
