export const copy = async (text) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    alert("Failed to copy");
  }
};
