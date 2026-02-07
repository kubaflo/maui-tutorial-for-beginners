---
title: "Dependency Injection"
layout: default
nav_order: 15
permalink: /docs/15-dependency-injection/
---

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

**Previous:** [← 14 — Community Toolkit](../14-Community-Toolkit/README.md) · **Next:** [16 — Unit Testing →](../16-Unit-Testing/README.md)
