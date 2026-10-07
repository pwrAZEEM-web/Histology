# CLAUDE.md — context for AI coding agents working on HistoAtlas

## What this is

A **single-page static study atlas** for the Histology III oral exam (University of Debrecen):
57 exam slides across 46 tabs (theory, mechanisms, histological appearance, embryology,
ID checklists, staining notes) plus 166 labeled handout plates with click-to-identify markers.

- **Live:** https://histo-atlas.netlify.app/ — deployed from `main` (Netlify, no build step)
- **Plain HTML/CSS/JS.** No framework, no bundler, no `package.json`, no dependencies to install.
  Do **not** introduce a build step, npm packages, or a framework.

## Repository map

| Path | Role |
|---|---|
| `index.html` | App shell: topbar, sidebar, lightbox markup, script tags. ~88 lines. |
| `app.js` | All app logic: hash routing, rendering, search, ID trainer, lightbox, localStorage. ~800 lines. |
| `app.css` | All styling (light/dark theme, phone/desktop layouts). |
| `data.js` | **All content** — one single-line JSON blob (~1 MB) assigned to `window.HISTO`. |
| `cc.js` | CaseCenter high-res slide links (`window.HISTO_CC`), hand-editable. |
| `img/` | The 166 plate images (JPEGs). |
| `netlify.toml` | Deploy config: publish `.`, cache headers, 404 → shell. |
| `README.md` | Human-facing docs (layout, run, deploy). |

## Golden rules — do not break these

1. **Images stay in `img/`, flat.** `app.js` builds every image URL as `"img/" + file`
   (`imgSrc`, line 7). Moving, renaming or nesting them breaks every plate in the app.
2. **Never rewrite, reformat, prettify or "clean" `data.js`.** It is a single line of ~1 MB.
   Edit it *surgically* (`grep -o`/`python3` targeted string replacement on the exact fragment),
   the same way the file was authored. A whole-file re-serialise risks silent content loss and
   produces a diff no human can review.
3. **Never put credentials in the repo.** It is public, and `cc.js` maps to a university server.
   The file header says it too: no usernames/passwords, ever.
4. **Keep `index.html` free of `/.netlify/scripts/hud` tags.** Netlify injects them at serve time;
   committed copies are duplicates.
5. **Content is exam material — preserve meaning and markup exactly** when editing text. Don't
   "improve" medical statements, don't translate, don't summarise.

## `data.js` schema

`window.HISTO = { slides: [...], stains: [...], abbrevs: [...], abbrev_intro: "..." }`

**`slides[]`** — display order = array order; the sidebar groups by `system`:

```js
{
  id: "3-5",                     // string key; also used in #/slide/<id> routes
  nums: [3, 4, 5],               // printed slide numbers
  label: "3·4·5",                // sidebar label
  title: "Cerebellum (Bielschowsky · Golgi · H&E)",   // stain in trailing parentheses
  system: "NERVOUS TISSUE",      // one of 16 systems
  whatitis: "...",               // one-sentence "what it is"
  spot: ["...", "...", "..."],   // the 3 things that identify it (may contain <strong>)
  sections: [ { key, label, items: [ { lvl, html } ] } ],
  images: [ { file, caption, technique, w, h, anns: [ { t, x, y } ] } ],
  notes: [ { page, src, kind, title, paras: [...] } ]   // "From the handout", page by page
}
```

- **`sections[].key`** is one of: `background`, `howitworks`, `appearance`, `embryology`,
  `structures`, `staining`. `app.js` keys icons/colours off these names.
- **How theory renders (Study notes card):** the five non-checklist section keys are shown as tabs
  in one card (`studyCard` in `app.js`). Each `lvl: 0` item is a headline point; the `lvl: 1/2` items after
  it are its details, collapsed behind a count button unless "Full detail" is on. Consecutive items starting
  with "Then " render as a numbered step flow (the word is kept in the DOM, hidden visually). A short
  "Term:" opener is wrapped in `.lead` for scanning. All of this is presentation only — keep authoring
  items exactly as before.
- **`items[].lvl`** controls nesting: `0` / `1` / `2` for bullet depth. In the `structures`
  section (the ID checklist) `lvl` is the string `"check"` instead — those items are ticked off
  in localStorage.
