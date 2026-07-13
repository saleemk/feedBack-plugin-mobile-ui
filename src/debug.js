import { DEBUG_STORAGE_KEY, PLUGIN_ID, PLUGIN_VERSION } from './state.js';

export function createDebugOverlay({ state }) {
  let overlay = null;
  let collapsed = true;
  let latestDebugText = '';
  let copyStatus = 'Copy';
  let copyStatusTimer = null;

  return {
    isEnabled,
    setEnabled,
    refresh,
    remove
  };

  function isEnabled() {
    try {
      return window.localStorage.getItem(DEBUG_STORAGE_KEY) === '1';
    } catch (_) {
      return false;
    }
  }

  function setEnabled(value) {
    try {
      if (value) window.localStorage.setItem(DEBUG_STORAGE_KEY, '1');
      else window.localStorage.removeItem(DEBUG_STORAGE_KEY);
    } catch (_) {
      /* private mode */
    }
  }

  function refresh() {
    if (!isEnabled()) {
      remove();
      return;
    }

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-ui-debug-overlay';
      overlay.addEventListener('click', handleOverlayClick);
      document.body.appendChild(overlay);
    }

    const viewport = state.viewport || {};
    const rotation = getRotationDiagnostics();
    const debugLines = getDebugLines(state, viewport, rotation);
    latestDebugText = debugLines.join('\n');
    const summary = [
      PLUGIN_ID,
      viewport.deviceClass || 'unknown',
      viewport.orientation || 'unknown',
      state.screen || 'unknown',
      rotation.iosViewportFix
    ].join(' · ');
    overlay.classList.toggle('mobile-ui-debug-overlay-collapsed', collapsed);
    overlay.innerHTML = [
      `<button type="button" class="mobile-ui-debug-toggle" data-mobile-ui-debug-toggle aria-expanded="${collapsed ? 'false' : 'true'}">`,
      `<span>${escapeHtml(summary)}</span>`,
      `<span>${collapsed ? 'Show' : 'Hide'}</span>`,
      '</button>',
      '<div class="mobile-ui-debug-body">',
      '<div class="mobile-ui-debug-actions">',
      '<strong>Diagnostics</strong>',
      `<button type="button" class="mobile-ui-debug-copy" data-mobile-ui-debug-copy>${escapeHtml(copyStatus)}</button>`,
      '</div>',
      `<pre>${escapeHtml(latestDebugText)}</pre>`,
      '</div>'
    ].join('');
  }

  function handleOverlayClick(event) {
    if (event.target.closest('[data-mobile-ui-debug-copy]')) {
      copyDebugText();
      return;
    }

    if (event.target.closest('[data-mobile-ui-debug-toggle]')) {
      collapsed = !collapsed;
      refresh();
    }
  }

  async function copyDebugText() {
    const text = latestDebugText;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopyStatus('Copied');
        return;
      } catch (_) {
        /* fall through to textarea fallback */
      }
    }

    setCopyStatus(copyDebugTextFallback(text) ? 'Copied' : 'Failed');
  }

  function copyDebugTextFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    textarea.remove();
    return copied;
  }

  function setCopyStatus(status) {
    copyStatus = status;
    refresh();

    if (copyStatusTimer) window.clearTimeout(copyStatusTimer);
    copyStatusTimer = window.setTimeout(() => {
      copyStatus = 'Copy';
      copyStatusTimer = null;
      refresh();
    }, 1500);
  }

  function remove() {
    if (copyStatusTimer) {
      window.clearTimeout(copyStatusTimer);
      copyStatusTimer = null;
    }
    if (overlay) {
      overlay.removeEventListener('click', handleOverlayClick);
      overlay.remove();
      overlay = null;
    }
  }
}

