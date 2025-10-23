let competitionTimer;
let compTimeLeft = 60;
let compProblems = { 1: [], 2: [], 3: [], 4: [] };
let playerScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
let currentProblems = {}; // store active problems for each player
let optionKeys = {
  1: ["a", "s", "d", "f"],
  2: ["h", "j", "k", "l"],
  3: ["1", "2", "3", "4"],
  4: ["6", "7", "8", "9"],
};

// Format numbers for display: at most 8 significant digits, avoid long float tails.
function formatNumber(n) {
  const num = Number(n);
  if (!isFinite(num)) return String(n);
  let s = num.toPrecision(8);
  if (!s.includes('e')) s = parseFloat(s).toString();
  return s;
}

// Generate 'count' distractors that are close to the correct integer answer.
function generateDistractors(answer, question, count) {
  const distractors = new Set();
  const base = Number(answer);

  // small offsets
  for (let d = 1; distractors.size < count && d <= 6; d++) {
    distractors.add(base + d);
    distractors.add(base - d);
  }

  // Try to parse operands to produce plausible mistakes
  const m = (question || '').match(/(-?\d+)\s*([+\-])\s*\(?(-?\d+)\)?/);
  if (m && distractors.size < count) {
    const a = Number(m[1]);
    const op = m[2];
    const b = Number(m[3]);
    if (op === '+') {
      distractors.add(a - b);
      distractors.add(b - a);
    } else {
      distractors.add(a + b);
    }
    distractors.add(a + 2 * b);
    distractors.add(2 * a + b);
  }

  while (distractors.size < count) {
    const jitter = Math.floor(Math.random() * 5) + 1;
    const cand = base + (Math.random() < 0.5 ? -jitter : jitter);
    if (cand !== base) distractors.add(cand);
  }

  return Array.from(distractors).filter(n => Number.isFinite(n) && n !== base).slice(0, count);
}

function initCompetition() {
  const section = document.getElementById("competition-section");
  // default to AP multiple-choice quiz
  currentTopic = 'ap_long_quiz';
  section.innerHTML = `
    <h2>🏁 AP Quiz Competition</h2>
    <div style="background: linear-gradient(135deg, #e8f5ff, #e0f7fa); padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #0288d1;">
      <p style="margin: 0; color: #0277bd; font-weight: bold;">🏆 Compete with up to 4 players on Araling Panlipunan multiple-choice questions (Migrasyon & Globalisasyon)</p>
    </div>
    
    <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; margin: 1rem 0;">
      <label for="comp-time-select" style="font-weight: bold;">⏱️ Competition Time: </label>
      <input type="number" id="comp-time-select" value="60" min="10" max="600" style="width: 80px;">
      <span>seconds</span>
    </div>

    <div style="display: flex; justify-content: center; gap: 1rem; margin: 0.5rem 0; align-items: center;">
      <label for="comp-player-name" style="font-weight: bold;">Team / Name:</label>
      <input id="comp-player-name" type="text" placeholder="Enter name (optional)" style="width:220px;">
    </div>
    
    <div style="text-align: center; margin: 1rem 0;">
      <button id="comp-start-btn" style="background: linear-gradient(45deg, #f39c12, #e67e22); font-size: 1.1rem; padding: 0.8rem 2rem;">🚀 Start Competition</button>
    </div>
    
    <div style="text-align: center; margin: 1rem 0;">
      <p style="background: #fff3e0; padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #ffb74d; display: inline-block;">
        ⏰ Timer: <span id="comp-timer" style="color: #f57c00; font-weight: bold;">0</span> seconds
      </p>
    </div>
    
    <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #4caf50;">
      <h4 style="color: #2e7d32; margin: 0 0 0.5rem 0;">🎮 Player Controls:</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
        <div><strong>Player 1:</strong> A, S, D, F</div>
        <div><strong>Player 2:</strong> H, J, K, L</div>
        <div><strong>Player 3:</strong> 1, 2, 3, 4</div>
        <div><strong>Player 4:</strong> 6, 7, 8, 9</div>
      </div>
    </div>
    
    <div id="players" class="competition-grid"></div>
    <div id="comp-summary"></div>
  `;

  document
    .getElementById("comp-start-btn")
    .addEventListener("click", startCompetition);
}

function startCompetition() {
  const inputTime = parseInt(document.getElementById("comp-time-select").value);
  compTimeLeft = isNaN(inputTime) ? 60 : Math.max(10, inputTime);

  // Reset question tracker for current topic to ensure fresh start
  if (typeof resetQuestionTracker === 'function') {
    resetQuestionTracker(currentTopic);
  }

  // reset state
  playerScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  compProblems = { 1: [], 2: [], 3: [], 4: [] };
  updateCompetitionDisplay();

  const playersDiv = document.getElementById("players");
  playersDiv.innerHTML = "";

  for (let i = 1; i <= 4; i++) {
    const div = document.createElement("div");
    div.classList.add("player-panel");
    div.innerHTML = `
      <h3>Player ${i}</h3>
      <p>Score: <span id="score-${i}">0</span></p>
      <div id="problem-${i}"></div>
    `;
    playersDiv.appendChild(div);
    generateCompetitionProblem(i);
  }

  clearInterval(competitionTimer);
  competitionTimer = setInterval(() => {
    compTimeLeft--;
    updateCompetitionDisplay();
    if (compTimeLeft <= 0) {
      clearInterval(competitionTimer);
      endCompetition();
    }
  }, 1000);

  document.addEventListener("keydown", handleKeyPress);
}

