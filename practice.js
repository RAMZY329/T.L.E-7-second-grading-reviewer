/* Practice mode for unit conversions (Metric & English/US) */
let practiceScore = 0;
let practiceTimer = null;
// fixed to 15 minutes (900 seconds)
let timeLeft = 900;
// reference to the Start button so we can change its text/style
let practiceStartBtn = null;
let solvedProblems = [];
let lastProblem = null;

function formatNumber(n) {
  const num = Number(n);
  if (!isFinite(num)) return String(n);
  if (Number.isInteger(num)) return String(num);
  return parseFloat(num.toFixed(3)).toString();
}

function generateDistractors(answer, question, count) {
  const base = Number(answer);
  const distractors = new Set();
  const isInt = Math.abs(base - Math.round(base)) < 1e-9;

  while (distractors.size < count) {
    let cand;
    if (isInt) {
      const jitter = Math.max(1, Math.floor(Math.abs(base) * 0.1));
      cand = base + (Math.floor(Math.random() * (jitter * 2 + 1)) - jitter);
    } else {
      const pct = (Math.random() * 0.2) - 0.1; // ±10%
      cand = base * (1 + pct);
    }
    if (!Number.isFinite(cand)) continue;
    cand = Number(Number(cand).toFixed(3));
    if (cand === base) continue;
    distractors.add(cand);
  }

  return Array.from(distractors).slice(0, count);
}

function initPractice() {
  const section = document.getElementById('practice-section');
  // Default to TLE question bank for practice
  currentTopic = 'tle_quiz';
  section.innerHTML = `
    <h2>T.L.E. Practice Quiz</h2>
    <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #43a047;">
      <p style="margin: 0; color: #2e7d32; font-weight: bold;">🌾 Practice multiple-choice questions on:</p>
      <ul style="list-style: none; margin: 0.5rem 0 0 0; padding: 0;">
        <li style="display: inline-block; margin: 0.25rem 1rem;">👨‍🌾 Agricultural Jobs</li>
        <li style="display: inline-block; margin: 0.25rem 1rem;">🌱 Crop Maintenance</li>
        <li style="display: inline-block; margin: 0.25rem 1rem;">♻️ Waste Management</li>
      </ul>
    </div>
    <div style="display:flex; justify-content:center; gap:1rem; align-items:center; flex-wrap:wrap;">
      <span style="font-weight:bold;">⏱️ Practice Time: 15:00 (fixed)</span>
  <button id="start-btn">🚀 Start Practice</button>
  <button id="example-btn" disabled title="Examples are disabled for this quiz">💡 Show Example</button>
    </div>
    <div style="display:flex; justify-content:center; gap:0.5rem; margin-top:0.5rem;">
      <label for="player-name" style="font-weight:bold;">Your name:</label>
      <input id="player-name" type="text" placeholder="Enter name (optional)" style="width:200px;">
    </div>
    <div style="margin:1rem 0; display:flex; justify-content:center; gap:2rem; flex-wrap:wrap; align-items:center;">
      <p style="margin:0;">⏰ Timer: <span id="timer" style="font-weight:bold;">00:00</span>
        <span id="timer-indicator" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ccc;margin-left:8px;vertical-align:middle;"></span>
      </p>
      <p style="margin:0;">🏆 Score: <span id="score" style="font-weight:bold;">0</span></p>
      <p style="margin:0;">📊 Progress: <span id="progress" style="font-weight:bold;">0/0</span></p>
    </div>
    <div id="problem"></div>
    <div id="example"></div>
    <div id="summary"></div>
  `;

  practiceStartBtn = document.getElementById('start-btn');
  practiceStartBtn.addEventListener('click', startPractice);
  // Example button is intentionally disabled for AP quiz so users cannot reveal answers
  const exampleBtn = document.getElementById('example-btn');
  if (exampleBtn) {
    exampleBtn.disabled = true;
    exampleBtn.title = 'Examples are disabled for this quiz';
    // attach a harmless handler to avoid missing-element errors elsewhere
    exampleBtn.addEventListener('click', (e) => { e.preventDefault(); });
  }
}