function getDebugLines(state, viewport, rotation) {
  return [
    `${PLUGIN_ID} ${PLUGIN_VERSION}`,
    `viewport: ${viewport.deviceClass || 'unknown'}`,
    `orientation: ${viewport.orientation || 'unknown'}`,
    `screen: ${state.screen || 'unknown'}`,
    `v3: ${state.isV3 ? 'true' : 'false'}`,
    `standalone: ${viewport.standalone ? 'true' : 'false'}`,
    `disabled: ${state.disabled ? 'true' : 'false'}`,
    `reason: ${state.lastRefreshReason || 'unknown'}`,
    '',
    `inner: ${rotation.inner}`,
    `vv: ${rotation.visualViewport}`,
    `ios fix: ${rotation.iosViewportFix}`,
    `scroll win/doc/body/main: ${rotation.scroll}`,
    `main: ${rotation.mainBox}`,
    `topbar: ${rotation.topbarBox}`,
    `active: ${rotation.activeBox}`,
    `nav: ${rotation.navBox}`,
    `nav hit: ${rotation.navHit}`,
    `btn hit: ${rotation.buttonHit}`,
    `focus: ${rotation.focus}`
  ];
}

function getRotationDiagnostics() {
  const root = document.documentElement;
  const body = document.body;
  const main = document.getElementById('v3-main');
  const topbar = document.getElementById('v3-topbar');
  const active = document.querySelector('.screen.active');
  const nav = document.querySelector('.mobile-ui-bottom-nav');
  const navButton = document.querySelector('.mobile-ui-bottom-nav button, .mobile-ui-bottom-nav a');

  return {
    inner: `${window.innerWidth || 0}x${window.innerHeight || 0}`,
    visualViewport: getVisualViewportLabel(),
    iosViewportFix: getIosViewportFixLabel(root),
    scroll: [
      `${Math.round(window.scrollX || 0)},${Math.round(window.scrollY || 0)}`,
      `${Math.round(root.scrollLeft || 0)},${Math.round(root.scrollTop || 0)}`,
      `${Math.round(body?.scrollLeft || 0)},${Math.round(body?.scrollTop || 0)}`,
      `${Math.round(main?.scrollLeft || 0)},${Math.round(main?.scrollTop || 0)}`
    ].join(' / '),
    mainBox: getElementBox(main),
    topbarBox: getElementBox(topbar),
    activeBox: getElementBox(active),
    navBox: getElementBox(nav),
    navHit: getHitLabel(nav),
    buttonHit: getHitLabel(navButton),
    focus: getElementLabel(document.activeElement)
  };
}

function getIosViewportFixLabel(root) {
  const active = root.classList.contains('mobile-ui-ios-vv-offset-bug');
  const value = root.style.getPropertyValue('--mobile-ui-ios-vv-offset-fix').trim() || '0px';
  return `${active ? 'on' : 'off'} ${value}`;
}

function getVisualViewportLabel() {
  const viewport = window.visualViewport;
  if (!viewport) return 'n/a';
  return [
    `${Math.round(viewport.width)}x${Math.round(viewport.height)}`,
    `s${round2(viewport.scale)}`,
    `o${Math.round(viewport.offsetLeft)},${Math.round(viewport.offsetTop)}`,
    `p${Math.round(viewport.pageLeft)},${Math.round(viewport.pageTop)}`
  ].join(' ');
}

function getElementBox(element) {
  if (!element) return 'missing';
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  return [
    `${Math.round(rect.x)},${Math.round(rect.y)}`,
    `${Math.round(rect.width)}x${Math.round(rect.height)}`,
    `pt${style.paddingTop}`,
    `mt${style.marginTop}`,
    `pos:${style.position}`,
    `tr:${style.transform === 'none' ? 'none' : 'yes'}`
  ].join(' ');
}

function getHitLabel(element) {
  if (!element) return 'missing';
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const hit = document.elementFromPoint(x, y);
  return `${Math.round(x)},${Math.round(y)} -> ${getElementLabel(hit)}`;
}

function getElementLabel(element) {
  if (!element) return 'none';
  const id = element.id ? `#${element.id}` : '';
  const cls = typeof element.className === 'string'
    ? `.${element.className.trim().replace(/\s+/g, '.').slice(0, 48)}`
    : '';
  const text = (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24);
  return `${element.tagName || 'node'}${id}${cls}${text ? ` "${text}"` : ''}`;
}

function round2(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}
