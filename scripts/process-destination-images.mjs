import sharp from "sharp";
import path from "path";

const DIR = path.join(process.cwd(), "public/images/destinations");

// source filename -> output slug (matches destinations.ts heroImage naming: <slug>-hero.jpg)
const map = {
  "Australia.jpg": "australia",
  "Canada.jpg": "canada",
  "Denmark.jpg": "denmark",
  "Finland.jpg": "finland",
  "Greece.jpg": "greece",
  "Malaysia.jpg": "malaysia",
  "Malta.jpg": "malta",
  "New Zealand.jpg": "new-zealand",
  "South Korea.jpg": "south-korea",
  "Sweden.jpg": "sweden",
  "UK.jpg": "uk",
  "US.jpg": "usa",
  "cyprus.jpg": "cyprus",
};

const WIDTH = 1200;
const HEIGHT = 800;

for (const [src, slug] of Object.entries(map)) {
  const inputPath = path.join(DIR, src);
  const outputPath = path.join(DIR, `${slug}-hero.jpg`);
  await sharp(inputPath)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(outputPath);
  const buf = await sharp(outputPath).toBuffer();
  const meta = await sharp(buf).metadata();
  console.log(`${slug}-hero.jpg  ${meta.width}x${meta.height}  ${(buf.length / 1024).toFixed(0)}KB`);
}
