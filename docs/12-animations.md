---
title: "Animations"
layout: default
nav_order: 12
parent: "📖 Lessons"
permalink: /docs/12-animations/
---

<img src="/maui-tutorial-for-beginners/assets/images/banners/animations.svg" alt="Chapter banner" class="chapter-banner">

# Animations

## What You'll Learn

- Use built-in view animations
- Compose complex animations
- Create custom easing functions
- Use the Animation class for advanced scenarios

> 💡 **Note (.NET 10):** The older animation methods (`FadeTo`, `ScaleTo`, `TranslateTo`, etc.) are deprecated. Use their `Async` variants throughout this chapter.

## Basic View Animations

Every `VisualElement` has built-in animation methods:

```csharp
// Fade in
await myView.FadeToAsync(1.0, 500);

// Fade out
await myView.FadeToAsync(0.0, 500);

// Scale up
await myView.ScaleToAsync(1.5, 300);

// Rotate
await myView.RotateToAsync(360, 800);

// Translate (move)
await myView.TranslateToAsync(100, 200, 500);

// Change background color
await myView.BackgroundColorTo(Colors.Red, length: 500);
```

## Composing Animations

### Sequential Animations

Use `await` to chain animations in sequence:

```csharp
private async Task AnimateEntrance(VisualElement view)
{
    view.Opacity = 0;
    view.TranslationY = 50;

    await view.FadeToAsync(1.0, 400);
    await view.TranslateToAsync(0, 0, 300);
    await view.ScaleToAsync(1.1, 150);
    await view.ScaleToAsync(1.0, 150);
}
```

### Parallel Animations

Use `Task.WhenAll` to run animations simultaneously:

```csharp
private async Task AnimateButton(Button button)
{
    await Task.WhenAll(
        button.ScaleToAsync(0.9, 100),
        button.FadeToAsync(0.7, 100)
    );

    await Task.WhenAll(
        button.ScaleToAsync(1.0, 100),
        button.FadeToAsync(1.0, 100)
    );
}
```

## Easing Functions

Control the acceleration curve of animations:

```csharp
// Smooth start and end
await myView.TranslateToAsync(200, 0, 500, Easing.CubicInOut);

// Bouncy effect
await myView.TranslateToAsync(0, 0, 800, Easing.BounceOut);

// Spring effect
await myView.ScaleToAsync(1.0, 600, Easing.SpringOut);
```

Available easing functions:

| Easing | Effect |
|--------|--------|
| `Linear` | Constant speed |
| `SinIn/Out/InOut` | Smooth sine curve |
| `CubicIn/Out/InOut` | Accelerating/decelerating |
| `BounceIn/Out` | Bouncy effect |
| `SpringIn/Out` | Spring/elastic effect |

## Custom Easing

Create your own easing function:

```csharp
var customEasing = new Easing(t => t * t * t);
await myView.FadeToAsync(1.0, 500, customEasing);
```

## The Animation Class

For complex, multi-step animations with fine control:

```csharp
var animation = new Animation();

// Add child animations with different timing
animation.Add(0.0, 0.5, new Animation(v => myView.Opacity = v, 0, 1));
animation.Add(0.0, 0.7, new Animation(v => myView.TranslationY = v, 50, 0));
animation.Add(0.5, 1.0, new Animation(v => myView.Scale = v, 0.8, 1.0));

// Commit the animation
animation.Commit(myView, "EntranceAnimation",
    length: 800,
    easing: Easing.CubicOut,
    finished: (v, cancelled) =>
    {
        // Animation completed
    });
```

### Repeating Animations

```csharp
var pulseAnimation = new Animation(v => myView.Scale = v, 1.0, 1.1);

pulseAnimation.Commit(myView, "PulseAnimation",
    length: 600,
    easing: Easing.SinInOut,
    repeat: () => true); // Repeats indefinitely
```

### Cancelling Animations

```csharp
// Cancel a specific animation
myView.AbortAnimation("PulseAnimation");

// Cancel all animations on a view
ViewExtensions.CancelAnimations(myView);
```

## Page Transition Animations

Animate page navigation for a polished feel:

