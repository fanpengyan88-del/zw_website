import { chromium } from "playwright";
import fs from "node:fs/promises";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

const results = [];

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
}

async function check(name, run) {
  try {
    await run();
    results.push({ name, status: "passed" });
  } catch (error) {
    results.push({ name, status: "failed", detail: error.message });
  }
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await desktop.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
await desktop.locator("h1").first().waitFor({ state: "visible" });
await check("桌面首页标题", async () => {
  const title = await desktop.locator("h1").first().innerText();
  if (!title.includes("安全大数据")) throw new Error(`unexpected h1: ${title}`);
});
await check("产品筛选", async () => {
  await desktop.getByRole("button", { name: "安全中台", exact: true }).click();
  const count = await desktop.locator(".product-editorial article").count();
  if (count !== 1) throw new Error(`expected 1 product, got ${count}`);
  await desktop.getByRole("button", { name: "全部", exact: true }).click();
});
await check("视频弹窗", async () => {
  await desktop.locator(".brand-films button").first().click();
  await desktop.locator(".modal").waitFor({ state: "visible" });
  await desktop.locator(".modal-close").click();
  await desktop.locator(".modal").waitFor({ state: "detached" });
});
await check("四季顺序与完整封面", async () => {
  const labels = await desktop.locator(".season-tabs button strong").allInnerTexts();
  if (labels.join("") !== "春夏秋冬") throw new Error(`unexpected seasons: ${labels.join(",")}`);
  await desktop.locator(".season-tabs button").filter({ hasText: "夏" }).click();
  const fit = await desktop.locator(".season-videos .video-frame video").first().evaluate((node) => getComputedStyle(node).objectFit);
  if (fit !== "contain") throw new Error(`expected contain, got ${fit}`);
  await desktop.locator(".season-tabs button").filter({ hasText: "秋" }).click();
  await desktop.locator(".season-coming img").waitFor({ state: "visible" });
  await desktop.locator(".season-tabs button").filter({ hasText: "春" }).click();
});
await check("发展历程横向滚动", async () => {
  const years = desktop.locator(".history-years button");
  const count = await years.count();
  if (count !== 22) throw new Error(`expected 22 timeline years, got ${count}`);
  const initialYear = await desktop.locator(".history-year strong").innerText();
  if (initialYear !== "未来") throw new Error(`expected initial year 未来, got ${initialYear}`);
  await desktop.getByRole("button", { name: "查看更早年份" }).click();
  await desktop.waitForTimeout(250);
  const previousYear = await desktop.locator(".history-year strong").innerText();
  if (previousYear !== "2026") throw new Error(`expected previous year 2026, got ${previousYear}`);
  const connectedSegments = await desktop.locator(".history-years button:not(:last-child)").count();
  if (connectedSegments !== count - 1) throw new Error("timeline connector segments are incomplete");
  await years.filter({ hasText: "2002" }).click();
  const firstEvent = await desktop.locator(".history-events article p").innerText();
  if (!firstEvent.includes("企业成立")) throw new Error(`unexpected first event: ${firstEvent}`);
});
await scrollThrough(desktop);
await desktop.screenshot({ path: "qa-desktop.png", fullPage: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await mobile.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
await mobile.locator("h1").first().waitFor({ state: "visible" });
await check("移动端导航", async () => {
  await mobile.locator(".menu-button").click();
  const nav = mobile.locator(".site-header nav");
  if (!(await nav.isVisible())) throw new Error("mobile nav not visible");
  await mobile.locator(".site-header nav").getByRole("button", { name: "产品能力", exact: true }).click();
});
await check("移动端无水平溢出", async () => {
  const sizes = await mobile.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  if (sizes.scroll > sizes.client + 2) throw new Error(`horizontal overflow ${sizes.scroll}/${sizes.client}`);
});
await scrollThrough(mobile);
await mobile.screenshot({ path: "qa-mobile.png", fullPage: true });

await browser.close();
await fs.writeFile("qa-results.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.some((item) => item.status === "failed")) process.exitCode = 1;
