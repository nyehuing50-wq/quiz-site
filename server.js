const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "./users.json";

// 🔥 파일 없으면 자동 생성
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "[]");
}

// 🔥 유저 읽기 (안전 버전)
function getUsers() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (e) {
    return [];
  }
}

// 🔥 유저 저장
function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

// =========================
// 회원가입
// =========================
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  let users = getUsers();

  if (users.find(u => u.username === username)) {
    return res.json({ ok: false, msg: "이미 존재하는 아이디" });
  }

  const hashed = await bcrypt.hash(password, 10);

  users.push({
    username,
    password: hashed
  });

  saveUsers(users);

  res.json({ ok: true });
});

// =========================
// 로그인
// =========================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let users = getUsers();

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.json({ ok: false, msg: "유저 없음" });
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.json({ ok: false, msg: "비밀번호 틀림" });
  }

  res.json({ ok: true });
});

// =========================
// 서버 실행 (Render 대응)
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server running 🚀 on port " + PORT);
});