---
title: "📊 Progress Tracker"
layout: default
nav_order: 99
permalink: /progress/
---

<div class="hero-section" style="padding: 2rem 1rem 1rem;">
  <span class="hero-logo">📊</span>
  <h1 class="hero-title">Your Progress</h1>
  <p class="hero-subtitle">Track your .NET MAUI learning journey. All data stored in your browser.</p>
</div>

<div class="stats-bar" id="progressStatsBar">
  <div class="stat-item">
    <span class="stat-icon">⚡</span>
    <span class="stat-value" id="pStatXP">0</span>
    <span class="stat-label">Total XP</span>
  </div>
  <div class="stat-item">
    <span class="stat-icon">🏆</span>
    <span class="stat-value" id="pStatLevel">1</span>
    <span class="stat-label">Level</span>
  </div>
  <div class="stat-item">
    <span class="stat-icon">🔥</span>
    <span class="stat-value" id="pStatStreak">0</span>
    <span class="stat-label">Day Streak</span>
  </div>
  <div class="stat-item">
    <span class="stat-icon">✅</span>
    <span class="stat-value" id="pStatQuizzes">0/0</span>
    <span class="stat-label">Quizzes</span>
  </div>
</div>

<div style="max-width:700px; margin:0 auto 1.5rem;">
  <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.25rem;">
    <span style="color:var(--text-secondary);">Overall Progress</span>
    <span id="pctLabel" style="color:var(--accent-purple); font-weight:600;">0%</span>
  </div>
  <div class="progress-bar-container" style="height: 10px;">
    <div class="progress-bar-fill" id="overall-progress" style="width: 0%"></div>
  </div>
</div>

<div class="section-header">
  <span class="section-icon">📖</span>
  <h2>Chapter Progress</h2>
</div>

<div id="chapter-progress-list" class="lesson-list"></div>

<div style="text-align:center; margin-top:2.5rem;">
  <button class="btn-secondary reset-quiz-btn" style="border-color: var(--accent-red) !important; color: var(--accent-red) !important;">🗑️ Reset All Progress</button>
</div>

<script>
(function() {
  var chapters = [
    { id: 'ch01', name: 'Getting Started', num: '01', quizzes: 2 },
    { id: 'ch02', name: 'Project Structure', num: '02', quizzes: 2 },
    { id: 'ch03', name: 'XAML Basics', num: '03', quizzes: 3 },
    { id: 'ch04', name: 'Layouts & Controls', num: '04', quizzes: 2 },
    { id: 'ch05', name: 'Data Binding & MVVM', num: '05', quizzes: 3 },
    { id: 'ch06', name: 'Navigation', num: '06', quizzes: 2 },
    { id: 'ch07', name: 'Styling & Theming', num: '07', quizzes: 2 },
    { id: 'ch08', name: 'Platform-Specific Code', num: '08', quizzes: 2 },
    { id: 'ch09', name: 'Working with APIs', num: '09', quizzes: 2 },
    { id: 'ch10', name: 'Local Storage', num: '10', quizzes: 2 },
    { id: 'ch11', name: 'Publishing & Deployment', num: '11', quizzes: 1 },
    { id: 'ch12', name: 'Animations', num: '12', quizzes: 2 },
    { id: 'ch13', name: 'Advanced Shell', num: '13', quizzes: 1 },
    { id: 'ch14', name: 'Community Toolkit', num: '14', quizzes: 2 },
    { id: 'ch15', name: 'Dependency Injection', num: '15', quizzes: 2 },
    { id: 'ch16', name: 'Unit Testing', num: '16', quizzes: 2 },
    { id: 'ch17', name: 'Blazor Hybrid', num: '17', quizzes: 2 },
    { id: 'ch18', name: 'Gestures & Touch', num: '18', quizzes: 2 },
    { id: 'ch19', name: 'Media & Camera', num: '19', quizzes: 2 },
    { id: 'ch20', name: 'HybridWebView', num: '20', quizzes: 2 },
    { id: 'ch21', name: 'Native AOT & Performance', num: '21', quizzes: 3 },
    { id: 'ch22', name: 'Real-World Project', num: '22', quizzes: 3 }
  ];

  var progress = {};
  try { progress = JSON.parse(localStorage.getItem('maui-tutorial-progress')) || {}; } catch(e) {}
  var gamification = {};
  try { gamification = JSON.parse(localStorage.getItem('maui-tutorial-gamification')) || {}; } catch(e) {}

  var LEVELS = [0, 100, 250, 500, 850, 1300, 1850, 2500, 3300, 4200, 5200];
  function getLevel(xp) {
    for (var i = LEVELS.length - 1; i >= 0; i--) { if (xp >= LEVELS[i]) return i + 1; }
    return 1;
  }

  var totalQuizzes = 0, totalCorrect = 0;
  var html = '';

  chapters.forEach(function(ch) {
    var correct = 0, attempted = 0;
    for (var i = 1; i <= ch.quizzes; i++) {
      var key = ch.id + '-q' + i;
      totalQuizzes++;
      if (progress[key]) {
        attempted++;
        if (progress[key].correct) { correct++; totalCorrect++; }
      }
    }

    var pct = ch.quizzes > 0 ? Math.round((correct / ch.quizzes) * 100) : 0;
    var status = attempted === 0 ? '⬜' : (correct === ch.quizzes ? '✅' : '🔶');
    var statusColor = attempted === 0 ? 'var(--text-muted)' : (correct === ch.quizzes ? 'var(--accent-green)' : 'var(--accent-orange)');

    html += '<div class="lesson-item" style="cursor:default;">';
    html += '<span class="lesson-num" style="background:' + (correct === ch.quizzes && ch.quizzes > 0 ? 'linear-gradient(135deg, var(--accent-green), #059669)' : 'var(--gradient-primary)') + ';">' + ch.num + '</span>';
    html += '<div class="lesson-info" style="flex:1;">';
    html += '<div class="lesson-title">' + status + ' ' + ch.name + '</div>';
    html += '<div style="display:flex; align-items:center; gap:8px; margin-top:4px;">';
    html += '<div class="progress-bar-container" style="height:4px; flex:1; max-width:120px;">';
    html += '<div class="progress-bar-fill" style="width:' + pct + '%;"></div>';
    html += '</div>';
    html += '<span class="lesson-meta">' + correct + '/' + ch.quizzes + ' correct</span>';
    html += '</div></div></div>';
  });

  document.getElementById('chapter-progress-list').innerHTML = html;

  var overallPct = totalQuizzes > 0 ? Math.round((totalCorrect / totalQuizzes) * 100) : 0;
  document.getElementById('overall-progress').style.width = overallPct + '%';
  document.getElementById('pctLabel').textContent = overallPct + '%';

  var xp = gamification.xp || 0;
  document.getElementById('pStatXP').textContent = xp;
  document.getElementById('pStatLevel').textContent = getLevel(xp);
  document.getElementById('pStatStreak').textContent = gamification.streak || 0;
  document.getElementById('pStatQuizzes').textContent = totalCorrect + '/' + totalQuizzes;
})();
</script>
