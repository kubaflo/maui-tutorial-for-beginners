---
title: "HybridWebView & JS Interop"
layout: default
nav_order: 20
parent: "📖 Lessons"
permalink: /docs/20-hybridwebview/
---

# HybridWebView & JavaScript Interop

## What You'll Learn

- Embed web content inside a MAUI app with `HybridWebView`
- Call JavaScript from C# and vice versa
- Build hybrid UIs that mix native and web technologies
- Use JSON serialization for type-safe interop

> **Note:** `HybridWebView` is available in .NET MAUI 9+ and is the recommended way to embed interactive web content. It replaces older WebView approaches for JS interop scenarios.

## When to Use HybridWebView

| Scenario | Recommended Control |
|:---------|:-------------------|
| Display static web pages | `WebView` |
| Rich JS interop with native | **`HybridWebView`** |
| Full Blazor app inside MAUI | `BlazorWebView` |
| Simple HTML rendering | `WebView` or `Label` with HTML |

## Setting Up HybridWebView

### 1. Create the Web Content

HybridWebView serves files from `Resources/Raw/wwwroot/`. Create the directory and add an `index.html`:

```
MyApp/
├── Resources/
│   └── Raw/
│       └── wwwroot/
│           ├── index.html
│           ├── app.js
│           └── styles.css
```

**`Resources/Raw/wwwroot/index.html`:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="styles.css" />
    <title>Hybrid App</title>
</head>
<body>
    <h1 id="title">Hello from Web!</h1>
    <p id="message">Waiting for data from .NET...</p>
    <button onclick="sendToNet()">Send to .NET</button>

    <script src="app.js"></script>
</body>
</html>
```

**`Resources/Raw/wwwroot/styles.css`:**

```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding: 20px;
    background: #1a1a2e;
    color: #e0e0e0;
}

button {
    background: #7c3aed;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
}
```

### 2. Add the HybridWebView to XAML

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="MyApp.HybridPage">

    <Grid RowDefinitions="Auto,*,Auto">
        <!-- Native MAUI header -->
        <Label Text="🌐 Hybrid Page"
               FontSize="24"
               FontAttributes="Bold"
               Padding="15"
               Grid.Row="0" />

        <!-- Web content -->
        <HybridWebView x:Name="hybridWebView"
                       RawMessageReceived="OnRawMessageReceived"
                       Grid.Row="1" />

        <!-- Native MAUI footer -->
        <Button Text="Send Message to JavaScript"
                Clicked="OnSendMessageClicked"
                Margin="15"
                Grid.Row="2" />
    </Grid>

</ContentPage>
```

## Sending Messages: C# → JavaScript

### Raw Messages

The simplest interop pattern — send string messages:

**C# (code-behind):**

```csharp
public partial class HybridPage : ContentPage
{
    public HybridPage()
    {
        InitializeComponent();
    }

    private async void OnSendMessageClicked(object sender, EventArgs e)
    {
        // Send a raw string to JavaScript
        await hybridWebView.SendRawMessageAsync("Hello from .NET MAUI!");
    }
}
```

**JavaScript (`app.js`):**

```javascript
// Listen for messages from C#
window.addEventListener("HybridWebViewMessageReceived", function (e) {
    document.getElementById("message").textContent = e.detail.message;
});
```

### Invoking Specific JavaScript Functions

Call named JS functions directly with typed return values:

```csharp
// Call a JS function and get the result
var title = await hybridWebView.InvokeJavaScriptAsync<string>(
    "getPageTitle");

// Execute arbitrary JS
var result = await hybridWebView.EvaluateJavaScriptAsync(
    "document.title");
```

**JavaScript:**

```javascript
function getPageTitle() {
    return document.getElementById("title").textContent;
}
```

## Sending Messages: JavaScript → C#

### Raw Messages from JS

**JavaScript:**

```javascript
function sendToNet() {
    window.HybridWebView.SendRawMessage("User clicked the web button!");
}
```

**C# handler:**

```csharp
private async void OnRawMessageReceived(object sender,
    HybridWebViewRawMessageReceivedEventArgs e)
{
    // e.Message contains the string from JS
    await DisplayAlert("From JavaScript", e.Message, "OK");
}
```

### Invoking C# Methods from JavaScript

Use `SetInvokeJavaScriptTarget` to expose a C# object to JavaScript:

```csharp
public partial class HybridPage : ContentPage
{
    public HybridPage()
    {
        InitializeComponent();
        hybridWebView.SetInvokeJavaScriptTarget(this);
    }

    // This method can be called from JavaScript!
    public string GetDeviceInfo()
    {
        return $"{DeviceInfo.Platform} - {DeviceInfo.Name}";
    }

    public async Task<string> GetBatteryLevel()
    {
        var level = Battery.Default.ChargeLevel;
        return $"{level * 100:F0}%";
    }
}
```

**JavaScript:**

```javascript
// Call the C# method from JS
async function showDeviceInfo() {
    var info = await window.HybridWebView.InvokeDotNet("QueryDeviceInfo");
    document.getElementById("message").textContent = info;
}
```

