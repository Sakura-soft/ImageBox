export const handleMousedownClick = (setterFn) => {
  document.dispatchEvent(new Event("mousedown"));
  setTimeout(() => {
    setterFn(true);
  }, 10);
};
