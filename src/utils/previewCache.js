const CACHE_KEY = 'previewCacheTimestamps';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

function getCacheTimestamps() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCacheTimestamps(timestamps) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(timestamps));
  } catch {
    // localStorage full, clear old entries
    const keys = Object.keys(timestamps);
    const half = keys.slice(0, Math.floor(keys.length / 2));
    half.forEach(k => delete timestamps[k]);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(timestamps));
    } catch {
      // give up
    }
  }
}

export function isPreviewCached(url) {
  const timestamps = getCacheTimestamps();
  const ts = timestamps[url];
  if (!ts) return false;
  if (Date.now() - ts > CACHE_DURATION) {
    delete timestamps[url];
    saveCacheTimestamps(timestamps);
    return false;
  }
  return true;
}

export function markPreviewCached(url) {
  const timestamps = getCacheTimestamps();
  timestamps[url] = Date.now();
  saveCacheTimestamps(timestamps);
}

export function getPreviewUrl(url) {
  return `https://image.thum.io/get/width/300/crop/400/noanimate/${url}`;
}

export function getPreviewSrc(url) {
  if (isPreviewCached(url)) {
    return getPreviewUrl(url);
  }
  return getPreviewUrl(url);
}
