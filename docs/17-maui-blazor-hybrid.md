---
title: "MAUI Blazor Hybrid"
layout: default
nav_order: 17
permalink: /docs/17-maui-blazor-hybrid/
---

# MAUI Blazor Hybrid

## What You'll Learn

- Understand what Blazor Hybrid is
- Create a MAUI Blazor Hybrid app
- Mix Razor components with native MAUI pages
- Share code between web and native

## What Is Blazor Hybrid?

**Blazor Hybrid** lets you build your UI using Razor components (HTML, CSS, C#) and host them inside a native MAUI app using `BlazorWebView`. You get:

- **Web UI** rendered natively (not in a browser)
- Full access to **native device APIs**
- Code sharing with **Blazor web apps**

This is different from HybridWebView — Blazor Hybrid uses the full Blazor component model with Razor syntax.

## Create a MAUI Blazor Hybrid App

```bash
dotnet new maui-blazor -n MyBlazorApp
cd MyBlazorApp
```

## Project Structure

```
MyBlazorApp/
├── Components/
│   ├── Layout/
│   │   ├── MainLayout.razor
│   │   └── NavMenu.razor
│   └── Pages/
│       ├── Counter.razor
│       └── Home.razor
├── wwwroot/
│   ├── css/
│   │   └── app.css
│   └── index.html
├── MainPage.xaml            # Hosts BlazorWebView
├── MauiProgram.cs
└── _Imports.razor
```

## How It Works

### MainPage.xaml — The Host

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:MyBlazorApp"
             x:Class="MyBlazorApp.MainPage"
             BackgroundColor="{DynamicResource PageBackgroundColor}">

    <BlazorWebView x:Name="blazorWebView" HostPage="wwwroot/index.html">
        <BlazorWebView.RootComponents>
            <RootComponent Selector="#app" ComponentType="{x:Type local:Components.Routes}" />
        </BlazorWebView.RootComponents>
    </BlazorWebView>

</ContentPage>
```

### A Razor Component

```razor
@* Components/Pages/Counter.razor *@
@page "/counter"

<h1>Counter</h1>

<p role="status">Current count: @currentCount</p>

<button class="btn btn-primary" @onclick="IncrementCount">Click me</button>

@code {
    private int currentCount = 0;

    private void IncrementCount()
    {
        currentCount++;
    }
}
```

## Accessing Native APIs from Razor Components

Inject native services into Razor components:

```csharp
// Services/IDeviceInfoService.cs
public interface IDeviceInfoService
{
    string GetPlatform();
    string GetDeviceName();
    double GetBatteryLevel();
}

public class DeviceInfoService : IDeviceInfoService
{
    public string GetPlatform() => DeviceInfo.Platform.ToString();
    public string GetDeviceName() => DeviceInfo.Name;
    public double GetBatteryLevel() => Battery.Default.ChargeLevel;
}
```

Register in `MauiProgram.cs`:

```csharp
builder.Services.AddSingleton<IDeviceInfoService, DeviceInfoService>();
```

Use in Razor:

```razor
@page "/device"
@inject IDeviceInfoService DeviceInfo

<h2>Device Info</h2>

<table class="table">
    <tr><td>Platform</td><td>@DeviceInfo.GetPlatform()</td></tr>
    <tr><td>Device</td><td>@DeviceInfo.GetDeviceName()</td></tr>
    <tr><td>Battery</td><td>@(DeviceInfo.GetBatteryLevel() * 100)%</td></tr>
</table>
```

## Mixing Blazor and MAUI Pages

You can navigate between native MAUI pages and Blazor content:

```csharp
// From a Razor component, navigate to a native MAUI page
@inject IServiceProvider ServiceProvider

<button @onclick="OpenNativeCamera">Take Photo</button>

@code {
    private async Task OpenNativeCamera()
    {
        var photo = await MediaPicker.Default.CapturePhotoAsync();
        if (photo != null)
        {
            // Process photo
        }
    }
}
```

## Sharing Components with Blazor Web

Create a shared Razor Class Library:

```bash
dotnet new razorclasslib -n SharedComponents
```

Reference it from both your MAUI Blazor app and a Blazor web app:

```xml
<!-- In both projects -->
<ProjectReference Include="..\SharedComponents\SharedComponents.csproj" />
```

Shared components work identically on both platforms:

```razor
@* SharedComponents/SharedCounter.razor *@
<div class="counter-card">
    <h3>@Title</h3>
    <p>Count: @count</p>
    <button @onclick="() => count++">Increment</button>
</div>

@code {
    [Parameter] public string Title { get; set; } = "Counter";
    private int count = 0;
}
```

## Styling with CSS

Use standard CSS in `wwwroot/css/app.css`:

```css
.counter-card {
    background: var(--surface-color);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.counter-card button {
    background: #512BD4;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-size: 16px;
    cursor: pointer;
}
```

## When to Use Blazor Hybrid vs XAML

| Scenario | Use Blazor Hybrid | Use XAML |
|----------|:-:|:-:|
| Sharing UI with a web app | ✅ | ❌ |
| Web team building mobile | ✅ | ❌ |
| Maximum native feel | ❌ | ✅ |
| Complex native animations | ❌ | ✅ |
| Rapid prototyping | ✅ | ❌ |
| Existing Blazor codebase | ✅ | ❌ |

## ✅ Checkpoint

You can now build hybrid apps that combine web technologies with native capabilities. Next, we'll learn about gestures and touch handling.

---

**Previous:** [← 16 — Unit Testing](../16-Unit-Testing/README.md) · **Next:** [18 — Gestures & Touch →](../18-Gestures-And-Touch/README.md)