function generateCompetitionProblem(player) {
  const problemEl = document.getElementById(`problem-${player}`);
  const problem = getProblem();

  // If AP MCQ topic detected, render A-D options with shuffled presentation
  if (currentTopic === 'ap_long_quiz' && problem && problem.options) {
    const question = problem.question;
    const letters = ['A','B','C','D'];
    // Build displayed options array and shuffle their order for players
    const displayed = letters.map(l => ({ letter: l, text: problem.options[l] }));
    // Shuffle displayed order so option keys don't always map to same letter
    for (let i = displayed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [displayed[i], displayed[j]] = [displayed[j], displayed[i]];
    }

    currentProblems[player] = { question, answer: problem.answer, displayed };

    problemEl.innerHTML = `\n      <p>${question}</p>\n      <div class="options-container">\n        ${displayed.map((opt, idx) => `<button class="option-btn">${optionKeys[player][idx]}) ${opt.letter}. ${opt.text}</button>`).join("")}\n      </div>\n    `;
    return;
  }

  // Fallback: numeric conversion problems
  const { question, answer } = problem;

  const close = generateDistractors(answer, question, 3);
  let options = new Set([answer, ...close]);
  options = Array.from(options).sort(() => Math.random() - 0.5);

  currentProblems[player] = { question, answer, options };

  problemEl.innerHTML = `
    <p>${question}</p>
    <div class="options-container">
      ${options.map((opt, idx) => `<button class="option-btn">${optionKeys[player][idx]}) ${formatNumber(opt)}</button>`).join("")}
    </div>
  `;
}

function handleKeyPress(e) {
  const key = e.key.toLowerCase();

  for (let player = 1; player <= 4; player++) {
    const keys = optionKeys[player];
    const idx = keys.indexOf(key);
    if (idx !== -1 && currentProblems[player]) {
      checkCompetitionAnswer(player, idx);
      break;
    }
  }
}

function checkCompetitionAnswer(player, idx) {
  const problem = currentProblems[player];

  // AP MCQ handling
  if (currentTopic === 'ap_long_quiz' && problem && problem.displayed) {
    const selected = problem.displayed[idx]; // {letter, text}
    const chosenLetter = selected.letter;
    const isCorrect = chosenLetter === problem.answer;

    if (isCorrect) playerScores[player]++;
    else playerScores[player]--;

    compProblems[player].push({ question: problem.question, correct: problem.answer, chosen: chosenLetter, result: isCorrect ? "✅" : "❌" });
    document.getElementById(`score-${player}`).textContent = playerScores[player];
    generateCompetitionProblem(player);
    return;
  }

  // Fallback: numeric
  const chosen = problem.options[idx];
  const isCorrect = chosen === problem.answer;

  if (isCorrect) {
    playerScores[player]++;
  } else {
    playerScores[player]--;
  }

  compProblems[player].push({
    question: problem.question,
    correct: problem.answer,
    chosen,
    result: isCorrect ? "✅" : "❌",
  });

  document.getElementById(`score-${player}`).textContent = playerScores[player];

  generateCompetitionProblem(player); // next problem immediately
}

function updateCompetitionDisplay() {
  document.getElementById("comp-timer").textContent = compTimeLeft;
}

function endCompetition() {
  document.getElementById("players").innerHTML = "";
  document.removeEventListener("keydown", handleKeyPress);

  const summaryEl = document.getElementById("comp-summary");

  let summaryHtml = `<h3>Competition Over ⏰</h3>`;
  for (let i = 1; i <= 4; i++) {
    summaryHtml += `
      <h4>Player ${i} - Final Score: ${playerScores[i]}</h4>
      <ul>
        ${compProblems[i]
          .map(
            p =>
              `<li>${p.question} = ${formatNumber(p.correct)} | Answer: ${formatNumber(p.chosen)} ${p.result}</li>`
          )
          .join("")}
      </ul>
    `;
  }
  summaryEl.innerHTML = summaryHtml;

  // Submit aggregated competition results to Google Forms if configured
  try {
    if (typeof isGFormConfigured === 'function' && isGFormConfigured()) {
      const teamName = (document.getElementById('comp-player-name')||{}).value || 'Anonymous';
      // Build a single combined score string, e.g. "P1: 3, P2: 1, P3: 0, P4: -1"
      const combined = Object.keys(playerScores)
        .map(i => `P${i}: ${playerScores[i]}`)
        .join(', ');
      // Use the name field for team and the score field for the combined string
      if (typeof sendScoreToGoogleForm === 'function') {
        sendScoreToGoogleForm(teamName, combined, { mode: 'competition' }).catch(()=>{});
      }
    }
  } catch (e) {
    console.warn('gforms aggregated submission skipped or failed', e);
  }
}
