export function slice(text = "", num = 20) {
  if (!text) return;
  return text.length > num ? text.slice(0, num) + "....." : text;
}
