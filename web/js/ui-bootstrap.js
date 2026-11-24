(() => {
  const root = document.documentElement;

  try {
    root.dataset.theme = localStorage.getItem('royalHavenTheme') === 'light' ? 'light' : 'dark';
  } catch {
    root.dataset.theme = 'dark';
  }

  try {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTourPage = location.pathname.endsWith('/tour.html');
    if (!isTourPage && !reducedMotion && !sessionStorage.getItem('royalHavenMoonLoaderShown')) {
      root.dataset.moonLoader = 'true';
      root.setAttribute('aria-busy', 'true');
      sessionStorage.setItem('royalHavenMoonLoaderShown', 'true');
    }
  } catch {
    root.dataset.theme = root.dataset.theme || 'dark';
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.setTimeout(initThemeToggle, 0);
    if (root.hasAttribute('data-moon-loader')) {
      window.setTimeout(() => {
        root.removeAttribute('data-moon-loader');
        root.removeAttribute('aria-busy');
      }, 1250);
    }
  });

  function initThemeToggle() {
    const host = document.querySelector('.nav-cta-group, .tour-actions');
    if (!host || host.querySelector('.theme-toggle')) return;

    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.type = 'button';
    const icon = document.createElement('i');
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon);

    function syncThemeButton() {
      const isLight = root.dataset.theme === 'light';
      icon.className = `fas ${isLight ? 'fa-moon' : 'fa-sun'}`;
      button.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
      button.title = `Switch to ${isLight ? 'dark' : 'light'} mode`;
      button.setAttribute('aria-pressed', String(isLight));
    }

    syncThemeButton();
    button.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = nextTheme;
      try {
        localStorage.setItem('royalHavenTheme', nextTheme);
      } catch {
        button.title = 'Theme changed for this page only; browser storage is unavailable';
      }

      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.content = nextTheme === 'light' ? '#f5f7fa' : '#0b0e14';
      syncThemeButton();
    });

    host.prepend(button);
  }
})();
