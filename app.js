export const $ = (id) => document.getElementById(id);

export function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

export function fmtDate(d) {
  if (!d) return "";
  const date = d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
}

export function safeImgSrc(s) {
  return /^https:\/\/\S+$/.test(s || "") ? s : "";
}

// Cloudinary ছবি ছোট ও হালকা করে দেখানোর জন্য
export function cld(url, w) {
  try {
    const u = new URL(url);
    if (u.hostname === "res.cloudinary.com" && url.includes("/image/upload/")) {
      return url.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_" + w + "/");
    }
  } catch (e) {}
  return url;
}

export function ytEmbed(id) {
  const w = el("div", "video");
  const f = document.createElement("iframe");
  f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id);
  f.allow = "accelerometer; encrypted-media; picture-in-picture; fullscreen";
  f.allowFullscreen = true;
  f.loading = "lazy";
  f.title = "YouTube video";
  w.append(f);
  return w;
}

// তালিকার কার্ডের জন্য সংক্ষিপ্ত তথ্য
export function summarize(p) {
  const blocks = p.blocks || [];
  const media = blocks.find((b) => b.type === "youtube" || b.type === "image");
  let thumb = "";
  if (media) {
    thumb = media.type === "youtube"
      ? "https://img.youtube.com/vi/" + media.value + "/hqdefault.jpg"
      : cld(media.value, 600);
  }
  const text = blocks.find((b) => b.type === "text");
  const counts = { text: 0, youtube: 0, image: 0 };
  blocks.forEach((b) => { if (counts[b.type] !== undefined) counts[b.type] += 1; });
  return { thumb, excerpt: text ? text.value.slice(0, 160) : "", counts };
}

function initTheme() {
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  const b = $("themeBtn");
  if (b) b.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  };
}
initTheme();
