import { renderHeader } from "../components/header.js";
import { PostsAPI, AuthAPI } from "../assets/api.js";
import { fileToDataUrl } from "../assets/utils.js";

renderHeader({ showBack: true });

let me = null;
try {
  me = (await AuthAPI.me())?.data;
} catch (_) {
  location.href = "./login.html";
}

const params = new URLSearchParams(location.search);
const postId = Number(params.get("postId"));
if (!postId) location.href = "./posts.html";

const form = document.getElementById("editForm");
const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");
const fileEl = document.getElementById("file");

const titleH = document.getElementById("titleHelper");
const contentH = document.getElementById("contentHelper");

let fileUrl = null;

fileEl.addEventListener("change", async () => {
  const f = fileEl.files?.[0];
  if (!f) return;
  fileUrl = await fileToDataUrl(f);
});

const p = (await PostsAPI.get(postId))?.data;
if (p.authorUserId !== me.userId) {
  location.href = `./post.html?postId=${postId}`;
}

titleEl.value = p.title;
contentEl.value = p.content;
fileUrl = p.fileUrl || null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleEl.value.trim();
  const content = contentEl.value.trim();
  titleH.textContent = "";
  contentH.textContent = "";

  if (!title) {
    titleH.textContent = "* 제목을 작성해주세요";
    return;
  }
  if (title.length > 26) {
    titleH.textContent = "* 제목은 최대 26자까지 작성 가능합니다.";
    return;
  }
  if (!content) {
    contentH.textContent = "* 내용을 작성해주세요";
    return;
  }

  await PostsAPI.update(postId, { title, content, fileUrl });
  location.href = `./post.html?postId=${postId}`;
});
