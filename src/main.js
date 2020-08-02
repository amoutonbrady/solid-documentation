import degit from "degit";
import remark from "remark";
import rehype from "rehype";
import postcss from "postcss";
import html from "remark-html";
import shiki from "rehype-shiki";
import * as Sqrl from "squirrelly";
import { join, dirname } from "path";
import htmlMinifier from "html-minifier";
import { readdir, readFile, writeFile, rmdir, mkdir } from "fs/promises";
import { performance } from "perf_hooks";

const DOC_DIST = join(__dirname, "doc");
const TEMPLATE_PATH = join(__dirname, "template.html");
const STYLES_PATH = join(__dirname, "tailwind.css");
const DIST = join(dirname(__dirname), "dist");
const dist = (...paths) => join(DIST, ...paths);

async function main() {
  process.env.NODE_ENV = "production";
  const start = performance.now();
  console.log("Removing dist leftover & recreating it...");
  await rmdir(DIST, { recursive: true });
  await mkdir(DIST);
  console.log("Done ✔️");
  const md = remark().use(html);
  const re = rehype().data("settings", { fragment: true }).use(shiki);
  const css = postcss([
    require("tailwindcss"),
    require("cssnano")({
      preset: "default",
    }),
  ]);

  const documentation = degit(
    "https://github.com/ryansolid/solid/documentation#master",
    { cache: false, force: true, mode: undefined, verbose: false }
  );
  console.log("Retrieving current Solid documentation...");
  await documentation.clone(DOC_DIST);

  const files = await readdir(DOC_DIST);
  console.log(`${files.length} files found ✔️`);

  const sections = [];

  for (const file of files) {
    const filePath = join(DOC_DIST, file);
    const fileName = file.replace(".md", "");
    console.log(`Processing ${fileName}...`);
    const fileContent = await readFile(filePath, { encoding: "utf-8" });
    const content = await md.process(fileContent);
    const processed = await re.process(content);

    sections.push({
      id: fileName,
      title: unslugify(fileName),
      content: processed.toString(),
    });
    console.log(`Done ✔️`);
  }

  console.log("Bundling index.html...");
  const template = await readFile(TEMPLATE_PATH, { encoding: "utf-8" });
  const styles = await readFile(STYLES_PATH, { encoding: "utf-8" });
  const logo = await pngToBase64(join(__dirname, "logo.png"));
  const textLogo = await pngToBase64(join(__dirname, "textlogo.png"));
  const finalCss = await css.process(styles);
  const finalHtml = Sqrl.render(template, {
    logo,
    textLogo,
    sections,
    css: `<style>${finalCss.content}</style>`,
  });

  await writeFile(
    dist("index.html"),
    htmlMinifier.minify(finalHtml, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
    })
  );
  const end = performance.now();
  console.log(`Everything generated ${Math.round(end - start) / 1000}s ✔️`);
}

function unslugify(slug) {
  const result = slug.replace(/\-/g, " ");
  return result.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

async function pngToBase64(filePath) {
  const bitmap = await readFile(filePath);
  return `data:image/png;base64,${Buffer.from(bitmap).toString("base64")}`;
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
