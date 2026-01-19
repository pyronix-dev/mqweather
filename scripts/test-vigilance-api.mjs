import JSZip from "jszip";

const API_KEY = "eyJ4NXQiOiJZV0kxTTJZNE1qWTNOemsyTkRZeU5XTTRPV014TXpjek1UVmhNbU14T1RSa09ETXlOVEE0Tnc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJib3NzamFja0BjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6ImJvc3NqYWNrIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJEZWZhdWx0QXBwbGljYXRpb24iLCJpZCI6MzU3NDMsInV1aWQiOiJmNTM4NzM0My0yZGE1LTRmNTQtYjFhNS0zN2M3OTdhNTMxNmYifSwiaXNzIjoiaHR0cHM6XC9cL3BvcnRhaWwtYXBpLm1ldGVvZnJhbmNlLmZyOjQ0M1wvb2F1dGgyXC90b2tlbiIsInRpZXJJbmZvIjp7IjYwUmVxUGFyTWluIjp7InRpZXJRdW90YVR5cGUiOiJyZXF1ZXN0Q291bnQiLCJncmFwaFFMTWF4Q29tcGxleGl0eSI6MCwiZ3JhcGhRTE1heERlcHRoIjowLCJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjowLCJzcGlrZUFycmVzdFVuaXQiOiJzZWMifSwiODUwcmVxUGVyNU1pbiI6eyJ0aWVyUXVvdGFUeXBlIjoicmVxdWVzdENvdW50IiwiZ3JhcGhRTE1heENvbXBsZXhpdHkiOjAsImdyYXBoUUxNYXhEZXB0aCI6MCwic3RvcE9uUXVvdGFSZWFjaCI6dHJ1ZSwic3Bpa2VBcnJlc3RMaW1pdCI6MCwic3Bpa2VBcnJlc3RVbml0Ijoic2VjIn19LCJrZXl0eXBlIjoiUFJPRFVDVElPTiIsInN1YnNjcmliZWRBUElzIjpbeyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkRvbm5lZXNQdWJsaXF1ZXNWaWdpbGFuY2UiLCJjb250ZXh0IjoiXC9wdWJsaWNcL0RQVmlnaWxhbmNlXC92MSIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6InYxIiwic3Vic2NyaXB0aW9uVGllciI6IjYwUmVxUGFyTWluIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkRvbm5lZXNQdWJsaXF1ZXNSYWRhciIsImNvbnRleHQiOiJcL3B1YmxpY1wvRFBSYWRhclwvdjEiLCJwdWJsaXNoZXIiOiJNRVRFTy5GUlwvbWFydGlubCIsInZlcnNpb24iOiJ2MSIsInN1YnNjcmlwdGlvblRpZXIiOiI4NTByZXFQZXI1TWluIn1dLCJleHAiOjE4MDAxMzYzMTYsInRva2VuX3R5cGUiOiJhcGlLZXkiLCJpYXQiOjE3Njg2MDAzMTYsImp0aSI6IjU1YzdjYTBhLTMwZDQtNDE1OC1iNzFjLTdmZDE2ZGQzNzExOCJ9.yGQVv5IXdTLDkecbxaTBnvSbDoBrEvIVPOaLDGuY5te3-L9Bx30BksDLWqN0HcJqFJPyUslYxX3F100xvEF2AanvR0m9HP-i5V5E2sVcNXOMPiLRvYWzgBZjirvDn4iInsT7D3XJTaplcLF8Dy04J4XQiQ4CqxAJwSJm4gG4Cg3eXHmLNGIkJAKIV0EyAzbxJiOZIvMfSIssU5lgkib9MKMAzYVDeZkGylO_qxg8v9jbSv96oeKzFvGnUIC3se03s0r8n3HsQkuMx3LUB_r8ZeMT9on86I9OCEkxlOvOk25FSthzygIDOOhFuudKJ9S1NyBGEtwHVVEnrbwyyGK6aw==";

const ENDPOINTS = {
  flux: "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/flux/dernier",
  controle: "https://public-api.meteofrance.fr/public/DPVigilance/v1/vigilanceom/controle/dernier"
};

