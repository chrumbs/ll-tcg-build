export const setTextByAttr = (element: Element | Document, attr: string, text: string) => {
  const el = element.querySelector<HTMLElement>(`[data-field="${attr}"]`);
  if (!el) {
    console.warn(`Element with data-field="${attr}" not found`);
    return;
  }
  el.textContent = text;
};
