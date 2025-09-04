export const showError = (message: string, timeout = 8000): void => {
  const errBox = document.querySelector<HTMLElement>('[data-role="error"]');
  if (errBox) {
    errBox.textContent = message;
    errBox.classList.remove('hide');

    setTimeout(() => {
      errBox.classList.add('hide');
    }, timeout);
  }
};