function startPractice() {
  // Prevent creating multiple intervals: if already running, offer to stop early
  if (practiceTimer) {
    if (confirm('Practice session is already running. Would you like to stop and start a new one?')) {
      endPractice();
    } else {
      return;
    }
  }

  // Confirm before starting with more detailed message
  if (!confirm('Ready to start a 15-minute T.L.E. practice quiz?\n\nYou will be tested on:\n- Agricultural Jobs\n- Crop Maintenance\n- Waste Management\n\nClick OK to begin!')) return;

  // Reset question tracker for current topic to ensure fresh start
  if (typeof resetQuestionTracker === 'function') {
    resetQuestionTracker(currentTopic);
  }

  // Always start with fixed 15 minutes (900 seconds)
  timeLeft = 900;
  practiceScore = 0;
  solvedProblems = [];
  updatePracticeDisplay();
  document.getElementById('summary').innerHTML = '';
  document.getElementById('example').innerHTML = '';

  if (practiceTimer) clearInterval(practiceTimer);

  // Update Start button text/style to show running
  if (practiceStartBtn) {
    practiceStartBtn.textContent = '⏳ Stop Practice';
    practiceStartBtn.style.background = '#ff7043';
    practiceStartBtn.style.color = '#fff';
  }

  practiceTimer = setInterval(() => {
    timeLeft--;
    updatePracticeDisplay();
    if (timeLeft <= 0) {
      clearInterval(practiceTimer);
      practiceTimer = null;
      // Inform the user and show summary
      alert("Time's up! Your practice session has ended.");
      endPractice();
    }
  }, 1000);

  generatePracticeProblem();
}

