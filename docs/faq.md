---
title: "❓ FAQ & Glossary"
layout: default
nav_order: 97
permalink: /faq/
---

# FAQ & Glossary

## Frequently Asked Questions

### Getting Started

<details>
<summary><strong>What's the difference between .NET MAUI and Xamarin.Forms?</strong></summary>

.NET MAUI is the evolution of Xamarin.Forms. Key differences:
- **Single project** instead of separate platform projects
- **Built-in dependency injection** via `MauiAppBuilder`
- **New handlers architecture** replacing renderers
- **Distributed via NuGet** (in .NET 10) for more granular updates
- **.NET 10 LTS support** with Native AOT and XAML source generation

</details>

<details>
<summary><strong>Can I use MAUI for web applications?</strong></summary>

Not directly, but MAUI Blazor Hybrid lets you build apps that share Razor components with Blazor web apps. You can share most of your UI code between MAUI (native) and Blazor (web) using a shared Razor class library.

</details>

<details>
<summary><strong>Which IDE should I use?</strong></summary>

- **Visual Studio 2022** (Windows) — Full MAUI support with hot reload, XAML preview, and Android emulator management
- **VS Code** with the .NET MAUI Extension — Lighter weight, works on all platforms
- **JetBrains Rider** — Full MAUI support starting from version 2023.3

</details>

<details>
<summary><strong>Do I need a Mac to build iOS apps?</strong></summary>

Yes. iOS apps require Xcode which only runs on macOS. You can:
- Develop on Windows and use a remote Mac build agent
- Develop directly on a Mac with VS Code or Rider
- Use a cloud Mac service for CI/CD (GitHub Actions, Azure DevOps)

</details>

### Architecture

<details>
<summary><strong>Should I use MVVM or code-behind?</strong></summary>

**MVVM is strongly recommended** for any non-trivial app. Benefits:
- Separation of concerns
- Unit testable ViewModels
- Reusable business logic
- Better team collaboration

Use the **CommunityToolkit.Mvvm** package to eliminate MVVM boilerplate with source generators.

</details>

<details>
<summary><strong>When should I use Singleton vs Transient for DI?</strong></summary>

| Lifetime | When to Use | Examples |
|:---------|:------------|:---------|
| **Singleton** | Shared state, expensive to create | `HttpClient`, database service, settings |
| **Transient** | Fresh state each time | Detail pages, detail ViewModels |
| **Scoped** | Per-scope (rare in MAUI) | Per-navigation-scope services |

**Rule of thumb:** Main/list pages → Singleton. Detail pages → Transient.

</details>

<details>
<summary><strong>What is the difference between HybridWebView and BlazorWebView?</strong></summary>

| Feature | HybridWebView | BlazorWebView |
|:--------|:-------------|:-------------|
| Content | Plain HTML/CSS/JS | Razor components |
| JS Interop | Built-in bidirectional | Via Blazor JS interop |
| Best For | Reusing existing web UIs | Full Blazor apps in native |
| Framework | Vanilla web | Blazor framework |

</details>

### Performance

<details>
<summary><strong>How do I make my app start faster?</strong></summary>

1. **Enable Native AOT** (iOS/Mac) — eliminates JIT overhead
2. **Use XAML Source Generator** — `<MauiXamlInflator>SourceGen</MauiXamlInflator>`
3. **Use compiled bindings** — always set `x:DataType`
4. **Lazy-load pages** — register as Transient, use `ContentTemplate`
5. **Minimize startup code** — defer non-essential initialization
6. **Profile** — use `dotnet-trace` to find bottlenecks

</details>

<details>
<summary><strong>How do I reduce my app's size?</strong></summary>

1. Enable **full trimming**: `<TrimMode>full</TrimMode>`
2. Use **Native AOT** for iOS
3. Remove unused **NuGet packages**
4. Use **AOT-safe JSON** (source generators instead of reflection)
5. Compress images and use **SVG** where possible

</details>

---

## Glossary

| Term | Definition |
|:-----|:-----------|
| **AOT** | Ahead-of-Time compilation — compiles C# to native code at build time |
| **Binding** | Connection between UI elements and data properties that keeps them in sync |
| **BlazorWebView** | Control that hosts a Blazor application inside a native MAUI app |
| **Compiled Binding** | Type-safe binding resolved at compile time (requires `x:DataType`) |
| **ContentPage** | A page that displays a single view; the most common page type |
| **DI** | Dependency Injection — design pattern for managing object dependencies |
| **Flyout** | A sliding panel that reveals navigation items |
| **Handler** | Platform-specific rendering code for a MAUI control (replaces Xamarin renderers) |
| **Hot Reload** | Feature that applies code changes without restarting the app |
| **HybridWebView** | Control for embedding web content with bidirectional JS interop |
| **INotifyPropertyChanged** | Interface that notifies the UI when a property value changes |
| **JIT** | Just-in-Time compilation — compiles C# to native code at runtime |
| **MAUI** | .NET Multi-platform App UI — framework for cross-platform native apps |
| **MVVM** | Model-View-ViewModel — architecture pattern separating UI from logic |
| **NuGet** | Package manager for .NET; MAUI 10 is distributed via NuGet packages |
| **ObservableCollection** | A collection that raises events when items are added or removed |
| **ObservableProperty** | Source generator attribute that creates properties with change notification |
| **RelayCommand** | Source generator attribute that creates ICommand implementations |
| **Resource** | Reusable value (color, style, string) defined in a ResourceDictionary |
| **Shell** | Top-level navigation container providing tabs, flyout, and URI-based routing |
| **Source Generator** | Compile-time code generation that eliminates runtime reflection |
| **Trimming** | Build optimization that removes unused code to reduce app size |
| **XAML** | eXtensible Application Markup Language — declarative UI language for MAUI |
| **x:DataType** | XAML attribute that enables compiled bindings for type safety |
