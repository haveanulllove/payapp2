const configuredBaseUrl = import.meta.env.BASE_URL || "/";

function getBaseUrl() {
  if (typeof window !== "undefined" && window.location.protocol === "file:" && configuredBaseUrl === "/") {
    return "./";
  }

  return configuredBaseUrl.endsWith("/") ? configuredBaseUrl : `${configuredBaseUrl}/`;
}

export function assetPath(path) {
  const cleanPath = path.replace(/^\/+/, "");
  return `${getBaseUrl()}${cleanPath}`;
}