## Passing Complex Data with JSON Serialization

For typed data, use `JsonSerializerContext` (required for Native AOT compatibility):

```csharp
// Define a serialization context for AOT safety
[JsonSerializable(typeof(Dictionary<string, string>))]
[JsonSerializable(typeof(string))]
[JsonSerializable(typeof(WeatherData))]
internal partial class HybridJSContext : JsonSerializerContext { }

public record WeatherData(string City, double Temperature, string Condition);
```

**Passing parameters and receiving typed results:**

```csharp
var result = await hybridWebView.InvokeJavaScriptAsync<Dictionary<string, string>>(
    "processData",
    HybridJSContext.Default.DictionaryStringString,
    ["key1", "value1"],
    [HybridJSContext.Default.String, HybridJSContext.Default.String]);
```

**JavaScript:**

```javascript
function processData(key, value) {
    var data = {};
    data[key] = value;
    data["timestamp"] = new Date().toISOString();
    return data;
}
```

## Practical Example: Settings Dashboard

Build a native + web hybrid settings page:

```csharp
public partial class SettingsDashboard : ContentPage
{
    public SettingsDashboard()
    {
        InitializeComponent();
        hybridWebView.SetInvokeJavaScriptTarget(this);
    }

    // Expose app preferences to JavaScript
    public string GetPreference(string key)
    {
        return Preferences.Get(key, "not set");
    }

    public void SetPreference(string key, string value)
    {
        Preferences.Set(key, value);
    }

    public string GetAllPreferences()
    {
        var prefs = new Dictionary<string, string>
        {
            ["theme"] = Preferences.Get("theme", "dark"),
            ["language"] = Preferences.Get("language", "en"),
            ["notifications"] = Preferences.Get("notifications", "true")
        };
        return JsonSerializer.Serialize(prefs);
    }
}
```

## ✅ Checkpoint

You now know how to embed web content in a MAUI app and communicate bidirectionally between C# and JavaScript. This is powerful for reusing existing web UIs or building rich interactive dashboards.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch20-q1" data-correct="b" data-explanation="HybridWebView serves web content from Resources/Raw/wwwroot/ and provides bidirectional JS interop.">
  <h3>Question 1</h3>
  <p class="quiz-question">What is the primary advantage of HybridWebView over a standard WebView?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch20-q1" value="a"> It renders faster on all platforms</label></li>
    <li><label><input type="radio" name="ch20-q1" value="b"> It provides built-in bidirectional JavaScript interop with typed returns</label></li>
    <li><label><input type="radio" name="ch20-q1" value="c"> It supports Blazor components natively</label></li>
    <li><label><input type="radio" name="ch20-q1" value="d"> It doesn't require an internet connection</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch20-q2" data-correct="c" data-explanation="SetInvokeJavaScriptTarget exposes a C# object so JavaScript can call its methods.">
  <h3>Question 2</h3>
  <p class="quiz-question">How do you expose a C# object to be callable from JavaScript?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch20-q2" value="a"> <code>hybridWebView.BindingContext = myObject</code></label></li>
    <li><label><input type="radio" name="ch20-q2" value="b"> <code>hybridWebView.RegisterTarget(myObject)</code></label></li>
    <li><label><input type="radio" name="ch20-q2" value="c"> <code>hybridWebView.SetInvokeJavaScriptTarget(myObject)</code></label></li>
    <li><label><input type="radio" name="ch20-q2" value="d"> <code>hybridWebView.ExposeToJS(myObject)</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Build a Calculator

<div class="exercise-container">
  <span class="exercise-badge">Hands-On</span>
  <h3>💻 Try It Yourself</h3>
  <p>Build a hybrid calculator where:</p>
  <ol>
    <li>The UI is built with HTML/CSS/JS in <code>wwwroot/</code></li>
    <li>The calculation logic runs in C# (exposed via <code>SetInvokeJavaScriptTarget</code>)</li>
    <li>Results are displayed back in the web UI</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```csharp
public partial class CalculatorPage : ContentPage
{
    public CalculatorPage()
    {
        InitializeComponent();
        hybridWebView.SetInvokeJavaScriptTarget(this);
    }

    public double Calculate(string operation, double a, double b)
    {
        return operation switch
        {
            "add" => a + b,
            "subtract" => a - b,
            "multiply" => a * b,
            "divide" when b != 0 => a / b,
            _ => 0
        };
    }
}
```

```javascript
async function calculate() {
    var a = parseFloat(document.getElementById("num1").value);
    var b = parseFloat(document.getElementById("num2").value);
    var op = document.getElementById("operation").value;

    var result = await window.HybridWebView.InvokeDotNet(
        "Calculate", op, a, b);
    document.getElementById("result").textContent = "= " + result;
}
```

  </details>
</div>

---

**Previous:** [← 19 — Media & Camera](/docs/19-media-and-camera/) · **Next:** [21 — Native AOT & Performance →](/docs/21-native-aot-performance/)
