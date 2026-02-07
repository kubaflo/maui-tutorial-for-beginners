---
title: .NET MAUI Tutorial for Beginners
layout: home
nav_order: 0
description: "A comprehensive, step-by-step guide to building cross-platform apps with .NET MAUI 10"
permalink: /
---

<!-- SVG Gradient Definition for Progress Circles -->
<svg width="0" height="0" style="position:absolute">
  <defs>
    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a855f7"/>
      <stop offset="100%" style="stop-color:#6366f1"/>
    </linearGradient>
  </defs>
</svg>

<div class="hero-section">
  <img src="{{ '/assets/images/hero-devices.svg' | relative_url }}" alt="Cross-platform app development" class="hero-illustration" style="max-width: 340px; margin: 0 auto 1.5rem; display: block;">
  <h1 class="hero-title">.NET MAUI Tutorial</h1>
  <p class="hero-subtitle">Master cross-platform app development with 25 interactive lessons, hands-on exercises, and real-world projects — powered by .NET 10 LTS</p>
  <div class="hero-buttons">
    <a href="{% link docs/01-getting-started.md %}" class="btn-primary">▶ Start Learning</a>
    <a href="{% link docs/quickstart.md %}" class="btn-secondary">⚡ Quick Start</a>
    <a href="{% link docs/progress.md %}" class="btn-secondary">📊 My Progress</a>
  </div>
</div>

<div class="stats-bar" id="statsBar">
  <div class="stat-item">
    <img src="{{ '/assets/images/icons/xp.svg' | relative_url }}" alt="" class="stat-icon-img">
    <span class="stat-value" id="statXP">0</span>
    <span class="stat-label">XP Earned</span>
  </div>
  <div class="stat-item">
    <img src="{{ '/assets/images/icons/streak.svg' | relative_url }}" alt="" class="stat-icon-img">
    <span class="stat-value" id="statStreak">0</span>
    <span class="stat-label">Day Streak</span>
  </div>
  <div class="stat-item">
    <img src="{{ '/assets/images/icons/level.svg' | relative_url }}" alt="" class="stat-icon-img">
    <span class="stat-value" id="statLevel">1</span>
    <span class="stat-label">Level</span>
  </div>
  <div class="stat-item">
    <img src="{{ '/assets/images/icons/completed.svg' | relative_url }}" alt="" class="stat-icon-img">
    <span class="stat-value" id="statCompleted">0/25</span>
    <span class="stat-label">Completed</span>
  </div>
</div>

<div class="section-header">
  <img src="{{ '/assets/images/icons/roadmap.svg' | relative_url }}" alt="" style="width:32px;height:32px;">
  <h2>Learning Paths</h2>
</div>

<div class="path-cards">
  <a href="{% link docs/01-getting-started.md %}" class="path-card fade-in-up">
    <div class="path-card-header">
      <img src="{{ '/assets/images/icons/fundamentals.svg' | relative_url }}" alt="" class="path-card-icon-img">
      <div class="path-card-progress" data-path="fundamentals">
        <svg viewBox="0 0 36 36">
          <circle class="progress-bg" cx="18" cy="18" r="15.5"/>
          <circle class="progress-fill" cx="18" cy="18" r="15.5" stroke-dasharray="97.4" stroke-dashoffset="97.4"/>
        </svg>
        <span class="progress-text">0%</span>
      </div>
    </div>
    <h3 class="path-card-title">Fundamentals</h3>
    <p class="path-card-desc">Setup, XAML, layouts, data binding, MVVM, and navigation basics</p>
    <div class="path-card-meta">
      <span class="path-card-tag beginner">Beginner</span>
      <span class="path-card-tag">6 Lessons</span>
    </div>
  </a>

  <a href="{% link docs/07-styling-and-theming.md %}" class="path-card fade-in-up">
    <div class="path-card-header">
      <img src="{{ '/assets/images/icons/intermediate.svg' | relative_url }}" alt="" class="path-card-icon-img">
      <div class="path-card-progress" data-path="intermediate">
        <svg viewBox="0 0 36 36">
          <circle class="progress-bg" cx="18" cy="18" r="15.5"/>
          <circle class="progress-fill" cx="18" cy="18" r="15.5" stroke-dasharray="97.4" stroke-dashoffset="97.4"/>
        </svg>
        <span class="progress-text">0%</span>
      </div>
    </div>
    <h3 class="path-card-title">Intermediate</h3>
    <p class="path-card-desc">Styling, REST APIs, local storage, publishing, and animations</p>
    <div class="path-card-meta">
      <span class="path-card-tag intermediate">Intermediate</span>
      <span class="path-card-tag">6 Lessons</span>
    </div>
  </a>

  <a href="{% link docs/13-shell-advanced.md %}" class="path-card fade-in-up">
    <div class="path-card-header">
      <img src="{{ '/assets/images/icons/advanced.svg' | relative_url }}" alt="" class="path-card-icon-img">
      <div class="path-card-progress" data-path="advanced">
        <svg viewBox="0 0 36 36">
          <circle class="progress-bg" cx="18" cy="18" r="15.5"/>
          <circle class="progress-fill" cx="18" cy="18" r="15.5" stroke-dasharray="97.4" stroke-dashoffset="97.4"/>
        </svg>
        <span class="progress-text">0%</span>
      </div>
    </div>
    <h3 class="path-card-title">Advanced</h3>
    <p class="path-card-desc">Shell, Community Toolkit, DI, testing, Blazor, gestures, media</p>
    <div class="path-card-meta">
      <span class="path-card-tag advanced">Advanced</span>
      <span class="path-card-tag">7 Lessons</span>
    </div>
  </a>

  <a href="{% link docs/20-hybridwebview.md %}" class="path-card fade-in-up">
    <div class="path-card-header">
      <img src="{{ '/assets/images/icons/expert.svg' | relative_url }}" alt="" class="path-card-icon-img">
      <div class="path-card-progress" data-path="expert">
        <svg viewBox="0 0 36 36">
          <circle class="progress-bg" cx="18" cy="18" r="15.5"/>
          <circle class="progress-fill" cx="18" cy="18" r="15.5" stroke-dasharray="97.4" stroke-dashoffset="97.4"/>
        </svg>
        <span class="progress-text">0%</span>
      </div>
    </div>
    <h3 class="path-card-title">Expert</h3>
    <p class="path-card-desc">HybridWebView, Native AOT, maps, accessibility, real-world project</p>
    <div class="path-card-meta">
      <span class="path-card-tag advanced">Expert</span>
      <span class="path-card-tag">6 Lessons</span>
    </div>
  </a>
