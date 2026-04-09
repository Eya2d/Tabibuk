// ===== DATA =====
// فقط IDs بدون عناوين — تُجلب تلقائياً من YouTube oEmbed
const DATA_RAW = {
  شائعة: [
    { id: "Gx_qtne5uT8", category: "شائعة" },

  ],
  بشرة: [
    
  ],
};
DATA_RAW.الكل = [...DATA_RAW.شائعة, ...DATA_RAW.بشرة];

// ===== TITLE CACHE =====
// يحفظ العناوين في localStorage لتجنّب طلبات متكررة
const TITLE_CACHE_KEY = "yt_title_cache_v1";

function getTitleCache() {
  try { return JSON.parse(localStorage.getItem(TITLE_CACHE_KEY) || "{}"); }
  catch { return {}; }
}
function saveTitleCache(cache) {
  try { localStorage.setItem(TITLE_CACHE_KEY, JSON.stringify(cache)); }
  catch {}
}

// جلب عنوان فيديو واحد عبر oEmbed (بدون API Key)
async function fetchVideoTitle(id) {
  const cache = getTitleCache();
  if (cache[id]) return cache[id];
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
    );
    if (!res.ok) throw new Error();
    const d = await res.json();
    const title = d.title || id;
    const c = getTitleCache();
    c[id] = title;
    saveTitleCache(c);
    return title;
  } catch {
    return id;
  }
}

// جلب عناوين مجموعة من الفيديوهات دفعةً واحدة (6 بالتوازي)
async function enrichVideos(videos) {
  const cache = getTitleCache();
  const missing = videos.filter(v => !cache[v.id]);
  const BATCH = 6;
  for (let i = 0; i < missing.length; i += BATCH) {
    await Promise.all(missing.slice(i, i + BATCH).map(v => fetchVideoTitle(v.id)));
  }
  const updated = getTitleCache();
  return videos.map(v => ({ ...v, title: updated[v.id] || v.title || v.id }));
}

// ===== DATA (متوافق مع الكود القديم) =====
// يبدأ بعناوين مخزّنة سابقاً، تُحدَّث بعد enrichVideos()
const DATA = {
  شائعة: DATA_RAW.شائعة.map(v => ({ ...v, title: getTitleCache()[v.id] || "جاري التحميل..." })),
  بشرة:  DATA_RAW.بشرة.map(v  => ({ ...v, title: getTitleCache()[v.id] || "جاري التحميل..." })),
};
DATA.الكل = [...DATA.شائعة, ...DATA.بشرة];

// ===== WATCH HISTORY =====
function getWatchHistory() {
  try { return JSON.parse(localStorage.getItem("watchHistory") || "[]"); }
  catch { return []; }
}
function addToWatchHistory(video) {
  let h = getWatchHistory();
  h = h.filter(v => v.id !== video.id);
  h.unshift({ ...video, watchedAt: Date.now() });
  h = h.slice(0, 5);
  localStorage.setItem("watchHistory", JSON.stringify(h));
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  const m = Math.floor(s / 60), hr = Math.floor(m / 60),
        d = Math.floor(hr / 24), w = Math.floor(d / 7), mo = Math.floor(d / 30);
  if (mo > 0) return `منذ ${mo} شهر`;
  if (w  > 0) return `منذ ${w} أسبوع`;
  if (d  > 0) return `منذ ${d} يوم`;
  if (hr > 0) return `منذ ${hr} ساعة`;
  if (m  > 0) return `منذ ${m} دقيقة`;
  return "منذ لحظات";
}
function getYoutubeThumbnail(id) {
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}