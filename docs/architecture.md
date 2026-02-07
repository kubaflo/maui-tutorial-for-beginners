---
title: "🏛️ Architecture Patterns"
layout: default
nav_order: 93
permalink: /architecture/
---

# Architecture Patterns for .NET MAUI

Best practices and patterns for building maintainable, testable MAUI applications.

---

## Recommended Project Structure

```
MyApp/
├── Models/                    # Data models (POCOs, DTOs)
│   ├── User.cs
│   └── Product.cs
├── ViewModels/                # Presentation logic
│   ├── MainViewModel.cs
│   └── ProductDetailViewModel.cs
├── Views/                     # XAML pages
│   ├── MainPage.xaml(.cs)
│   └── ProductDetailPage.xaml(.cs)
├── Services/                  # Business logic & data access
│   ├── Interfaces/
│   │   ├── IProductService.cs
│   │   └── IAuthService.cs
│   ├── ProductService.cs
│   └── AuthService.cs
├── Converters/                # Value converters
│   └── BoolToColorConverter.cs
├── Controls/                  # Custom controls
│   └── RatingView.xaml(.cs)
├── Resources/                 # Styles, fonts, images
│   ├── Styles/
│   ├── Fonts/
│   └── Raw/
├── Platforms/                 # Platform-specific code
├── Constants.cs               # App-wide constants
├── MauiProgram.cs             # DI registration
├── App.xaml(.cs)
└── AppShell.xaml(.cs)
```

---

## Pattern 1: Clean MVVM with Service Layer

The most common and recommended pattern for MAUI apps:

```
View → ViewModel → Service → Repository/API
```

### Service Interface

```csharp
public interface IProductService
{
    Task<List<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(int id);
    Task SaveAsync(Product product);
    Task DeleteAsync(int id);
}
```

### Service Implementation

```csharp
public class ProductService(
    IDatabaseService db,
    IConnectivity connectivity) : IProductService
{
    public async Task<List<Product>> GetAllAsync()
    {
        // Try remote first if online
        if (connectivity.NetworkAccess == NetworkAccess.Internet)
        {
            try
            {
                var remote = await FetchFromApiAsync();
                await CacheLocallyAsync(remote);
                return remote;
            }
            catch { /* fall through to local */ }
        }

        return await db.GetProductsAsync();
    }

    // ...
}
```

### ViewModel

```csharp
public partial class ProductListViewModel(
    IProductService productService) : ObservableObject
{
    [ObservableProperty]
    private ObservableCollection<Product> _products = [];

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    [RelayCommand]
    private async Task LoadAsync()
    {
        if (IsLoading) return;

        try
        {
            IsLoading = true;
            ErrorMessage = string.Empty;
            var items = await productService.GetAllAsync();
            Products = new(items);
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task GoToDetailAsync(Product product)
    {
        await Shell.Current.GoToAsync(
            "productdetail",
            new Dictionary<string, object> { ["Product"] = product });
    }
}
```

---

## Pattern 2: Repository Pattern with Offline-First

For apps that need to work offline:

```csharp
public interface IRepository<T> where T : class, new()
{
    Task<List<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task<int> InsertAsync(T entity);
    Task<int> UpdateAsync(T entity);
    Task<int> DeleteAsync(T entity);
}

public class SqliteRepository<T>(
    SQLiteAsyncConnection db) : IRepository<T>
    where T : class, new()
{
    public Task<List<T>> GetAllAsync()
        => db.Table<T>().ToListAsync();

    public Task<T?> GetByIdAsync(int id)
        => db.FindAsync<T>(id);

    public Task<int> InsertAsync(T entity)
        => db.InsertAsync(entity);

    public Task<int> UpdateAsync(T entity)
        => db.UpdateAsync(entity);

    public Task<int> DeleteAsync(T entity)
        => db.DeleteAsync(entity);
}
```

**Registration:**

```csharp
builder.Services.AddSingleton<SQLiteAsyncConnection>(_ =>
{
    var path = Path.Combine(FileSystem.AppDataDirectory, "app.db3");
    return new SQLiteAsyncConnection(path);
});

builder.Services.AddSingleton<IRepository<Product>, SqliteRepository<Product>>();
builder.Services.AddSingleton<IRepository<Category>, SqliteRepository<Category>>();
```

---

