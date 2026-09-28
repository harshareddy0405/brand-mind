/* Validate persisted data before it reaches rendering or simulation. */
(() => {
  "use strict";
  const text = (v) => typeof v === "string" && v.length <= 100000;
  const id = (v) => text(v) && /^[a-zA-Z0-9_-]{1,120}$/.test(v);
  const number =
    (min = 0, max = 1e15) =>
    (v) =>
      Number.isFinite(v) && v >= min && v <= max;
  const bool = (v) => typeof v === "boolean";
  const one =
    (...values) =>
    (v) =>
      values.includes(v);
  const optional = (check) => (v) => v === undefined || check(v);
  const nullable = (check) => (v) => v === null || check(v);
  const array =
    (check, min = 0, max = 1000) =>
    (v) =>
      Array.isArray(v) && v.length >= min && v.length <= max && v.every(check);
  const object = (fields) => (v) =>
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.entries(fields).every(([key, check]) => check(v[key]));
  const record = (check) => (v) =>
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.values(v).every(check);
  const unique = (items) =>
    new Set(items.map((item) => item.id)).size === items.length;
  const color = (v) => text(v) && /^hsl\([\d.]+ [\d.]+% [\d.]+%\)$/.test(v);
  const brief = object({
    name: text,
    tagline: text,
    industry: one(
      "technology",
      "wellness",
      "culture",
      "finance",
      "food",
      "climate",
      "education",
    ),
    archetype: one(
      "visionary",
      "sage",
      "rebel",
      "caregiver",
      "explorer",
      "maker",
    ),
    audience: text,
    energy: number(0, 100),
    era: number(0, 100),
    play: number(0, 100),
  });
  const system = object({
    font: object({
      display: text,
      body: text,
      displayName: text,
      bodyName: text,
      meta: text,
    }),
    headline: text,
    say: text,
    not: text,
    traits: array(text, 1, 10),
    radius: number(0, 100),
    mark: number(0, 4),
  });
  const snapshot = object({
    id: text,
    brief,
    palette: array(color, 5, 5),
    system,
    seed: number(),
    markIndex: number(0, 4),
  });
  window.validateWorkspace = object({
    brief,
    seed: number(),
    markIndex: number(0, 4),
    lockedColors: array(bool, 5, 5),
    palette: array(color, 0, 5),
    system: nullable(system),
    saved: array(snapshot, 0, 12),
    activePreview: one("landing", "social", "product"),
  });
})();
