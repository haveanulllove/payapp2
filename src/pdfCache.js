const PDF_REQUEST_TIMEOUT_MS = 15000;
const PDF_MAX_RETRIES = 3;

const pdfCache = new Map();

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function fetchPdfViaXhr(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.timeout = PDF_REQUEST_TIMEOUT_MS;

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
        resolve(new Uint8Array(xhr.response));
        return;
      }
      reject(new Error(`PDF request failed: HTTP ${xhr.status || "unknown"}`));
    };

    xhr.onerror = () => reject(new Error("PDF request failed: network error"));
    xhr.ontimeout = () => reject(new Error("PDF request failed: timeout"));
    xhr.send();
  });
}

async function loadPdfWithRetry(url) {
  let lastError = null;

  for (let attempt = 1; attempt <= PDF_MAX_RETRIES; attempt += 1) {
    try {
      return await fetchPdfViaXhr(url);
    } catch (error) {
      lastError = error;
      if (attempt < PDF_MAX_RETRIES) {
        await wait(400 * attempt);
      }
    }
  }

  throw lastError || new Error("PDF request failed");
}

export async function getCachedPdfData(url) {
  const cached = pdfCache.get(url);
  if (cached) {
    return cached;
  }

  const request = loadPdfWithRetry(url)
    .then((data) => {
      pdfCache.set(url, data);
      return data;
    })
    .catch((error) => {
      pdfCache.delete(url);
      throw error;
    });

  pdfCache.set(url, request);
  return request;
}
