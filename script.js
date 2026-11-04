// Navegação móvel, seleção de coleções, detalhes e efeitos de entrada.
const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menu');
  mainNav?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mainNav?.classList.toggle('is-open', !isOpen);
});

mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  const filter = link.dataset.mediaFilter;
  if (filter) mediaTabs.find((tab) => tab.dataset.filter === filter)?.click();
  closeMenu();
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Os botões Filmes e Livros alternam a coleção apresentada.
const mediaTabs = [...document.querySelectorAll('.media-tab')];
const mediaCards = [...document.querySelectorAll('.media-card')];

mediaTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const chosenType = tab.dataset.filter;
    mediaTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    mediaCards.forEach((card) => {
      const show = card.dataset.type === chosenType;
      card.classList.toggle('is-hidden', !show);
      if (show) card.classList.add('is-visible');
    });
  });
});

// Conteúdos complementares aparecem em uma caixa de diálogo nativa.
const modal = document.querySelector('.story-modal');
const modalTitle = document.querySelector('#modal-title');
const modalText = document.querySelector('.modal-text');

function openDetails(source) {
  if (!modal || !modalTitle || !modalText) return;
  modalTitle.textContent = source.dataset.modalTitle || 'Uma história do mundo mágico';
  modalText.textContent = source.dataset.modalText || '';
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', '');
  document.body.classList.add('modal-open');
}

document.querySelectorAll('[data-modal-title]').forEach((trigger) => {
  trigger.addEventListener('click', () => openDetails(trigger));
});

document.querySelector('.modal-close')?.addEventListener('click', () => modal?.close());
document.querySelector('.modal-done')?.addEventListener('click', () => modal?.close());
modal?.addEventListener('close', () => document.body.classList.remove('modal-open'));
modal?.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

// Permite abrir os cards do universo mágico também pelo teclado.
document.querySelectorAll('.world-card').forEach((card) => {
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Saiba mais: ${card.dataset.modalTitle}`);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails(card);
    }
  });
});

// Revela elementos conforme entram na tela; sem suporte, mantém o conteúdo visível.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelector('#current-year').textContent = String(new Date().getFullYear());
