---
title: "⚡ Quick Start Guide"
layout: default
nav_order: 1
parent: "📚 Reference"
permalink: /quickstart/
---

# ⚡ Quick Start Guide

Get your first .NET MAUI app running in **5 minutes**.

---

## Step 1: Install Prerequisites

<div class="exercise-container">
  <span class="exercise-badge">Setup</span>

**Option A: Visual Studio 2022** (Recommended for Windows)

1. Download [Visual Studio 2022](https://visualstudio.microsoft.com/) (Community — free)
2. Select the **.NET Multi-platform App UI development** workload
3. Click **Install**

**Option B: Command Line** (All platforms)

```bash
# Install .NET 10 SDK from https://dotnet.microsoft.com/download
# Then install the MAUI workload:
dotnet workload install maui
```

Verify:
```bash
dotnet --version          # Should show 10.x.x
dotnet workload list      # Should show 'maui'
```

</div>

---

## Step 2: Create Your App

```bash
dotnet new maui -n HelloMaui
cd HelloMaui
```

This creates a complete project with:
- ✅ Cross-platform app structure
- ✅ Sample counter page
- ✅ Platform configurations for Android, iOS, macOS, Windows

---

## Step 3: Run It

Choose your target platform:

```bash
# Windows
dotnet build -t:Run -f net10.0-windows10.0.19041.0

# Android (emulator must be running)
dotnet build -t:Run -f net10.0-android

# macOS (Mac only)
dotnet build -t:Run -f net10.0-maccatalyst

# iOS (Mac only)
dotnet build -t:Run -f net10.0-ios
```

You should see the default counter app! 🎉

---

## Step 4: Make Your First Change

Open `MainPage.xaml` and change the welcome text:

```xml
<Label Text="Hello, .NET MAUI!"
       FontSize="32"
       HorizontalOptions="Center" />
```

Save and the app updates automatically with Hot Reload.

---

## Step 5: Add MVVM (Modern Pattern)

Install the MVVM Toolkit:

```bash
dotnet add package CommunityToolkit.Mvvm
```

Create `MainViewModel.cs`:

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace HelloMaui;

public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private int _count;

    [ObservableProperty]
    private string _buttonText = "Click me";

    [RelayCommand]
    private void IncrementCounter()
    {
        Count++;
        ButtonText = Count == 1 ? "Clicked 1 time" : $"Clicked {Count} times";
    }
}
```

Update `MainPage.xaml`:

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:HelloMaui"
             x:Class="HelloMaui.MainPage"
             x:DataType="vm:MainViewModel">

    <ContentPage.BindingContext>
        <vm:MainViewModel />
    </ContentPage.BindingContext>

    <VerticalStackLayout Padding="30" Spacing="25"
                         VerticalOptions="Center">
        <Label Text="Hello, .NET MAUI!"
               FontSize="32"
               HorizontalOptions="Center" />

        <Label Text="{Binding Count, StringFormat='Count: {0}'}"
               FontSize="18"
               HorizontalOptions="Center" />

        <Button Text="{Binding ButtonText}"
                Command="{Binding IncrementCounterCommand}"
                HorizontalOptions="Fill" />
    </VerticalStackLayout>
</ContentPage>
```

---

## What's Next?

You now have a working MAUI app with modern MVVM! Continue the tutorial:

| Next Step | What You'll Learn |
|:----------|:-----------------|
| [📖 Full Tutorial (Ch 1–22)](/docs/01-getting-started/) | Complete learning path |
| [🔖 Cheat Sheet](/cheat-sheet/) | Quick reference for patterns |
| [🎯 Coding Challenges](/challenges/) | Practice with real projects |

---

<div class="quiz-container" data-quiz-id="qs-q1" data-correct="b" data-explanation="CommunityToolkit.Mvvm provides [ObservableProperty] and [RelayCommand] source generators that eliminate MVVM boilerplate.">
  <h3>Quick Check ✓</h3>
  <p class="quiz-question">What package did we use to simplify the ViewModel?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="qs-q1" value="a"> Microsoft.Maui.Mvvm</label></li>
    <li><label><input type="radio" name="qs-q1" value="b"> CommunityToolkit.Mvvm</label></li>
    <li><label><input type="radio" name="qs-q1" value="c"> Prism.Maui</label></li>
    <li><label><input type="radio" name="qs-q1" value="d"> ReactiveUI</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>
