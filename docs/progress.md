---
title: "📊 Progress Tracker"
layout: default
nav_order: 99
permalink: /progress/
---

# 📊 Your Progress

Track your learning journey through the .NET MAUI tutorial. Quiz answers are saved in your browser.

<div id="progress-overview">
  <div class="progress-bar-container" style="height: 12px; margin: 1.5rem 0;">
    <div class="progress-bar-fill" id="overall-progress" style="width: 0%"></div>
  </div>
  <p id="progress-text" style="text-align: center; font-weight: 600;"></p>
</div>

## Chapter Progress

<div id="chapter-progress-list"></div>

<button class="quiz-btn reset-quiz-btn" style="background: #ef4444; margin-top: 2rem;">🗑️ Reset All Progress</button>

<script>
(function() {
  var chapters = [
    { id: 'ch01', name: '01 — Getting Started', quizzes: 2 },
    { id: 'ch02', name: '02 — Project Structure', quizzes: 2 },
    { id: 'ch03', name: '03 — XAML Basics', quizzes: 3 },
    { id: 'ch04', name: '04 — Layouts & Controls', quizzes: 2 },
    { id: 'ch05', name: '05 — Data Binding & MVVM', quizzes: 3 },
    { id: 'ch06', name: '06 — Navigation', quizzes: 2 },
    { id: 'ch07', name: '07 — Styling & Theming', quizzes: 2 },
    { id: 'ch08', name: '08 — Platform-Specific Code', quizzes: 2 },
    { id: 'ch09', name: '09 — Working with APIs', quizzes: 2 },
    { id: 'ch10', name: '10 — Local Storage', quizzes: 2 },
    { id: 'ch11', name: '11 — Publishing & Deployment', quizzes: 1 },
    { id: 'ch12', name: '12 — Animations', quizzes: 2 },
    { id: 'ch13', name: '13 — Advanced Shell', quizzes: 1 },
    { id: 'ch14', name: '14 — Community Toolkit', quizzes: 2 },
    { id: 'ch15', name: '15 — Dependency Injection', quizzes: 2 },
    { id: 'ch16', name: '16 — Unit Testing', quizzes: 2 },
    { id: 'ch17', name: '17 — Blazor Hybrid', quizzes: 2 },
    { id: 'ch18', name: '18 — Gestures & Touch', quizzes: 2 },
    { id: 'ch19', name: '19 — Media & Camera', quizzes: 2 },
    { id: 'ch20', name: '20 — HybridWebView', quizzes: 2 },
    { id: 'ch21', name: '21 — Native AOT & Performance', quizzes: 3 },
    { id: 'ch22', name: '22 — Real-World Project', quizzes: 3 },
    { id: 'qs', name: '⚡ Quick Start', quizzes: 1 },
    { id: 'wn', name: '🆕 What\'s New', quizzes: 2 },
    { id: 'ts', name: '🐛 Troubleshooting', quizzes: 1 },
    { id: 'arch', name: '🏛️ Architecture', quizzes: 1 }
  ];

  var progress = {};
  try {
    progress = JSON.parse(localStorage.getItem('maui-tutorial-progress')) || {};
  } catch(e) {}

  var totalQuizzes = 0;
  var totalCorrect = 0;
  var html = '';

  chapters.forEach(function(ch) {
    var correct = 0;
    var attempted = 0;
    for (var i = 1; i <= ch.quizzes; i++) {
      var key = ch.id + '-q' + i;
      totalQuizzes++;
      if (progress[key]) {
        attempted++;
        if (progress[key].correct) {
          correct++;
          totalCorrect++;
        }
      }
    }

    var pct = ch.quizzes > 0 ? Math.round((correct / ch.quizzes) * 100) : 0;
    var status = attempted === 0 ? '⬜' : (correct === ch.quizzes ? '✅' : '🔶');

    html += '<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);">';
    html += '<span style="font-size:1.2rem;">' + status + '</span>';
    html += '<span style="flex:1;font-weight:500;">' + ch.name + '</span>';
    html += '<span style="font-size:0.85rem;opacity:0.7;">' + correct + '/' + ch.quizzes + '</span>';
    html += '<div style="width:80px;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">';
    html += '<div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,#7c3aed,#22c55e);border-radius:3px;"></div>';
    html += '</div>';
    html += '</div>';
  });

  document.getElementById('chapter-progress-list').innerHTML = html;

  var overallPct = totalQuizzes > 0 ? Math.round((totalCorrect / totalQuizzes) * 100) : 0;
  document.getElementById('overall-progress').style.width = overallPct + '%';
  document.getElementById('progress-text').textContent =
    totalCorrect + ' of ' + totalQuizzes + ' quiz questions answered correctly (' + overallPct + '%)';
})();
</script>
