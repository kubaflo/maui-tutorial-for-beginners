---
title: "Getting Started"
layout: default
nav_order: 1
parent: "📖 Lessons"
permalink: /docs/01-getting-started/
---

<img src="/maui-tutorial-for-beginners/assets/images/banners/getting-started.svg" alt="Chapter banner" class="chapter-banner">

# Getting Started

## What You'll Learn

- Install the .NET MAUI workload
- Create your first MAUI application
- Run the app on an emulator or device

> **Note:** This tutorial uses **.NET 10** (LTS) and .NET MAUI 10. If you're on .NET 9, the concepts are the same — just replace `net10.0` with `net9.0` in target frameworks.

## Step 1: Install Prerequisites

### Visual Studio 2022 (Recommended)

1. Download [Visual Studio 2022](https://visualstudio.microsoft.com/) (Community edition is free, v17.12+).
2. During installation, select the **.NET Multi-platform App UI development** workload.
3. Ensure the **Android SDK** is selected in the individual components tab.

### Command Line (Alternative)

```bash
# Install the MAUI workload via the .NET CLI
dotnet workload install maui
```

Verify your setup:

```bash
dotnet workload list
```

You should see `maui` in the output.

## Step 2: Create Your First App

### Using the CLI

```bash
dotnet new maui -n HelloMaui
cd HelloMaui
```

### Using Visual Studio

1. **File → New → Project**
2. Search for **.NET MAUI App**
3. Name the project `HelloMaui` and click **Create**

## Step 3: Explore the Default App

Open `MainPage.xaml` — this is the main UI file:

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="HelloMaui.MainPage">

    <ScrollView>
        <VerticalStackLayout Padding="30,0" Spacing="25">
            <Image Source="dotnet_bot.png"
                   HeightRequest="185"
                   Aspect="AspectFit" />

            <Label Text="Hello, World!"
                   FontSize="32"
                   HorizontalOptions="Center" />

            <Label Text="Welcome to &#10;.NET Multi-platform App UI"
                   FontSize="18"
                   HorizontalOptions="Center" />

            <Button x:Name="CounterBtn"
                    Text="Click me"
                    Clicked="OnCounterClicked"
                    HorizontalOptions="Fill" />
        </VerticalStackLayout>
    </ScrollView>

</ContentPage>
```

Open `MainPage.xaml.cs` — this is the code-behind:

```csharp
namespace HelloMaui;

public partial class MainPage : ContentPage
{
    int count = 0;

    public MainPage()
    {
        InitializeComponent();
    }

    private void OnCounterClicked(object sender, EventArgs e)
    {
        count++;
        CounterBtn.Text = count == 1
            ? $"Clicked {count} time"
            : $"Clicked {count} times";

        SemanticScreenReader.Announce(CounterBtn.Text);
    }
}
```

## Step 4: Run the App

### Android

```bash
dotnet build -t:Run -f net10.0-android
```

Or press **F5** in Visual Studio with an Android emulator selected.

### Windows

```bash
dotnet build -t:Run -f net10.0-windows10.0.19041.0
```

### iOS (macOS only)

```bash
dotnet build -t:Run -f net10.0-ios
```

### macOS (Mac Catalyst)

```bash
dotnet build -t:Run -f net10.0-maccatalyst
```

## ✅ Checkpoint

You should see the default MAUI counter app running. Clicking the button increments a counter. Congratulations — you've built your first .NET MAUI app!

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch01-q1" data-correct="b" data-explanation="The 'dotnet workload install maui' command installs the .NET MAUI workload, which includes all templates and SDKs needed.">
  <h3>Question 1</h3>
  <p class="quiz-question">Which command installs the .NET MAUI workload?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch01-q1" value="a"> <code>dotnet install maui</code></label></li>
    <li><label><input type="radio" name="ch01-q1" value="b"> <code>dotnet workload install maui</code></label></li>
    <li><label><input type="radio" name="ch01-q1" value="c"> <code>dotnet add package maui</code></label></li>
    <li><label><input type="radio" name="ch01-q1" value="d"> <code>dotnet new install maui</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch01-q2" data-correct="c" data-explanation="SemanticScreenReader.Announce() reads the text aloud for accessibility — it helps visually impaired users know the button was clicked.">
  <h3>Question 2</h3>
  <p class="quiz-question">What does <code>SemanticScreenReader.Announce()</code> do in the counter example?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch01-q2" value="a"> Logs the button text to the console</label></li>
    <li><label><input type="radio" name="ch01-q2" value="b"> Sends a push notification to the user</label></li>
    <li><label><input type="radio" name="ch01-q2" value="c"> Announces the text for screen reader accessibility</label></li>
    <li><label><input type="radio" name="ch01-q2" value="d"> Displays a toast message on screen</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Customize the Counter

<div class="exercise-container">
  <span class="exercise-badge">Beginner</span>
  <h3>💻 Try It Yourself</h3>
  <p>Modify the default counter app to:</p>
  <ol>
    <li>Change the button color to purple (<code>#7c3aed</code>)</li>
    <li>Add a "Reset" button that sets the counter back to 0</li>
    <li>Display the count in a larger font when it exceeds 10</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```xml
<Button x:Name="CounterBtn"
        Text="Click me"
        Clicked="OnCounterClicked"
        BackgroundColor="#7c3aed"
        TextColor="White"
        HorizontalOptions="Fill" />

<Button Text="Reset"
        Clicked="OnResetClicked"
        BackgroundColor="#ef4444"
        TextColor="White"
        HorizontalOptions="Fill" />
```

```csharp
private void OnResetClicked(object sender, EventArgs e)
{
    count = 0;
    CounterBtn.Text = "Click me";
}
```

  </details>
</div>

<div class="key-takeaways">
  <h4>📌 Key Takeaways</h4>
  <ul>
    <li><strong>MAUI = one codebase, all platforms</strong> — Write C# and XAML once, deploy to Android, iOS, macOS, and Windows</li>
    <li>Use <code>dotnet new maui</code> or Visual Studio templates to scaffold a project</li>
    <li>The <code>MainPage.xaml</code> file defines the UI; <code>MainPage.xaml.cs</code> handles events</li>
    <li><code>Clicked</code> events connect button taps to C# methods</li>
  </ul>
</div>

<div class="callout callout-tip">
  <div class="callout-title">💡 Tip</div>
  If you're on macOS, you can use Visual Studio Code with the <a href="https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-maui">MAUI extension</a> instead of Visual Studio for Mac (which is discontinued).
</div>

<div class="related-chapters">
  <h4>📖 Related Chapters</h4>
  <ul>
    <li><a href="/maui-tutorial-for-beginners/docs/02-project-structure/">Ch 02 — Project Structure</a></li>
    <li><a href="/maui-tutorial-for-beginners/docs/03-xaml-basics/">Ch 03 — XAML Basics</a></li>
    <li><a href="/maui-tutorial-for-beginners/quickstart/">Quick Start Guide</a></li>
  </ul>
</div>

---

**Next:** [02 — Project Structure →](/maui-tutorial-for-beginners/docs/02-project-structure/)