## Pattern 3: Messaging (Pub/Sub)

For loose coupling between ViewModels using `WeakReferenceMessenger`:

```csharp
// Define a message
public record ProductUpdatedMessage(Product Product);

// Send a message (from DetailsViewModel)
WeakReferenceMessenger.Default.Send(new ProductUpdatedMessage(product));

// Receive a message (in ListViewModel)
public partial class ProductListViewModel : ObservableObject
{
    public ProductListViewModel()
    {
        WeakReferenceMessenger.Default.Register<ProductUpdatedMessage>(
            this, (recipient, message) =>
            {
                // Refresh the list
                LoadCommand.Execute(null);
            });
    }
}
```

---

## Pattern 4: State Management

For complex apps, consider a centralized state:

```csharp
public class AppState : ObservableObject
{
    private static readonly Lazy<AppState> _instance = new(() => new());
    public static AppState Current => _instance.Value;

    [ObservableProperty]
    private User? _currentUser;

    [ObservableProperty]
    private bool _isAuthenticated;

    [ObservableProperty]
    private AppTheme _theme = AppTheme.Unspecified;
}
```

**Register as Singleton:**
```csharp
builder.Services.AddSingleton(AppState.Current);
```

---

## DI Registration Best Practices

```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSans");
            })
            .RegisterServices()
            .RegisterViewModels()
            .RegisterViews();

        return builder.Build();
    }

    private static MauiAppBuilder RegisterServices(this MauiAppBuilder builder)
    {
        // Platform APIs (Singleton — single instance)
        builder.Services.AddSingleton(Connectivity.Current);
        builder.Services.AddSingleton(Geolocation.Default);
        builder.Services.AddSingleton(FilePicker.Default);

        // Database (Singleton — one connection)
        builder.Services.AddSingleton<IDatabaseService, DatabaseService>();

        // HTTP (Singleton — reuse connections)
        builder.Services.AddSingleton<HttpClient>();

        // Business logic (Singleton — stateless)
        builder.Services.AddSingleton<IProductService, ProductService>();
        builder.Services.AddSingleton<IAuthService, AuthService>();

        return builder;
    }

    private static MauiAppBuilder RegisterViewModels(this MauiAppBuilder builder)
    {
        // List/Main VMs → Singleton (persist state)
        builder.Services.AddSingleton<MainViewModel>();
        builder.Services.AddSingleton<ProductListViewModel>();

        // Detail VMs → Transient (fresh state each time)
        builder.Services.AddTransient<ProductDetailViewModel>();
        builder.Services.AddTransient<SettingsViewModel>();

        return builder;
    }

    private static MauiAppBuilder RegisterViews(this MauiAppBuilder builder)
    {
        // Pages mirror their ViewModel lifetime
        builder.Services.AddSingleton<MainPage>();
        builder.Services.AddSingleton<ProductListPage>();
        builder.Services.AddTransient<ProductDetailPage>();
        builder.Services.AddTransient<SettingsPage>();

        return builder;
    }
}
```

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|:---------|:-------------|
| Put business logic in code-behind | Use ViewModels with commands |
| Create `new HttpClient()` per call | Register as Singleton in DI |
| Use string-based bindings | Use compiled bindings with `x:DataType` |
| Reference ViewModels in other ViewModels | Use `WeakReferenceMessenger` |
| Hard-code API URLs | Use `appsettings` or constants class |
| Mix UI concerns in ViewModels | ViewModels should not reference UI types |
| Skip `async/await` for I/O operations | Always use async for DB, HTTP, file access |
| Register everything as Singleton | Use Transient for detail pages/VMs |

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="arch-q1" data-correct="c" data-explanation="ViewModels should never directly reference UI types (Views, Controls). They communicate through data binding and commands.">
  <h3>Architecture Check</h3>
  <p class="quiz-question">Which of these violates the MVVM pattern?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="arch-q1" value="a"> A ViewModel calling a service method</label></li>
    <li><label><input type="radio" name="arch-q1" value="b"> A View setting its BindingContext to a ViewModel</label></li>
    <li><label><input type="radio" name="arch-q1" value="c"> A ViewModel directly creating and showing a new Page</label></li>
    <li><label><input type="radio" name="arch-q1" value="d"> A ViewModel using WeakReferenceMessenger</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>
