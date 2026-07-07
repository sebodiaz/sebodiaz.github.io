# Sebo Diaz — Personal Website

Repository for my personal academic website, built with [Eleventy](https://www.11ty.dev/).
Everything is rendered to static HTML at build time — Markdown, LaTeX (KaTeX), and
syntax highlighting (PrismJS) — so pages ship with no client-side rendering JavaScript.

## Features

* **Fast:** static HTML + one small stylesheet; KaTeX math and Prism code highlighting are rendered at build time.
* **Blog/notes in Markdown:** drop a `.md` file in `src/notes/`, get a page with full LaTeX support.
* **Project pages in Markdown:** frontmatter drives the header (authors, venue, links, hero figure); the body is freeform Markdown.
* **Data-driven homepage:** publications and news live in JSON files, not HTML.
* **Dark mode:** toggle in the nav, persisted in `localStorage`, defaults to the system preference.

## Folder Structure

```
├── .eleventy.js            # Eleventy config: KaTeX, Prism, collections, macros
├── src/                    # ALL source lives here — edit these files
│   ├── _data/
│   │   ├── publications.json   # homepage publications list
│   │   ├── news.json           # homepage news items
│   │   └── site.json           # name, email, social links
│   ├── _layouts/
│   │   ├── base.njk            # HTML shell, nav, footer, theme toggle
│   │   ├── note.njk            # note pages
│   │   └── project.njk         # project pages
│   ├── css/style.css           # the whole site's stylesheet (light + dark themes)
│   ├── js/site.js              # theme toggle + image lightbox (only JS shipped)
│   ├── index.njk               # homepage
│   ├── notes/                  # notes as Markdown (+ the notes index)
│   └── projects/               # project pages as Markdown (+ the projects index)
├── images/, files/         # static assets, served as-is
├── index.html, notes/, projects/, css/, js/   # BUILD OUTPUT — do not edit by hand
└── package.json
```

The build writes into the repository root so GitHub Pages serves it directly:
commit both `src/` and the generated output.

## Development

```bash
npm install
npm run build     # build the site AND regenerate files/cv.pdf from /cv/
npm run watch     # dev server with live reload at http://localhost:8080
```

The PDF step renders the `/cv/` page with a headless Chromium-family browser
(Playwright's Chromium, Chrome, or Edge — whichever is found). On a machine
with none of them, run `npx playwright install chromium` once; until then the
PDF step is skipped with a warning and the rest of the build still succeeds.

### Updating the CV

Edit `src/_data/cv.json` and run `npm run build` — both the `/cv/` page and
the downloadable `files/cv.pdf` regenerate from it. There is no other source
of truth (`npm run build:pdf` re-renders just the PDF).

### Adding a note

Create `src/notes/my-note.md`:

```markdown
---
layout: note.njk
title: "My Note"
date: 2026-07-07
displayDate: "July 7th, 2026"
tags: ["topic"]
description: "One-line summary shown on the notes index."
---

Inline math \(x^2\), display math on its own paragraph, fenced code blocks, callout divs.
```

The notes index updates automatically. Use `draft: true` to build a page without
listing it. See `src/notes/markdown-demo.md` for everything the pipeline supports
(math conventions, callouts, numbered equations).

### Adding a project

Create `src/projects/MyProject.md` with `layout: project.njk` and frontmatter for
`title`, `authors`, `affiliations`, `venue`, `links`, `hero`/`heroCaption`, `thumb`,
and `description`. See `src/projects/DropGen.md`.

### Publications & news

Edit `src/_data/publications.json` / `src/_data/news.json` and rebuild.
Put figures in `images/publications/`.

### LaTeX macros

Global macros (`\R`, `\E`, `\norm{...}`, …) are defined in `.eleventy.js`.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

* Design inspired by [horwitz.ai](http://horwitz.ai).
* Built with [Eleventy](https://www.11ty.dev/), [KaTeX](https://katex.org/), and [PrismJS](https://prismjs.com/).
