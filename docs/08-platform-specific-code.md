---
title: "Platform-Specific Code"
layout: default
nav_order: 8
permalink: /docs/08-platform-specific-code/
---

# Platform-Specific Code

## What You'll Learn

- Use conditional compilation (`#if`)
- Work with partial classes and partial methods
- Use platform-specific APIs
- Customize platform behavior in `Platforms/` folders

## When Do You Need Platform-Specific Code?

Most MAUI code is shared, but sometimes you need to:

- Access native APIs (camera, sensors, notifications)
- Customize platform look and feel
- Handle platform differences in behavior

## Approach 1: Conditional Compilation

Use preprocessor directives to include code for specific platforms:

```csharp
public string GetPlatformName()
{
#if ANDROID
    return "Android";
#elif IOS
    return "iOS";
#elif MACCATALYST
    return "macOS";
#elif WINDOWS
    return "Windows";
#else
    return "Unknown";
#endif
}
```

Available symbols: `ANDROID`, `IOS`, `MACCATALYST`, `WINDOWS`

## Approach 2: DeviceInfo and Platform Checks

Runtime checks without preprocessor directives:

```csharp
if (DeviceInfo.Platform == DevicePlatform.Android)
{
    // Android-specific logic
}
else if (DeviceInfo.Platform == DevicePlatform.iOS)
{
    // iOS-specific logic
}

// Check device type
if (DeviceInfo.Idiom == DeviceIdiom.Phone)
{
    // Phone-specific layout
}
```

## Approach 3: Partial Classes (Recommended)

Split implementation across platform folders using partial classes:

### 1. Define the shared interface

```csharp
// Services/IDeviceOrientationService.cs
namespace HelloMaui.Services;

public interface IDeviceOrientationService
{
    DeviceOrientation GetOrientation();
}

public enum DeviceOrientation
{
    Undefined, Portrait, Landscape
}
```

### 2. Create partial class

```csharp
// Services/DeviceOrientationService.cs
namespace HelloMaui.Services;

public partial class DeviceOrientationService : IDeviceOrientationService
{
    public partial DeviceOrientation GetOrientation();
}
```

### 3. Platform implementations

```csharp
// Platforms/Android/Services/DeviceOrientationService.cs
using Android.Content;
using Android.Views;
using Android.Runtime;

namespace HelloMaui.Services;

public partial class DeviceOrientationService
{
    public partial DeviceOrientation GetOrientation()
    {
        var context = Platform.CurrentActivity ?? Platform.AppContext;
        var windowManager = context.GetSystemService(Context.WindowService)
            .JavaCast<IWindowManager>();

        var rotation = windowManager?.DefaultDisplay?.Rotation;
        return rotation switch
        {
            SurfaceOrientation.Rotation0 or
            SurfaceOrientation.Rotation180 => DeviceOrientation.Portrait,
            _ => DeviceOrientation.Landscape
        };
    }
}
```

```csharp
// Platforms/iOS/Services/DeviceOrientationService.cs
using UIKit;

namespace HelloMaui.Services;

public partial class DeviceOrientationService
{
    public partial DeviceOrientation GetOrientation()
    {
        var orientation = UIDevice.CurrentDevice.Orientation;
        return orientation switch
        {
            UIDeviceOrientation.Portrait or
            UIDeviceOrientation.PortraitUpsideDown => DeviceOrientation.Portrait,
            _ => DeviceOrientation.Landscape
        };
    }
}
```

### 4. Register in DI

```csharp
// MauiProgram.cs
builder.Services.AddSingleton<IDeviceOrientationService, DeviceOrientationService>();
```

## Built-in Platform APIs (Microsoft.Maui.Essentials)

MAUI includes many cross-platform APIs out of the box:

```csharp
// Battery
var level = Battery.Default.ChargeLevel;
var state = Battery.Default.State;

// Connectivity
var access = Connectivity.Current.NetworkAccess;
if (access == NetworkAccess.Internet)
{
    // Online
}

// Geolocation
var location = await Geolocation.Default.GetLocationAsync();
if (location != null)
{
    Console.WriteLine($"Lat: {location.Latitude}, Lon: {location.Longitude}");
}

// Share
await Share.Default.RequestAsync(new ShareTextRequest
{
    Text = "Check out this MAUI tutorial!",
    Title = "Share"
});

// Vibration
Vibration.Default.Vibrate(TimeSpan.FromMilliseconds(500));

// Clipboard
await Clipboard.Default.SetTextAsync("Copied!");

// Flashlight
await Flashlight.Default.TurnOnAsync();
```

## HybridWebView (.NET 9+)

The `HybridWebView` control enables hosting HTML/JS/CSS content inside your MAUI app with bidirectional communication between JavaScript and C#:

```xml
<HybridWebView x:Name="myHybridWebView"
               HybridRoot="wwwroot"
               DefaultFile="index.html"
               RawMessageReceived="OnRawMessageReceived" />
```

```csharp
// Receive messages from JavaScript
private void OnRawMessageReceived(object sender, HybridWebViewRawMessageReceivedEventArgs e)
{
    var message = e.Message;
    // Process message from JS
}

// Invoke JavaScript from C#
var result = await myHybridWebView.InvokeJavaScriptAsync("myJsFunction", ["arg1"]);
```

In .NET 10, `HybridWebView` also supports intercepting web requests via the `WebResourceRequested` event.

## Platform-Specific XAML

Use `OnPlatform` to set different values per platform:

```xml
<Label Text="Hello">
    <Label.FontSize>
        <OnPlatform x:TypeArguments="x:Double">
            <On Platform="iOS" Value="20" />
            <On Platform="Android" Value="18" />
            <On Platform="WinUI" Value="24" />
        </OnPlatform>
    </Label.FontSize>
</Label>

<!-- Shorthand -->
<Label Padding="{OnPlatform iOS='0,20,0,0', Default='0'}" />
```

## ✅ Checkpoint

You now know multiple ways to write platform-specific code while keeping most of your app shared, including the new HybridWebView for hosting web content. Next, we'll connect to web APIs.

---

**Previous:** [← 07 — Styling & Theming](../07-Styling-And-Theming/README.md) · **Next:** [09 — Working with APIs →](../09-Working-With-APIs/README.md)
