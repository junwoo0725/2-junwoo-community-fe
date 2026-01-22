import { renderHeader } from "../components/header.js";
import { AuthAPI, UsersAPI, ApiError } from "../assets/api.js";
import { PW_RE, setEnabled } from "../assets/utils.js";

renderHeader({ showBack: false });

try {
  await AuthAPI.me();
} catch (_) {
  location.href = "./login.html";
}

const pwEl = document.getElementById("pw");
const pw2El = document.getElementById("pw2");
const pwH = document.getElementById("pwHelper");
const pw2H = document.getElementById("pw2Helper");

const btn = document.getElementById("saveBtn");
const toast = document.getElementById("toast");

function validate() {
  pwH.textContent = "";
  pw2H.textContent = "";
  const pw = pwEl.value;
  const pw2 = pw2El.value;

  let ok = true;

  if (!pw) {
    ok = false;
    pwH.textContent = "* 비밀번호를 입력해주세요";
  } else if (!PW_RE.test(pw)) {
    ok = false;
    pwH.textContent =
      "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  if (!pw2) {
    ok = false;
    pw2H.textContent = "* 비밀번호를 한번 더 입력해주세요";
  } else if (pw !== pw2) {
    ok = false;
    pw2H.textContent = "* 비밀번호와 다릅니다.";
  }

  setEnabled(btn, ok);
}

pwEl.addEventListener("input", validate);
pw2El.addEventListener("input", validate);

document.getElementById("pwForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  toast.style.display = "none";
  btn.disabled = true;

  try {
    await UsersAPI.updatePassword({ password: pwEl.value, passwordConfirm: pw2El.value });
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 1500);
    pwEl.value = "";
    pw2El.value = "";
  } catch (err) {
    if (err instanceof ApiError) {
      pw2H.textContent = "* " + err.message;
    } else {
      pw2H.textContent = "* 네트워크 오류가 발생했습니다.";
    }
  } finally {
    validate();
  }
});

validate();
