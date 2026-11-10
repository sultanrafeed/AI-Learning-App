const fs = require("fs");
const { chromium } = require("playwright");
(async () => {
  const dir = __dirname;
  const html = ["head", "p1", "p2", "p3", "p4", "p5"].map((f) => fs.readFileSync(`${dir}/${f}.html`, "utf8")).join("\n");
  fs.writeFileSync(`${dir}/cheatsheet.html`, html);
  const b = await chromium.launch(); const p = await b.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("file://" + dir + "/cheatsheet.html", { waitUntil: "load" });
  await p.evaluate(() => renderMathInElement(document.body, { delimiters: [{ left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }], throwOnError: false }));
  const kerr = await p.$$eval(".katex-error", (x) => x.map((e) => e.textContent));
  await p.pdf({ path: process.argv[2], format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: `<div style="font-size:7px;width:100%;text-align:center;color:#64748b;font-family:sans-serif">42172 AI exam cheat sheet · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
    margin: { top: "9mm", bottom: "11mm", left: "8mm", right: "8mm" } });
  console.log("errors", errs, "katex errors", kerr);
  await b.close();
})();
