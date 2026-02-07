---
title: "🆕 What's New in MAUI 10"
layout: default
nav_order: 5
parent: "📚 Reference"
permalink: /whats-new/
---

# What's New in .NET MAUI 10

.NET 10 is a **Long-Term Support (LTS)** release. Here are the key changes and new features for MAUI developers.

---

## 🚀 Distribution via NuGet

Starting with .NET 10, MAUI is distributed as **NuGet packages** instead of being bundled with the .NET SDK. This means:

- **Faster updates** — MAUI can ship fixes independently of .NET SDK releases
- **Version flexibility** — Pin to specific MAUI versions
- **Smaller SDK** — Only install what you need

```xml
<!-- Your .csproj automatically references the MAUI NuGet packages -->
<ItemGroup>
  <PackageReference Include="Microsoft.Maui.Controls" Version="10.0.*" />
  <PackageReference Include="Microsoft.Maui.Controls.Compatibility" Version="10.0.*" />
</ItemGroup>
```

---

## ⚡ XAML Source Generator

Compile XAML to C# at build time instead of parsing it at runtime:

```xml
<PropertyGroup>
  <MauiXamlInflator>SourceGen</MauiXamlInflator>
</PropertyGroup>
```

**Benefits:**
- Faster app startup (no XAML parsing)
- Compile-time error detection
- AOT-friendly (no reflection)
- Better IDE tooling support

**Requirements:**
- Use `x:DataType` on all pages and templates
- Avoid `FindByName()` — use `x:Name` instead
- Ensure custom controls have parameterless constructors

---

## 🔧 Native AOT (Production Ready)

Native AOT compilation is now fully supported for **iOS** and **Mac Catalyst**:

```xml
<PropertyGroup>
  <IsAotCompatible>true</IsAotCompatible>
  <PublishAot Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios'">true</PublishAot>
  <PublishAot Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'maccatalyst'">true</PublishAot>
</PropertyGroup>
```

**What this means:**
- ~50% faster startup on iOS
- Smaller app bundles
- No JIT compiler in the binary
- Requires trimming-compatible code

---

## 🎨 TitleBar Customization

Windows and Mac Catalyst apps can now customize the title bar:

```xml
<TitleBar Title="My App"
          BackgroundColor="#512BD4"
          HeightRequest="48">
    <TitleBar.Content>
        <SearchBar Placeholder="Search"
                   MaximumWidthRequest="300"
                   HorizontalOptions="Fill"
                   VerticalOptions="Center" />
    </TitleBar.Content>
</TitleBar>
```

---

## 📱 Safe Area Improvements

Better control over safe areas on notched devices:

```xml
<!-- Page-level safe area -->
<ContentPage ios:Page.UseSafeArea="True">

<!-- Or per-view with Padding -->
<Grid Padding="{OnPlatform iOS='0,47,0,34', Default='0'}">
```

---

## ⌨️ Keyboard Accelerators

Add keyboard shortcuts to menu items (desktop platforms):

```xml
<MenuFlyoutItem Text="Save"
                Clicked="OnSaveClicked">
    <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Modifiers="Ctrl" Key="S" />
    </MenuFlyoutItem.KeyboardAccelerators>
</MenuFlyoutItem>
```

---

## 🌐 HybridWebView Enhancements

`HybridWebView` has been improved with:

- **`InvokeJavaScriptAsync<T>`** — Call JS functions with typed returns
- **`EvaluateJavaScriptAsync`** — Execute arbitrary JS code
- **`SetInvokeJavaScriptTarget`** — Expose C# objects to JavaScript
- **AOT-safe interop** — Uses `JsonSerializerContext` for typed serialization

---

## 📦 CollectionView Improvements

```xml
<!-- New scroll behavior control -->
<CollectionView ItemsUpdatingScrollMode="KeepLastItemInView">

<!-- Improved selection handling -->
<CollectionView SelectionMode="Multiple"
                SelectionChangedCommand="{Binding SelectionCommand}">
```

---

## 🔄 Compiled Bindings in C#

Create type-safe bindings in code-behind:

```csharp
// New lambda-based compiled bindings
myLabel.SetBinding(
    Label.TextProperty,
    Binding.Create(static (MainViewModel vm) => vm.Title));
```

---

## 📋 Migration Checklist

If you're upgrading from .NET 9 to .NET 10:

- [ ] Update target framework to `net10.0-*`
- [ ] Update MAUI NuGet packages to `10.0.*`
- [ ] Add `x:DataType` to all XAML pages (for source gen compatibility)
- [ ] Replace string-based bindings with compiled bindings where possible
- [ ] Test with `<IsAotCompatible>true</IsAotCompatible>` to catch trimming issues
- [ ] Replace deprecated animation methods if any warnings appear
- [ ] Update JSON serialization to use `JsonSerializerContext` source generators
- [ ] Review `MauiProgram.cs` for any deprecated API calls

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="wn-q1" data-correct="c" data-explanation="In .NET 10, MAUI ships as NuGet packages, allowing independent versioning and updates separate from the .NET SDK.">
  <h3>Question 1</h3>
  <p class="quiz-question">How is .NET MAUI distributed starting with .NET 10?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="wn-q1" value="a"> Bundled with the .NET SDK as before</label></li>
    <li><label><input type="radio" name="wn-q1" value="b"> As a Visual Studio extension</label></li>
    <li><label><input type="radio" name="wn-q1" value="c"> Via NuGet packages</label></li>
    <li><label><input type="radio" name="wn-q1" value="d"> Through the Windows Store</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="wn-q2" data-correct="a" data-explanation="The XAML Source Generator compiles XAML to C# at build time, eliminating runtime parsing for faster startup.">
  <h3>Question 2</h3>
  <p class="quiz-question">What does the XAML Source Generator do?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="wn-q2" value="a"> Compiles XAML to C# code at build time</label></li>
    <li><label><input type="radio" name="wn-q2" value="b"> Generates XAML from C# code</label></li>
    <li><label><input type="radio" name="wn-q2" value="c"> Creates XAML previews in the IDE</label></li>
    <li><label><input type="radio" name="wn-q2" value="d"> Validates XAML syntax at runtime</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>
