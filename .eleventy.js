const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const texmath = require("markdown-it-texmath");
const katex = require("katex");

// LaTeX macros available in every note/project (KaTeX, rendered at build time)
const katexMacros = {
  "\\R": "\\mathbb{R}",
  "\\E": "\\mathbb{E}",
  "\\N": "\\mathbb{N}",
  "\\Z": "\\mathbb{Z}",
  "\\norm": "\\left\\lVert #1 \\right\\rVert",
  "\\abs": "\\left\\lvert #1 \\right\\rvert",
  "\\inner": "\\langle #1,\\, #2 \\rangle",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

module.exports = function (eleventyConfig) {
  const md = markdownIt({ html: true, linkify: true })
    .use(texmath, {
      engine: katex,
      delimiters: ["dollars", "brackets"], // $...$/$$...$$ and \(...\)/\[...\]
      katexOptions: { throwOnError: false, macros: katexMacros },
    })
    .use(markdownItAnchor); // ids on headings, for the TOC and deep links
  eleventyConfig.setLibrary("md", md);

  // Extract h2/h3 headings from rendered content for the sidebar TOC
  eleventyConfig.addFilter("tocEntries", (html) => {
    if (!html) return [];
    const entries = [];
    const re = /<h([23])[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
    let m;
    while ((m = re.exec(html))) {
      entries.push({
        level: Number(m[1]),
        id: m[2],
        text: m[3].replace(/<[^>]*>/g, "").trim(),
      });
    }
    return entries;
  });

  // Build-time syntax highlighting (PrismJS) — no client-side JS
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/js": "js" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/katex/dist/katex.min.css": "css/katex/katex.min.css",
    "node_modules/katex/dist/fonts": "css/katex/fonts",
  });
  // raw Markdown sources, served alongside each note's HTML for
  // machine/LLM-agent consumption (e.g. /notes/my-note.md)
  eleventyConfig.addPassthroughCopy("src/notes/*.md");

  // "2025-12-12" -> "Dec 2025" (string parsing avoids timezone off-by-one)
  eleventyConfig.addFilter("monthYear", (iso) => {
    const [y, m] = String(iso).split("-");
    return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
  });

  const published = (p) => !p.data.draft;
  const newestFirst = (a, b) => b.date - a.date;
  eleventyConfig.addCollection("notes", (api) =>
    api.getFilteredByGlob("src/notes/*.md").filter(published).sort(newestFirst));
  eleventyConfig.addCollection("projects", (api) =>
    api.getFilteredByGlob("src/projects/*.md").filter(published).sort(newestFirst));

  return {
    dir: {
      input: "src",
      output: ".", // build into repo root so GitHub Pages serves it directly
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk"],
  };
};
