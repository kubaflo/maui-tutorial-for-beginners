# .NET MAUI Tutorial for Beginners

A comprehensive, step-by-step guide to building cross-platform mobile and desktop applications with **.NET MAUI** (Multi-platform App UI).

## 🎯 Who Is This For?

- Developers new to .NET MAUI
- C# developers looking to build mobile/desktop apps
- Xamarin.Forms developers migrating to MAUI

## 📋 Prerequisites

- Basic knowledge of **C#**
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) (LTS) or later
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (v17.12+) with the **.NET MAUI workload** installed
  - Alternatively: VS Code with the [.NET MAUI Extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-maui)

## 📚 Tutorial Contents

| # | Topic | Description |
|---|-------|-------------|
| 01 | [Getting Started](01-GettingStarted/README.md) | Install tools, create your first MAUI app |
| 02 | [Project Structure](02-ProjectStructure/README.md) | Understand the anatomy of a MAUI project |
| 03 | [XAML Basics](03-XAML-Basics/README.md) | Learn XAML syntax, markup extensions, and resources |
| 04 | [Layouts & Controls](04-Layouts-And-Controls/README.md) | Build UIs with layouts, lists, and input controls |
| 05 | [Data Binding & MVVM](05-Data-Binding-MVVM/README.md) | Master data binding and the MVVM pattern |
| 06 | [Navigation](06-Navigation/README.md) | Navigate between pages with Shell and NavigationPage |
| 07 | [Styling & Theming](07-Styling-And-Theming/README.md) | Apply styles, themes, and custom fonts |
| 08 | [Platform-Specific Code](08-Platform-Specific-Code/README.md) | Write platform-conditional logic and use partial classes |
| 09 | [Working with APIs](09-Working-With-APIs/README.md) | Consume REST APIs with HttpClient |
| 10 | [Local Storage](10-Local-Storage/README.md) | Persist data with Preferences and SQLite |
| 11 | [Publishing & Deployment](11-Publishing-Deployment/README.md) | Build and publish to app stores |
| 12 | [Animations](12-Animations/README.md) | Add smooth animations and transitions |
| 13 | [Advanced Shell](13-Shell-Advanced/README.md) | Search, custom flyouts, and navigation guards |
| 14 | [Community Toolkit](14-Community-Toolkit/README.md) | Converters, behaviors, popups, and snackbars |
| 15 | [Dependency Injection](15-Dependency-Injection/README.md) | Structure your app with DI and service lifetimes |
| 16 | [Unit Testing](16-Unit-Testing/README.md) | Test ViewModels and services with xUnit |
| 17 | [MAUI Blazor Hybrid](17-MAUI-Blazor-Hybrid/README.md) | Build hybrid apps with Razor components |
| 18 | [Gestures & Touch](18-Gestures-And-Touch/README.md) | Handle taps, swipes, pinch, drag-and-drop |
| 19 | [Media & Camera](19-Media-And-Camera/README.md) | Capture photos, play video, share content |
| 20 | [HybridWebView](docs/20-hybridwebview.md) | Embed web content, JS interop |
| 21 | [Native AOT & Performance](docs/21-native-aot-performance.md) | AOT compilation, XAML source gen, optimization |
| 22 | [Real-World Project](docs/22-real-world-project.md) | Build a complete task manager app |

## 🛠️ What Is .NET MAUI?

.NET MAUI is the evolution of Xamarin.Forms — a single codebase framework for building native apps on:

- **Android**
- **iOS**
- **macOS**
- **Windows**

It ships as part of .NET and is fully supported by Microsoft. As of .NET 10 (LTS), MAUI is distributed via NuGet packages for finer dependency control and supports Native AOT, .NET Aspire integration, and a new XAML source generator.

## 🚀 Quick Start

```bash
# Install the MAUI workload
dotnet workload install maui

# Create a new MAUI app
dotnet new maui -n MyFirstMauiApp

# Build and run
cd MyFirstMauiApp
dotnet build
```

## 📄 License

This tutorial is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request if you'd like to improve the tutorial.
