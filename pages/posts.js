import { renderHeader } from "../components/header.js";
import { PostsAPI, UsersAPI, AuthAPI } from "../assets/api.js";
import { formatDate, formatCount } from "../assets/utils.js";

renderHeader({ showBack: false });

// 로그인 유저 확인(안되어 있으면 로그인으로)
try {
  await AuthAPI.me();
} catch (_) {
  location.href = "./login.html";
}

const cardsEl = document.getElementById("cards");
const goMake = document.getElementById("goMake");
goMake.addEventListener("click", () => (location.href = "./make-post.html"));

let offset = 0;
const limit = 10;
let loading = false;
let done = false;

async function renderPosts() {
  if (loading || done) return;
  loading = true;

  const res = await PostsAPI.list({ offset, limit });
  const items = res?.data?.items || [];

  if (offset === 0 && items.length === 0) {
    cardsEl.innerHTML = `<div style="text-align:center; color:#6B7280; padding:24px 0;">게시글이 없습니다. 첫 게시글을 작성해보세요.</div>`;
    done = true;
    loading = false;
    return;
  }

  if (items.length < limit) done = true;

  for (const p of items) {
    let author = null;
    try {
      const u = await UsersAPI.getUser(p.authorUserId);
      author = u?.data;
    } catch (_) {}

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="card-title">${escapeHtml(p.title)}</div>
      <div class="card-meta">
        <div class="card-stats">
          <span>좋아요 ${formatCount(p.likeCount)}</span>
          <span>댓글 ${formatCount(p.commentCount || 0)}</span>
          <span>조회수 ${formatCount(p.hits)}</span>
        </div>
        <div>${formatDate(p.createdAt)}</div>
      </div>
      <div class="card-author">
        <div class="mini-avatar">${author?.profileImageUrl ? `<img alt="a" src="${author.profileImageUrl}">` : ""}</div>
        <div class="name">${author?.nickname || `user#${p.authorUserId}`}</div>
      </div>
    `;
    div.addEventListener("click", () => (location.href = `./post.html?postId=${p.postId}`));
    cardsEl.appendChild(div);
  }

  offset += items.length;
  loading = false;
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// infinite scroll
const sentinel = document.getElementById("sentinel");
const io = new IntersectionObserver(async (entries) => {
  if (entries.some((e) => e.isIntersecting)) {
    await renderPosts();
  }
});
io.observe(sentinel);

// initial
await renderPosts();
