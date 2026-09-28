const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { boot } = require("./harness.cjs");
const key = fs
  .readFileSync(path.join(__dirname, "../app.js"), "utf8")
  .match(/const (?:STORAGE_KEY|STORE|KEY) = "([^"]+)"/)[1];
const fixture = async (t, options) => {
  const h = await boot(options);
  t.after(() => {
    const errors = [...h.errors];
    h.close();
    assert.deepEqual(errors, []);
  });
  return h;
};
const submit = (h, selector) =>
  h
    .$(selector)
    .dispatchEvent(
      new h.window.Event("submit", { bubbles: true, cancelable: true }),
    );
const readBlob = (h, blob) =>
  new Promise((resolve, reject) => {
    const r = new h.window.FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsText(blob);
  });
async function roundTrip(t, h) {
  await h.wait(450);
  const raw = h.window.localStorage.getItem(key);
  assert.ok(raw, "Interaction should persist workspace data");
  assert.equal(
    h.window.validateWorkspace(JSON.parse(raw)),
    true,
    "Generated state must satisfy its schema",
  );
  const reloaded = await fixture(t, { saved: { [key]: raw } });
  assert.equal(
    reloaded.$("#storage-notice"),
    null,
    "Valid edits must not be discarded on reload",
  );
}
test("locked palette colors survive regeneration and saved directions reload", async (t) => {
  const h = await fixture(t);
  h.click('[data-lock="0"]');
  const before = JSON.parse(h.window.localStorage.getItem(key)).palette[0];
  h.click("#generateButton");
  h.click("#saveButton");
  assert.equal(
    JSON.parse(h.window.localStorage.getItem(key)).palette[0],
    before,
  );
  await roundTrip(t, h);
});
test("brand input is escaped in previews and CSS comments", async (t) => {
  const h = await fixture(t);
  h.input("#brandName", "<img src=x> */");
  assert.equal(h.$("#previewCanvas img"), null);
  h.click("#downloadCssButton");
  const css = await readBlob(h, h.downloads[0]);
  assert.ok(css.includes(":root"));
  assert.ok(!css.startsWith("/* <img src=x> */"));
});
