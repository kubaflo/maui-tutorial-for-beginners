---
title: "Styling & Theming"
layout: default
nav_order: 7
parent: "📖 Lessons"
permalink: /docs/07-styling-and-theming/
---

# Styling & Theming

## What You'll Learn

- Apply implicit and explicit styles
- Customize colors and fonts
- Implement light/dark theme support
- Use custom fonts

## Styles in MAUI

Styles let you define a set of property values once and apply them to multiple controls.

### Explicit Styles (with `x:Key`)

Must be referenced by name:

```xml
<ContentPage.Resources>
    <Style x:Key="HeaderLabel" TargetType="Label">
        <Setter Property="FontSize" Value="28" />
        <Setter Property="FontAttributes" Value="Bold" />
        <Setter Property="TextColor" Value="#512BD4" />
    </Style>
</ContentPage.Resources>

<Label Text="Welcome" Style="{StaticResource HeaderLabel}" />
```

### Implicit Styles (without `x:Key`)

Applied automatically to all matching controls in scope:

```xml
<ContentPage.Resources>
    <Style TargetType="Button">
        <Setter Property="BackgroundColor" Value="#512BD4" />
        <Setter Property="TextColor" Value="White" />
        <Setter Property="CornerRadius" Value="8" />
        <Setter Property="Padding" Value="14,10" />
    </Style>
</ContentPage.Resources>

<!-- All buttons on this page get the style automatically -->
<Button Text="Save" />
<Button Text="Cancel" />
```

### Style Inheritance

Use `BasedOn` to extend existing styles:

```xml
<Style x:Key="BaseButton" TargetType="Button">
    <Setter Property="FontSize" Value="16" />
    <Setter Property="CornerRadius" Value="8" />
</Style>

<Style x:Key="PrimaryButton" TargetType="Button" BasedOn="{StaticResource BaseButton}">
    <Setter Property="BackgroundColor" Value="#512BD4" />
    <Setter Property="TextColor" Value="White" />
</Style>

<Style x:Key="DangerButton" TargetType="Button" BasedOn="{StaticResource BaseButton}">
    <Setter Property="BackgroundColor" Value="#E53935" />
    <Setter Property="TextColor" Value="White" />
</Style>
```

## Application-Level Styles

Define in `Resources/Styles/Styles.xaml` to share across the entire app:

```xml
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Style TargetType="Page" ApplyToDerivedTypes="True">
        <Setter Property="BackgroundColor" Value="{AppThemeBinding Light=White, Dark=#1C1C1E}" />
    </Style>

    <Style TargetType="Label">
        <Setter Property="TextColor" Value="{AppThemeBinding Light=Black, Dark=White}" />
    </Style>
</ResourceDictionary>
```

## Colors

Define your color palette in `Resources/Styles/Colors.xaml`:

```xml
<ResourceDictionary>
    <Color x:Key="Primary">#512BD4</Color>
    <Color x:Key="PrimaryDark">#3B1F9E</Color>
    <Color x:Key="Accent">#DFD8F7</Color>
    <Color x:Key="TextPrimary">#1A1A1A</Color>
    <Color x:Key="TextSecondary">#6B6B6B</Color>
    <Color x:Key="Background">#FFFFFF</Color>
    <Color x:Key="Surface">#F5F5F5</Color>
</ResourceDictionary>
```

## Light/Dark Theme Support

### Using `AppThemeBinding`

Automatically switch values based on the system theme:

```xml
<Label Text="Adaptive Text"
       TextColor="{AppThemeBinding Light=#1A1A1A, Dark=#FFFFFF}" />

<ContentPage BackgroundColor="{AppThemeBinding Light=White, Dark=#1C1C1E}">
```

### Detecting Theme Changes in Code

```csharp
Application.Current!.RequestedThemeChanged += (s, e) =>
{
    var theme = e.RequestedTheme; // Light, Dark, or Unspecified
};
```

### Forcing a Theme

```csharp
Application.Current!.UserAppTheme = AppTheme.Dark;
```

## Custom Fonts

### 1. Add Font Files

Place `.ttf` or `.otf` files in `Resources/Fonts/`.

### 2. Register in MauiProgram.cs

```csharp
builder.ConfigureFonts(fonts =>
{
    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
    fonts.AddFont("MaterialIcons-Regular.ttf", "MaterialIcons");
});
```

### 3. Use in XAML

```xml
<Label Text="Custom Font"
       FontFamily="OpenSansSemibold"
       FontSize="20" />

<!-- Icon font -->
<Label Text="&#xe87c;"
       FontFamily="MaterialIcons"
       FontSize="32" />
```

## Visual States

Change appearance based on control state:

