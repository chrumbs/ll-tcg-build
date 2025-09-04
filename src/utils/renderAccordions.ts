import Accordion from 'accordion-js';

export const renderAccordions = function (elements: Element[]) {
  new Accordion(elements, {
    showMultiple: true,
    // openOnInit: [0],
  });
};
