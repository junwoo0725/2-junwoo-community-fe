import { renderHeader } from "../components/header.js";
import { PostsAPI, AuthAPI } from "../assets/api.js";
import { setEnabled, fileToDataUrl } from "../assets/utils.js";

renderHeader({ showBack: true });

try {
  await AuthAPI.me();
} catch (_) {
  location.href = "./login.html";
}

const form = document.getElementById("makeForm");
const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");
const fileEl = document.getElementById("file");

const titleH = document.getElementById("titleHelper");
const contentH = document.getElementById("contentHelper");
const btn = document.getElementById("submitBtn");

let fileUrl = null;

fileEl.addEventListener("change", async () => {
  const f = fileEl.files?.[0];
  if (!f) {
    fileUrl = null;
    validate();
    return;
  }
  fileUrl = await fileToDataUrl(f);
  validate();
});

function validate() {
  const title = titleEl.value.trim();
  const content = contentEl.value.trim();

  titleH.textContent = "";
  contentH.textContent = "";

  let ok = true;
  if (!title) {
    ok = false;
    titleH.textContent = "* 제목을 작성해주세요";
  } else if (title.length > 26) {
    ok = false;
    titleH.textContent = "* 제목은 최대 26자까지 작성 가능합니다.";
  }

  if (!content) {
    ok = false;
    contentH.textContent = "* 내용을 작성해주세요";
  }

  setEnabled(btn, ok);
}

titleEl.addEventListener("input", validate);
contentEl.addEventListener("input", validate);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (btn.disabled) return;

  const res = await PostsAPI.create({
    title: titleEl.value.trim(),
    content: contentEl.value.trim(),
    fileUrl,
  });

  const newId = res?.data?.postId;
  location.href = `./post.html?postId=${newId}`;
});

validate();
