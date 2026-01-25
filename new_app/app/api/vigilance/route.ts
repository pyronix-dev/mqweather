// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from "next/server"
import JSZip from "jszip"

const METEO_FRANCE_API_KEY = process.env.METEO_FRANCE_API_KEY
const METEO_FRANCE_APPLICATION_ID = process.env.METEO_FRANCE_APPLICATION_ID
const TOKEN_URL = "https://portail-api.meteofrance.fr/token"



const COLOR_ID_MAP: Record<number, string> = {
  1: "vert",
  2: "jaune",
  3: "orange",
  4: "rouge",
  5: "violet",
}


const MAP_URLS: Record<string, string> = {
  gris: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_gris.png",
  vert: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_vert.png",
  jaune: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_jaune.png",
  orange: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_orange.png",
  rouge: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_rouge.png",
  violet: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/map_violet.png",
  erreur: "https://raw.githubusercontent.com/pyronix-dev/mqweather/main/public/maps/error.png",
}



let cachedToken: string | null = null
let tokenExpiration: number = 0

async function getOAuthToken(): Promise<string | null> {
  
  if (cachedToken && Date.now() < tokenExpiration - 60000) {
    return cachedToken
  }

  if (!METEO_FRANCE_APPLICATION_ID) {
    console.error("[MQ] No METEO_FRANCE_APPLICATION_ID configured")
    return null
  }

  try {
    console.log("[MQ] Requesting new OAuth2 token...")
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
      console.error(`[MQ] Token request failed: ${response.status} ${await response.text()}`)
      return null
    }

    const data = await response.json()
    cachedToken = data.access_token
    
    const expiresIn = data.expires_in || 3600
    tokenExpiration = Date.now() + (expiresIn * 1000)

    console.log("[MQ] New OAuth2 token obtained successfully")
    return cachedToken
  } catch (error) {
    console.error("[MQ] Error fetching token:", error)
    return null
  }
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
    console.log(`[MQ] Token failed with status: ${response.status}`)
    return null
  } catch (error) {
    console.log(`[MQ] Token fetch error:`, error)
    return null
  }
}

export async function fetchAndParseVigilanceData(): Promise<VigilanceData> {
  
  
  

  
  if (METEO_FRANCE_API_KEY) {
    const endpoints = [
      "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/flux/dernier",
    ]
    for (const endpoint of endpoints) {
      console.log(`[MQ] Trying Static API_KEY on: ${endpoint}`)
      const response = await tryFetchWithToken(endpoint, METEO_FRANCE_API_KEY)
      if (response) return await processResponse(response)
    }
  }

  
  const token = await getOAuthToken()
  if (token) {
    const endpoint = "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/flux/dernier"
    console.log(`[MQ] Trying OAuth2 Token on: ${endpoint}`)

    let response = await tryFetchWithToken(endpoint, token)

    
    if (!response || response.status === 401) {
      console.log("[MQ] Token might be expired (401), refreshing...")
      cachedToken = null 
      const newToken = await getOAuthToken()
      if (newToken) {
        response = await tryFetchWithToken(endpoint, newToken)
      }
    }

    if (response && response.ok) {
      return await processResponse(response)
    }
  }

  
  console.log("[MQ] All methods failed, returning error status")
  return {
    colorId: -1,
    colorName: "erreur",
    mapUrl: MAP_URLS.erreur,
    lastUpdate: new Date().toISOString(),
    phenomena: [],
  }
}

async function processResponse(response: Response): Promise<VigilanceData> {
  console.log(`[MQ] Success with token`)
  
  const arrayBuffer = await response.arrayBuffer()
  const zip = new JSZip()
  const zipContents = await zip.loadAsync(arrayBuffer)

  const allFiles = Object.keys(zipContents.files)
  console.log(`[MQ] ZIP files found:`, allFiles)

  
  const txtFiles = allFiles.filter((f) => f.toLowerCase().endsWith(".txt"))
  console.log(`[MQ] TXT files found:`, txtFiles)

  
  const martiniqueTxtFile = txtFiles.find((f) => f.includes("TFFF") || f.toLowerCase().includes("martinique"))

  if (martiniqueTxtFile) {
    console.log(`[MQ] Found Martinique TXT file: ${martiniqueTxtFile}`)
    const file = zipContents.files[martiniqueTxtFile]
    const content = await file.async("string")
    console.log(`[MQ] File content:\n${content}`)

    
    const vigilanceData = parseVigilanceTxtContent(content)
    if (vigilanceData) {
      return vigilanceData
    }
  } else {
    console.log(`[MQ] No Martinique TXT file found, checking all TXT files...`)
    
    for (const txtFile of txtFiles) {
      const file = zipContents.files[txtFile]
      const content = await file.async("string")

      if (content.toLowerCase().includes("martinique") || content.includes("972")) {
        console.log(`[MQ] Found Martinique data in: ${txtFile}`)
        console.log(`[MQ] File content:\n${content}`)

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
    let maxColorId = 1 
    const phenomena: string[] = []

    for (const line of lines) {
      const lowerLine = line.toLowerCase()

      
      
      
      

      
      if (
        lowerLine.includes("vigilance rouge") ||
        lowerLine.includes("niveau rouge") ||
        lowerLine.includes("alerte rouge")
      ) {
        maxColorId = Math.max(maxColorId, 4)
        console.log(`[MQ] Found ROUGE in line: ${line}`)
      } else if (
        lowerLine.includes("vigilance orange") ||
        lowerLine.includes("niveau orange") ||
        lowerLine.includes("alerte orange")
      ) {
        maxColorId = Math.max(maxColorId, 3)
        console.log(`[MQ] Found ORANGE in line: ${line}`)
      } else if (
        lowerLine.includes("vigilance jaune") ||
        lowerLine.includes("niveau jaune") ||
        lowerLine.includes("alerte jaune")
      ) {
        maxColorId = Math.max(maxColorId, 2)
        console.log(`[MQ] Found JAUNE in line: ${line}`)
      } else if (
        lowerLine.includes("vigilance verte") ||
        lowerLine.includes("vigilance vert") ||
        lowerLine.includes("niveau vert")
      ) {
        maxColorId = Math.max(maxColorId, 1)
        console.log(`[MQ] Found VERT in line: ${line}`)
      } else if (lowerLine.includes("vigilance violet") || lowerLine.includes("niveau violet")) {
        maxColorId = Math.max(maxColorId, 5)
        console.log(`[MQ] Found VIOLET in line: ${line}`)
      }

      
      const numericMatch = line.match(/(?:couleur|color|niveau|level|niv|vig)[:\s=]*(\d)/i)
      if (numericMatch) {
        const colorId = Number.parseInt(numericMatch[1])
        if (colorId >= 1 && colorId <= 5) {
          maxColorId = Math.max(maxColorId, colorId)
          console.log(`[MQ] Found numeric color ${colorId} in line: ${line}`)
        }
      }

      
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

    console.log(`[MQ] Final color ID: ${maxColorId}, phenomena: ${phenomena.join(", ")}`)

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
    console.error(`[MQ] Error parsing vigilance TXT content:`, e)
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
    console.error("[MQ] Vigilance API error:", error)

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