```csharp
public partial class DetailPage : ContentPage
{
    protected override async void OnAppearing()
    {
        base.OnAppearing();

        MainContent.Opacity = 0;
        MainContent.TranslationY = 30;

        await Task.WhenAll(
            MainContent.FadeToAsync(1.0, 400),
            MainContent.TranslateToAsync(0, 0, 400, Easing.CubicOut)
        );
    }
}
```

## Lottie Animations (Advanced)

For complex vector animations, use the [SkiaSharp.Extended.UI.Maui](https://github.com/nicolestandifer3/lottie-skiasharp-maui) package:

```bash
dotnet add package SkiaSharp.Extended.UI.Maui
```

```xml
<skia:SKLottieView Source="loading.json"
                    RepeatCount="-1"
                    HeightRequest="200"
                    WidthRequest="200" />
```

## Spring Animations

Create natural-feeling animations with spring physics:

```csharp
// Spring bounce effect
await button.ScaleTo(0.9, 100, Easing.CubicIn);
await button.ScaleTo(1.0, 300, Easing.SpringOut);

// Custom spring-like easing
var springEasing = new Easing(t =>
{
    double frequency = 3;
    double decay = 6;
    return 1 - Math.Exp(-decay * t) * Math.Cos(2 * Math.PI * frequency * t);
});

await view.TranslateTo(0, 0, 800, springEasing);
```

## Animation Best Practices

| Practice | Why |
|---|---|
| Keep animations under 300ms for UI feedback | Users perceive delays > 300ms as sluggish |
| Use `Easing.CubicOut` for entrances | Starts fast, ends smooth — feels natural |
| Use `Easing.CubicIn` for exits | Starts slow, ends fast — draws attention away |
| Cancel animations with `CancelAnimations()` | Prevents stacking when user navigates fast |
| Use `Task.WhenAll` for parallel animations | Reduces total animation time |
| Avoid animating during scrolling | Can cause jank on lower-end devices |

```csharp
// Always cancel existing animations before starting new ones
protected override async void OnAppearing()
{
    base.OnAppearing();
    
    // Cancel any leftover animations from previous navigation
    MainContent.CancelAnimations();
    
    MainContent.Opacity = 0;
    await MainContent.FadeTo(1, 400);
}
```

## Interactive Demo: Animation Easing Curves

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
<p style="font-size:0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Click the buttons below to see how different easing functions affect a moving element:</p>
<div id="anim-demo" style="position:relative; height: 60px; background: rgba(255,255,255,0.03); border-radius: 8px; overflow:hidden; margin-bottom: 1rem;">
<div id="anim-ball" style="position:absolute; left: 10px; top: 14px; width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #a855f7, #6366f1);"></div>
</div>
<div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
<button onclick="animBall('linear')" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(168,85,247,0.3);background:rgba(168,85,247,0.1);color:#a855f7;cursor:pointer;font-size:0.8rem;">Linear</button>
<button onclick="animBall('ease-in')" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(99,102,241,0.3);background:rgba(99,102,241,0.1);color:#6366f1;cursor:pointer;font-size:0.8rem;">Ease In</button>
<button onclick="animBall('ease-out')" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(34,211,238,0.3);background:rgba(34,211,238,0.1);color:#22d3ee;cursor:pointer;font-size:0.8rem;">Ease Out</button>
<button onclick="animBall('ease-in-out')" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(52,211,153,0.3);background:rgba(52,211,153,0.1);color:#34d399;cursor:pointer;font-size:0.8rem;">Ease In-Out</button>
<button onclick="animBall('spring')" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(244,114,182,0.3);background:rgba(244,114,182,0.1);color:#f472b6;cursor:pointer;font-size:0.8rem;">Spring</button>
<button onclick="animBall('bounce')" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(251,146,60,0.3);background:rgba(251,146,60,0.1);color:#fb923c;cursor:pointer;font-size:0.8rem;">Bounce</button>
</div>
</div>

<script>
var animBallEl = null;
var animRunning = false;
function animBall(type) {
  if (!animBallEl) animBallEl = document.getElementById('anim-ball');
  if (animRunning) return;
  animRunning = true;
  var container = document.getElementById('anim-demo');
  var maxX = container.offsetWidth - 42;
  var startLeft = animBallEl.offsetLeft;
  var targetX = startLeft < 50 ? maxX : 10;
  var easing;
  switch(type) {
    case 'linear': easing = 'linear'; break;
    case 'ease-in': easing = 'cubic-bezier(0.42,0,1,1)'; break;
    case 'ease-out': easing = 'cubic-bezier(0,0,0.58,1)'; break;
    case 'ease-in-out': easing = 'cubic-bezier(0.42,0,0.58,1)'; break;
    case 'spring': easing = 'cubic-bezier(0.175,0.885,0.32,1.275)'; break;
    case 'bounce': easing = 'cubic-bezier(0.34,1.56,0.64,1)'; break;
  }
  animBallEl.style.transition = 'left 0.8s ' + easing;
  animBallEl.style.left = targetX + 'px';
  setTimeout(function() { animRunning = false; }, 850);
}
</script>

## ✅ Checkpoint

You can now add smooth, engaging animations to your MAUI apps. Next, we'll explore advanced Shell features.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch12-q1" data-correct="a" data-explanation="In .NET 10, the animation methods are async and return Task, so you should use FadeToAsync, ScaleToAsync, etc.">
  <h3>Question 1</h3>
  <p class="quiz-question">What is the modern way to fade a view in .NET MAUI 10?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch12-q1" value="a"> <code>await view.FadeTo(1, 500);</code></label></li>
    <li><label><input type="radio" name="ch12-q1" value="b"> <code>view.Opacity = 1;</code> with a timer</label></li>
    <li><label><input type="radio" name="ch12-q1" value="c"> <code>AnimationManager.Fade(view);</code></label></li>
    <li><label><input type="radio" name="ch12-q1" value="d"> CSS transitions in a Blazor view</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch12-q2" data-correct="d" data-explanation="Task.WhenAll runs multiple animations simultaneously, while sequential awaits run them one after another.">
  <h3>Question 2</h3>
  <p class="quiz-question">How do you run multiple animations at the same time?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch12-q2" value="a"> Chain them with <code>await</code> one after another</label></li>
    <li><label><input type="radio" name="ch12-q2" value="b"> Use <code>Animation.WithConcurrency()</code></label></li>
    <li><label><input type="radio" name="ch12-q2" value="c"> Wrap them in a <code>ParallelAnimation</code> class</label></li>
    <li><label><input type="radio" name="ch12-q2" value="d"> Use <code>Task.WhenAll(anim1, anim2, ...)</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Animated Card

<div class="exercise-container">
  <span class="exercise-badge">Hands-On</span>
  <h3>💻 Create an Animated Welcome Screen</h3>
  <p>Build an animated entrance for your app:</p>
  <ol>
    <li>A logo that fades in and scales up from 0.5 to 1.0</li>
    <li>A welcome text that slides in from below (TranslateTo)</li>
    <li>A "Get Started" button that bounces in with <code>Easing.SpringOut</code></li>
    <li>All animations happen in sequence with slight delays</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```csharp
protected override async void OnAppearing()
{
    base.OnAppearing();

    // Start invisible
    Logo.Opacity = 0;
    Logo.Scale = 0.5;
    WelcomeLabel.Opacity = 0;
    WelcomeLabel.TranslationY = 50;
    GetStartedButton.Opacity = 0;
    GetStartedButton.Scale = 0;

    // Animate logo
    await Task.WhenAll(
        Logo.FadeTo(1, 800),
        Logo.ScaleTo(1, 800, Easing.CubicOut));

    // Animate welcome text
    await Task.WhenAll(
        WelcomeLabel.FadeTo(1, 500),
        WelcomeLabel.TranslateTo(0, 0, 500, Easing.CubicOut));

    // Bounce in button
    await Task.WhenAll(
        GetStartedButton.FadeTo(1, 300),
        GetStartedButton.ScaleTo(1, 500, Easing.SpringOut));
}
```

  </details>
</div>

---

**Previous:** [← 11 — Publishing & Deployment](/docs/11-publishing-deployment/) · **Next:** [13 — Advanced Shell →](/docs/13-shell-advanced/)
