---
title: "Dependency Injection"
layout: default
nav_order: 15
parent: "📖 Lessons"
permalink: /docs/15-dependency-injection/
---

<img src="/maui-tutorial-for-beginners/assets/images/banners/di.svg" alt="Chapter banner" class="chapter-banner">

# Dependency Injection

## What You'll Learn

- Understand dependency injection (DI) in .NET MAUI
- Register services, ViewModels, and pages
- Use constructor injection
- Choose between Singleton, Transient, and Scoped lifetimes

## Why Dependency Injection?

DI decouples your classes from their dependencies, making code:

- **Testable** — swap real services for mocks in unit tests
- **Maintainable** — change implementations without modifying consumers
- **Organized** — centralized configuration in one place

.NET MAUI has **built-in** DI powered by `Microsoft.Extensions.DependencyInjection` — the same system used in ASP.NET Core.

## Registering Services

All registrations happen in `MauiProgram.cs`:

```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder.UseMauiApp<App>();

        // Register services
        builder.Services.AddSingleton<IWeatherService, WeatherService>();
        builder.Services.AddSingleton<IDatabaseService, DatabaseService>();
        builder.Services.AddTransient<IEmailService, EmailService>();

        // Register HttpClient
        builder.Services.AddHttpClient("api", client =>
        {
            client.BaseAddress = new Uri("https://api.example.com/");
        });

        // Register ViewModels
        builder.Services.AddTransient<HomeViewModel>();
        builder.Services.AddTransient<SettingsViewModel>();
        builder.Services.AddSingleton<ProfileViewModel>();

        // Register Pages
        builder.Services.AddTransient<HomePage>();
        builder.Services.AddTransient<SettingsPage>();
        builder.Services.AddSingleton<ProfilePage>();

        return builder.Build();
    }
}
```

## Service Lifetimes

| Lifetime | Behavior | Use When |
|----------|----------|----------|
| `Singleton` | One instance for the entire app | Database connections, caches, app state |
| `Transient` | New instance every time it's requested | Stateless services, ViewModels for pages |
| `Scoped` | One instance per scope | Rarely used in MAUI (more common in web) |

```csharp
builder.Services.AddSingleton<ICacheService, CacheService>();   // One instance
builder.Services.AddTransient<IEmailService, EmailService>();   // New each time
builder.Services.AddScoped<ISessionService, SessionService>();  // Per scope
```

## Constructor Injection

### In ViewModels

```csharp
public partial class HomeViewModel : ObservableObject
{
    private readonly IWeatherService _weatherService;
    private readonly IConnectivity _connectivity;

    public HomeViewModel(IWeatherService weatherService, IConnectivity connectivity)
    {
        _weatherService = weatherService;
        _connectivity = connectivity;
    }

    [RelayCommand]
    private async Task LoadWeather()
    {
        if (_connectivity.NetworkAccess != NetworkAccess.Internet)
        {
            await Shell.Current.DisplayAlert("Error", "No internet", "OK");
            return;
        }

        var forecast = await _weatherService.GetForecastAsync();
        // Update UI...
    }
}
```

### In Pages

```csharp
public partial class HomePage : ContentPage
{
    public HomePage(HomeViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

### In Pages for Shell Navigation

Register routes with DI-resolved pages:

```csharp
// AppShell.xaml.cs
Routing.RegisterRoute("details", typeof(DetailsPage));
```

When Shell navigates, it resolves `DetailsPage` from DI automatically, injecting all dependencies.

## Registering Platform APIs

MAUI's platform APIs are already available for DI:

```csharp
// Register platform services
builder.Services.AddSingleton(Connectivity.Current);
builder.Services.AddSingleton(Geolocation.Default);
builder.Services.AddSingleton(Preferences.Default);
builder.Services.AddSingleton(SecureStorage.Default);
builder.Services.AddSingleton(FilePicker.Default);
```

Then inject them:

```csharp
public class LocationService(IGeolocation geolocation)
{
    public async Task<Location?> GetCurrentLocation()
    {
        return await geolocation.GetLocationAsync(
            new GeolocationRequest(GeolocationAccuracy.Medium));
    }
}
```

## Service Registration Patterns

### Interface-Based (Recommended)

```csharp
// Define interface
public interface INotificationService
{
    Task SendAsync(string title, string message);
}

// Implement
public class NotificationService : INotificationService
{
    public async Task SendAsync(string title, string message)
    {
        // Platform notification logic
    }
}

// Register
builder.Services.AddSingleton<INotificationService, NotificationService>();
```

### Factory Registration

For services that need custom initialization:

```csharp
builder.Services.AddSingleton<IDatabaseService>(sp =>
{
    var dbPath = Path.Combine(FileSystem.AppDataDirectory, "app.db3");
    return new DatabaseService(dbPath);
});
```

### Multiple Implementations

```csharp
builder.Services.AddKeyedSingleton<IStorage, LocalStorage>("local");
builder.Services.AddKeyedSingleton<IStorage, CloudStorage>("cloud");

