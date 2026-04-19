function showMessage(text, color="red") {
  const msg = document.getElementById("msg");
  msg.innerText = text;
  msg.style.color = color;
}

function showLogin() {
  document.getElementById("msg").innerText = "";
  document.getElementById("formArea").innerHTML = `
    <input id="u" autocomplete="off" placeholder="아이디">
    <input id="p" type="password" autocomplete="off" placeholder="비밀번호">
    <button onclick="login()">로그인</button>
  `;
}

function showRegister() {
  document.getElementById("msg").innerText = "";
  document.getElementById("formArea").innerHTML = `
    <input id="u" autocomplete="off" placeholder="아이디">
    <input id="p" type="password" autocomplete="off" placeholder="비밀번호">
    <button onclick="register()">회원가입</button>
  `;
}

window.onload = () => showLogin();

// 회원가입
async function register() {
  const username = document.getElementById("u").value.trim();
  const password = document.getElementById("p").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({username, password})
  });

  const data = await res.json();

  if (data.ok) showMessage("회원가입 성공", "green");
  else showMessage(data.msg);
}

// 로그인
async function login() {
  const username = document.getElementById("u").value.trim();
  const password = document.getElementById("p").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({username, password})
  });

  const data = await res.json();

  if (data.ok) {
    localStorage.setItem("logged", "true");
    localStorage.setItem("username", username);

    showMessage("로그인 성공", "green");

    setTimeout(() => {
      window.open("/quiz.html", "_blank");
    }, 500);
  } else {
    showMessage(data.msg);
  }
}