async function fetchAndExtractZip(name, url) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Testing endpoint: ${name}`);
  console.log(`URL: ${url}`);
  console.log("=".repeat(60));

  try {
    const response = await fetch(url, {
      headers: {
        "accept": "*/*",
        "apikey": API_KEY
      }
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get("content-type")}`);

    if (!response.ok) {
      const text = await response.text();
      console.log(`Error response: ${text}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log(`Response size: ${arrayBuffer.byteLength} bytes`);

    // Load ZIP
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    console.log(`\nFiles in ZIP:`);
    const fileNames = Object.keys(zip.files);
    fileNames.forEach(f => console.log(`  - ${f}`));

    // Extract and analyze each file
    const results = {};
    for (const fileName of fileNames) {
      const file = zip.files[fileName];
      if (!file.dir) {
        const content = await file.async("string");
        results[fileName] = content;
        
        console.log(`\n--- File: ${fileName} ---`);
        
        // Try to parse as JSON
        try {
          const json = JSON.parse(content);
          console.log(`Parsed as JSON successfully`);
          
          // Look for Martinique data
          console.log(`\nSearching for Martinique data...`);
          const martinique = findMartiniqueData(json, fileName);
          if (martinique) {
            console.log(`\n*** MARTINIQUE DATA FOUND ***`);
            console.log(JSON.stringify(martinique, null, 2));
          }
        } catch (e) {
          // Not JSON, show raw content (truncated)
          console.log(`Content (first 500 chars): ${content.substring(0, 500)}`);
        }
      }
    }
    
    return results;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return null;
  }
}

function findMartiniqueData(data, fileName) {
  // Martinique department code is 972
  const martiniqueCodes = ["972", "MART", "Martinique", "martinique"];
  
  if (Array.isArray(data)) {
    // Search in array
    const found = data.filter(item => {
      const str = JSON.stringify(item).toLowerCase();
      return martiniqueCodes.some(code => str.includes(code.toLowerCase()));
    });
    if (found.length > 0) return found;
  }
  
  if (typeof data === "object" && data !== null) {
    // Check for product.domain or similar structure
    if (data.product) {
      console.log(`Product structure found:`);
      console.log(`  - domain: ${data.product.domain}`);
      console.log(`  - update_time: ${data.product.update_time}`);
      console.log(`  - periods count: ${data.product.periods?.length || 0}`);
    }
    
    // Search for timelaps (periods) with domain info
    if (data.product?.periods) {
      for (const period of data.product.periods) {
        console.log(`\nPeriod: ${period.echeance} (${period.begin_validity_time} - ${period.end_validity_time})`);
        
        if (period.timelaps?.domain_ids) {
          const martiniqueData = period.timelaps.domain_ids.find(d => 
            d.domain_id === "972" || d.domain_id === "MART972"
          );
          if (martiniqueData) {
            return {
              period: period.echeance,
              begin: period.begin_validity_time,
              end: period.end_validity_time,
              martinique: martiniqueData
            };
          }
        }
      }
    }
    
    // Deep search
    for (const key of Object.keys(data)) {
      const value = data[key];
      const str = JSON.stringify(value).toLowerCase();
      if (martiniqueCodes.some(code => str.includes(code.toLowerCase()))) {
        console.log(`Found potential Martinique data in key: ${key}`);
        const result = findMartiniqueData(value, fileName);
        if (result) return result;
      }
    }
  }
  
  return null;
}

// Run tests
async function main() {
  console.log("Testing Météo France Vigilance API endpoints");
  console.log("Looking for Martinique (972) vigilance data\n");

  const fluxData = await fetchAndExtractZip("flux", ENDPOINTS.flux);
  const controleData = await fetchAndExtractZip("controle", ENDPOINTS.controle);

  console.log("\n\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log(`Flux endpoint: ${fluxData ? "SUCCESS" : "FAILED"}`);
  console.log(`Controle endpoint: ${controleData ? "SUCCESS" : "FAILED"}`);
}

main();
