// Story 15.2 dark-completeness evidence extractor (local, read-only).
// Decodes the committed recon PNG (8-bit RGB, non-interlaced) with zlib only
// and prints an exact-RGB pixel census — extraction from the recon pack, not
// invention. Run: node sample-dark-png.mjs <png> [topN]
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const [pngPath, topArg] = process.argv.slice(2);
const topN = Number(topArg ?? 40);
const buf = readFileSync(pngPath);
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
const bitDepth = buf[24];
const colorType = buf[25];
if (bitDepth !== 8 || colorType !== 2) {
  throw new Error(`unsupported PNG: bitDepth=${bitDepth} colorType=${colorType}`);
}

// Concatenate IDAT chunks.
let idatOffset = 8;
let idat = [];
while (idatOffset < buf.length) {
  const length = buf.readUInt32BE(idatOffset);
  const type = buf.toString('ascii', idatOffset + 4, idatOffset + 8);
  if (type === 'IDAT') idat.push(buf.subarray(idatOffset + 8, idatOffset + 8 + length));
  if (type === 'IEND') break;
  idatOffset += 12 + length;
}
const raw = inflateSync(Buffer.concat(idat));

// Unfilter scanlines (filters 0..4, 3 bytes/px, bpp=3).
const stride = width * 3;
const out = Buffer.alloc(height * stride);
for (let y = 0; y < height; y += 1) {
  const filter = raw[y * (stride + 1)];
  const rowStart = y * (stride + 1) + 1;
  for (let x = 0; x < stride; x += 1) {
    const byte = raw[rowStart + x];
    const left = x >= 3 ? out[y * stride + x - 3] : 0;
    const up = y > 0 ? out[(y - 1) * stride + x] : 0;
    const upLeft = y > 0 && x >= 3 ? out[(y - 1) * stride + x - 3] : 0;
    let value;
    switch (filter) {
      case 0: value = byte; break;
      case 1: value = byte + left; break;
      case 2: value = byte + up; break;
      case 3: value = byte + ((left + up) >> 1); break;
      case 4: {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        const pred = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
        value = byte + pred;
        break;
      }
      default: throw new Error(`unknown filter ${filter}`);
    }
    out[y * stride + x] = value & 0xff;
  }
}

// Exact-RGB census.
const census = new Map();
for (let i = 0; i < out.length; i += 3) {
  const key = (out[i] << 16) | (out[i + 1] << 8) | out[i + 2];
  census.set(key, (census.get(key) ?? 0) + 1);
}
const hex = (n) => `#${n.toString(16).padStart(6, '0').toUpperCase()}`;
const sorted = [...census.entries()].sort((a, b) => b[1] - a[1]);
console.log(`${pngPath} — ${width}x${height}, ${census.size} distinct colors`);
console.log(`census^2 ${sorted.length}`);
for (const [key, count] of sorted.slice(0, topN)) {
  console.log(`${hex(key)}  ${count}`);
}