// Inject with [FromKeyedServices]
public class SyncService(
    [FromKeyedServices("local")] IStorage local,
    [FromKeyedServices("cloud")] IStorage cloud)
{
    // Use both storage implementations
}
```

## ✅ Checkpoint

You now understand how to structure your MAUI apps with dependency injection for clean, testable architecture. Next, we'll write unit tests.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch15-q1" data-correct="c" data-explanation="Singleton: one instance for the app's lifetime. Transient: new instance every time. Scoped: one instance per scope (less common in MAUI).">
  <h3>Question 1</h3>
  <p class="quiz-question">What is the difference between Singleton and Transient service lifetimes?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch15-q1" value="a"> Singleton is faster, Transient is thread-safe</label></li>
    <li><label><input type="radio" name="ch15-q1" value="b"> Singleton is for interfaces, Transient is for concrete types</label></li>
    <li><label><input type="radio" name="ch15-q1" value="c"> Singleton creates one shared instance; Transient creates a new instance each time it's requested</label></li>
    <li><label><input type="radio" name="ch15-q1" value="d"> There is no practical difference in MAUI</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch15-q2" data-correct="a" data-explanation="Extension methods like RegisterServices() and RegisterViewModels() keep MauiProgram.cs clean and organized.">
  <h3>Question 2</h3>
  <p class="quiz-question">What is the recommended pattern for organizing DI registration in a large MAUI app?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch15-q2" value="a"> Extension methods on MauiAppBuilder (e.g., RegisterServices, RegisterViewModels)</label></li>
    <li><label><input type="radio" name="ch15-q2" value="b"> Register everything in App.xaml.cs</label></li>
    <li><label><input type="radio" name="ch15-q2" value="c"> Use a third-party DI container like Autofac</label></li>
    <li><label><input type="radio" name="ch15-q2" value="d"> Create separate MauiProgram files for each module</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Service Architecture

<div class="exercise-container">
  <span class="exercise-badge">Intermediate</span>
  <h3>💻 Design a Service Layer</h3>
  <p>Design the DI registration for a weather app with:</p>
  <ol>
    <li>An <code>IWeatherService</code> interface and implementation</li>
    <li>A <code>ILocationService</code> that wraps MAUI's Geolocation API</li>
    <li>A ViewModel that depends on both services</li>
    <li>Correct lifetimes for each registration</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```csharp
public static MauiAppBuilder RegisterServices(this MauiAppBuilder builder)
{
    // HttpClient — Singleton to reuse connections
    builder.Services.AddSingleton<HttpClient>();

    // Weather API — Singleton (stateless, reusable)
    builder.Services.AddSingleton<IWeatherService, WeatherService>();

    // Location — Singleton (wraps platform API)
    builder.Services.AddSingleton<ILocationService, LocationService>();

    return builder;
}

public static MauiAppBuilder RegisterViewModels(this MauiAppBuilder builder)
{
    builder.Services.AddTransient<WeatherViewModel>();
    return builder;
}

public static MauiAppBuilder RegisterViews(this MauiAppBuilder builder)
{
    builder.Services.AddTransient<WeatherPage>();
    return builder;
}
```

  </details>
</div>

<div class="key-takeaways">
  <h4>📌 Key Takeaways</h4>
  <ul>
    <li><strong>DI is built into MAUI</strong> via <code>MauiAppBuilder</code> — no third-party container needed</li>
    <li>Use <code>AddSingleton</code> (one instance), <code>AddTransient</code> (new every time), or <code>AddScoped</code> (per-scope)</li>
    <li>Services are <strong>constructor-injected</strong> into ViewModels and Pages automatically</li>
    <li>Register <strong>interfaces → implementations</strong> to keep code testable and loosely coupled</li>
  </ul>
</div>

<div class="callout callout-tip">
  <div class="callout-title">💡 Tip</div>
  Register your pages as <code>AddTransient</code> and ViewModels as <code>AddTransient</code> too — unless you need a ViewModel to survive navigation (then use <code>AddSingleton</code>).
</div>

<div class="related-chapters">
  <h4>📖 Related Chapters</h4>
  <ul>
    <li><a href="/maui-tutorial-for-beginners/docs/05-data-binding-mvvm/">Ch 05 — Data Binding & MVVM</a></li>
    <li><a href="/maui-tutorial-for-beginners/docs/16-unit-testing/">Ch 16 — Unit Testing (mock injected services)</a></li>
    <li><a href="/maui-tutorial-for-beginners/docs/22-real-world-project/">Ch 22 — Real-World Project</a></li>
  </ul>
</div>

---

**Previous:** [← 14 — Community Toolkit](/docs/14-community-toolkit/) · **Next:** [16 — Unit Testing →](/docs/16-unit-testing/)
