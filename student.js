let quizWords = [];
let currentWord = null;
let wrongList = [];
let total = 0;
let correctCount = 0;
let retryMode = false;

window.onload = function() {
  const units = JSON.parse(localStorage.getItem("units") || "{}");
  const unitSelect = document.getElementById("unitSelect");
  Object.keys(units).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    unitSelect.appendChild(opt);
  });

  document.getElementById("startBtn").onclick = () => {
    const unit = unitSelect.value;
    if (!unit) return alert("単元を選んでください。");
    quizWords = Object.entries(units[unit]);
    total = quizWords.length;
    correctCount = 0;
    wrongList = [];
    document.getElementById("selectArea").style.display = "none";
    document.getElementById("quizArea").style.display = "block";
    nextQuestion();
  };

  document.getElementById("answerInput").addEventListener("keydown", e => {
    if (e.key === "Enter") checkAnswer();
  });

  document.getElementById("endBtn").onclick = endTest;
  document.getElementById("retryBtn").onclick = startRetry;
};

function nextQuestion() {
  if (quizWords.length === 0) return endTest();
  const randomIndex = Math.floor(Math.random() * quizWords.length);
  currentWord = quizWords.splice(randomIndex, 1)[0];
  document.getElementById("quizWord").textContent = currentWord[0];
  document.getElementById("result").textContent = "";
  document.getElementById("progress").textContent =
    `${total - quizWords.length}/${total}問`;
  const input = document.getElementById("answerInput");
  input.value = "";
  input.focus();
}

function checkAnswer() {
  const input = document.getElementById("answerInput");
  const answer = input.value.trim();
  if (!answer) return;

  const correct = currentWord[1];
  const result = document.getElementById("result");

  if (answer.toLowerCase() === correct.toLowerCase()) {
    result.textContent = "✅ 正解！もう一度Enterで次へ";
    correctCount++;
  } else {
    result.textContent = `❌ 正解は「${correct}」です。Enterで次へ`;
    wrongList.push(currentWord);
  }

  input.value = "";
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      input.onkeydown = (e) => { if (e.key === "Enter") checkAnswer(); };
      nextQuestion();
    }
  };
}

function endTest() {
  document.getElementById("quizArea").style.display = "none";
  const retryArea = document.getElementById("retryArea");
  retryArea.style.display = "block";

  retryArea.innerHTML = `
    <h2>テスト終了！</h2>
    <p>正解数：${correctCount} / ${total}</p>
    ${
      wrongList.length > 0
        ? `<p>間違えた問題数：${wrongList.length}</p><button id="retryBtn">間違いだけ再挑戦</button>`
        : `<p>全問正解です！</p>`
    }
    <button onclick="location.reload()">最初から</button>
  `;

  if (wrongList.length > 0) {
    document.getElementById("retryBtn").onclick = startRetry;
  }
}

function startRetry() {
  if (wrongList.length === 0) {
    alert("間違いはありません！");
    location.reload();
    return;
  }
  quizWords = [...wrongList];
  total = quizWords.length;
  correctCount = 0;
  wrongList = [];
  retryMode = true;
  document.getElementById("retryArea").style.display = "none";
  document.getElementById("quizArea").style.display = "block";
  nextQuestion();
}