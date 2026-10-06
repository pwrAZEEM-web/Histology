# HistoAtlas — the 57 histology slides

A single-page static study atlas for the **Histology III oral exam** (University of Debrecen):
all **57 exam slides**, each with what it is, how to spot it, theoretical background, mechanisms,
histological appearance, embryology, an interactive ID checklist, staining notes, and the labeled
handout plates with click-to-identify markers.

**Live site:** https://histo-atlas.netlify.app/

## Repository layout

```
index.html      the app shell (sidebar, search, lightbox, bottom nav)
app.css         all styling (light/dark theme, phone/desktop layouts)
app.js          the app: routing, rendering, ID trainer, lightbox
data.js         ALL slide content (46 tabs) + stains + abbreviations  (~1 MB)
cc.js           CaseCenter high-res slide links (University of Debrecen server)
img/            the 166 handout plate images (labeled plates + zoom/pan sources)
netlify.toml    deploy settings (publish dir, cache headers, redirects)
```

`app.js` builds image URLs as `"img/" + file` — so every plate **must** stay inside `img/`.
There are no runtime dependencies to install and no build step: it is plain HTML/CSS/JS.

## Run it locally

Any static file server works, for example:

```bash
python3 -m http.server 8080      # then open http://localhost:8080
```

Opening `index.html` directly from disk also works (all content is loaded from local files).

## Deploy

The repo is deploy-ready as-is.

- **Netlify via Git:** connect this repository, build command *empty*, publish directory `.`
  (already declared in `netlify.toml`).
- **Netlify Drop:** drag the whole repository folder onto https://app.netlify.com/drop
- **Any other host:** upload the folder as static files — no server-side code is required.

## Editing content

- **Slide text, checklists, plate captions & marker coordinates** → `data.js`
  (`window.HISTO.slides[].sections`, `images[].anns`).
- **High-res CaseCenter links** → `cc.js` (`window.HISTO_CC.slides`). The file header documents
  the format. Never put a username/password in there — it is public.
- **App behaviour / styling** → `app.js`, `app.css`.
- **Replacing a plate image:** keep the same filename, or update `file` in `data.js`, then bump the
  cache-bust stamps (`IMG_V` in `app.js`, `?v=` on the `<link>`/`<script>` tags in `index.html`).

## External dependencies (not stored in this repo)

- **Google Fonts** — Fraunces, Plus Jakarta Sans and Caveat are loaded from
  `fonts.googleapis.com`; without internet the site falls back to system fonts.
- **CaseCenter high-res slides** — the "High-res ↗" buttons link to
  `histopractice.med.unideb.hu`, which needs a university login. The links live in `cc.js`;
  the slides themselves stay on the university server.

## Notes

- Progress (reviewed slides, ID checklists, theme, layout) is stored in the browser's
  `localStorage` under `histo_atlas_v1` — nothing is sent anywhere.
- `index.html` no longer contains Netlify's injected `/.netlify/scripts/hud` tags; Netlify adds
  those at serve time by itself.
