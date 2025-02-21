export function getPlatform() {
  return window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
}
