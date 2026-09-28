(() => {
  "use strict";

  const STORAGE_KEY = "brand-mind.studio.v1";
  const fontPairs = [
    {
      display: 'Georgia, "Times New Roman", serif',
      body: "Arial, Helvetica, sans-serif",
      displayName: "Editorial Serif",
      bodyName: "Neutral Sans",
      meta: "Display / 500 / −4%",
    },
    {
      display: "Arial Black, Arial, sans-serif",
      body: 'Georgia, "Times New Roman", serif',
      displayName: "Monument Grotesk",
      bodyName: "Literary Serif",
      meta: "Display / 900 / −6%",
    },
    {
      display: "Trebuchet MS, Arial, sans-serif",
      body: "Arial, Helvetica, sans-serif",
      displayName: "Warm Geometric",
      bodyName: "Utility Sans",
      meta: "Display / 700 / −3%",
    },
    {
      display: "Palatino Linotype, Book Antiqua, serif",
      body: "Verdana, Geneva, sans-serif",
      displayName: "Humanist Roman",
      bodyName: "Open Sans",
      meta: "Display / 600 / −3%",
    },
    {
      display: "Courier New, Courier, monospace",
      body: "Arial, Helvetica, sans-serif",
      displayName: "Studio Mono",
      bodyName: "Modern Sans",
      meta: "Display / 700 / −5%",
    },
    {
      display: "Impact, Haettenschweiler, sans-serif",
      body: "Trebuchet MS, Arial, sans-serif",
      displayName: "Compressed Display",
      bodyName: "Humanist Sans",
      meta: "Display / 400 / −2%",
    },
  ];
  const archetypes = {
    visionary: {
      traits: ["Clear-eyed", "Expansive", "Decisive"],
      headlines: [
        "Build the next thing like it already belongs.",
        "Tomorrow gets real when you give it form.",
        "Make possibility practical.",
      ],
      say: [
        "Let’s make it tangible.",
        "Here’s what could change.",
        "Start with the signal.",
      ],
      not: [
        "Leverage future-ready solutions.",
        "Disrupt the paradigm.",
        "Unlock unprecedented synergy.",
      ],
    },
    sage: {
      traits: ["Lucid", "Grounded", "Generous"],
      headlines: [
        "Clarity is a form of momentum.",
        "Know more. Choose better.",
        "Complex ideas, made useful.",
      ],
      say: [
        "Here’s what the evidence shows.",
        "Let’s make this clear.",
        "One useful truth at a time.",
      ],
      not: [
        "Trust us, we’re experts.",
        "The answer is obvious.",
        "Our proprietary insights win.",
      ],
    },
    rebel: {
      traits: ["Direct", "Restless", "Unpolished"],
      headlines: [
        "The old rules had their turn.",
        "Normal is not the brief.",
        "Make something impossible to ignore.",
      ],
      say: [
        "Let’s challenge the default.",
        "Good. Now make it matter.",
        "No filler, just movement.",
      ],
      not: [
        "Best-in-class innovation.",
        "We’ve always done it this way.",
        "Please find our value proposition.",
      ],
    },
    caregiver: {
      traits: ["Warm", "Steady", "Human"],
      headlines: [
        "Care should feel easy to reach.",
        "Made for the moments that matter.",
        "Support that meets you here.",
      ],
      say: [
        "We’ll take this one step at a time.",
        "You’re in the right place.",
        "Here’s what happens next.",
      ],
      not: [
        "User error detected.",
        "Please comply with the process.",
        "Your request cannot be accommodated.",
      ],
    },
    explorer: {
      traits: ["Curious", "Open", "Kinetic"],
      headlines: [
        "There is more out there.",
        "Take the interesting way forward.",
        "Go where your questions lead.",
      ],
      say: [
        "Let’s see what’s possible.",
        "Follow the useful detour.",
        "Bring your curiosity.",
      ],
      not: [
        "Stay inside the lines.",
        "This is the only path.",
        "Standard journey applies.",
      ],
    },
    maker: {
      traits: ["Tactile", "Candid", "Exacting"],
      headlines: [
        "Ideas get better in your hands.",
        "Make it. Test it. Make it yours.",
        "Craft lives in the details.",
      ],
      say: [
        "Here’s how it’s made.",
        "Put the work on the table.",
        "Every detail earns its place.",
      ],
      not: [
        "Magic happens automatically.",
        "Effortless perfection.",
        "Powered by secret sauce.",
      ],
    },
  };
  const industryHue = {
    technology: 232,
    wellness: 151,
    culture: 328,
    finance: 212,
    food: 21,
    climate: 112,
    education: 47,
  };
  const surprises = [
    {
      name: "Kindred",
      tagline: "Good things grow together.",
      industry: "wellness",
      archetype: "caregiver",
      audience: "people building gentler everyday rituals",
      energy: 42,
      era: 53,
      play: 61,
    },
    {
      name: "Offgrid",
      tagline: "Useful trouble, beautifully made.",
      industry: "culture",
      archetype: "rebel",
      audience: "independent creators allergic to the default",
      energy: 88,
      era: 79,
      play: 73,
    },
    {
      name: "Fieldnote",
      tagline: "Turn curiosity into direction.",
      industry: "education",
      archetype: "sage",
      audience: "teams learning in the middle of the work",
      energy: 37,
      era: 44,
      play: 25,
    },
    {
      name: "Luma",
      tagline: "Energy for the long horizon.",
      industry: "climate",
      archetype: "visionary",
      audience: "optimists making infrastructure feel human",
      energy: 70,
      era: 85,
      play: 46,
    },
    {
      name: "Crumb",
      tagline: "Make room for something good.",
      industry: "food",
      archetype: "maker",
      audience: "neighborhood people with excellent taste",
      energy: 58,
      era: 32,
      play: 81,
    },
  ];

  const defaultState = {
    brief: {
      name: "Morrow",
      tagline: "Make tomorrow feel possible.",
      industry: "technology",
      archetype: "visionary",
      audience: "curious teams building what comes next",
      energy: 62,
      era: 74,
      play: 38,
    },
    seed: 1,
    markIndex: 0,
    lockedColors: [false, false, false, false, false],
    palette: [],
    system: null,
    saved: [],
    activePreview: "landing",
  };
  let state = loadState();
  let toastTimer;
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [
    ...context.querySelectorAll(selector),
  ];
  const root = document.documentElement;

  function loadState() {
    try {
      const saved = JSON.parse(WorkspaceStorage.getItem(STORAGE_KEY));
      if (!saved) return structuredClone(defaultState);
      return {
        ...structuredClone(defaultState),
        ...saved,
        brief: { ...defaultState.brief, ...saved.brief },
        lockedColors: saved.lockedColors || [...defaultState.lockedColors],
        saved: Array.isArray(saved.saved) ? saved.saved : [],
      };
    } catch {
      return structuredClone(defaultState);
    }
  }

  function persist() {
    WorkspaceStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
  function mulberry32(seed) {
    return () => {
      let value = (seed += 0x6d2b79f5);
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hsl(h, s, l) {
    return `hsl(${Math.round((h + 360) % 360)} ${Math.round(s)}% ${Math.round(l)}%)`;
  }

  function readBrief() {
    state.brief = {
      name: $("#brandName").value.trim() || "Untitled",
      tagline: $("#tagline").value.trim() || "Made with intention.",
      industry: $("#industry").value,
      archetype: $("#archetype").value,
      audience: $("#audience").value.trim() || "thoughtful people",
      energy: +$("#energy").value,
      era: +$("#era").value,
      play: +$("#play").value,
    };
  }

  function generate(increment = true) {
    readBrief();
    if (increment) state.seed += 1;
    const signature = `${state.brief.name}|${state.brief.industry}|${state.brief.archetype}|${state.brief.energy}|${state.brief.era}|${state.brief.play}|${state.seed}`;
    const random = mulberry32(hashString(signature));
    const baseHue =
      (industryHue[state.brief.industry] +
        (random() - 0.5) * 42 +
        state.brief.play * 0.3) %
      360;
    const energy = state.brief.energy;
    const play = state.brief.play;
    const generated = [
      hsl(baseHue, 54 + energy * 0.36, 28 + (100 - energy) * 0.12),
      hsl(baseHue + 124 + random() * 50, 62 + play * 0.25, 48 + random() * 10),
      hsl(baseHue + 55 + random() * 75, 67 + play * 0.2, 68 + random() * 12),
      hsl(baseHue + 12, 12 + play * 0.08, 7 + random() * 7),
      hsl(baseHue + 25, 18 + play * 0.08, 94 + random() * 3),
    ];
    state.palette = generated.map((color, index) =>
      state.lockedColors[index] && state.palette[index]
        ? state.palette[index]
        : color,
    );
    const fontIndex = Math.floor(random() * fontPairs.length);
    const copySet = archetypes[state.brief.archetype] || archetypes.visionary;
    state.system = {
      font: fontPairs[fontIndex],
      headline:
        copySet.headlines[Math.floor(random() * copySet.headlines.length)],
      say: copySet.say[Math.floor(random() * copySet.say.length)],
      not: copySet.not[Math.floor(random() * copySet.not.length)],
      traits: copySet.traits,
      radius: Math.round(2 + state.brief.play * 0.29),
      mark: state.markIndex % 5,
      generatedAt: Date.now(),
      signature,
    };
    persist();
    renderAll();
    animateBoard();
  }

  function applySystem() {
    if (!state.system || !state.palette.length) return generate(false);
    state.palette.forEach((color, index) =>
      root.style.setProperty(`--brand-${index + 1}`, color),
    );
    root.style.setProperty("--display-font", state.system.font.display);
    root.style.setProperty("--body-font", state.system.font.body);
    root.style.setProperty("--radius", `${state.system.radius}px`);
    const markStyles = [
      { radius: "50% 50% 8% 50%", rotate: "-6deg" },
      { radius: "50%", rotate: "0deg" },
      { radius: "5% 50% 5% 50%", rotate: "10deg" },
      { radius: "6px", rotate: "-4deg" },
      { radius: "50% 8% 50% 8%", rotate: "8deg" },
    ][state.system.mark % 5];
    root.style.setProperty("--mark-radius", markStyles.radius);
    root.style.setProperty("--mark-rotate", markStyles.rotate);
  }

  function renderAll() {
    applySystem();
    $("#systemSeed").textContent =
      `SEED ${String(state.seed).padStart(3, "0")}`;
    $("#displayName").textContent = state.brief.name;
    $("#displayTagline").textContent = state.brief.tagline;
    $("#markInitial").textContent = state.brief.name.charAt(0).toUpperCase();
    $("#displayFontName").textContent = state.system.font.displayName;
    $("#bodyFontName").textContent = state.system.font.bodyName;
    $("#displayFontMeta").textContent = state.system.font.meta;
    $("#typeSample").textContent =
      state.brief.archetype === "maker"
        ? "Every detail earns its place."
        : state.brief.tagline;
    $("#voiceHeadline").textContent = `“${state.system.headline}”`;
    $("#sayLine").textContent = `“${state.system.say}”`;
    $("#notLine").textContent = `“${state.system.not}”`;
    $("#voiceTraits").innerHTML = state.system.traits
      .map((trait) => `<span>${escapeHtml(trait)}</span>`)
      .join("");
    renderSwatches();
    renderTokens();
    renderPreview();
    renderSaved();
  }

  function renderInputs() {
    Object.entries(state.brief).forEach(([key, value]) => {
      const input = $(`#${key === "name" ? "brandName" : key}`);
      if (input) input.value = value;
    });
    $$('input[type="range"]').forEach((input) => {
      const output = $(`output[for="${input.id}"]`);
      if (output) output.value = input.value;
    });
  }

  function renderSwatches() {
    $("#swatchList").innerHTML = state.palette
      .map(
        (color, index) => `
      <div class="swatch"><div class="swatch-color" style="--swatch:${color}"><button type="button" data-lock="${index}" aria-pressed="${state.lockedColors[index]}" title="${state.lockedColors[index] ? "Unlock" : "Lock"} this color">${state.lockedColors[index] ? "●" : "○"}</button></div><code>${toHex(color)}</code></div>`,
      )
      .join("");
    $$("[data-lock]").forEach((button) =>
      button.addEventListener("click", () => {
        const index = +button.dataset.lock;
        state.lockedColors[index] = !state.lockedColors[index];
        persist();
        renderSwatches();
        toast(state.lockedColors[index] ? "Color locked" : "Color unlocked");
      }),
    );
    const ratio = contrastRatio(state.palette[0], state.palette[4]);
    const pass = ratio >= 4.5;
    $("#contrastLine").classList.toggle("fail", !pass);
    $("#contrastLine").innerHTML =
      `<span>${pass ? "AA" : "LOW"}</span> Primary pairing ${pass ? "passes" : "needs review"} · ${ratio.toFixed(1)}:1`;
  }

  function tokenText() {
    return `:root {\n  --brand-primary: ${state.palette[0]};\n  --brand-accent: ${state.palette[1]};\n  --brand-highlight: ${state.palette[2]};\n  --brand-ink: ${state.palette[3]};\n  --brand-canvas: ${state.palette[4]};\n\n  --font-display: ${state.system.font.display};\n  --font-body: ${state.system.font.body};\n\n  --radius-sm: ${Math.max(2, Math.round(state.system.radius / 2))}px;\n  --radius-md: ${state.system.radius}px;\n  --radius-lg: ${state.system.radius * 2}px;\n\n  --space-1: 0.25rem;\n  --space-2: 0.5rem;\n  --space-3: 0.75rem;\n  --space-4: 1rem;\n  --space-6: 1.5rem;\n  --space-8: 2rem;\n}`;
  }

  function renderTokens() {
    $("#tokenCode").textContent = tokenText();
    $("#tokenStats").innerHTML =
      "<div><b>5</b><span>CORE COLORS</span></div><div><b>2</b><span>TYPE ROLES</span></div><div><b>9</b><span>SPACING & RADII</span></div>";
  }

  function renderPreview() {
    const name = escapeHtml(state.brief.name);
    const tagline = escapeHtml(state.brief.tagline);
    const audience = escapeHtml(state.brief.audience);
    const initial = escapeHtml(state.brief.name.charAt(0).toUpperCase());
    $("#mockDomain").textContent = `${slugify(state.brief.name)}.studio`;
    const canvas = $("#mockupCanvas");
    if (state.activePreview === "social") {
      canvas.innerHTML = `<div class="social-preview"><article class="social-card"><small>${name.toUpperCase()} / FIELD NOTE 01</small><blockquote>${escapeHtml(state.system.headline)}</blockquote><footer><span>${tagline}</span><b>↗</b></footer></article></div>`;
    } else if (state.activePreview === "product") {
      canvas.innerHTML = `<div class="product-preview"><article class="product-card"><span class="product-badge">NEW DIRECTION</span><h3>${tagline}</h3><p>Built for ${audience}. A focused system for turning intention into something people can feel.</p><button type="button">EXPLORE ${name.toUpperCase()} →</button></article></div>`;
    } else {
      canvas.innerHTML = `<div class="landing-preview"><nav class="mock-nav"><strong>${name}</strong><span>ABOUT WORK NOTES</span></nav><div class="mock-hero"><div class="mock-copy"><h3>${tagline}</h3><p>For ${audience}. ${escapeHtml(state.system.say)}</p><span class="mock-cta">SEE WHAT'S POSSIBLE →</span></div><div class="mock-art" data-letter="${initial}"></div></div></div>`;
    }
  }

  function renderSaved() {
    $("#savedCount").textContent = state.saved.length;
    $("#savedList").innerHTML = state.saved.length
      ? state.saved
          .map(
            (item) => `
      <article class="saved-card"><span class="saved-swatch" style="--saved-color:${item.palette[0]};--saved-radius:${item.system.radius}px"></span><div><strong>${escapeHtml(item.brief.name)}</strong><span>${escapeHtml(item.brief.archetype)} · seed ${String(item.seed).padStart(3, "0")}</span></div><button type="button" data-load-saved="${item.id}">Load</button></article>`,
          )
          .join("")
      : '<p class="saved-empty">No saved directions yet.<br>Use the heart on a brand board to keep a favorite.</p>';
    $$("[data-load-saved]").forEach((button) =>
      button.addEventListener("click", () =>
        loadSaved(button.dataset.loadSaved),
      ),
    );
  }

  function saveCurrent() {
    const snapshot = {
      id: `${Date.now()}`,
      brief: structuredClone(state.brief),
      palette: [...state.palette],
      system: structuredClone(state.system),
      seed: state.seed,
      markIndex: state.markIndex,
    };
    state.saved.unshift(snapshot);
    state.saved = state.saved.slice(0, 12);
    persist();
    renderSaved();
    $("#saveButton").classList.add("saved");
    $("#saveButton").textContent = "♥";
    window.setTimeout(() => {
      $("#saveButton").classList.remove("saved");
      $("#saveButton").textContent = "♡";
    }, 800);
    toast("Direction saved locally");
  }

  function loadSaved(id) {
    const snapshot = state.saved.find((item) => item.id === id);
    if (!snapshot) return;
    state.brief = structuredClone(snapshot.brief);
    state.palette = [...snapshot.palette];
    state.system = structuredClone(snapshot.system);
    state.seed = snapshot.seed;
    state.markIndex = snapshot.markIndex || 0;
    persist();
    renderInputs();
    renderAll();
    closeHistory();
    toast(`${state.brief.name} restored`);
  }

  function showSystemView(name) {
    $$(".view-tab").forEach((tab) => {
      const active = tab.dataset.view === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    $$("[data-system-view]").forEach((view) => {
      const active = view.dataset.systemView === name;
      view.hidden = !active;
      view.classList.toggle("active", active);
    });
  }

  function surprise() {
    const idea =
      surprises[
        (state.seed + Math.floor(Math.random() * surprises.length)) %
          surprises.length
      ];
    state.brief = structuredClone(idea);
    state.seed += 3;
    state.markIndex = (state.markIndex + 1) % 5;
    renderInputs();
    generate(false);
    toast("Fresh brief, fresh direction");
  }

  function exportJson() {
    const data = {
      product: "Brand Mind",
      generatedAt: new Date().toISOString(),
      generation:
        "Local deterministic browser algorithm; no AI or network request.",
      brief: state.brief,
      palette: state.palette.map((color) => ({
        css: color,
        hex: toHex(color),
      })),
      typography: state.system.font,
      voice: {
        headline: state.system.headline,
        traits: state.system.traits,
        say: state.system.say,
        avoid: state.system.not,
      },
      tokens: tokenText(),
    };
    download(
      `${slugify(state.brief.name)}-brand-kit.json`,
      JSON.stringify(data, null, 2),
      "application/json",
    );
    toast("Brand kit exported");
  }
  function downloadCss() {
    download(
      `${slugify(state.brief.name)}-tokens.css`,
      `/* ${state.brief.name.replaceAll("*/", "* /")} design tokens · Generated locally by Brand Mind */\n${tokenText()}\n`,
      "text/css",
    );
    toast("CSS tokens downloaded");
  }
  function download(filename, value, type) {
    const url = URL.createObjectURL(new Blob([value], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  async function copyCss() {
    try {
      await navigator.clipboard.writeText(tokenText());
      toast("CSS variables copied");
    } catch {
      toast("Clipboard access was unavailable");
    }
  }

  function openHistory() {
    $("#historyDrawer").hidden = false;
    $("#drawerScrim").hidden = false;
    $("#historyButton").setAttribute("aria-expanded", "true");
    $("#closeHistoryButton").focus();
  }
  function closeHistory() {
    $("#historyDrawer").hidden = true;
    $("#drawerScrim").hidden = true;
    $("#historyButton").setAttribute("aria-expanded", "false");
  }
  function animateBoard() {
    $$(".brand-tile").forEach((tile, index) => {
      tile.animate(
        [
          { opacity: 0.25, transform: "translateY(7px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 260 + index * 70, easing: "ease-out" },
      );
    });
  }
  function toast(message) {
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").classList.add("show");
    toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2200);
  }

  function parseHsl(color) {
    const values = color.match(/[\d.]+/g)?.map(Number) || [0, 0, 0];
    const [h, s, l] = values;
    const sat = s / 100,
      light = l / 100,
      c = (1 - Math.abs(2 * light - 1)) * sat,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = light - c / 2;
    let r = 0,
      g = 0,
      b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [r + m, g + m, b + m].map((v) => Math.round(v * 255));
  }
  function toHex(color) {
    const rgb = color.startsWith("hsl") ? parseHsl(color) : [0, 0, 0];
    return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
  }
  function luminance(color) {
    return parseHsl(color)
      .map((v) => {
        const n = v / 255;
        return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      })
      .reduce((sum, v, index) => sum + v * [0.2126, 0.7152, 0.0722][index], 0);
  }
  function contrastRatio(a, b) {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
  }
  function escapeHtml(value = "") {
    return String(value).replace(
      /[&<>'"]/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[char],
    );
  }
  function slugify(value) {
    return (
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "brand"
    );
  }

  $$('input[type="range"]').forEach((input) =>
    input.addEventListener("input", () => {
      $(`output[for="${input.id}"]`).value = input.value;
    }),
  );
  $("#generateButton").addEventListener("click", () => generate(true));
  $("#surpriseButton").addEventListener("click", surprise);
  $("#cycleMarkButton").addEventListener("click", () => {
    state.markIndex = (state.markIndex + 1) % 5;
    state.system.mark = state.markIndex;
    persist();
    applySystem();
    renderPreview();
    toast("Mark form changed");
  });
  $$(".view-tab").forEach((tab) =>
    tab.addEventListener("click", () => showSystemView(tab.dataset.view)),
  );
  $$(".preview-switcher button").forEach((button) =>
    button.addEventListener("click", () => {
      state.activePreview = button.dataset.preview;
      $$(".preview-switcher button").forEach((item) =>
        item.classList.toggle("active", item === button),
      );
      persist();
      renderPreview();
    }),
  );
  $("#copyCssButton").addEventListener("click", copyCss);
  $("#downloadCssButton").addEventListener("click", downloadCss);
  $("#exportJsonButton").addEventListener("click", exportJson);
  $("#saveButton").addEventListener("click", saveCurrent);
  $("#historyButton").addEventListener("click", openHistory);
  $("#closeHistoryButton").addEventListener("click", closeHistory);
  $("#drawerScrim").addEventListener("click", closeHistory);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeHistory();
  });
  ["brandName", "tagline"].forEach((id) =>
    $(`#${id}`).addEventListener("input", () => {
      readBrief();
      state.system && renderAll();
      persist();
    }),
  );

  renderInputs();
  if (!state.system || !state.palette.length) generate(false);
  else renderAll();
})();
