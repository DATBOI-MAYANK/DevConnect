// src/utils/randomDev.js
String.prototype.hashCode = function() {
  return [...this].reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0);
};

export function pickFeaturedDevs(devs, count = 2) {
  const seed = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const base = Math.abs(seed.hashCode()) % devs.length;
  return Array.from({ length: Math.min(count, devs.length) }, (_, i) =>
    devs[(base + i) % devs.length]
  );
}
