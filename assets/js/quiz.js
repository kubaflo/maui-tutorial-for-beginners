/**
 * Interactive Quiz System for .NET MAUI Tutorial
 * Works with Jekyll/GitHub Pages — no server needed.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'maui-tutorial-progress';

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch { /* storage unavailable */ }
  }

  function initQuizzes() {
    document.querySelectorAll('.quiz-container').forEach(function (container) {
      var quizId = container.dataset.quizId;
      var correctAnswer = container.dataset.correct;
      var explanation = container.dataset.explanation || '';
      var btn = container.querySelector('.quiz-btn');
      var feedback = container.querySelector('.quiz-feedback');
      var options = container.querySelectorAll('.quiz-options label');
      var radios = container.querySelectorAll('input[type="radio"]');

      if (!btn || !feedback) return;

      // Restore previous answer
      var progress = loadProgress();
      if (progress[quizId]) {
        showResult(container, progress[quizId].selected, correctAnswer, explanation, options, feedback, btn);
      }

      btn.addEventListener('click', function () {
        var selected = container.querySelector('input[type="radio"]:checked');
        if (!selected) return;

        var value = selected.value;
        showResult(container, value, correctAnswer, explanation, options, feedback, btn);

        // Save progress
        progress = loadProgress();
        progress[quizId] = { selected: value, correct: value === correctAnswer };
        saveProgress(progress);

        updateScoreBadges();
      });
    });
  }

  function showResult(container, selectedValue, correctAnswer, explanation, options, feedback, btn) {
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
    if (isCorrect) {
      feedback.textContent = '✅ Correct! ' + explanation;
    } else {
      feedback.textContent = '❌ Not quite. ' + explanation;
    }

    btn.disabled = true;
    btn.textContent = isCorrect ? 'Correct!' : 'Try again next time';
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

  // Fill-in-the-blank exercises
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
            input.style.borderBottomColor = '#22c55e';
          } else {
            input.style.borderBottomColor = '#ef4444';
            allCorrect = false;
          }
        });

        feedback.className = 'quiz-feedback show ' + (allCorrect ? 'correct' : 'incorrect');
        feedback.textContent = allCorrect
          ? '✅ All blanks filled correctly!'
          : '❌ Some answers are incorrect. Check the highlighted fields.';
      });
    });
  }

  // Reset progress button
  function initResetButtons() {
    document.querySelectorAll('.reset-quiz-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      });
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initQuizzes();
      initFillBlanks();
      initResetButtons();
      updateScoreBadges();
    });
  } else {
    initQuizzes();
    initFillBlanks();
    initResetButtons();
    updateScoreBadges();
  }
})();
