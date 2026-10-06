/* HistoAtlas app */
(function () {
  const D = window.HISTO;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const IMG_V = "260928b";  // cache-bust stamp for plate images
  const imgSrc = (f) => "img/" + f + "?v=" + IMG_V;
  const esc = (t) => String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ---------- CaseCenter (Unideb) high-res link layer ---------- */
  const CC = window.HISTO_CC || {};
  const ccCfg = (id) => (CC.slides || {})[id] || null;
  const ccClean = (u) => (u || []).filter((x) => typeof x === "string" && x.trim() !== "");
  const ccNorm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/<[^>]+>/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
  function ccFind(id, target, loose) {
    const cfg = ccCfg(id);
    if (!cfg || !cfg.spots || !target) return [];
    const t = ccNorm(target);
    return cfg.spots.filter((sp) => {
      const n = ccNorm(sp.text);
      if (!n || !ccClean(sp.urls).length) return false;
      return loose ? (t.includes(n) || n.includes(t)) : t.includes(n);
    });
  }
  const ccExHtml = (spots) => spots.map((sp) => {
    const us = ccClean(sp.urls);
    return us.map((u, k) => `<a class="cc-x" href="${esc(u)}" target="_blank" rel="noopener noreferrer" title="Open high-res example in CaseCenter — new tab">${us.length > 1 ? k + 1 + " ↗" : "↗"}</a>`).join("");
  }).join("");

  /* ---------- icons ---------- */
  const I = {
    scope: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>',
    search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    eye: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    book: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15A2.5 2.5 0 0 0 6.5 22H20v-2.5"/></svg>',
    gear: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h0a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h0a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v0a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"/></svg>',
    lens: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>',
    dna: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 3c0 6 14 6 14 12M19 3c0 6-14 6-14 12M5 21c0-3 3.5-4.5 7-4.5s7 1.5 7 4.5"/><path d="M7 7h10M7 13h10"/></svg>',
    check: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
    checkS: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
    drop: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.7s6.5 7 6.5 11.3a6.5 6.5 0 0 1-13 0C5.5 9.7 12 2.7 12 2.7Z"/></svg>',
    cam: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8a2 2 0 0 1 2-2h2l2-2.5h6L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    note: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M15 3v5h5M9 13h6M9 17h4"/></svg>',
    hour: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 22h14M5 2h14"/><path d="M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22"/><path d="M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4A2 2 0 0 0 17 6.2V2"/></svg>',
    chev: '<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m9 5 7 7-7 7"/></svg>',
    sun: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    arrl: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M19 12H5m7-7-7 7 7 7"/></svg>',
    arrr: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>',
    menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    target: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
  };

  /* ---------- state ---------- */
  const LS = "histo_atlas_v1";
  const _saved = (() => { try { return JSON.parse(localStorage.getItem(LS) || "null"); } catch (e) { return null; } })();
  let state = Object.assign({ reviewed: {}, checks: {}, theme: null, view: "auto", detail: "key", studyTab: null, last: null }, _saved || {});
  if (!state.theme) state.theme = (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  const save = () => localStorage.setItem(LS, JSON.stringify(state));
  document.documentElement.dataset.theme = state.theme;

  const SEC_META = {
    background: { t: "Theoretical background & location", i: I.book, c: "var(--vio)", bg: "var(--vio-soft)" },
    howitworks: { t: "How it works – processes & mechanisms", i: I.gear, c: "var(--teal)", bg: "var(--teal-soft)" },
    appearance: { t: "Histological appearance", i: I.lens, c: "var(--eos)", bg: "var(--eos-soft2)" },
    embryology: { t: "Embryology", i: I.dna, c: "var(--amber)", bg: "var(--amber-soft)" },
    structures: { t: "Structures to identify", i: I.check, c: "var(--ok)", bg: "var(--ok-soft)" },
    staining: { t: "Staining note", i: I.drop, c: "var(--vio)", bg: "var(--vio-soft)" },
  };

  /* ---------- inline abbreviation expansion (full form everywhere) ---------- */
  const ABB = {};
  (D.abbrevs || []).forEach((a) => { ABB[a.abbr] = a.meaning; });
  const TOK = /[A-Za-z][A-Za-z0-9\u2080-\u2089\u207A\u207B\u00B2\u00B3\u00B9\u03B2]*(?:[-\u2013][A-Za-z0-9\u2080-\u2089\u207A\u207B\u00B2\u00B3\u00B9\u03B2]+)*/g;
  function abbrify(html) {
    return String(html).split(/(<[^>]+>)/).map((seg) => {
      if (seg.charCodeAt(0) === 60) return seg;
      return seg.replace(TOK, (m) => {
        const full = ABB[m];
        if (!full) return m;
        const f = full.replace(/"/g, "'");
        return `<abbr class="ab" title="${m} = ${f}" data-t="${m}" data-f="${f}">${m}</abbr>`;
      });
    }).join("");
  }
  D.slides.forEach((s) => {
    if (s.whatitis) s.whatitis = abbrify(s.whatitis);
    s.spot = (s.spot || []).map(abbrify);
    s.sections.forEach((sec) => sec.items.forEach((it) => { it.html = abbrify(it.html); }));
  });
  (D.stains || []).forEach((st) => st.items.forEach((it) => { it.html = abbrify(it.html); }));

  const byId = {};
  D.slides.forEach((s) => (byId[s.id] = s));
  const order = D.slides.map((s) => s.id);

  /* ---------- helpers ---------- */
  function bullets(items, cls) {
    if (!items || !items.length) return "";
    return '<ul class="blist ' + (cls || "") + '">' + items.map((it) => {
      const lvl = it.lvl === 1 ? "l1" : it.lvl === 2 ? "l2" : "";
      const proc = /^Then /i.test(it.html.replace(/<[^>]+>/g, "")) ? " proc" : "";
      return `<li class="${lvl}${proc}">${it.html}</li>`;
    }).join("") + "</ul>";
  }

  /* ---------- motion helpers (all skipped under prefers-reduced-motion) ---------- */
  const RM = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function countUp(el) {
    const to = +el.dataset.to, t0 = performance.now(), dur = 950;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = "0";
    requestAnimationFrame(step);
  }
  const revealIO = "IntersectionObserver" in window ? new IntersectionObserver((es) => {
    let k = 0;
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.style.setProperty("--rd", Math.min(k++, 7) * 55 + "ms");
      el.classList.add("in");
      revealIO.unobserve(el);
      $$("[data-to]", el).forEach(countUp);
    });
  }, { rootMargin: "0px 0px -5% 0px" }) : null;
  // fade/slide sections in as they scroll into view
  function reveal(root) {
    if (!revealIO || RM.matches) return;
    $$(".sect, .quick > .qcard, .home-how, .grid2 > .qcard, .tile, .syscard, .gal > .fig", root).forEach((el) => {
      el.classList.add("rv"); revealIO.observe(el);
    });
  }
  // plates fade in once decoded instead of popping in
  function settleImgs(root) {
    $$(".fig img", root).forEach((im) => {
      const done = () => { im.classList.add("ok"); im.parentElement.classList.add("ok"); };
      if (im.complete && im.naturalWidth) done();
      else { im.addEventListener("load", done, { once: true }); im.addEventListener("error", done, { once: true }); }
    });
  }
  // small confetti burst from an element (checklist complete, slide reviewed)
  function burst(el) {
    if (RM.matches || !el) return;
    const r = el.getBoundingClientRect(), box = document.createElement("div");
    box.className = "burst";
    box.style.left = r.left + r.width / 2 + "px"; box.style.top = r.top + r.height / 2 + "px";
    const cols = ["var(--vio)", "var(--eos)", "var(--amber)", "var(--ok)"];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("i"), a = (i / 18) * Math.PI * 2 + Math.random() * 0.35, d = 36 + Math.random() * 38;
      s.style.setProperty("--x", Math.cos(a) * d + "px"); s.style.setProperty("--y", Math.sin(a) * d + "px");
      s.style.setProperty("--r", Math.round(Math.random() * 360) + "deg");
      s.style.background = cols[i % cols.length];
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 950);
  }
  function popRow(el) { if (!el) return; el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
  // sliding underline under the active study tab
  function moveInd(tabs) {
    const on = $(".stab.on", tabs), ind = $(".sind", tabs);
    if (!on || !ind) return;
    ind.style.width = on.offsetWidth + "px";
    ind.style.transform = `translateX(${on.offsetLeft}px)`;
    ind.style.setProperty("--k", on.style.getPropertyValue("--k"));
  }
  function initInds(root) {
    $$(".stabs", root).forEach((t) => {
      moveInd(t);
      requestAnimationFrame(() => t.classList.add("ready"));
    });
  }
  window.addEventListener("resize", () => $$(".stabs").forEach(moveInd));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => $$(".stabs").forEach(moveInd));

  /* ---------- study notes: headline points, details one tap away ---------- */
  const STUDY = ["background", "howitworks", "appearance", "embryology", "staining"];
  const STUDY_TAB = { background: "Theory", howitworks: "Processes", appearance: "Appearance", embryology: "Embryology", staining: "Staining" };
  const STUDY_SUB = {
    background: "Location, structure & function the examiner expects",
    howitworks: "Step-by-step mechanisms behind every term",
    appearance: "What you actually see through the oculars",
    embryology: "Origins, timing & clinical correlates",
    staining: "Why the colours look the way they look",
  };
  const plain = (h) => String(h).replace(/<[^>]+>/g, "");
  const isThen = (h) => /^Then /i.test(plain(h));
  // wrap a short "Term:" opener in a span so topics can be scanned by eye (text unchanged)
  function leadify(html) {
    let txt = 0, depth = 0, i = 0;
    for (; i < html.length; i++) {
      const c = html[i];
      if (c === "<") { const j = html.indexOf(">", i); if (j < 0) return html; i = j; continue; }
      if (c === "(") depth++;
      else if (c === ")") depth--;
      else if (c === ":" && depth <= 0) break;
      if (++txt > 48) return html;
    }
    if (i >= html.length || txt < 3 || !/^(\s|<|$)/.test(html.slice(i + 1))) return html;
    let end = i + 1;
    while (html.startsWith("</", end)) end = html.indexOf(">", end) + 1;
    const head = html.slice(0, end);
    const opened = (head.match(/<[a-z][^>]*>/gi) || []).length, closed = (head.match(/<\/[^>]+>/g) || []).length;
    if (opened !== closed) return html;
    return `<span class="lead">${head}</span>${html.slice(end)}`;
  }
  const thenify = (html) => html.replace(/^Then /, '<span class="then">Then </span>');
  function toPoints(items) {
    const pts = [];
    items.forEach((it) => {
      if (it.lvl === 0 || !pts.length) pts.push({ head: it, kids: [] });
      else pts[pts.length - 1].kids.push(it);
    });
    return pts;
  }
  function detailHtml(kids) {
    let h = "", i = 0;
    while (i < kids.length) {
      const it = kids[i];
      if (isThen(it.html)) {
        const lv = it.lvl;
        const run = [];
        while (i < kids.length && ((kids[i].lvl === lv && isThen(kids[i].html)) || (run.length && kids[i].lvl > lv))) {
          if (kids[i].lvl > lv) run[run.length - 1].sub.push(kids[i]);
          else run.push({ it: kids[i], sub: [] });
          i++;
        }
        h += `<ol class="flow${lv === 2 ? " l2" : ""}">` + run.map((r) =>
          `<li>${thenify(r.it.html)}${r.sub.map((x) => `<div class="dt l2">${leadify(x.html)}</div>`).join("")}</li>`).join("") + "</ol>";
        continue;
      }
      h += `<div class="dt${it.lvl === 2 ? " l2" : ""}">${leadify(it.html)}</div>`;
      i++;
    }
    return h;
  }
  function pointsHtml(items) {
    return '<div class="pts">' + toPoints(items).map((p) => {
      const n = p.kids.length;
      const proc = isThen(p.head.html) ? " proc" : "";
      return `<div class="pt${n ? " has-d" : ""}${proc}">
        <div class="pt-h"${n ? ' role="button" tabindex="0" aria-expanded="false"' : ""}><span class="pt-tx">${proc ? thenify(p.head.html) : leadify(p.head.html)}</span>${n ? `<span class="pt-more" title="Show the ${n} detail${n > 1 ? "s" : ""}">${n} ${I.chev}</span>` : ""}</div>
        ${n ? `<div class="pt-d"><div class="pt-in"><div class="pt-pad">${detailHtml(p.kids)}</div></div></div>` : ""}</div>`;
    }).join("") + "</div>";
  }
  const nPoints = (items) => items.filter((it, i) => it.lvl === 0 || i === 0).length;
  const dmodeHtml = () => `<div class="dmode" role="group" aria-label="Detail level" data-on="${state.detail === "full" ? "full" : "key"}">
      <button data-d="key" class="${state.detail === "full" ? "" : "on"}" title="Headlines only — tap a point to open its details">Key points</button>
      <button data-d="full" class="${state.detail === "full" ? "on" : ""}" title="Every detail open">Full detail</button></div>`;
  function applyDetail() {
    const full = state.detail === "full";
    $$(".dscope").forEach((el) => el.classList.toggle("full", full));
    $$(".dmode button").forEach((b) => b.classList.toggle("on", b.dataset.d === (full ? "full" : "key")));
    $$(".dmode").forEach((d) => { d.dataset.on = full ? "full" : "key"; });
    if (!full) $$(".pt.open").forEach((p) => { p.classList.remove("open"); $(".pt-h", p).setAttribute("aria-expanded", "false"); });
  }
  function wireDmode(root) {
    $$(".dmode button", root).forEach((b) => b.addEventListener("click", () => {
      if (state.detail === b.dataset.d) return;
      state.detail = b.dataset.d; save(); applyDetail();
      toast(state.detail === "full" ? "Showing every detail" : "Showing key points — tap a point for its details");
    }));
  }
  function togglePoint(h) {
    if (h.closest(".dscope.full")) return;
    const p = h.parentElement;
    const open = p.classList.toggle("open");
    h.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function studyCard(secs) {
    const keys = STUDY.filter((k) => secs.some((x) => x.key === k));
    if (!keys.length) return "";
    const cur = keys.includes(state.studyTab) ? state.studyTab : keys[0];
    let h = `<section class="sect study dscope${state.detail === "full" ? " full" : ""}" id="q-study"><header>
        <span class="ico" style="background:var(--vio-soft);color:var(--vio)">${I.book}</span>
        <div><h3>Study notes</h3><div class="sub">One topic at a time — headlines first, tap any point for its details</div></div>
        ${dmodeHtml()}</header>
      <div class="stabs" role="tablist">` + keys.map((k) => {
        const n = secs.filter((x) => x.key === k).reduce((a, g) => a + nPoints(g.items), 0);
        return `<button class="stab${k === cur ? " on" : ""}" role="tab" aria-selected="${k === cur}" data-k="${k}" style="--k:${SEC_META[k].c}">${STUDY_TAB[k]}<span class="n">${n}</span></button>`;
      }).join("") + `<span class="sind" aria-hidden="true"></span></div>`;
    keys.forEach((k) => {
      const gs = secs.filter((x) => x.key === k);
      const nTot = gs.reduce((a, g) => a + g.items.length, 0), nPt = gs.reduce((a, g) => a + nPoints(g.items), 0);
      h += `<div class="spanel" role="tabpanel" data-k="${k}"${k === cur ? "" : " hidden"}>
        <div class="spanel-h" style="--k:${SEC_META[k].c}"><b>${SEC_META[k].t}</b> <span>${STUDY_SUB[k]} · ${nPt} point${nPt > 1 ? "s" : ""}${nTot > nPt ? `, ${nTot - nPt} details` : ""}</span></div>`;
      gs.forEach((g) => {
        const pm = g.label.match(/\((.+)\)\s*$/);
        const lbl = k === "appearance" && pm ? pm[1] : "";
        h += `<div class="appearance-block">${lbl ? `<h5>${esc(lbl)}</h5>` : ""}${pointsHtml(g.items)}</div>`;
      });
      h += `</div>`;
    });
    return h + `</section>`;
  }
  function wireStudy(root) {
    $$(".stab", root).forEach((b) => b.addEventListener("click", () => {
      const card = b.closest(".study");
      state.studyTab = b.dataset.k; save();
      $$(".stab", card).forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-selected", on); });
      $$(".spanel", card).forEach((p) => { p.hidden = p.dataset.k !== b.dataset.k; });
      moveInd($(".stabs", card));
      if (card.getBoundingClientRect().top < 60) card.scrollIntoView({ block: "start" });
    }));
    initInds(root);
    wireDmode(root);
  }
  document.addEventListener("click", (e) => {
    const h = e.target.closest && e.target.closest(".pt.has-d > .pt-h");
    if (h && !e.target.closest("abbr,a")) togglePoint(h);
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches(".pt.has-d > .pt-h")) { e.preventDefault(); togglePoint(e.target); }
  });

  function stainOf(title) {
    const m = title.match(/\(([^)]*)\)\s*$/);
    return m ? m[1] : "";
  }
  function progress() {
    const rev = order.filter((id) => state.reviewed[id]).length;
    return { rev, tot: order.length };
  }

  /* ---------- sidebar ---------- */
  function renderSidebar() {
    const sb = $("#sidebar");
    const p = progress();
    let html = `<div class="prog"><div class="t"><span>Revision progress</span><b>${p.rev} / ${p.tot} reviewed</b></div>
      <div class="pbar"><i style="width:${(p.rev / p.tot) * 100}%"></i></div></div>`;
    html += `<button class="nav-item" data-route="home"><span class="num">⌂</span><span><span class="tt">Start here</span><span class="st">How to use this atlas</span></span></button>`;
    html += `<button class="nav-item" data-route="stains"><span class="num">★</span><span><span class="tt">Stains at a glance</span><span class="st">The 10 stain families used</span></span></button>`;

    let lastSys = null;
    D.slides.forEach((s) => {
      if (s.system !== lastSys) {
        html += `<button class="sys-head" data-route="system" data-sys="${esc(s.system)}" title="Study this whole system">${esc(s.system)}</button>`;
        lastSys = s.system;
      }
      const chk = state.checks[s.id];
      const nChk = chk ? chk.filter(Boolean).length : 0;
      const nTot = (s.sections.find((x) => x.key === "structures") || { items: [] }).items.length;
      html += `<button class="nav-item" data-route="slide" data-id="${s.id}">
        <span class="num">${s.label}</span>
        <span style="min-width:0">
          <span class="tt">${esc(s.title)}</span>
          <span class="tags">
            ${s.images.length ? `<span class="mini-tag img">${s.images.length} img</span>` : `<span class="mini-tag img">0 img</span>`}
            ${state.reviewed[s.id] ? `<span class="mini-tag done">reviewed</span>` : ""}
            ${nTot && nChk === nTot ? `<span class="mini-tag done">ID ✓</span>` : ""}
          </span>
        </span></button>`;
    });
    sb.innerHTML = html;
    const navGo = (r, id, sys) => {
      location.hash = r === "slide" ? "#/slide/" + id
        : r === "system" ? "#/system/" + encodeURIComponent(sys)
        : "#/" + r;
      closeDrawer();
    };
    $$(".nav-item", sb).forEach((b) => b.addEventListener("click", () => { SYS_CTX = null; navGo(b.dataset.route, b.dataset.id); }));
    $$(".sys-head", sb).forEach((b) => b.addEventListener("click", () => navGo(b.dataset.route, null, b.dataset.sys)));
  }

  let SYS_CTX = null;

  function markActive(route, id) {
    $$("#sidebar .nav-item").forEach((b) => b.classList.toggle("active",
      b.dataset.route === route && (route !== "slide" || b.dataset.id === id)));
    $$("#sidebar .sys-head").forEach((b) => b.classList.toggle("active", (route === "system" && b.dataset.sys === id) || (route === "slide" && SYS_CTX && b.dataset.sys === SYS_CTX)));
    const act = $("#sidebar .nav-item.active");
    if (act && document.documentElement.dataset.layout !== "phone") {
      const sb = $("#sidebar"), r = act.getBoundingClientRect(), sr = sb.getBoundingClientRect();
      if (r.top < sr.top + 40 || r.bottom > sr.bottom - 20) sb.scrollTop += r.top - sr.top - sr.height / 3;
    }
    const bn = (route === "slide" || route === "system") ? "slides" : route;
    $$("#botnav button").forEach((b) => b.classList.toggle("on", b.dataset.r === bn));
  }

  /* ---------- slide view ---------- */
  function renderSlide(id) {
    const s = byId[id];
    if (!s) return renderHome();
    if (state.last !== id) { state.last = id; save(); }
    const idx = order.indexOf(id);
    let prev = idx > 0 ? byId[order[idx - 1]] : null;
    let next = idx < order.length - 1 ? byId[order[idx + 1]] : null;
    const sysList = SYS_CTX ? D.slides.filter((x) => x.system === SYS_CTX) : [];
    const si = sysList.findIndex((x) => String(x.id) === String(id));
    const inSys = si >= 0;
    const sysName = inSys ? SYS_CTX : null;
    if (inSys) {
      prev = si > 0 ? sysList[si - 1] : null;
      next = si < sysList.length - 1 ? sysList[si + 1] : null;
    } else if (SYS_CTX) SYS_CTX = null;
    const st = stainOf(s.title);
    const secs = s.sections;
    const groups = (key) => secs.filter((x) => x.key === key);

    let pills = `<a class="pill" href="#q-quick">Quick look</a>`;
    pills += `<a class="pill" href="#q-imgs">Labeled images${s.images.length ? " (" + s.images.length + ")" : ""}</a>`;
    const annImgs = s.images.map((im, ix) => ({ im, ix })).filter((o) => o.im.anns && o.im.anns.length);
    if (annImgs.length) pills += `<a class="pill primary" href="#q-id">ID trainer (${annImgs.reduce((a, o) => a + o.im.anns.length, 0)})</a>`;
    const cc = ccCfg(id);
    if (cc && (cc.url || ccClean(cc.spots && cc.spots.reduce((a, sp) => a.concat(ccClean(sp.urls)), [])).length)) pills += `<a class="pill cc" href="#q-cc">High-res ↗</a>`;
    if (STUDY.some((k) => groups(k).length)) pills += `<a class="pill" href="#q-study">Study notes</a>`;
    if (groups("structures").length) pills += `<a class="pill" href="#q-structures">ID checklist</a>`;
    if (s.notes.length) pills += `<a class="pill" href="#q-notes">Handout notes</a>`;

    let h = `<div class="wrap">
      <div class="hero">
        <div class="ghnum">${s.label}</div>
        <div class="kick">Slide ${s.label} of 57 · ${esc(s.system)}</div>
        <h2>${esc(s.title)}</h2>
        <div class="chips">
          <span class="chip vio">ID ${s.label}</span>
          ${st ? `<span class="chip eos">${esc(st)}</span>` : ""}
          <span class="chip teal">${s.images.length} labeled handout image${s.images.length > 1 ? "s" : ""}</span>
          ${s.notes.length ? `<span class="chip">handout theory included</span>` : ""}
        </div>
        <div class="acts">
          <button class="btn ${state.reviewed[id] ? "on" : "primary"}" id="rev-btn">${I.check} ${state.reviewed[id] ? "Reviewed — tap to undo" : "Mark as reviewed"}</button>
          ${prev ? `<button class="btn ghost" id="p-prev">${I.arrl} Previous</button>` : ""}
          ${next ? `<button class="btn ghost" id="p-next">Next ${I.arrr}</button>` : ""}
          ${sysName ? `<button class="btn ghost sysb" id="p-sysback" title="Back to ${esc(sysName)}">${I.arrl} System</button>` : ""}
          ${cc && cc.url ? `<button class="btn ghost" id="cc-open">${I.scope} CaseCenter ↗</button>` : ""}
        </div>
      </div>

      <div class="quick" id="q-quick">
        <div class="qcard"><h4><span class="dot" style="background:var(--vio)"></span>What it is</h4><p>${s.whatitis || ""}</p></div>
        <div class="qcard"><h4><span class="dot" style="background:var(--eos)"></span>Spot it by</h4>
          <ul class="spot">${(s.spot || []).map((x) => `<li>${I.target}<span>${x}</span></li>`).join("")}</ul></div>
      </div>

      <nav class="pills" id="pills">${pills}</nav>`;

    /* high-res CaseCenter section */
    if (cc) {
      const ccSpots = (cc.spots || []).filter((sp) => ccClean(sp.urls).length);
      if (cc.url || ccSpots.length) {
        h += `<section class="sect cc-sect" id="q-cc"><header>
          <span class="ico" style="background:var(--teal-soft);color:var(--teal)">${I.scope}</span>
          <div><h3>High-res slide · CaseCenter</h3><div class="sub">Whole-slide scanner image from the University of Debrecen CaseCenter — opens in a new tab (one login may be asked)</div></div>
          ${ccSpots.length ? `<span class="cnt">${ccSpots.reduce((a, sp) => a + ccClean(sp.urls).length, 0)} example link${ccSpots.reduce((a, sp) => a + ccClean(sp.urls).length, 0) > 1 ? "s" : ""}</span>` : ""}</header>`;
        if (cc.url) h += `<div class="cc-main"><button class="btn primary" id="cc-open2">${I.scope} Open this slide in CaseCenter ↗</button></div>`;
        if (ccSpots.length) h += `<div class="cc-spotlist">` + ccSpots.map((sp) =>
          `<div class="cc-spot"><span class="cc-st">${esc(sp.text)}</span><span class="cc-links">${ccExHtml([sp])}</span></div>`).join("") + `</div>`;
        h += `</section>`;
      }
    }

    /* ID trainer */
    if (annImgs.length) {
      h += `<section class="sect" id="q-id"><header>
        <span class="ico" style="background:var(--eos-soft);color:var(--eos)">${I.target}</span>
        <div><h3>ID trainer</h3><div class="sub">Tap a structure — the plate opens zoomed straight to it, ring on the spot</div></div>
        <span class="cnt">${annImgs.reduce((a, o) => a + o.im.anns.length, 0)} structures</span></header>`;
      annImgs.forEach((o) => {
        h += `<div class="appearance-block"><h5>${esc(o.im.caption)} · ${esc(o.im.technique)}</h5>
          <div class="labels">${o.im.anns.map((a, ai) => {
            const ex = ccExHtml(ccFind(id, a.t, true));
            return `<span class="lb idchip" data-g="${id}" data-i="${o.ix}" data-a="${ai}">${esc(a.t)}${ex ? `<span class="cc-mini">${ex}</span>` : ""}</span>`;
          }).join("")}</div></div>`;
      });
      h += `</section>`;
    }

    /* images */
    h += `<section class="sect" id="q-imgs"><header>
        <span class="ico" style="background:var(--teal-soft);color:var(--teal)">${I.cam}</span>
        <div><h3>Labeled ID images</h3><div class="sub">From the University of Debrecen handouts — click to zoom</div></div>
        <span class="cnt">${s.images.length} plates</span></header>`;
    if (s.images.length) {
      h += `<div class="gal">` + s.images.map((im, i) => `
        <figure class="fig${im.w / im.h > 1.9 ? " wide" : ""}" data-g="${id}" data-i="${i}">
          <span class="tech">${esc(im.technique)}</span>
          ${im.anns && im.anns.length ? `<span class="nid">${im.anns.length} IDs</span>` : ""}
          <img loading="lazy" src="${imgSrc(im.file)}" alt="${esc(im.caption)}"${im.w && im.h ? ` style="aspect-ratio:${im.w}/${im.h}"` : ""}>
          <figcaption class="cap"><b>${esc(im.caption)}</b></figcaption>
        </figure>`).join("") + `</div>`;
    }
    h += `</section>`;

    /* study notes: theory, processes, appearance, embryology, staining — one tab at a time */
    h += studyCard(secs);

    /* checklist */
    const stc = groups("structures");
    if (stc.length) {
      const items = stc[0].items;
      const chk = state.checks[id] || [];
      const done = items.filter((_, i) => chk[i]).length;
      h += `<section class="sect" id="q-structures"><header>
        <span class="ico" style="background:${SEC_META.structures.bg};color:${SEC_META.structures.c}">${I.check}</span>
        <div><h3>Structures to identify</h3><div class="sub">Tick them off as you can point them out on the slide</div></div>
        <span class="cnt">${done}/${items.length}</span></header>
        <div class="check-head"><div class="pbar"><i style="width:${items.length ? (done / items.length) * 100 : 0}%"></i></div>
        <span>${done} of ${items.length} identified</span>
        <button class="btn ghost" id="ck-reset" style="padding:5px 12px;font-size:11.5px">reset</button></div>
        <div id="cklist">` + items.map((it, i) => {
          const ex = ccExHtml(ccFind(id, it.html, false));
          return `
          <label class="ck"><input type="checkbox" data-i="${i}" ${chk[i] ? "checked" : ""}><span class="box">${I.checkS}</span><span class="txt">${it.html}${ex ? `<span class="cc-inline">${ex}</span>` : ""}</span></label>`;
        }).join("") + `</div></section>`;
    }

    /* handout notes */
    if (s.notes.length) {
      h += `<section class="sect" id="q-notes"><header>
        <span class="ico" style="background:var(--amber-soft);color:var(--amber)">${I.note}</span>
        <div><h3>From the handout</h3><div class="sub">Every description & label from the seminar handout pages for this slide</div></div>
        <span class="cnt">${s.notes.length} pages</span></header>`;
      s.notes.forEach((n, ni) => {
        h += `<div class="acc" data-acc="${ni}">
          <button>${I.chev}<span class="pg">p.${n.page}</span> ${n.title ? esc(n.title) : (n.kind === "image" ? "Labeled plate — description & labels" : "Handout description")}
          <span class="src">${esc(n.src)}</span></button>
          <div class="body">
            ${n.paras.map((p) => `<p>${abbrify(esc(p))}</p>`).join("")}
            ${n.labels.length ? `<div class="labels"><span class="ttl">labels on page</span>` + n.labels.map((l) => `<span class="lb">${abbrify(esc(l))}</span>`).join("") + `</div>` : ""}
          </div></div>`;
      });
      h += `</section>`;
    }

    h += `<div class="fnav">
      ${prev ? `<button class="btn" id="f-prev"><span>${I.arrl}</span><span style="text-align:left"><small>previous</small>${esc(prev.title).slice(0, 34)}</span></button>` : `<span></span>`}
      ${sysName ? `<button class="btn ghost sysb" id="f-sysback"><span>${I.arrl}</span><span style="text-align:left"><small>back to system</small>${esc(sysName).slice(0, 24)}</span></button>` : ""}
      ${next ? `<button class="btn" id="f-next"><span style="text-align:right"><small>next</small>${esc(next.title).slice(0, 34)}</span><span>${I.arrr}</span></button>` : `<span></span>`}
    </div></div>`;

    $("#main").innerHTML = h;
    markActive("slide", id);

    /* wire */
    $("#rev-btn").addEventListener("click", () => {
      state.reviewed[id] = !state.reviewed[id];
      save(); renderSidebar(); markActive("slide", id);
      const b = $("#rev-btn");
      b.classList.toggle("on", !!state.reviewed[id]);
      b.innerHTML = I.check + (state.reviewed[id] ? " Reviewed — tap to undo" : " Mark as reviewed");
      toast(state.reviewed[id] ? "Slide " + s.label + " marked as reviewed ✓" : "Review flag removed");
      if (state.reviewed[id]) { burst(b); popRow(b); }
    });
    if (prev) { $("#p-prev").addEventListener("click", () => go("slide", prev.id)); $("#f-prev").addEventListener("click", () => go("slide", prev.id)); }
    if (next) { $("#p-next").addEventListener("click", () => go("slide", next.id)); $("#f-next").addEventListener("click", () => go("slide", next.id)); }
    if (sysName) {
      const backToSys = () => { location.hash = "#/system/" + encodeURIComponent(sysName); };
      if ($("#p-sysback")) $("#p-sysback").addEventListener("click", backToSys);
      if ($("#f-sysback")) $("#f-sysback").addEventListener("click", backToSys);
    }
    $$(".fig").forEach((f) => f.addEventListener("click", () => openLB(f.dataset.g, +f.dataset.i)));
    $$(".idchip").forEach((ch) => ch.addEventListener("click", () => openLB(ch.dataset.g, +ch.dataset.i, byId[ch.dataset.g].images[+ch.dataset.i].anns[+ch.dataset.a])));
    if (cc && cc.url) {
      const openCC = () => window.open(cc.url, "_blank", "noopener");
      if ($("#cc-open")) $("#cc-open").addEventListener("click", openCC);
      if ($("#cc-open2")) $("#cc-open2").addEventListener("click", openCC);
    }
    $$(".cc-x").forEach((a) => a.addEventListener("click", (e) => e.stopPropagation()));
    if ($("#cklist")) {
      $$("#cklist input").forEach((cb) => cb.addEventListener("change", () => {
        const arr = state.checks[id] || (state.checks[id] = []);
        arr[+cb.dataset.i] = cb.checked;
        save();
        const items = stc[0].items;
        const done = items.filter((_, i) => arr[i]).length;
        $("#q-structures .cnt").textContent = done + "/" + items.length;
        $(".check-head span").textContent = done + " of " + items.length + " identified";
        $(".check-head .pbar i").style.width = (done / items.length) * 100 + "%";
        if (cb.checked) popRow(cb.closest(".ck"));
        if (cb.checked && done === items.length) { burst($("#q-structures .cnt")); toast("All " + items.length + " structures identified 🎉"); }
        renderSidebar(); markActive("slide", id);
      }));
      $("#ck-reset").addEventListener("click", () => { state.checks[id] = []; save(); renderSlide(id); });
    }
    $$(".acc > button").forEach((b) => b.addEventListener("click", () => b.parentElement.classList.toggle("open")));
    wireStudy($("#main"));
    settleImgs($("#main"));
    reveal($("#main"));
    setupSpy();
  }

  /* ---------- scroll spy ---------- */
  function setupSpy() {
    const pills = $$("#pills .pill");
    if (!pills.length) return;
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          pills.forEach((p) => p.classList.toggle("active", p.getAttribute("href") === "#" + e.target.id));
        }
      });
    }, { rootMargin: "-130px 0px -70% 0px" });
    $$("[id^=\"q-\"]").forEach((s) => obs.observe(s));
    pills.forEach((p) => p.addEventListener("click", (ev) => {
      ev.preventDefault();
      const el = $(p.getAttribute("href"));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  }

  /* ---------- home / stains / abbrev ---------- */
  function renderHome() {
    SYS_CTX = null;
    const sys = [];
    D.slides.forEach((s) => { if (!sys.includes(s.system)) sys.push(s.system); });
    const structOf = (s) => (s.sections.find((x) => x.key === "structures") || { items: [] }).items;
    const doneOf = (s) => { const c = state.checks[s.id] || []; return structOf(s).filter((_, i) => c[i]).length; };
    const nImg = D.slides.reduce((a, s) => a + s.images.length, 0);
    const nAnn = D.slides.reduce((a, s) => a + s.images.reduce((b, im) => b + (im.anns ? im.anns.length : 0), 0), 0);
    const nSt = D.slides.reduce((a, s) => a + structOf(s).length, 0);
    const nTick = D.slides.reduce((a, s) => a + doneOf(s), 0);
    const p = progress();
    const C = 2 * Math.PI * 30, frac = p.tot ? p.rev / p.tot : 0;
    const last = state.last && byId[state.last];
    $("#main").innerHTML = `<div class="wrap">
      <div class="hero home-hero">
        <div class="cells" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="kick">Oral-exam companion · Histology III</div>
        <h2>HistoAtlas — every slide, every structure,<br>every line of theory in one place</h2>
        <p style="max-width:640px;color:var(--muted);margin:4px 0 0">
          All <b>57 exam slides</b> from your notes, each with its own tab: what it is, how to spot it,
          theoretical background, mechanisms, histological appearance, embryology, an interactive ID checklist and
          staining notes — plus the <b>labeled handout plates</b> and the handouts' own theory for every topic.</p>
        <div class="acts">
          ${last ? `<button class="btn primary" onclick="location.hash='#/slide/${last.id}'">Continue · slide ${esc(last.label)} ${I.arrr}</button>
          <button class="btn" onclick="location.hash='#/slide/1'">Start from slide 1</button>`
          : `<button class="btn primary" onclick="location.hash='#/slide/1'">Start with slide 1 ${I.arrr}</button>`}
          <button class="btn" onclick="location.hash='#/stains'">★ Stains at a glance</button>
          <button class="btn ghost" onclick="var e=document.getElementById('syscards'); if(e) e.scrollIntoView({behavior:'smooth',block:'start'})">Study by system ↓</button>
        </div>
      </div>
      <div class="stat-tiles">
        <div class="tile"><div class="n" data-to="57">57</div><div class="l">exam slides</div></div>
        <div class="tile"><div class="n" data-to="${nImg}">${nImg}</div><div class="l">labeled plates</div></div>
        <div class="tile"><div class="n" data-to="${nAnn}">${nAnn}</div><div class="l">ID-trainer markers</div></div>
        <div class="tile"><div class="n" data-to="${sys.length}">${sys.length}</div><div class="l">body systems</div></div>
        <div class="tile progt">
          <svg class="ring" viewBox="0 0 72 72" style="--c:${C.toFixed(1)};--off:${(C * (1 - frac)).toFixed(1)}"><circle class="bg" cx="36" cy="36" r="30"/><circle class="fg" cx="36" cy="36" r="30"/></svg>
          <div><div class="n"><span data-to="${p.rev}">${p.rev}</span><small> / ${p.tot}</small></div><div class="l">slides reviewed</div>
          <div class="sub2">${nTick} of ${nSt} structures ticked</div></div>
        </div>
      </div>
      <div class="home-how">
        <div class="qcard"><h4><span class="dot" style="background:var(--vio)"></span>How each tab is built</h4>
          <ul class="spot">
            <li>${I.target}<span><b>Quick look</b> — one-sentence “what it is” + the three things that let you spot it.</span></li>
            <li>${I.cam}<span><b>Labeled ID images</b> — the handout plates with their labels burnt in; click any plate to zoom & pan.</span></li>
            <li>${I.book}<span><b>Theory → staining</b> — background, mechanisms, appearance per stain, embryology, staining note, exactly as in your notes.</span></li>
            <li>${I.check}<span><b>ID checklist</b> — tick structures off; progress is saved on this device.</span></li>
            <li>${I.note}<span><b>From the handout</b> — the seminar handout's own descriptions and label vocabulary, page by page.</span></li>
          </ul></div>
      </div>
      <div class="sect" style="margin-top:18px"><header>
        <span class="ico" style="background:var(--vio-soft);color:var(--vio)">${I.scope}</span>
        <div><h3>Study a whole system</h3><div class="sub">New mode — one page per body system: every slide side-by-side, one master ID checklist, all high-res links. (Topic-by-topic tabs stay exactly as they are.)</div></div>
        <span class="cnt">${sys.length} systems</span></header>
        <div class="syscards" id="syscards">${sys.map((sy) => {
          const sl = D.slides.filter((s2) => s2.system === sy);
          const nst = sl.reduce((a, s2) => a + structOf(s2).length, 0);
          const nd = sl.reduce((a, s2) => a + doneOf(s2), 0);
          return `<button class="syscard" data-sys="${esc(sy)}">
            <span class="sc-top"><span class="sc-n">${sl.length}</span><span class="sc-l">slide${sl.length > 1 ? "s" : ""}</span></span>
            <b>${esc(sy)}</b>
            <span class="sc-m">${nst} structures to identify${nd ? ` · ${nd} done` : ""}</span>
            <span class="sc-bar"><i style="width:${nst ? (nd / nst) * 100 : 0}%"></i></span>
            <span class="sc-go">Study this system ${I.arrr}</span></button>`;
        }).join("")}</div></div>
    </div>`;
    $$("#syscards .syscard").forEach((b) => b.addEventListener("click", () => {
      location.hash = "#/system/" + encodeURIComponent(b.dataset.sys);
    }));
    reveal($("#main"));
    markActive("home");
  }

  function renderStains() {
    SYS_CTX = null;
    $("#main").innerHTML = `<div class="wrap">
      <div class="page-head"><h2>★ Stains used on the 57 slides</h2>
      <p>Read this first — every colour you see has a chemical reason.</p></div>
      <div class="grid2">${D.stains.map((st) => `
        <div class="qcard"><h4><span class="dot" style="background:var(--eos)"></span>${esc(st.name)}</h4>
        ${bullets(st.items)}</div>`).join("")}</div></div>`;
    reveal($("#main"));
    markActive("stains");
  }

  /* ---------- lightbox ---------- */
  let lb = { g: null, i: 0, scale: 1, x: 0, y: 0, ann: null, w: 0, h: 0 };
  let annT;
  function markerOn(on) { $("#lb-marker").classList.toggle("on", on); $("#lb-mlabel").classList.toggle("on", on); }
  function openLB(g, i, ann) {
    lb = { g, i, scale: 1, x: 0, y: 0, ann: ann || null, w: 0, h: 0 };
    const im = byId[g].images[i];
    const img = $("#lb-img"), w = $("#lb-wrap");
    clearTimeout(annT); markerOn(false);
    w.classList.add("snap"); applyLB();
    // once the plate is laid out, glide from the full view to the structure
    img.onload = () => {
      lb.w = w.offsetWidth; lb.h = w.offsetHeight;
      requestAnimationFrame(() => {
        w.classList.remove("snap");
        if (lb.ann) annT = setTimeout(placeAnn, RM.matches ? 0 : 160); else applyLB();
      });
    };
    img.src = imgSrc(im.file);
    setLBCap();
    $("#lb-prev").style.display = $("#lb-next").style.display = "";
    $("#lb").classList.remove("closing");
    $("#lb").classList.add("open");
    if (img.complete && img.naturalWidth) img.onload();
  }
  function showImg(src, capHtml) {
    lb = { g: null, i: 0, scale: 1, x: 0, y: 0, ann: null, w: 0, h: 0, single: src };
    const img = $("#lb-img");
    img.onload = () => { const w = $("#lb-wrap"); lb.w = w.offsetWidth; lb.h = w.offsetHeight; applyLB(); };
    img.src = src;
    $("#lb-cap").innerHTML = capHtml;
    $("#lb-prev").style.display = $("#lb-next").style.display = "none";
    $("#lb").classList.remove("closing");
    $("#lb").classList.add("open");
    applyLB();
  }
  function setLBCap() {
    if (!lb.g) return;
    const im = byId[lb.g].images[lb.i];
    const n = byId[lb.g].images.length;
    $("#lb-cap").innerHTML = `<b>${esc(im.caption)}</b> · ${esc(im.technique)} · plate ${lb.i + 1} of ${n}` +
      (lb.ann ? ` · <b style="color:var(--vio)">${esc(lb.ann.t)}</b>` : "");
  }
  function placeAnn() {
    if (!lb.ann) return;
    const w = $("#lb-wrap");
    lb.w = w.offsetWidth; lb.h = w.offsetHeight;   // layout size, unaffected by the transform
    lb.scale = 2.8;
    lb.x = (0.5 - lb.ann.x) * lb.w * lb.scale;
    lb.y = (0.5 - lb.ann.y) * lb.h * lb.scale;
    markerOn(false);
    applyLB();
    clearTimeout(annT);
    annT = setTimeout(() => markerOn(true), RM.matches ? 0 : 380);
  }
  function applyLB() {
    $("#lb-wrap").style.transform = `translate(${lb.x}px,${lb.y}px) scale(${lb.scale})`;
    const mk = $("#lb-marker"), ml = $("#lb-mlabel");
    if (lb.ann && lb.w) {
      const st = $("#lb-stage");
      const cx = st.clientWidth / 2, cy = st.clientHeight / 2;
      const ox = lb.x + (lb.ann.x - 0.5) * lb.w * lb.scale;
      const oy = lb.y + (lb.ann.y - 0.5) * lb.h * lb.scale;
      mk.style.display = "block"; ml.style.display = "block";
      mk.style.left = (cx + ox) + "px"; mk.style.top = (cy + oy) + "px";
      ml.style.left = (cx + ox) + "px"; ml.style.top = (cy + oy - 26) + "px";
      ml.textContent = lb.ann.t;
    } else { mk.style.display = "none"; ml.style.display = "none"; }
  }
  function closeLB() {
    const o = $("#lb");
    if (!o.classList.contains("open") || o.classList.contains("closing")) return;
    clearTimeout(annT);
    if (RM.matches) { o.classList.remove("open"); return; }
    o.classList.add("closing");
    setTimeout(() => o.classList.remove("open", "closing"), 180);
  }
  function lbNav(d) {
    if (!lb.g) return;
    const n = byId[lb.g].images.length;
    lb.i = (lb.i + d + n) % n;
    lb.scale = 1; lb.x = 0; lb.y = 0; lb.ann = null;
    clearTimeout(annT); markerOn(false);
    const img = $("#lb-img");
    img.onload = () => { const w = $("#lb-wrap"); lb.w = w.offsetWidth; lb.h = w.offsetHeight; applyLB(); popRow(img); };
    img.src = imgSrc(byId[lb.g].images[lb.i].file);
    setLBCap(); applyLB();
  }

  /* ---------- system study view ---------- */
  function renderSystem(sys) {
    const slides = D.slides.filter((s) => s.system === sys);
    if (!slides.length) return renderHome();
    SYS_CTX = sys;
    const structOf = (s) => (s.sections.find((x) => x.key === "structures") || { items: [] }).items;
    const sysAll = [...new Set(D.slides.map((s) => s.system))];
    const nextSys = sysAll[(sysAll.indexOf(sys) + 1) % sysAll.length];
    const nStruct = slides.reduce((a, s) => a + structOf(s).length, 0);
    const doneOf = (s) => { const c = state.checks[s.id] || []; return structOf(s).filter((_, i) => c[i]).length; };
    const nDone = slides.reduce((a, s) => a + doneOf(s), 0);
    const ccFull = (id) => ccCfg(id);
    const ccUsable = (id) => {
      const cc = ccCfg(id);
      if (!cc) return null;
      if (cc.url && cc.url.trim()) return cc;
      if ((cc.spots || []).some((sp) => ccClean(sp.urls).length)) return cc;
      return null;
    };
    const ccSlides = slides.filter((s) => ccUsable(s.id));
    const nCc = slides.reduce((a, s) => {
      const cc = ccFull(s.id); if (!cc) return a;
      return a + ((cc.url && cc.url.trim()) ? 1 : 0) + (cc.spots || []).reduce((b, sp) => b + ccClean(sp.urls).length, 0);
    }, 0);
    const first = slides[0];

    let pills = `<a class="pill" href="#q-quick">At a glance</a>
      <a class="pill" href="#q-scheck">Master ID (${nStruct})</a>` +
      (ccSlides.length ? `<a class="pill cc" href="#q-scc">High-res &#8599; (${nCc})</a>` : "") +
      `<a class="pill" href="#q-stheory">Theory</a>` +
      slides.map((s) => `<a class="pill mini" href="#q-s-${s.id}" title="${esc(s.title)}">${esc(s.label)}</a>`).join("");

    let h = `<div class="wrap">
      <div class="hero sys-hero">
        <div class="ghnum">${slides.length}</div>
        <div class="kick">System study mode &middot; ${slides.length} slide${slides.length > 1 ? "s" : ""} &middot; ${nStruct} structures &middot; ${nCc} high-res link${nCc === 1 ? "" : "s"}</div>
        <h2>${esc(sys)}</h2>
        <div class="chips">
          ${slides.map((s) => `<span class="chip vio" title="${esc(s.title)}">${esc(s.label)}</span>`).join("")}
          <span class="chip teal" id="sys-chip">${nDone}/${nStruct} identified</span>
        </div>
        <div class="acts">
          <button class="btn primary" id="sys-start">Start with slide ${esc(first.label)} &middot; ${esc(first.title).slice(0, 30)} ${I.arrr}</button>
          <button class="btn ghost" id="sys-home">&#8962; Home</button>
        </div>
      </div>
      <nav class="pills" id="pills">${pills}</nav>

      <section class="sect" id="q-quick"><header>
        <span class="ico" style="background:var(--vio-soft);color:var(--vio-ink)">${I.book}</span>
        <div><h3>All slides at a glance</h3><div class="sub">Side-by-side — compare before you zoom in</div></div>
        <span class="cnt">${slides.length} slides</span></header>
        <div class="grid2">` + slides.map((s) => `
          <div class="qcard sysq" id="q-s-${s.id}">
            <h4 class="sctitle"><span class="numdot">${esc(s.label)}</span> ${esc(s.title)}</h4>
            <p style="margin:2px 0 8px">${s.whatitis || ""}</p>
            <ul class="spot">${(s.spot || []).map((x) => `<li>${I.target}<span>${x}</span></li>`).join("")}</ul>
            <div class="qc-acts"><button class="btn ghost sm" data-gotab="${s.id}">Open full tab ${I.arrr}</button></div>
          </div>`).join("") + `</div></section>`;

    h += `<section class="sect" id="q-scheck"><header>
        <span class="ico" style="background:${SEC_META.structures.bg};color:${SEC_META.structures.c}">${I.check}</span>
        <div><h3>Master ID checklist</h3><div class="sub">Every structure of the whole system — ticks are shared with the slide tabs</div></div>
        <span class="cnt" id="sys-cnt">${nDone}/${nStruct}</span></header>
        <div class="check-head"><div class="pbar"><i id="sys-bar" style="width:${nStruct ? (nDone / nStruct) * 100 : 0}%"></i></div>
        <span id="sys-lbl">${nDone} of ${nStruct} identified</span></div>`;
    slides.forEach((s) => {
      const items = structOf(s);
      if (!items.length) return;
      const chk = state.checks[s.id] || [];
      const d = items.filter((_, i) => chk[i]).length;
      h += `<div class="mblock"><div class="mblock-h"><span class="numdot">${esc(s.label)}</span><b>${esc(s.title)}</b><span class="cnt" data-cnt="${s.id}">${d}/${items.length}</span></div>
        <div class="cklist" data-sid="${s.id}">` +
        items.map((it, i) => `<label class="ck"><input type="checkbox" data-i="${i}" ${chk[i] ? "checked" : ""}><span class="box">${I.checkS}</span><span class="txt">${it.html}</span></label>`).join("") +
        `</div></div>`;
    });
    h += `</section>`;

    if (ccSlides.length) {
      h += `<section class="sect" id="q-scc"><header>
        <span class="ico" style="background:var(--teal-soft);color:var(--teal)">${I.scope}</span>
        <div><h3>High-res slides &middot; CaseCenter</h3><div class="sub">Every scanner slide linked for this system — opens in a new tab (one login may be asked)</div></div>
        <span class="cnt">${nCc} links</span></header>
        <div class="cc-spotlist">`;
      ccSlides.forEach((s) => {
        const cc = ccFull(s.id);
        let chips = "", k = 0;
        if (cc.url && cc.url.trim()) { k++; chips += `<a class="cc-x" href="${esc(cc.url)}" target="_blank" rel="noopener noreferrer" title="Primary high-res slide">${k} &#8599;</a>`; }
        (cc.spots || []).forEach((sp) => ccClean(sp.urls).forEach((u) => {
          k++; chips += `<a class="cc-x" href="${esc(u)}" target="_blank" rel="noopener noreferrer" title="${esc(sp.text)}">${k} &#8599;</a>`;
        }));
        if (!chips) return;
        h += `<div class="cc-spot"><span class="cc-st"><span class="numdot">${esc(s.label)}</span> ${esc(s.title)}</span><span class="cc-links">${chips}</span></div>`;
      });
      h += `</div></section>`;
    }

    const THEORY = ["background", "howitworks", "appearance", "embryology", "staining"];
    h += `<section class="sect dscope${state.detail === "full" ? " full" : ""}" id="q-stheory"><header>
        <span class="ico" style="background:${SEC_META.background.bg};color:${SEC_META.background.c}">${I.gear}</span>
        <div><h3>Theory — every slide of the system</h3><div class="sub">Collapsed by default — open only what you need</div></div>
        ${dmodeHtml()}</header>`;
    slides.forEach((s, i) => {
      const secs = s.sections.filter((x) => THEORY.includes(x.key));
      if (!secs.length) return;
      h += `<div class="acc" data-acc="t${i}"><button>${I.chev}<span class="numdot">${esc(s.label)}</span> ${esc(s.title)}</button>
        <div class="body">` + secs.map((g) => `<h5 class="th-h">${esc(SEC_META[g.key].t)}</h5>${pointsHtml(g.items)}`).join("") + `</div></div>`;
    });
    h += `</section>`;

    h += `<div class="fnav">
      <button class="btn" id="f-home2"><span>${I.arrl}</span><span style="text-align:left"><small>back to</small>Home</span></button>
      <button class="btn" id="f-nextsys"><span style="text-align:right"><small>next system</small>${esc(nextSys)}</span>${I.arrr}</button>
    </div></div>`;

    $("#main").innerHTML = h;
    markActive("system", sys);

    $("#sys-start").addEventListener("click", () => go("slide", first.id));
    $("#sys-home").addEventListener("click", () => go("home"));
    $("#f-home2").addEventListener("click", () => go("home"));
    $("#f-nextsys").addEventListener("click", () => { location.hash = "#/system/" + encodeURIComponent(nextSys); });
    $$("[data-gotab]").forEach((b) => b.addEventListener("click", () => go("slide", b.dataset.gotab)));
    $$(".acc > button").forEach((b) => b.addEventListener("click", () => b.parentElement.classList.toggle("open")));
    wireDmode($("#main"));
    reveal($("#main"));
    $$(".cklist input").forEach((cb) => cb.addEventListener("change", () => {
      const list = cb.closest(".cklist");
      const sid = list.dataset.sid;
      const arr = state.checks[sid] || (state.checks[sid] = []);
      arr[+cb.dataset.i] = cb.checked;
      save();
      const items = structOf(byId[sid]);
      const d = items.filter((_, i) => arr[i]).length;
      const cntEl = $('[data-cnt="' + sid + '"]');
      if (cntEl) cntEl.textContent = d + "/" + items.length;
      if (cb.checked) popRow(cb.closest(".ck"));
      if (cb.checked && d === items.length) { burst(cntEl); toast("Slide " + byId[sid].label + ": all structures identified 🎉"); }
      const dn = slides.reduce((a, s) => a + doneOf(s), 0);
      $("#sys-cnt").textContent = dn + "/" + nStruct;
      $("#sys-lbl").textContent = dn + " of " + nStruct + " identified";
      $("#sys-bar").style.width = (nStruct ? (dn / nStruct) * 100 : 0) + "%";
      const chip = $("#sys-chip");
      if (chip) chip.textContent = dn + "/" + nStruct + " identified";
      renderSidebar(); markActive("system", sys);
    }));
    setupSpy();
  }

  /* ---------- router ---------- */
  function go(route, id) { location.hash = route === "slide" ? "#/slide/" + id : "#/" + route; }
  function route() {
    const h = location.hash || "#/home";
    window.scrollTo({ top: 0, behavior: "instant" });
    if (h.startsWith("#/slide/")) renderSlide(h.slice(8));
    else if (h.startsWith("#/system/")) renderSystem(decodeURIComponent(h.slice(9)));
    else if (h === "#/stains") renderStains();
    else renderHome();
  }
  window.addEventListener("hashchange", () => { route(); onScroll(); });

  /* ---------- scroll-linked chrome: top-bar shadow, reading progress, back-to-top ---------- */
  let scrollRaf = 0;
  function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      document.body.classList.toggle("scrolled", y > 4);
      $("#readbar").style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      $("#totop").classList.toggle("show", y > 900);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  $("#totop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: RM.matches ? "auto" : "smooth" }));

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest ? e.target.closest("abbr.ab") : null;
    if (a) toast(a.dataset.t + " = " + a.dataset.f);
  });

  /* ---------- global wiring ---------- */
  $("#theme-btn").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    $("#theme-btn").innerHTML = state.theme === "dark" ? I.sun : I.moon;
    save();
  });
  $("#theme-btn").innerHTML = state.theme === "dark" ? I.sun : I.moon;
  /* ---------- layout mode: auto / phone / desktop ---------- */
  function isPhone() { return document.documentElement.dataset.layout === "phone"; }
  function openDrawer() { $("#sidebar").classList.add("open"); syncScrim(); }
  function closeDrawer() { $("#sidebar").classList.remove("open"); syncScrim(); }
  function syncScrim() { $("#scrim").classList.toggle("show", isPhone() && $("#sidebar").classList.contains("open")); }
  function applyLayout() {
    const v = state.view || "auto";
    const phone = v === "phone" || (v === "auto" && window.innerWidth < 960);
    document.documentElement.dataset.layout = phone ? "phone" : "desktop";
    $$("#view-seg button").forEach((b) => b.classList.toggle("on", b.dataset.v === v));
    $("#search-btn").style.display = phone ? "" : "none";
    if (!phone) { document.body.classList.remove("searching"); closeDrawer(); } else syncScrim();
  }
  window.addEventListener("resize", applyLayout);
  $$("#view-seg button").forEach((b) => b.addEventListener("click", () => {
    state.view = b.dataset.v; save(); applyLayout();
    toast("Layout mode: " + b.dataset.v);
  }));
  $("#search-btn").addEventListener("click", () => {
    document.body.classList.toggle("searching");
    if (document.body.classList.contains("searching")) $("#q2").focus();
  });
  $("#burger").addEventListener("click", () => { $("#sidebar").classList.contains("open") ? closeDrawer() : openDrawer(); });
  $("#scrim").addEventListener("click", closeDrawer);
  $$("#botnav button").forEach((b) => b.addEventListener("click", () => {
    const r = b.dataset.r;
    if (r === "slides") openDrawer();
    else location.hash = "#/" + r;
  }));
  function filterNav(val) {
    const q = val.toLowerCase().trim();
    $$("#sidebar .nav-item[data-id]").forEach((b) => {
      const s = byId[b.dataset.id];
      const hit = !q || s.title.toLowerCase().includes(q) || s.label.includes(q) || s.system.toLowerCase().includes(q);
      b.classList.toggle("hidden", !hit);
    });
    $$("#sidebar .sys-head").forEach((hd) => {
      let el = hd.nextElementSibling, any = false;
      while (el && !el.classList.contains("sys-head")) {
        if (el.classList.contains("nav-item") && !el.classList.contains("hidden")) any = true;
        el = el.nextElementSibling;
      }
      hd.style.display = any ? "" : "none";
    });
  }
  ["q", "q2"].forEach((id) => $("#" + id).addEventListener("input", (e) => {
    $("#" + (id === "q" ? "q2" : "q")).value = e.target.value;
    filterNav(e.target.value);
  }));
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input,textarea")) return;
    if ($("#lb").classList.contains("open")) {
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") lbNav(1);
      if (e.key === "ArrowLeft") lbNav(-1);
      if (e.key === "+" || e.key === "=") { lb.scale = Math.min(6, lb.scale * 1.25); applyLB(); }
      if (e.key === "-") { lb.scale = Math.max(0.4, lb.scale / 1.25); applyLB(); }
      return;
    }
    if (e.key === "/") { e.preventDefault(); if (isPhone()) { document.body.classList.add("searching"); $("#q2").focus(); } else $("#q").focus(); return; }
    const h = location.hash;
    if (h.startsWith("#/slide/")) {
      const idx = order.indexOf(h.slice(8));
      if (e.key === "ArrowRight" && idx < order.length - 1) go("slide", order[idx + 1]);
      if (e.key === "ArrowLeft" && idx > 0) go("slide", order[idx - 1]);
    }
  });
  /* lightbox drag & zoom */
  (function () {
    const stage = $("#lb-stage");
    let drag = null;
    stage.addEventListener("pointerdown", (e) => { drag = { x: e.clientX - lb.x, y: e.clientY - lb.y }; stage.classList.add("drag"); });
    window.addEventListener("pointermove", (e) => { if (drag) { lb.x = e.clientX - drag.x; lb.y = e.clientY - drag.y; applyLB(); } });
    window.addEventListener("pointerup", () => { drag = null; stage.classList.remove("drag"); });
    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      lb.scale = Math.min(6, Math.max(0.4, lb.scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
      applyLB();
    }, { passive: false });
    stage.addEventListener("dblclick", () => { lb.scale = lb.scale > 1.5 ? 1 : 2.4; lb.x = lb.y = 0; applyLB(); });
  })();
  $("#lb-close").addEventListener("click", closeLB);
  $("#lb-in").addEventListener("click", () => { lb.scale = Math.min(6, lb.scale * 1.25); applyLB(); });
  $("#lb-out").addEventListener("click", () => { lb.scale = Math.max(0.4, lb.scale / 1.25); applyLB(); });
  $("#lb-prev").addEventListener("click", () => lbNav(-1));
  $("#lb-next").addEventListener("click", () => lbNav(1));

  renderSidebar();
  applyLayout();
  route();
  onScroll();
})();
