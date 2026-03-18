// Freedom Green Energy — Navigation JS
(function () {
  // Mobile menu toggle
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('mobileClose');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.add('open'));
  }
  if (close && menu) {
    close.addEventListener('click', () => menu.classList.remove('open'));
  }

  // Mark active nav item based on current page filename
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const links = item.querySelectorAll('a[data-page]');
    links.forEach(a => {
      if (a.dataset.page === path) item.classList.add('active');
    });
  });
})();
