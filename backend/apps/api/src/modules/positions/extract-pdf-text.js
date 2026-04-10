// Standalone script to extract text from a PDF URL.
// Called via child_process to avoid webpack bundling issues with pdfjs-dist.
// Usage: node extract-pdf-text.js <url>

const { getDocument } = require('pdfjs-dist/legacy/build/pdf.mjs');

async function main() {
  const url = process.argv[2];
  if (!url) {
    process.stdout.write('');
    process.exit(0);
  }

  const response = await fetch(url);
  if (!response.ok) {
    process.stdout.write('');
    process.exit(0);
  }

  const buffer = new Uint8Array(await response.arrayBuffer());
  const doc = await getDocument({ data: buffer, useSystemFonts: true }).promise;
  const pages = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(' '));
  }

  await doc.destroy();
  process.stdout.write(pages.join('\n'));
}

main().catch(() => {
  process.stdout.write('');
  process.exit(0);
});
