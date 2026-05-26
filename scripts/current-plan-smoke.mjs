import assert from "node:assert/strict";
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";

const checks = [];
function pass(id, detail = "") {
  checks.push({ id, status: "PASS", detail });
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  const failedResponses = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
  });
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto(BASE_URL, { waitUntil: "load" });

  const title = await page.title();
  assert.match(title, /^\[TEST\]/);
  pass("TC-092", "Test title starts with [TEST].");

  assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, nofollow");
  pass("TC-089", "Test page has noindex,nofollow.");

  assert.equal(await page.getByText("TEST ENVIRONMENT", { exact: false }).count(), 1);
  pass("TC-090", "Test environment banner is visible.");

  const expected404s = new Set([`${BASE_URL}/favicon.svg`]);
  assert.deepEqual(errors, []);
  assert.deepEqual(failedResponses.filter((entry) => !expected404s.has(entry.replace(/^404 /, ""))), []);
  pass("TC-007", "No console/page errors or unexpected 4xx/5xx assets on load.");

  const body = await page.locator("body").innerText();
  assert.equal(body.includes("bentindale+hillstest"), false);
  assert.equal(body.includes("ABN 26 667 426 593"), true);
  assert.equal(body.includes("NSW Licence #451327C"), true);
  assert.equal(body.includes("$108"), true);
  assert.equal(body.includes("1,196"), true);
  assert.equal(body.includes("500"), true);
  pass("TC-005", "Core price, ABN and licence copy is present; old test email is absent.");

  const stripeLinks = await page.evaluate(() => {
    return [...document.documentElement.innerHTML.matchAll(/https:\/\/buy\.stripe\.com\/[^'"\s<]+/g)].map((m) => m[0]);
  });
  assert.equal(stripeLinks.length, 3);
  assert.equal(stripeLinks.every((href) => href.includes("/test_")), true);
  pass("TC-013/014/015", "All embedded Stripe links are test-mode links.");

  const buttonBoxes = await page.locator("button").evaluateAll((buttons) => {
    return buttons
      .map((button) => {
        const rect = button.getBoundingClientRect();
        return { text: button.textContent.trim(), width: rect.width, height: rect.height };
      })
      .filter((box) => box.width > 0 && box.height > 0);
  });
  assert.equal(buttonBoxes.every((box) => box.width >= 44 && box.height >= 44), true);
  pass("TC-085", "Visible buttons meet the 44x44px target.");

  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
  pass("TC-002/003/004", "No horizontal overflow at desktop viewport.");

  await page.locator("#cta-monthly-hero").click();
  await page.locator("#modal-postcode").fill("2000");
  await page.locator("#postcode-error.visible").waitFor({ state: "visible", timeout: 3000 });
  pass("TC-010", "Non-2154 postcode shows out-of-area message.");

  await page.locator("#modal-postcode").fill("2154");
  await page.locator('label:has(input[value="house"])').click();
  assert.equal(await page.locator("#modal-continue-btn").isEnabled(), true);
  await page.locator("#modal-continue-btn").click();
  await page.locator("#modal-step-2.active").waitFor({ state: "visible", timeout: 3000 });
  pass("TC-010", "2154 postcode continues to payment confirmation step.");

  await page.locator(".modal-close").click();
  await page.locator("#cta-monthly-hero").click();
  await page.locator("#modal-postcode").fill("2154");
  await page.locator('label:has(input[value="strata"])').click();
  await page.locator("#strata-msg.visible").waitFor({ state: "visible", timeout: 3000 });
  pass("TC-009/012", "Strata option shows strata handoff message in the eligibility modal.");

  await page.locator(".modal-close").click();
  await page.goto(`${BASE_URL}/robots.txt`, { waitUntil: "load" });
  assert.match(await page.locator("body").innerText(), /Disallow:\s*\//);
  pass("TC-089", "robots.txt blocks all crawling in test.");

  const sitemapResponse = await page.goto(`${BASE_URL}/sitemap.xml`, { waitUntil: "load" });
  assert.equal(sitemapResponse.status(), 404);
  pass("TC-089", "Test sitemap is absent.");

  await browser.close();
  console.log(JSON.stringify(checks, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
