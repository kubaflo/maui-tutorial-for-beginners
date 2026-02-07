/**
 * .NET MAUI Tutorial — Interactive Quiz & Gamification System
 * XP, streaks, levels, progress tracking — all via localStorage.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'maui-tutorial-progress';
  const GAMIFICATION_KEY = 'maui-tutorial-gamification';
  const XP_PER_CORRECT = 25;
  const XP_PER_CHAPTER = 50;
  const LEVELS = [0, 100, 250, 500, 850, 1300, 1850, 2500, 3300, 4200, 5200];

  // --- Storage helpers ---
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function saveProgress(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }

  function loadGamification() {
    try {
      return JSON.parse(localStorage.getItem(GAMIFICATION_KEY)) || {
        xp: 0, streak: 0, lastVisit: null, completedChapters: []
      };
    } catch {
      return { xp: 0, streak: 0, lastVisit: null, completedChapters: [] };
    }
  }

  function saveGamification(data) {
    try { localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data)); } catch {}
  }

  // --- Level calculation ---
  function getLevel(xp) {
    for (var i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i]) return i + 1;
    }
    return 1;
  }

  // --- Streak tracking ---
  function updateStreak() {
    var g = loadGamification();
    var today = new Date().toDateString();
    if (g.lastVisit === today) return g;

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (g.lastVisit === yesterday.toDateString()) {
      g.streak++;
    } else if (g.lastVisit !== today) {
      g.streak = 1;
    }
    g.lastVisit = today;
    saveGamification(g);
    return g;
  }

  // --- XP Toast ---
  function showXPToast(amount) {
    var existing = document.querySelector('.xp-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'xp-toast';
    toast.textContent = '+' + amount + ' XP ⚡';
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 2000);
  }

  // --- Add XP ---
  function addXP(amount) {
    var g = loadGamification();
    g.xp += amount;
    saveGamification(g);
    updateStatsBar();
    showXPToast(amount);
  }

  // --- Update stats bar on homepage ---
  function updateStatsBar() {
    var g = loadGamification();
    var progress = loadProgress();

    var xpEl = document.getElementById('statXP');
    var streakEl = document.getElementById('statStreak');
    var levelEl = document.getElementById('statLevel');
    var completedEl = document.getElementById('statCompleted');

    if (xpEl) xpEl.textContent = g.xp;
    if (streakEl) streakEl.textContent = g.streak;
    if (levelEl) levelEl.textContent = getLevel(g.xp);

    // Count completed chapters (chapters where all quizzes are correct)
    var chapterMap = {};
    Object.keys(progress).forEach(function (qid) {
      var parts = qid.split('-q');
      var ch = parts[0];
      if (!chapterMap[ch]) chapterMap[ch] = { total: 0, correct: 0 };
      chapterMap[ch].total++;
      if (progress[qid] && progress[qid].correct) chapterMap[ch].correct++;
    });

    var completed = 0;
    Object.keys(chapterMap).forEach(function (ch) {
      if (chapterMap[ch].correct === chapterMap[ch].total && chapterMap[ch].total > 0) completed++;
    });

    if (completedEl) {
      var manualCompleted = (g.completedChapters || []).length;
      var displayCompleted = Math.max(completed, manualCompleted);
      completedEl.textContent = displayCompleted + '/25';
    }

    // Update path card progress circles
    updatePathProgress(chapterMap);
  }

  // --- Update path card SVG progress ---
  function updatePathProgress(chapterMap) {
    var paths = {
      fundamentals: ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06'],
      intermediate: ['ch07', 'ch08', 'ch09', 'ch10', 'ch11', 'ch12'],
      advanced: ['ch13', 'ch14', 'ch15', 'ch16', 'ch17', 'ch18', 'ch19'],
      expert: ['ch20', 'ch21', 'ch22', 'ch23', 'ch24', 'ch25']
    };

    Object.keys(paths).forEach(function (pathName) {
      var el = document.querySelector('[data-path="' + pathName + '"]');
      if (!el) return;

      var chapters = paths[pathName];
      var totalQuizzes = 0;
      var correctQuizzes = 0;

      chapters.forEach(function (ch) {
        if (chapterMap[ch]) {
          totalQuizzes += chapterMap[ch].total;
          correctQuizzes += chapterMap[ch].correct;
        }
      });

      var pct = totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0;
      var circumference = 97.4;
      var offset = circumference - (pct / 100) * circumference;

      var circle = el.querySelector('.progress-fill');
      var text = el.querySelector('.progress-text');
      if (circle) circle.setAttribute('stroke-dashoffset', offset);
      if (text) text.textContent = pct + '%';
    });
  }

  // --- Quiz initialization ---
  function initQuizzes() {
    document.querySelectorAll('.quiz-container').forEach(function (container) {
      var quizId = container.dataset.quizId;
      var correctAnswer = container.dataset.correct;
      var explanation = container.dataset.explanation || '';
      var btn = container.querySelector('.quiz-btn');
      var feedback = container.querySelector('.quiz-feedback');
      var options = container.querySelectorAll('.quiz-options label');

      if (!btn || !feedback) return;

      var progress = loadProgress();
      if (progress[quizId]) {
        showResult(container, progress[quizId].selected, correctAnswer, explanation, options, feedback, btn, false);
      }

      btn.addEventListener('click', function () {
        var selected = container.querySelector('input[type="radio"]:checked');
        if (!selected) return;

        var value = selected.value;
        var isNew = !progress[quizId];
        showResult(container, value, correctAnswer, explanation, options, feedback, btn, true);

        progress = loadProgress();
        progress[quizId] = { selected: value, correct: value === correctAnswer };
        saveProgress(progress);

        if (value === correctAnswer && isNew) {
          addXP(XP_PER_CORRECT);
        }

        updateScoreBadges();
        updateStatsBar();
      });
    });
  }

  function showResult(container, selectedValue, correctAnswer, explanation, options, feedback, btn, animate) {
    var isCorrect = selectedValue === correctAnswer;

    options.forEach(function (label) {
      var radio = label.querySelector('input[type="radio"]');
      label.classList.remove('correct', 'incorrect');
      if (radio.value === correctAnswer) {
        label.classList.add('correct');
      } else if (radio.value === selectedValue && !isCorrect) {
        label.classList.add('incorrect');
      }
      radio.disabled = true;
    });

    feedback.className = 'quiz-feedback show ' + (isCorrect ? 'correct' : 'incorrect');
    var xpBadge = isCorrect && animate ? ' <span class="quiz-xp">+' + XP_PER_CORRECT + ' XP</span>' : '';
    if (isCorrect) {
      feedback.innerHTML = '✅ Correct! ' + explanation + xpBadge;
    } else {
      feedback.innerHTML = '❌ Not quite. ' + explanation;
    }

    btn.disabled = true;
    btn.textContent = isCorrect ? '✓ Correct!' : 'Try again next time';
  }

  function updateScoreBadges() {
    var progress = loadProgress();
    document.querySelectorAll('.quiz-score').forEach(function (badge) {
      var chapter = badge.dataset.chapter;
      if (!chapter) return;

      var quizzes = document.querySelectorAll('.quiz-container[data-quiz-id^="' + chapter + '"]');
      var total = quizzes.length;
      var correct = 0;

      quizzes.forEach(function (q) {
        var qid = q.dataset.quizId;
        if (progress[qid] && progress[qid].correct) correct++;
      });

      badge.textContent = '🏆 Score: ' + correct + '/' + total;
    });
  }

  // --- Fill-in-the-blank ---
  function initFillBlanks() {
    document.querySelectorAll('.fill-blank-exercise').forEach(function (exercise) {
      var btn = exercise.querySelector('.check-blank-btn');
      var inputs = exercise.querySelectorAll('.code-blank input');
      var feedback = exercise.querySelector('.blank-feedback');

      if (!btn || !feedback) return;

      btn.addEventListener('click', function () {
        var allCorrect = true;
        inputs.forEach(function (input) {
          var expected = (input.dataset.answer || '').trim().toLowerCase();
          var userVal = input.value.trim().toLowerCase();
          if (userVal === expected) {
            input.style.borderBottomColor = '#34d399';
          } else {
            input.style.borderBottomColor = '#ef4444';
            allCorrect = false;
          }
        });

        feedback.className = 'quiz-feedback show ' + (allCorrect ? 'correct' : 'incorrect');
        feedback.textContent = allCorrect
          ? '✅ All blanks filled correctly!'
          : '❌ Some answers are incorrect. Check the highlighted fields.';

        if (allCorrect) addXP(XP_PER_CORRECT);
      });
    });
  }

  // --- Chapter completion ---
  function initChapterCompletion() {
    // Only show on chapter pages (those with quiz containers)
    var quizzes = document.querySelectorAll('.quiz-container');
    if (quizzes.length === 0) return;

    // Detect chapter number from first quiz ID
    var firstQuiz = quizzes[0].dataset.quizId || '';
    var chapterMatch = firstQuiz.match(/^ch(\d+)/);
    if (!chapterMatch) return;

    var chapterNum = parseInt(chapterMatch[1], 10);
    var chapterId = 'ch' + String(chapterNum).padStart(2, '0');
    var g = loadGamification();
    var isCompleted = g.completedChapters && g.completedChapters.indexOf(chapterId) !== -1;

    // Check if all quizzes are answered correctly
    var progress = loadProgress();
    var allCorrect = true;
    quizzes.forEach(function (q) {
      var qid = q.dataset.quizId;
      if (!progress[qid] || !progress[qid].correct) allCorrect = false;
    });

    // Create completion banner
    var banner = document.createElement('div');
    banner.className = 'chapter-completion' + (isCompleted ? ' completed' : '');
    banner.innerHTML = isCompleted
      ? '<div class="completion-check">✅</div><div class="completion-text"><strong>Chapter Completed!</strong><br><span>You\'ve mastered this topic. Great job!</span></div>'
      : '<div class="completion-check">' + (allCorrect ? '🎯' : '📖') + '</div><div class="completion-text"><strong>' + (allCorrect ? 'All quizzes passed!' : 'Keep learning!') + '</strong><br><span>' + (allCorrect ? 'Mark this chapter as complete' : 'Answer all quizzes correctly to complete this chapter') + '</span></div>' + (allCorrect ? '<button class="btn-primary complete-chapter-btn" style="margin-left:auto;padding:8px 20px;font-size:0.85rem;">Complete Chapter</button>' : '');

    // Insert before the prev/next nav
    var navLine = document.querySelector('.chapter-nav');
    if (!navLine) {
      // Fall back to inserting before the last <hr> + <p> with Previous/Next
      var allPs = document.querySelectorAll('.main-content p');
      for (var i = allPs.length - 1; i >= 0; i--) {
        if (allPs[i].textContent.indexOf('Previous:') !== -1 || allPs[i].textContent.indexOf('Next:') !== -1) {
          allPs[i].parentNode.insertBefore(banner, allPs[i].previousElementSibling || allPs[i]);
          break;
        }
      }
    } else {
      navLine.parentNode.insertBefore(banner, navLine);
    }

    // Handle completion button
    var completeBtn = banner.querySelector('.complete-chapter-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', function () {
        g = loadGamification();
        if (!g.completedChapters) g.completedChapters = [];
        if (g.completedChapters.indexOf(chapterId) === -1) {
          g.completedChapters.push(chapterId);
          addXP(XP_PER_CHAPTER);
        }
        saveGamification(g);
        banner.className = 'chapter-completion completed';
        banner.innerHTML = '<div class="completion-check">✅</div><div class="completion-text"><strong>Chapter Completed!</strong><br><span>You\'ve mastered this topic. Great job!</span></div>';
        celebrateCompletion();
      });
    }
  }

  // Mini confetti celebration
  function celebrateCompletion() {
    var colors = ['#a855f7', '#6366f1', '#22d3ee', '#34d399', '#fb923c', '#f472b6'];
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:100000;overflow:hidden;';
    document.body.appendChild(container);

    for (var i = 0; i < 50; i++) {
      var particle = document.createElement('div');
      var color = colors[Math.floor(Math.random() * colors.length)];
      var x = Math.random() * 100;
      var delay = Math.random() * 0.5;
      var size = Math.random() * 8 + 4;
      particle.style.cssText = 'position:absolute;top:-10px;left:' + x + '%;width:' + size + 'px;height:' + size + 'px;background:' + color + ';border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';animation:confetti-fall ' + (Math.random() * 2 + 1.5) + 's ease-in ' + delay + 's forwards;opacity:0.9;';
      container.appendChild(particle);
    }

    // Add confetti keyframes if not exists
    if (!document.getElementById('confetti-style')) {
      var style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = '@keyframes confetti-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(' + (Math.random() * 720 - 360) + 'deg); opacity: 0; } }';
      document.head.appendChild(style);
    }

    setTimeout(function () { container.remove(); }, 4000);
  }

  // --- Reset ---
  function initResetButtons() {
    document.querySelectorAll('.reset-quiz-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (confirm('Reset all progress? This clears quiz answers and XP.')) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(GAMIFICATION_KEY);
          location.reload();
        }
      });
    });
  }

  // --- Bootstrap ---
  function init() {
    updateStreak();
    initQuizzes();
    initFillBlanks();
    initResetButtons();
    initChapterCompletion();
    updateScoreBadges();
    updateStatsBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