</div>

<div class="section-header">
  <img src="{{ '/assets/images/icons/cheatsheet.svg' | relative_url }}" alt="" style="width:32px;height:32px;">
  <h2>All Lessons</h2>
</div>

<div class="lesson-list">
  <a href="{% link docs/01-getting-started.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">01</span>
    <div class="lesson-info">
      <div class="lesson-title">Getting Started</div>
      <div class="lesson-meta">Install tools, create your first app · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/02-project-structure.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">02</span>
    <div class="lesson-info">
      <div class="lesson-title">Project Structure</div>
      <div class="lesson-meta">Anatomy of a MAUI project · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/03-xaml-basics.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">03</span>
    <div class="lesson-info">
      <div class="lesson-title">XAML Basics</div>
      <div class="lesson-meta">Syntax, markup extensions, resources · 3 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/04-layouts-and-controls.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">04</span>
    <div class="lesson-info">
      <div class="lesson-title">Layouts & Controls</div>
      <div class="lesson-meta">Grid, StackLayout, CollectionView · 3 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/05-data-binding-mvvm.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">05</span>
    <div class="lesson-info">
      <div class="lesson-title">Data Binding & MVVM</div>
      <div class="lesson-meta">MVVM pattern and data binding · 3 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/06-navigation.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">06</span>
    <div class="lesson-info">
      <div class="lesson-title">Navigation</div>
      <div class="lesson-meta">Shell, tabs, flyout, passing data · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/07-styling-and-theming.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">07</span>
    <div class="lesson-info">
      <div class="lesson-title">Styling & Theming</div>
      <div class="lesson-meta">Styles, themes, custom fonts · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/08-platform-specific-code.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">08</span>
    <div class="lesson-info">
      <div class="lesson-title">Platform-Specific Code</div>
      <div class="lesson-meta">Conditional compilation, partial classes · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/09-working-with-apis.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">09</span>
    <div class="lesson-info">
      <div class="lesson-title">Working with APIs</div>
      <div class="lesson-meta">REST APIs with HttpClient · 3 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/10-local-storage.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">10</span>
    <div class="lesson-info">
      <div class="lesson-title">Local Storage</div>
      <div class="lesson-meta">Preferences, SecureStorage, SQLite · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/11-publishing-deployment.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">11</span>
    <div class="lesson-info">
      <div class="lesson-title">Publishing & Deployment</div>
      <div class="lesson-meta">App stores and CI/CD · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/12-animations.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">12</span>
    <div class="lesson-info">
      <div class="lesson-title">Animations</div>
      <div class="lesson-meta">View animations and easing functions · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/13-shell-advanced.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">13</span>
    <div class="lesson-info">
      <div class="lesson-title">Advanced Shell</div>
      <div class="lesson-meta">Search, flyout customization · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/14-community-toolkit.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">14</span>
    <div class="lesson-info">
      <div class="lesson-title">Community Toolkit</div>
      <div class="lesson-meta">Converters, behaviors, popups · 3 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/15-dependency-injection.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">15</span>
    <div class="lesson-info">
      <div class="lesson-title">Dependency Injection</div>
      <div class="lesson-meta">DI and service lifetimes · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/16-unit-testing.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">16</span>
    <div class="lesson-info">
      <div class="lesson-title">Unit Testing</div>
      <div class="lesson-meta">xUnit, mocking, testing ViewModels · 3 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/17-maui-blazor-hybrid.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">17</span>
    <div class="lesson-info">
      <div class="lesson-title">Blazor Hybrid</div>
      <div class="lesson-meta">Razor components in MAUI · 3 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/18-gestures-and-touch.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">18</span>
    <div class="lesson-info">
      <div class="lesson-title">Gestures & Touch</div>
      <div class="lesson-meta">Tap, swipe, pan, drag-and-drop · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/19-media-and-camera.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">19</span>
    <div class="lesson-info">
      <div class="lesson-title">Media & Camera</div>
      <div class="lesson-meta">Photos, video, file picking · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/20-hybridwebview.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">20</span>
    <div class="lesson-info">
      <div class="lesson-title">HybridWebView & JS Interop</div>
      <div class="lesson-meta">Embed web content, JS interop · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/21-native-aot-performance.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">21</span>
    <div class="lesson-info">
      <div class="lesson-title">Native AOT & Performance</div>
      <div class="lesson-meta">AOT compilation, XAML source gen · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/22-real-world-project.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">22</span>
    <div class="lesson-info">
      <div class="lesson-title">Real-World Project</div>
      <div class="lesson-meta">Build a complete task manager app · Capstone</div>
    </div>
  </a>
  <a href="{% link docs/23-maps-location.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">23</span>
    <div class="lesson-info">
      <div class="lesson-title">Maps & Location</div>
      <div class="lesson-meta">GPS, geocoding, pins, map controls · 3 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/24-accessibility.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">24</span>
    <div class="lesson-info">
      <div class="lesson-title">Accessibility</div>
      <div class="lesson-meta">Screen readers, semantic properties, WCAG · 2 quizzes</div>
    </div>
  </a>
  <a href="{% link docs/25-notifications-background.md %}" class="lesson-item fade-in-up">
    <span class="lesson-num">25</span>
    <div class="lesson-info">
      <div class="lesson-title">Notifications & Background Tasks</div>
      <div class="lesson-meta">Local notifications, background services, connectivity · 2 quizzes</div>
    </div>
  </a>
