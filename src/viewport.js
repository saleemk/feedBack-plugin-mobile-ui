export function getViewportInfo() {
  const width = window.innerWidth || document.documentElement.clientWidth || 0;
  const height = window.innerHeight || document.documentElement.clientHeight || 0;
  const visualViewport = getVisualViewportInfo();
  const orientation = width > height ? 'landscape' : 'portrait';

  return {
    width,
    height,
    devicePixelRatio: window.devicePixelRatio || 1,
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    deviceClass: classifyDevice(width),
    standalone: isStandaloneMode(),
    visualViewport
  };
}

function classifyDevice(width) {
  if (width <= 767) return 'phone';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

function isStandaloneMode() {
  return (
    window.navigator.standalone === true ||
    window.matchMedia?.('(display-mode: standalone)')?.matches === true
  );
}

function getVisualViewportInfo() {
  if (!window.visualViewport) return null;

  return {
    width: window.visualViewport.width,
    height: window.visualViewport.height,
    scale: window.visualViewport.scale,
    offsetLeft: window.visualViewport.offsetLeft,
    offsetTop: window.visualViewport.offsetTop,
    pageLeft: window.visualViewport.pageLeft,
    pageTop: window.visualViewport.pageTop
  };
}