- **`images[].anns[]`** are the ID-trainer markers: `t` = label, `x`/`y` = **0–1 fractions** of the
  image (not pixels). `w`/`h` are the source pixel dimensions.
- **`abbrevs[]`** = `{ abbr, meaning }`. `app.js` (`abbrify`) auto-wraps every matching token in
  `<abbr title="SHORT = full form">`. So: if you introduce a new abbreviation in slide text,
  **add it to `abbrevs` too**, or it gets no tooltip. Write short forms as plain text — the
  expansion is automatic on load.

**`stains[]`** = `{ name, items: [ { lvl, html } ] }` — the "Stains at a glance" page.

## Authoring conventions in the text

- Emphasis uses `<strong>`; bullets are separate `items`, never `<ul>`/`<li>` HTML.
- Long-form, spelled-out terminology with the short form in the same sentence, e.g.
  "periodic acid–Schiff (PAS)".
- **Arrows are written as words:** there are **zero `→` characters**; the phrase "leads to"
  is used instead (125×). Keep that.
- Spelling is British-leaning but *mixed* (`tumour`, `colour`, `oedema` — but `hematoxylin` is the
  common form). Match the spelling already used in the slide you're editing; don't normalise
  the whole file.
- Inline HTML must stay valid inside a JSON string (escape `"` as `\"`, keep `&amp;` entities).

## Cache-busting (bump these when you ship assets)

- `IMG_V` in `app.js` (currently `"260928b"`) → bump after **replacing** a plate image.
- `?v=...` on the `<link>`/`<script>` tags in `index.html` (currently `261007a`) → bump after
  changing `app.css` / `app.js` / `data.js` / `cc.js`.

## Verify before finishing — all three must pass

```bash
# 1. data.js is still valid JSON after your edit
python3 -c "import json;raw=open('data.js',encoding='utf-8').read();json.loads(raw[raw.index('{'):raw.rindex('}')+1]);print('data.js OK')"

# 2. every referenced image exists in img/ (must print NOTHING)
grep -h -o -E "[A-Za-z0-9_.-]+\.(jpg|jpeg|png|webp)" data.js cc.js app.js | sort -u > /tmp/refs.txt
ls img | sort > /tmp/disk.txt; comm -3 /tmp/refs.txt /tmp/disk.txt

# 3. serve it and click through
python3 -m http.server 8080        # http://localhost:8080
#   app/assets 200, plates 200 under /img/..., a slide tab renders, lightbox zooms
```

Also sanity-check that `netlify.toml` still parses as TOML if you touch it.

## Look (cinematic theme)

The visual theme is the last block of `app.css` ("CINEMATIC THEME"): it redefines the colour/type
tokens (near-black, acid-lime `--vio` accent, Inter Tight / Inter / JetBrains Mono) and restyles
components on top of the older rules above it. Text on accent fills uses `--on-acc` (dark). Heroes are
always dark and show a plate behind the title (`.hero-media`); new visitors default to dark.

## Motion

Animations live at the end of `app.css` ("motion & polish") plus small helpers in `app.js`
(`reveal`, `burst`, `countUp`, `moveInd`, `settleImgs`). Every one is skipped under
`prefers-reduced-motion` (JS checks `RM.matches`; CSS has a global reduced-motion override), and
scroll-reveal only adds its hiding class from JS, so content is never hidden if it doesn't run.
Keep new motion on `transform`/`opacity` so it stays smooth on phones.

## External dependencies (intentionally not in the repo)

- **Google Fonts** — Fraunces, Plus Jakarta Sans, Caveat, loaded from `fonts.googleapis.com`
  in `index.html`. System fonts are the offline fallback.
- **CaseCenter** — the "High-res ↗" buttons open `histopractice.med.unideb.hu` in a new tab and
  require a university login. Only the links live in `cc.js`.

## User state (don't break existing progress)

Reviewed slides, ID checklists, theme, layout, the study-notes detail level (`detail`: `key`/`full`)
the last study tab (`studyTab`) and the last opened slide (`last`, for "Continue") are stored in `localStorage` under the key
`histo_atlas_v1`. If you change the shape of `state`, migrate it rather than resetting it —
students have real checklist progress in there.
