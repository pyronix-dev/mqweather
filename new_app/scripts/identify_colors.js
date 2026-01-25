const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const directory = "./map_images";
const colorMap = {
    red: { h: [340, 15] },   // 340-360 or 0-15
    orange: { h: [15, 45] },
    yellow: { h: [45, 75] },
    green: { h: [75, 160] },
    purple: { h: [240, 320] },
    // Grey/White needs saturation check
};

// Simplified color checker
async function identifyColor(filePath) {
    try {
        const image = await Jimp.read(filePath);
        image.resize(50, 50); // Resize for speed

        let rTotal = 0, gTotal = 0, bTotal = 0;
        let count = 0;

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Convert to HSV to check saturation
            // Simple approach: skip pixels that are essentially greyscale (unless we are looking for grey map)
            // But the grey map IS greyscale.
            // Let's filter out PURE white/black background.
            // Assuming white background.
            if (r < 240 || g < 240 || b < 240) { // Not near-white
                rTotal += r;
                gTotal += g;
                bTotal += b;
                count++;
            }
        });

        if (count === 0) return "empty/white";

        const avgR = rTotal / count;
        const avgG = gTotal / count;
        const avgB = bTotal / count;

        // Convert RGB to HSL/HSV
        // https://stackoverflow.com/questions/2348597/why-doesnt-this-javascript-rgb-to-hsl-code-work
        const r = avgR / 255;
        const g = avgG / 255;
        const b = avgB / 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        const degree = h * 360;

        // Saturation check for Grey
        if (s < 0.15) return "grey";

        if (degree >= 340 || degree <= 15) return "red";
        if (degree > 15 && degree <= 45) return "orange";
        if (degree > 45 && degree <= 75) return "yellow";
        if (degree > 75 && degree <= 160) return "green";
        if (degree > 240 && degree <= 320) return "purple";

        return `unknown (h:${degree.toFixed(0)}, s:${s.toFixed(2)})`;

    } catch (err) {
        return `Error: ${err.message}`;
    }
}

async function main() {
    try {
        const files = fs.readdirSync(directory).filter(f => f.match(/\.(jpg|jpeg|png)$/i) && !f.includes('error'));

        for (const file of files) {
            const color = await identifyColor(path.join(directory, file));
            console.log(`File: ${file} -> Color: ${color}`);
        }
    } catch (e) {
        console.error(e);
    }
}

main();
