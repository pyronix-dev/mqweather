const AdmZip = require("adm-zip")
const fs = require("fs")
const path = require("path")

// Read API key from file or environment
let API_KEY = process.env.METEO_FRANCE_API_KEY

if (!API_KEY) {
  try {
    const keyPath = path.join(__dirname, "api-key.txt")
    API_KEY = fs.readFileSync(keyPath, "utf8").trim()
  } catch (e) {
    console.log("Please set METEO_FRANCE_API_KEY environment variable or put your API key in scripts/api-key.txt")
    process.exit(1)
  }
}

async function processZipResponse(response, endpointName) {
  const buffer = await response.arrayBuffer()
  console.log("Response size: " + buffer.byteLength + " bytes")

  try {
    const zip = new AdmZip(Buffer.from(buffer))
    const entries = zip.getEntries()

    console.log("\nZIP contains " + entries.length + " files:")
    entries.forEach((entry) => {
      console.log("  - " + entry.entryName + " (" + entry.header.size + " bytes)")
    })

    // Extract and analyze all files
    for (const entry of entries) {
      const content = entry.getData().toString("utf8")
      console.log("\n--- Content of " + entry.entryName + " ---")

      if (entry.entryName.endsWith(".json")) {
        try {
          const data = JSON.parse(content)
          console.log(JSON.stringify(data, null, 2))

          // Look for Martinique data
          const jsonStr = JSON.stringify(data)
          if (jsonStr.includes("972") || jsonStr.toLowerCase().includes("martinique")) {
            console.log("\n*** MARTINIQUE DATA FOUND IN THIS FILE ***")
          }
        } catch (error) {
          console.log("(Could not parse as JSON)")
          console.log(content.substring(0, 2000))
        }
      } else if (entry.entryName.endsWith(".xml")) {
        console.log(content.substring(0, 5000))
        if (content.includes("972") || content.toLowerCase().includes("martinique")) {
          console.log("\n*** MARTINIQUE DATA FOUND IN THIS FILE ***")
        }
      } else {
        console.log("(Binary or unknown format, " + content.length + " chars)")
        console.log(content.substring(0, 500))
      }
    }
  } catch (error) {
    console.log("Error processing ZIP: " + error.message)
    // Try to read as plain text
    const text = Buffer.from(buffer).toString("utf8")
    console.log("Raw response (first 2000 chars): " + text.substring(0, 2000))
  }
}

async function testVigilanceAPI() {
  console.log("=== Testing Meteo France Vigilance OM API ===\n")
  console.log("API Key length: " + API_KEY.length + " characters")
  console.log("API Key starts with: " + API_KEY.substring(0, 50) + "...")

  // Endpoint 1: vigilanceom/flux/dernier
  const fluxUrl = "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/flux/dernier"

  console.log("\n1. Testing vigilanceom/flux/dernier endpoint...")
  console.log("URL: " + fluxUrl)

  try {
    const response = await fetch(fluxUrl, {
      headers: {
        apikey: API_KEY,
        Accept: "*/*",
      },
    })

    console.log("Status: " + response.status)
    console.log("Content-Type: " + response.headers.get("content-type"))

    if (response.ok) {
      await processZipResponse(response, "flux")
    } else {
      const text = await response.text()
      console.log("Error response: " + text)
    }
  } catch (error) {
    console.log("Error: " + error.message)
  }

  // Endpoint 2: vigilanceom/controle/dernier
  console.log("\n\n========================================")
  console.log("2. Testing vigilanceom/controle/dernier endpoint...")
  const controleUrl = "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/controle/dernier"
  console.log("URL: " + controleUrl)

  try {
    const response = await fetch(controleUrl, {
      headers: {
        apikey: API_KEY,
        Accept: "*/*",
      },
    })

    console.log("Status: " + response.status)
    console.log("Content-Type: " + response.headers.get("content-type"))

    if (response.ok) {
      await processZipResponse(response, "controle")
    } else {
      const text = await response.text()
      console.log("Error response: " + text)
    }
  } catch (error) {
    console.log("Error: " + error.message)
  }
}

testVigilanceAPI()
