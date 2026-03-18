// youtube-latest.js
// Fetches latest video/short/live from a YouTube channel and returns info for notifications
// Usage: Call fetchLatestYouTubeContent(channelId, apiKey)

async function fetchLatestYouTubeContent(channelId, apiKey) {
  if (!channelId || !apiKey) return null;
  try {
    // Get latest video (including shorts)
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&maxResults=1&order=date&type=video&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('YouTube fetch failed');
    const data = await res.json();
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      const item = data.items[0];
      const videoId = (item.id && (item.id.videoId || item.id)) || null;
      const title = item.snippet && item.snippet.title ? item.snippet.title : 'New YouTube Video';
      const isShort = item.id && videoId && videoId.length === 11 && item.snippet && item.snippet.title && /#shorts|short/i.test(item.snippet.title);
      return {
        type: isShort ? 'short' : 'video',
        title,
        url: videoId ? `https://youtu.be/${videoId}` : `https://www.youtube.com/channel/${channelId}`,
        publishedAt: item.snippet.publishedAt
      };
    }
    return null;
  } catch (e) {
    console.warn('YouTube latest fetch error', e);
    return null;
  }
}

window.fetchLatestYouTubeContent = fetchLatestYouTubeContent;
