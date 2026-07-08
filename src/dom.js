export function detectScreen() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const route = `${path}${hash}`;

  if (route.includes('settings')) return 'settings';
  if (route.includes('plugin')) return 'plugins';
  if (route.includes('library') || route.includes('songs')) return 'song_library';
  if (route.includes('player') || document.getElementById('player')) return 'player';
  if (route === '/' || route === '/#/' || document.querySelector('[data-screen="home"]')) return 'home';

  return 'unknown';
}
