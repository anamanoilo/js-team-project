(() => {
  const refs = {
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
  };

  refs.closeModalBtn.addEventListener('click', closeModal);

  function closeModal() {
    refs.modal.classList.add('is-hidden');
  }
})();
