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
      : cld(media.value, 700);
  }
  const text = blocks.find((b) => b.type === "text");
  const counts = { text: 0, youtube: 0, image: 0 };
  blocks.forEach((b) => { if (counts[b.type] !== undefined) counts[b.type] += 1; });
  return { thumb, excerpt: text ? text.value.slice(0, 160) : "", counts };
}

// থিম: ডিফল্ট ডার্ক (AI লুক)
function initTheme() {
  const root = document.documentElement;
  const b = $("themeBtn");
  if (localStorage.getItem("theme") !== "light") root.classList.add("dark");
  const sync = () => { if (b) b.textContent = root.classList.contains("dark") ? "☀️" : "🌙"; };
  sync();
  if (b) b.onclick = () => {
    root.classList.toggle("dark");
    try { localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light"); } catch (e) {}
    sync();
  };
}
initTheme();

// নিউরাল-নেটওয়ার্কের মতো অ্যানিমেটেড ব্যাকগ্রাউন্ড
export function startBackground() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const c = document.createElement("canvas");
  c.className = "bg-canvas";
  document.body.prepend(c);
  const ctx = c.getContext("2d");
  let W = 0, H = 0, pts = [];
  const mouse = { x: -9999, y: -9999 };

  function size() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    c.style.width = W + "px"; c.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (W * H) / 22000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
    if (reduced) frame();
  }

  function frame() {
    const dark = document.documentElement.classList.contains("dark");
    const rgb = dark ? "34,211,238" : "37,99,235";
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      if (!reduced) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, 6.283);
      ctx.fillStyle = "rgba(" + rgb + ",.7)";
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.strokeStyle = "rgba(" + rgb + "," + ((1 - d / 130) * 0.25).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      const mx = pts[i].x - mouse.x, my = pts[i].y - mouse.y;
      const md = Math.sqrt(mx * mx + my * my);
      if (md < 160) {
        ctx.strokeStyle = "rgba(167,139,250," + ((1 - md / 160) * 0.5).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  window.addEventListener("resize", size);
  window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  size();
  if (!reduced) frame();
}