</div>

<div class="section-header">
  <img src="{{ '/assets/images/icons/architecture.svg' | relative_url }}" alt="" style="width:32px;height:32px;">
  <h2>Resources & Reference</h2>
</div>

<div class="resource-grid">
  <a href="{% link docs/quickstart.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/quickstart.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">Quick Start</div>
    <div class="resource-card-desc">5-minute setup guide</div>
  </a>
  <a href="{% link docs/cheat-sheet.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/cheatsheet.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">Cheat Sheet</div>
    <div class="resource-card-desc">Common patterns & snippets</div>
  </a>
  <a href="{% link docs/architecture.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/architecture.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">Architecture</div>
    <div class="resource-card-desc">MVVM, repository, messaging</div>
  </a>
  <a href="{% link docs/best-practices.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/practices.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">Best Practices</div>
    <div class="resource-card-desc">Production coding standards</div>
  </a>
  <a href="{% link docs/whats-new.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/whatsnew.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">What's New</div>
    <div class="resource-card-desc">MAUI 10 features</div>
  </a>
  <a href="{% link docs/challenges.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/challenges.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">Challenges</div>
    <div class="resource-card-desc">Practice projects to build</div>
  </a>
  <a href="{% link docs/troubleshooting.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/troubleshoot.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">Troubleshooting</div>
    <div class="resource-card-desc">Common mistakes & fixes</div>
  </a>
  <a href="{% link docs/faq.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/faq.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">FAQ & Glossary</div>
    <div class="resource-card-desc">Questions & terminology</div>
  </a>
  <a href="{% link docs/progress.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/progress.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">Progress Tracker</div>
    <div class="resource-card-desc">Track your quiz scores</div>
  </a>
  <a href="{% link docs/playground.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/playground.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">XAML Playground</div>
    <div class="resource-card-desc">Live XAML layout editor</div>
  </a>
  <a href="{% link docs/roadmap.md %}" class="resource-card fade-in-up">
    <img src="{{ '/assets/images/icons/roadmap.svg' | relative_url }}" alt="" class="resource-card-icon-img">
    <div class="resource-card-title">Learning Roadmap</div>
    <div class="resource-card-desc">Visual learning path guide</div>
  </a>
</div>

<div style="text-align:center; margin-top:3rem; padding:1.5rem; color: var(--text-muted); font-size: 0.85rem;">
  <p>Prerequisites: Basic C# · <a href="https://dotnet.microsoft.com/download/dotnet/10.0">.NET 10 SDK</a> · <a href="https://visualstudio.microsoft.com/">Visual Studio 2022</a> (v17.12+)</p>
  <p style="margin-top:0.5rem;">Built with ❤️ by <a href="https://github.com/kubaflo">kubaflo</a></p>
</div>
