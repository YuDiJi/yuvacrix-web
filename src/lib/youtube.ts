export function extractYouTubeVideoId(value: string): string | null {
  const input = value.trim();

  if (!input) {
    return null;
  }

  try {
    const url = new URL(input);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];

      return videoId || null;
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "music.youtube.com"
    ) {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      const pathParts = url.pathname.split("/").filter(Boolean);

      if (
        pathParts[0] === "live" ||
        pathParts[0] === "embed" ||
        pathParts[0] === "shorts"
      ) {
        return pathParts[1] || null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function isValidYouTubeUrl(value: string): boolean {
  return Boolean(extractYouTubeVideoId(value));
}

export function createYouTubeEmbedUrl(value: string): string | null {
  const videoId = extractYouTubeVideoId(value);

  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
}
