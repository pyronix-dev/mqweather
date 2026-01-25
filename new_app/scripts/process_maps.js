const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const sourceDir = "./map_images";
const targetDir = "./public/maps";

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Mapping derived from previous analysis
const fileMapping = {
    "WhatsApp Image 2026-01-20 at 00.42.51.jpeg": "map_jaune.png",   // yellow -> jaune (french)
    "WhatsApp Image 2026-01-20 at 00.42.52.jpeg": "map_orange.png",  // orange
    "WhatsApp Image 2026-01-20 at 00.42.55 (1).jpeg": "map_violet.png", // purple -> violet
    "WhatsApp Image 2026-01-20 at 00.42.55 (2).jpeg": "map_gris.png",  // grey -> gris
    "WhatsApp Image 2026-01-20 at 00.42.55.jpeg": "map_rouge.png",   // red -> rouge
    "WhatsApp Image 2026-01-20 at 00.42.58.jpeg": "map_vert.png"     // green -> vert
};

async function processImages() {
    for (const [srcName, targetName] of Object.entries(fileMapping)) {
        try {
            const srcPath = path.join(sourceDir, srcName);
            const targetPath = path.join(targetDir, targetName);

            if (fs.existsSync(srcPath)) {
                console.log(`Processing ${srcName} -> ${targetName}...`);
                const image = await Jimp.read(srcPath);
                await image.writeAsync(targetPath);
                console.log(`Saved to ${targetPath}`);
            } else {
                console.warn(`Source file not found: ${srcName}`);
            }
        } catch (err) {
            console.error(`Error processing ${srcName}:`, err);
        }
    }
}

processImages();