function generatePracticeProblem() {
  const problemEl = document.getElementById('problem');
  const problem = getProblem();
  lastProblem = problem;

  // If the current topic has MCQ options (TLE or AP quiz), render A-D options
  if (problem && problem.options) {
    const question = problem.question;
    const optionsObj = problem.options; // {A: '...', B: '...'}
    problemEl.innerHTML = `\n      <p style="font-weight:bold;">${question}</p>\n      <div id="options" class="options-container"></div>\n    `;

    const optionsDiv = document.getElementById('options');
    ['A','B','C','D'].forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = `${letter}. ${optionsObj[letter]}`;
      btn.addEventListener('click', () => {
        const isCorrect = letter === problem.answer;
        practiceScore += isCorrect ? 1 : -1;
        solvedProblems.push({ question, correct: problem.answer, chosen: letter, result: isCorrect ? '\u2705' : '\u274c' });
        updatePracticeDisplay();
        document.getElementById('example').innerHTML = '';
        setTimeout(generatePracticeProblem, 150);
      });
      optionsDiv.appendChild(btn);
    });
    return;
  }

  // Fallback: keep numeric conversion behavior
  if (!problem) return;
  const { question, answer } = problem;
  // generate 3 distractors
  const distractors = generateDistractors(answer, question, 3);
  const options = [Number(answer), ...distractors].map(n => Number(n));
  // shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  problemEl.innerHTML = `
    <p style="font-weight:bold;">${question}</p>
    <div id="options" class="options-container"></div>
  `;

  const optionsDiv = document.getElementById('options');
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = formatNumber(opt);
    btn.addEventListener('click', () => {
      const isCorrect = Number(opt) === Number(answer);
      practiceScore += isCorrect ? 1 : -1;
      solvedProblems.push({ question, correct: answer, chosen: opt, result: isCorrect ? '\u2705' : '\u274c' });
      updatePracticeDisplay();
      document.getElementById('example').innerHTML = '';
      // small delay so user sees feedback if desired
      setTimeout(generatePracticeProblem, 150);
    });
    optionsDiv.appendChild(btn);
  });
}

function updatePracticeDisplay() {
  const scoreEl = document.getElementById('score');
  const timerEl = document.getElementById('timer');
  if (scoreEl) scoreEl.textContent = practiceScore;
  if (timerEl) timerEl.textContent = formatTime(timeLeft);
  const indicator = document.getElementById('timer-indicator');
  if (indicator) indicator.style.background = practiceTimer ? '#4caf50' : '#ccc';
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

function endPractice() {
  if (practiceTimer) { clearInterval(practiceTimer); practiceTimer = null; }
  document.getElementById('problem').innerHTML = '';
  document.getElementById('example').innerHTML = '';
  const summaryEl = document.getElementById('summary');
  summaryEl.innerHTML = `
    <h3>Practice Over ⏰</h3>
    <p>Final Score: ${practiceScore}</p>
    <h4>Summary:</h4>
    <ul>
      ${solvedProblems.map(p => `<li>${p.question} = ${formatNumber(p.correct)} | Your Answer: ${formatNumber(p.chosen)} ${p.result}</li>`).join('')}
    </ul>
  `;

  // Reset Start button text/style
  if (practiceStartBtn) {
    practiceStartBtn.textContent = '🚀 Start Practice';
    practiceStartBtn.style.background = '';
    practiceStartBtn.style.color = '';
  }

  const indicator = document.getElementById('timer-indicator');
  if (indicator) indicator.style.background = '#ccc';

  // optional: submit to gforms if configured
  try {
    if (typeof isGFormConfigured === 'function' && isGFormConfigured()) {
      const name = (document.getElementById('player-name') || {}).value || 'Anonymous';
      if (typeof sendScoreToGoogleForm === 'function') {
        // send and inform the user on success/failure
        sendScoreToGoogleForm(name, practiceScore, { mode: 'practice' })
          .then(res => {
            try {
              if (res && res.success) {
                // show a friendly confirmation inside the summary area
                const msg = document.createElement('div');
                msg.id = 'gforms-msg';
                msg.style.marginTop = '1rem';
                msg.style.padding = '0.5rem 1rem';
                msg.style.background = '#e8f5e9';
                msg.style.border = '1px solid #c8e6c9';
                msg.style.color = '#2e7d32';
                msg.style.borderRadius = '6px';
                msg.textContent = 'Your score was recorded in Google Forms. Thank you!';
                summaryEl.appendChild(msg);
              } else {
                // fallback notification
                alert('Score submission completed but could not be verified.');
              }
            } catch (e) {
              // fallback to alert if DOM ops fail
              alert('Your score was recorded in Google Forms.');
            }
          })
          .catch(err => {
            console.warn('gforms submission error', err);
            alert('Could not submit score to Google Forms.');
          });
      }
    }
  } catch (e) {
    console.warn('gforms submission error', e);
  }
}

function showExample() {
  // Prevent revealing answers for quiz questions
  if (currentTopic === 'ap_long_quiz' || currentTopic === 'tle_quiz') {
    // Do nothing (examples are disabled for quiz practice)
    return;
  }

  // If lastProblem is an AP MCQ, show the options and highlight the correct letter
  const currentQuestion = (lastProblem && lastProblem.question) || null;
  if (lastProblem && lastProblem.options) {
    const p = lastProblem;
    const q = p.question;
    const correct = p.answer;
    const opts = p.options;
    const html = `
      <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; border-left: 4px solid #1e88e5;">
        <h4 style="color: #1565c0; margin-bottom: 0.5rem;">📝 Example (MCQ)</h4>
        <p style="margin-bottom: 0.5rem;"><strong>Problem:</strong> ${q}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Options:</strong></p>
        <ul>
          <li>A. ${opts.A}${correct === 'A' ? ' ✅' : ''}</li>
          <li>B. ${opts.B}${correct === 'B' ? ' ✅' : ''}</li>
          <li>C. ${opts.C}${correct === 'C' ? ' ✅' : ''}</li>
          <li>D. ${opts.D}${correct === 'D' ? ' ✅' : ''}</li>
        </ul>
        <p style="font-weight:bold;color:#1976d2;">Correct Answer: ${correct}</p>
      </div>
    `;
    document.getElementById('example').innerHTML = html;
    return;
  }

  // Fallback: previous conversion example logic
  const currentQ = currentQuestion;
  let exampleProblem = null;

  // Try to parse current units
  let desiredFrom = null;
  let desiredTo = null;
  if (currentQ) {
    const mcur = currentQ.match(/Convert\s+([0-9.]+)\s+([^\s]+)\s+to\s+([^\s(]+)/i);
    if (mcur) {
      desiredFrom = mcur[2];
      desiredTo = mcur[3];
    }
  }

  if (desiredFrom && desiredTo) {
    for (let attempt = 0; attempt < 20; attempt++) {
      const p = getProblem();
      const mp = (p && p.question) ? p.question.match(/Convert\s+([0-9.]+)\s+([^\s]+)\s+to\s+([^\s(]+)/i) : null;
      if (mp && mp[2] === desiredFrom && mp[3] === desiredTo && p.question !== currentQ) {
        exampleProblem = p;
        break;
      }
    }
  }

  if (!exampleProblem) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const p = getProblem();
      if (!currentQ || p.question !== currentQ) {
        exampleProblem = p;
        break;
      }
    }
  }

  if (!exampleProblem) exampleProblem = lastProblem || getProblem();

  showConversionExample(exampleProblem);
}

function showConversionExample(problem) {
  const q = problem.question || '';
  const ans = problem.answer;
  // Try to parse: Convert <value> <from> to <to>
  const m = q.match(/Convert\s+([0-9.]+)\s+([^\s]+)\s+to\s+([^\s(]+)/i);
  let explanation = '';
  if (m) {
    const value = m[1];
    const fromUnit = m[2];
    const toUnit = m[3];
    explanation = `Method: Convert ${value} ${fromUnit} to base units, then to ${toUnit}.\nCalculated answer: ${formatNumber(ans)} ${toUnit}`;
  } else {
    explanation = `Answer: ${formatNumber(ans)}`;
  }

  document.getElementById('example').innerHTML = `
    <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; border-left: 4px solid #1e88e5;">
      <h4 style="color: #1565c0; margin-bottom: 0.5rem;">🧾 Worked Example</h4>
      <p style="margin-bottom: 0.5rem;"><strong>Problem:</strong> ${q}</p>
      <p style="margin-bottom: 0.5rem;"><strong>Solution:</strong> ${explanation.replace(/\n/g, '<br>')}</p>
      <p style="margin-bottom: 0; font-weight: bold; color: #1976d2;">Answer: ${formatNumber(ans)}</p>
    </div>
  `;
}
