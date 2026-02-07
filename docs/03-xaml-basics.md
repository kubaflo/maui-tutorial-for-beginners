---
title: "XAML Basics"
layout: default
nav_order: 3
permalink: /docs/03-xaml-basics/
---

# XAML Basics

## What You'll Learn

- Understand XAML syntax and structure
- Use markup extensions
- Define and reference resources
- Work with namespaces

## What Is XAML?

**XAML** (eXtensible Application Markup Language) is an XML-based language used to define UI in .NET MAUI. It separates the UI layout from the application logic (C#).

## Basic Syntax

Every XAML element maps to a .NET class. Attributes map to properties:

```xml
<Label Text="Hello, MAUI!"
       FontSize="24"
       TextColor="Blue"
       HorizontalOptions="Center" />
```

This is equivalent to:

```csharp
var label = new Label
{
    Text = "Hello, MAUI!",
    FontSize = 24,
    TextColor = Colors.Blue,
    HorizontalOptions = LayoutOptions.Center
};
```

## Content Properties

Some elements have a **content property** — the default child element. For `ContentPage`, it's `Content`:

```xml
<ContentPage>
    <!-- This Label is set as the Content property -->
    <Label Text="I am the content" />
</ContentPage>
```

For layout elements like `VerticalStackLayout`, the content property is `Children`:

```xml
<VerticalStackLayout>
    <Label Text="First" />
    <Label Text="Second" />
    <Label Text="Third" />
</VerticalStackLayout>
```

## Namespaces

XAML files typically start with two default namespaces:

```xml
xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
```

| Namespace | Purpose |
|-----------|---------|
| Default (`xmlns`) | Maps to MAUI controls (Label, Button, etc.) |
| `x:` | XAML language features (`x:Name`, `x:Class`, `x:DataType`) |

To reference your own classes:

```xml
xmlns:local="clr-namespace:HelloMaui"
xmlns:vm="clr-namespace:HelloMaui.ViewModels"
```

## Markup Extensions

Markup extensions are surrounded by `{}` and provide dynamic values:

### `{StaticResource}`

References a resource defined in a resource dictionary:

```xml
<Label Text="Styled text" Style="{StaticResource TitleStyle}" />
```

### `{DynamicResource}`

Like `StaticResource`, but updates at runtime if the resource changes:

```xml
<Label TextColor="{DynamicResource PrimaryColor}" />
```

### `{Binding}`

Binds a property to a data source (covered in depth in Chapter 05):

```xml
<Label Text="{Binding UserName}" />
```

### `{x:Static}`

References a static property or field:

```xml
<Label Text="{x:Static local:AppConstants.Version}" />
```

## Resources and Resource Dictionaries

Resources let you define reusable values:

### Page-Level Resources

```xml
<ContentPage>
    <ContentPage.Resources>
        <Color x:Key="AccentColor">#512BD4</Color>
        <x:Double x:Key="HeaderFontSize">28</x:Double>
    </ContentPage.Resources>

    <Label Text="Hello"
           TextColor="{StaticResource AccentColor}"
           FontSize="{StaticResource HeaderFontSize}" />
</ContentPage>
```

### Application-Level Resources

Define in `App.xaml` to share across all pages:

```xml
<Application.Resources>
    <ResourceDictionary>
        <Color x:Key="Primary">#512BD4</Color>
        <Style TargetType="Button">
            <Setter Property="BackgroundColor" Value="{StaticResource Primary}" />
            <Setter Property="TextColor" Value="White" />
        </Style>
    </ResourceDictionary>
</Application.Resources>
```

## Naming Elements with `x:Name`

Use `x:Name` to reference a XAML element from code-behind:

```xml
<Entry x:Name="NameEntry" Placeholder="Enter your name" />
<Label x:Name="GreetingLabel" />
<Button Text="Greet" Clicked="OnGreetClicked" />
```

```csharp
private void OnGreetClicked(object sender, EventArgs e)
{
    GreetingLabel.Text = $"Hello, {NameEntry.Text}!";
}
```

## Compiled Bindings (Important)

Starting with .NET 9+, **compiled bindings** are strongly recommended for performance and compile-time safety. Use `x:DataType` on your pages to enable them:

```xml
<ContentPage x:DataType="vm:MyViewModel">
    <Label Text="{Binding UserName}" />
</ContentPage>
```

In .NET 10, you can also enable compilation of bindings with `Source` property by adding this to your `.csproj`:

```xml
<MauiEnableXamlCBindingWithSourceCompilation>true</MauiEnableXamlCBindingWithSourceCompilation>
```

> 💡 **Native AOT:** If you plan to use Native AOT deployment (supported on iOS in .NET 10), all bindings **must** be compiled.

## ✅ Checkpoint

You now know how to write XAML, use markup extensions, define resources, compiled bindings, and reference elements in code. Next, we'll explore layouts and controls to build real UIs.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch03-q1" data-correct="a" data-explanation="x:DataType enables compiled bindings, which are checked at build time for type safety and better performance.">
  <h3>Question 1</h3>
  <p class="quiz-question">What does the <code>x:DataType</code> attribute enable?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch03-q1" value="a"> Compiled bindings with type checking at build time</label></li>
    <li><label><input type="radio" name="ch03-q1" value="b"> Automatic data validation on input controls</label></li>
    <li><label><input type="radio" name="ch03-q1" value="c"> Type conversion for binding values</label></li>
    <li><label><input type="radio" name="ch03-q1" value="d"> Database schema generation from XAML</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch03-q2" data-correct="d" data-explanation="StaticResource is resolved once at load time, while DynamicResource watches for changes and updates automatically — useful for theming.">
  <h3>Question 2</h3>
  <p class="quiz-question">What is the difference between <code>StaticResource</code> and <code>DynamicResource</code>?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch03-q2" value="a"> StaticResource is for strings, DynamicResource is for objects</label></li>
    <li><label><input type="radio" name="ch03-q2" value="b"> StaticResource only works in code-behind, DynamicResource only in XAML</label></li>
    <li><label><input type="radio" name="ch03-q2" value="c"> There is no difference — they are interchangeable</label></li>
    <li><label><input type="radio" name="ch03-q2" value="d"> StaticResource is resolved once at load time; DynamicResource updates when the resource changes</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch03-q3" data-correct="b" data-explanation="XAML namespaces map CLR namespaces to XML prefixes — xmlns:vm='clr-namespace:...' makes your ViewModels available in XAML.">
  <h3>Question 3</h3>
  <p class="quiz-question">What is the purpose of <code>xmlns:vm="clr-namespace:MyApp.ViewModels"</code>?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch03-q3" value="a"> It creates a virtual machine for the ViewModel</label></li>
    <li><label><input type="radio" name="ch03-q3" value="b"> It maps a CLR namespace to an XML prefix for use in XAML</label></li>
    <li><label><input type="radio" name="ch03-q3" value="c"> It imports JavaScript modules into the page</label></li>
    <li><label><input type="radio" name="ch03-q3" value="d"> It registers the namespace for dependency injection</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Resource Dictionary

<div class="exercise-container">
  <span class="exercise-badge">Hands-On</span>
  <h3>💻 Build a Reusable Style</h3>
  <p>Create a ResourceDictionary with:</p>
  <ol>
    <li>A color palette (Primary, Secondary, Background, Text)</li>
    <li>A reusable <code>Style</code> for all buttons in your app</li>
    <li>A string resource for your app's name</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```xml
<ResourceDictionary>
    <!-- Color Palette -->
    <Color x:Key="Primary">#7c3aed</Color>
    <Color x:Key="Secondary">#22c55e</Color>
    <Color x:Key="Background">#1a1a2e</Color>
    <Color x:Key="TextPrimary">#e0e0e0</Color>

    <!-- App Name -->
    <x:String x:Key="AppName">My MAUI App</x:String>

    <!-- Button Style -->
    <Style TargetType="Button">
        <Setter Property="BackgroundColor" Value="{StaticResource Primary}" />
        <Setter Property="TextColor" Value="White" />
        <Setter Property="CornerRadius" Value="8" />
        <Setter Property="Padding" Value="12,8" />
        <Setter Property="FontAttributes" Value="Bold" />
    </Style>
</ResourceDictionary>
```

  </details>
</div>

---

**Previous:** [← 02 — Project Structure](../02-ProjectStructure/README.md) · **Next:** [04 — Layouts & Controls →](../04-Layouts-And-Controls/README.md)
