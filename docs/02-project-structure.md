---
title: "Project Structure"
layout: default
nav_order: 2
permalink: /docs/02-project-structure/
---

# Project Structure

## What You'll Learn

- Understand the folder layout of a .NET MAUI project
- Know the purpose of key files
- Learn about the single-project architecture

## Single Project Architecture

Unlike Xamarin.Forms (which required separate platform projects), .NET MAUI uses a **single project** that targets all platforms. Platform-specific code lives inside the `Platforms/` folder.

## Folder Structure

```
HelloMaui/
├── App.xaml                  # Application-level resources and styles
├── App.xaml.cs               # App startup logic
├── AppShell.xaml             # Shell navigation structure
├── AppShell.xaml.cs
├── MainPage.xaml             # Your first page (UI)
├── MainPage.xaml.cs          # Code-behind for MainPage
├── MauiProgram.cs            # App builder and service registration
├── HelloMaui.csproj          # Project file (targets all platforms)
├── Platforms/
│   ├── Android/
│   │   ├── AndroidManifest.xml
│   │   ├── MainActivity.cs
│   │   └── MainApplication.cs
│   ├── iOS/
│   │   ├── AppDelegate.cs
│   │   ├── Info.plist
│   │   └── Program.cs
│   ├── MacCatalyst/
│   │   ├── AppDelegate.cs
│   │   ├── Info.plist
│   │   └── Program.cs
│   └── Windows/
│       ├── App.xaml
│       ├── App.xaml.cs
│       └── Package.appxmanifest
├── Resources/
│   ├── AppIcon/              # App icon (SVG, resized per platform)
│   ├── Fonts/                # Custom fonts
│   ├── Images/               # Shared images
│   ├── Raw/                  # Raw assets (JSON, text, etc.)
│   ├── Splash/               # Splash screen image
│   └── Styles/
│       ├── Colors.xaml       # Color definitions
│       └── Styles.xaml       # Global styles
```

## Key Files Explained

### `MauiProgram.cs`

The app's entry point. It uses a builder pattern to configure services and the app:

```csharp
using Microsoft.Extensions.Logging;

namespace HelloMaui;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
```

This is where you register **dependency injection services**, fonts, and third-party libraries.

### `App.xaml` / `App.xaml.cs`

Defines application-level resources (colors, styles) and sets the initial page:

```csharp
public partial class App : Application
{
    public App()
    {
        InitializeComponent();
    }

    protected override Window CreateWindow(IActivationState? activationState)
    {
        return new Window(new AppShell());
    }
}
```

> 💡 **Breaking change (.NET 9+):** The `MainPage` property has been removed from `Application`. Use `CreateWindow()` to set the initial page instead.

### `AppShell.xaml`

Defines the navigation structure of your app using Shell:

```xml
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:local="clr-namespace:HelloMaui"
       x:Class="HelloMaui.AppShell">

    <ShellContent
        Title="Home"
        ContentTemplate="{DataTemplate local:MainPage}"
        Route="MainPage" />

</Shell>
```

### `.csproj` File

The project file contains target frameworks for all platforms. In .NET 10, MAUI is also distributed as NuGet packages, giving you finer control over versioning:

```xml
<TargetFrameworks>net10.0-android;net10.0-ios;net10.0-maccatalyst</TargetFrameworks>
<TargetFrameworks Condition="$([MSBuild]::IsOSPlatform('windows'))">
    $(TargetFrameworks);net10.0-windows10.0.19041.0
</TargetFrameworks>
```

> 💡 **New in .NET 10:** MAUI ships via NuGet packages in addition to the workload, so you can pin specific versions of MAUI independently from the .NET SDK.

## ✅ Checkpoint

You should now understand what each file and folder does in a MAUI project. This knowledge will be essential as we start building UIs in the next chapter.

---

**Previous:** [← 01 — Getting Started](../01-GettingStarted/README.md) · **Next:** [03 — XAML Basics →](../03-XAML-Basics/README.md)
