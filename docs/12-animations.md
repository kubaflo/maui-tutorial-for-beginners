---
title: "Animations"
layout: default
nav_order: 12
permalink: /docs/12-animations/
---

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

---

**Previous:** [← 11 — Publishing & Deployment](../11-Publishing-Deployment/README.md) · **Next:** [13 — Advanced Shell →](../13-Shell-Advanced/README.md)
