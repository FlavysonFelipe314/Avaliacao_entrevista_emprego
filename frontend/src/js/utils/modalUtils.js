export function removeCheckboxesFromModal() {
  setTimeout(() => {
    const modal = document.querySelector('.swal2-popup');
    if (modal) {
      const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => {
        const parent = cb.parentElement;
        if (parent && parent.tagName !== 'LABEL' && !parent.classList.contains('swal2-html-container')) {
          parent.remove();
        } else if (parent && parent.tagName === 'LABEL') {
          parent.remove();
        } else {
          cb.remove();
        }
      });
    }
  }, 100);
}