```xml
<Style TargetType="Button">
    <Setter Property="VisualStateManager.VisualStateGroups">
        <VisualStateGroupList>
            <VisualStateGroup x:Name="CommonStates">
                <VisualState x:Name="Normal">
                    <VisualState.Setters>
                        <Setter Property="BackgroundColor" Value="#512BD4" />
                    </VisualState.Setters>
                </VisualState>
                <VisualState x:Name="Pressed">
                    <VisualState.Setters>
                        <Setter Property="BackgroundColor" Value="#3B1F9E" />
                        <Setter Property="Scale" Value="0.96" />
                    </VisualState.Setters>
                </VisualState>
                <VisualState x:Name="Disabled">
                    <VisualState.Setters>
                        <Setter Property="BackgroundColor" Value="#CCCCCC" />
                    </VisualState.Setters>
                </VisualState>
            </VisualStateGroup>
        </VisualStateGroupList>
    </Setter>
</Style>
```

## Safe Area Support (.NET 10)

.NET MAUI 10 introduces a `SafeAreaEdges` property on layouts and pages, giving granular control over rendering content under device cutouts, home indicators, or keyboard overlays:

```xml
<ContentPage SafeAreaEdges="All">
    <!-- Content stays within safe area on all edges -->
</ContentPage>

<VerticalStackLayout SafeAreaEdges="Top,Bottom">
    <!-- Only respects top and bottom safe areas -->
</VerticalStackLayout>
```

## ✅ Checkpoint

Your apps can now look polished with consistent styles, custom fonts, safe area handling, and theme support. Next, we'll explore platform-specific code.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch07-q1" data-correct="a" data-explanation="AppThemeBinding automatically switches values based on the system's light/dark mode setting, e.g. TextColor='{AppThemeBinding Light=Black, Dark=White}'.">
  <h3>Question 1</h3>
  <p class="quiz-question">How do you make a property respond to light/dark mode in XAML?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch07-q1" value="a"> <code>AppThemeBinding</code> markup extension</label></li>
    <li><label><input type="radio" name="ch07-q1" value="b"> <code>DynamicResource</code> with manual switching</label></li>
    <li><label><input type="radio" name="ch07-q1" value="c"> CSS media queries</label></li>
    <li><label><input type="radio" name="ch07-q1" value="d"> Platform-specific conditional compilation</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch07-q2" data-correct="b" data-explanation="An implicit style (no x:Key) applies automatically to all controls of that TargetType. An explicit style (with x:Key) must be referenced manually.">
  <h3>Question 2</h3>
  <p class="quiz-question">What makes a Style "implicit" vs "explicit" in MAUI?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch07-q2" value="a"> Implicit styles use StaticResource, explicit use DynamicResource</label></li>
    <li><label><input type="radio" name="ch07-q2" value="b"> Implicit styles have no x:Key and apply to all matching controls automatically</label></li>
    <li><label><input type="radio" name="ch07-q2" value="c"> Implicit styles are defined in code, explicit in XAML</label></li>
    <li><label><input type="radio" name="ch07-q2" value="d"> There is no difference in MAUI</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Dark/Light Theme Toggle

<div class="exercise-container">
  <span class="exercise-badge">Hands-On</span>
  <h3>💻 Build a Theme Switcher</h3>
  <p>Create a settings page with a theme toggle:</p>
  <ol>
    <li>Define light and dark color palettes in <code>App.xaml</code> using <code>AppThemeBinding</code></li>
    <li>Create a Switch that toggles between themes</li>
    <li>Save the theme preference using <code>Preferences</code></li>
    <li>Apply the saved theme on app startup</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```xml
<!-- App.xaml Resources -->
<Color x:Key="PageBg">{AppThemeBinding Light=#FFFFFF, Dark=#1a1a2e}</Color>
<Color x:Key="CardBg">{AppThemeBinding Light=#F5F5F5, Dark=#2d2d44}</Color>
<Color x:Key="TextPrimary">{AppThemeBinding Light=#1a1a1a, Dark=#e0e0e0}</Color>
```

```csharp
// Theme toggle in ViewModel
[RelayCommand]
private void ToggleTheme()
{
    var current = Application.Current!.UserAppTheme;
    var newTheme = current == AppTheme.Dark ? AppTheme.Light : AppTheme.Dark;
    Application.Current.UserAppTheme = newTheme;
    Preferences.Set("app_theme", newTheme.ToString());
}

// In App.xaml.cs constructor
var savedTheme = Preferences.Get("app_theme", "Unspecified");
if (Enum.TryParse<AppTheme>(savedTheme, out var theme))
    UserAppTheme = theme;
```

  </details>
</div>

---

**Previous:** [← 06 — Navigation](/docs/06-navigation/) · **Next:** [08 — Platform-Specific Code →](/docs/08-platform-specific-code/)
