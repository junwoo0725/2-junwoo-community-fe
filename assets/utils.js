import { API_BASE } from "./config.js";
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PW_RE = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;

export function setEnabled(btn, enabled) {
  btn.disabled = !enabled;
  btn.classList.toggle("enabled", enabled);
}

export function formatDate(isoLike) {
  if (!isoLike) return "";
  const d = new Date(isoLike);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export function formatCount(n) {
  const v = Number(n || 0);
  if (v >= 100000) return `${Math.floor(v / 1000)}k`;
  if (v >= 10000) return `${Math.floor(v / 1000)}k`;
  if (v >= 1000) return `${Math.floor(v / 1000)}k`;
  return String(v);
}

export async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function getFileUrl(url) {
  if (!url) return "";
  if (url.startsWith("/public/")) {
    return `${API_BASE}${url}`;
  }
  return url;
}
