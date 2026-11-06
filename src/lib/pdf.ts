import fs from "fs";
import path from "path";

let cachedFontCss: string | null = null;

// Chromium (especially the stripped-down @sparticuz/chromium build used in
// production) has no Arabic-capable system font. Embedding Cairo directly as
// base64 data URIs makes every PDF self-contained and renders Arabic shaping
// and bidi correctly via Chromium's own text engine — no manual reshaping
// needed, unlike the old reportlab/Python approach.
function getFontFaceCss(): string {
  if (cachedFontCss) return cachedFontCss;
  const dir = path.join(process.cwd(), "src/lib/fonts");
  const weights: [string, number][] = [
    ["Cairo-Regular.ttf", 400],
    ["Cairo-Bold.ttf", 700],
    ["Cairo-ExtraBold.ttf", 800],
  ];
  cachedFontCss = weights
    .map(([file, weight]) => {
      const base64 = fs.readFileSync(path.join(dir, file)).toString("base64");
      return `@font-face { font-family: "Cairo"; font-weight: ${weight}; src: url(data:font/ttf;base64,${base64}) format("truetype"); }`;
    })
    .join("\n");
  return cachedFontCss;
}

export function wrapHtmlDocument(bodyHtml: string, dir: "rtl" | "ltr" = "rtl"): string {
  return `<!doctype html>
<html lang="${dir === "rtl" ? "ar" : "en"}" dir="${dir}">
<head>
<meta charset="utf-8" />
<style>
  ${getFontFaceCss()}
  * { box-sizing: border-box; }
  body { font-family: "Cairo", sans-serif; margin: 0; }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

async function getBrowser() {
  const isServerless = !!process.env.RENDER;
  const puppeteer = await import("puppeteer-core");

  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const localCandidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  const executablePath = localCandidates.find((p) => fs.existsSync(p));
  if (!executablePath) {
    throw new Error(
      "No local Chrome/Chromium installation found for PDF generation in development."
    );
  }
  return puppeteer.launch({ executablePath, headless: true });
}

export async function renderHtmlToPdf(html: string, options?: { landscape?: boolean }): Promise<Buffer> {
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
      landscape: options?.landscape ?? false,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
