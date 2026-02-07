---
title: "Native AOT & Performance"
layout: default
nav_order: 21
parent: "📖 Lessons"
permalink: /docs/21-native-aot-performance/
---

# Native AOT & Performance Optimization

## What You'll Learn

- Enable Native AOT compilation for iOS and Mac Catalyst
- Use the XAML Source Generator for faster builds
- Optimize app startup time and memory usage
- Apply trimming correctly to reduce app size
- Profile and benchmark your MAUI app

> **New in .NET 10:** MAUI is distributed via NuGet packages, XAML source generation is available, and Native AOT support is production-ready for iOS and Mac Catalyst.

## What Is Native AOT?

**Ahead-of-Time (AOT) compilation** compiles your C# code to native machine code at build time instead of at runtime (JIT). Benefits include:

| Benefit | Description |
|:--------|:------------|
| **Faster startup** | No JIT compilation delay |
| **Smaller footprint** | Only used code is included |
| **Better security** | No IL code in the binary |
| **Required for iOS** | App Store requires AOT |

## Enabling Native AOT

### Project Configuration

Add these properties to your `.csproj` file:

```xml
<PropertyGroup>
  <!-- Enable trimming and AOT analyzers on all platforms -->
  <IsAotCompatible>true</IsAotCompatible>

  <!-- Enable Native AOT for iOS and Mac Catalyst -->
  <PublishAot Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios'">true</PublishAot>
  <PublishAot Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'maccatalyst'">true</PublishAot>
</PropertyGroup>
```

### Building with AOT

```bash
# Publish for iOS with Native AOT
dotnet publish -f net10.0-ios -c Release

# Publish for Mac Catalyst with Native AOT
dotnet publish -f net10.0-maccatalyst -c Release
```

{: .warning }
> Native AOT requires that your code is **trimming-compatible**. Reflection-heavy patterns may need adjustments.

## XAML Source Generator

The XAML source generator compiles your XAML to C# code at build time, replacing the runtime XAML parser:

```xml
<PropertyGroup>
  <MauiXamlInflator>SourceGen</MauiXamlInflator>
</PropertyGroup>
```

### Benefits

- **Faster startup** — no XAML parsing at runtime
- **Compile-time errors** — catch XAML mistakes during build
- **AOT-friendly** — no reflection needed to inflate XAML
- **Better IntelliSense** — tooling can analyze generated code

### Migration Checklist

When switching to the XAML Source Generator:

1. ✅ Use `x:DataType` on all pages and templates (compiled bindings)
2. ✅ Avoid `FindByName<T>()` — use `x:Name` with generated fields
3. ✅ Replace string-based bindings with lambda bindings where possible
4. ✅ Ensure all custom controls have parameterless constructors

## Compiled Bindings (Required for AOT)

Always specify `x:DataType` to enable compiled bindings:

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:MyApp.ViewModels"
             x:DataType="vm:MainViewModel">

    <!-- These bindings are compiled at build time -->
    <Label Text="{Binding Title}" />
    <Button Command="{Binding LoadCommand}" />
</ContentPage>
```

**In C# code** (equally AOT-safe):

```csharp
myLabel.SetBinding(
    Label.TextProperty,
    Binding.Create(static (MainViewModel vm) => vm.Title));
```

## JSON Serialization for AOT

Replace runtime reflection-based serialization with source generators:

```csharp
// ❌ Not AOT-compatible
var json = JsonSerializer.Serialize(myObject);

// ✅ AOT-compatible with source generators
var json = JsonSerializer.Serialize(myObject, AppJsonContext.Default.MyType);
```

Define your serialization context:

```csharp
[JsonSourceGenerationOptions(WriteIndented = true)]
[JsonSerializable(typeof(List<TodoItem>))]
[JsonSerializable(typeof(TodoItem))]
[JsonSerializable(typeof(UserProfile))]
internal partial class AppJsonContext : JsonSerializerContext { }
```

Use it with `HttpClient`:

```csharp
public class TodoService(HttpClient http)
{
    public async Task<List<TodoItem>> GetTodosAsync()
    {
        return await http.GetFromJsonAsync(
            "api/todos",
            AppJsonContext.Default.ListTodoItem) ?? [];
    }
}
```

## Performance Optimization Techniques

### 1. Lazy Loading Pages

Don't load pages until they're navigated to:

```csharp
// In MauiProgram.cs — use AddTransient, not AddSingleton for pages
builder.Services.AddTransient<DetailsPage>();
builder.Services.AddTransient<DetailsViewModel>();
```

### 2. Optimize CollectionView

```xml
<!-- Use ItemSizingStrategy for uniform items -->
<CollectionView ItemSizingStrategy="MeasureFirstItem"
                ItemsUpdatingScrollMode="KeepScrollOffset">
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="models:Product">
            <!-- Keep templates simple — avoid nested layouts -->
            <Grid ColumnDefinitions="60,*" Padding="8">
                <Image Source="{Binding ImageUrl}"
                       Aspect="AspectFill"
                       WidthRequest="50"
                       HeightRequest="50" />
                <Label Grid.Column="1"
                       Text="{Binding Name}"
                       VerticalOptions="Center" />
            </Grid>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

### 3. Image Optimization

```csharp
// Use caching for network images
public class CachedImageService
{
    private static readonly Dictionary<string, ImageSource> _cache = new();

    public static ImageSource GetImage(string url)
    {
        if (!_cache.TryGetValue(url, out var source))
        {
            source = ImageSource.FromUri(new Uri(url));
            _cache[url] = source;
        }
        return source;
    }
}
```

### 4. Reduce Startup Time

```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                // Only register fonts you actually use
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            });

        // Register services with correct lifetimes
        builder.Services.AddSingleton<IConnectivity>(Connectivity.Current);
        builder.Services.AddSingleton<MainViewModel>();
        builder.Services.AddSingleton<MainPage>();

        // Use transient for detail pages
        builder.Services.AddTransient<DetailViewModel>();
        builder.Services.AddTransient<DetailPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
```

### 5. Efficient Data Loading

```csharp
public partial class ProductViewModel : ObservableObject
{
    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private ObservableCollection<Product> _products = [];

    private readonly ProductService _productService;
    private int _currentPage = 0;
    private const int PageSize = 20;
    private bool _hasMoreItems = true;

    [RelayCommand]
    private async Task LoadMoreAsync()
    {
        if (IsLoading || !_hasMoreItems) return;

        try
        {
            IsLoading = true;
            var items = await _productService
                .GetProductsAsync(_currentPage, PageSize);

            if (items.Count < PageSize)
                _hasMoreItems = false;

            foreach (var item in items)
                Products.Add(item);

            _currentPage++;
        }
        finally
        {
            IsLoading = false;
        }
    }
}
```

## App Size Reduction

### Trimming Configuration

```xml
<PropertyGroup>
  <!-- Enable full trimming -->
  <TrimMode>full</TrimMode>

  <!-- Suppress known trimming warnings for MAUI internals -->
  <NoWarn>$(NoWarn);IL2026;IL2067;IL2104</NoWarn>
</PropertyGroup>
```

### Checking App Size

```bash
# Build a release version and check the output size
dotnet publish -f net10.0-android -c Release

# For Android, check the APK size
ls -lh bin/Release/net10.0-android/publish/*.apk

# For iOS, check the .app bundle
du -sh bin/Release/net10.0-ios/publish/*.app
```

## Profiling Tools

| Tool | Platform | Purpose |
|:-----|:---------|:--------|
| **dotnet-trace** | All | Collect performance traces |
| **Android Studio Profiler** | Android | CPU, memory, network |
| **Xcode Instruments** | iOS/macOS | Time Profiler, Allocations |
| **Visual Studio Diagnostic Tools** | Windows | CPU, memory, events |
| **dotnet-counters** | All | Real-time metrics |

```bash
# Monitor runtime metrics
dotnet-counters monitor --process-id <PID>

# Collect a trace
dotnet-trace collect --process-id <PID> --duration 00:00:30
```

## ✅ Checkpoint

You now know how to optimize your MAUI app for production with Native AOT, XAML source generation, compiled bindings, and performance best practices.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch21-q1" data-correct="b" data-explanation="IsAotCompatible enables AOT analyzers, and PublishAot enables the actual AOT compilation for specific platforms.">
  <h3>Question 1</h3>
  <p class="quiz-question">Which property enables Native AOT compilation in a MAUI project?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch21-q1" value="a"> <code>&lt;EnableAot&gt;true&lt;/EnableAot&gt;</code></label></li>
    <li><label><input type="radio" name="ch21-q1" value="b"> <code>&lt;PublishAot&gt;true&lt;/PublishAot&gt;</code></label></li>
    <li><label><input type="radio" name="ch21-q1" value="c"> <code>&lt;NativeCompilation&gt;true&lt;/NativeCompilation&gt;</code></label></li>
    <li><label><input type="radio" name="ch21-q1" value="d"> <code>&lt;AheadOfTime&gt;true&lt;/AheadOfTime&gt;</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch21-q2" data-correct="a" data-explanation="The XAML Source Generator is enabled with MauiXamlInflator set to SourceGen, converting XAML to C# at build time.">
  <h3>Question 2</h3>
  <p class="quiz-question">How do you enable the XAML Source Generator in .NET MAUI 10?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch21-q2" value="a"> <code>&lt;MauiXamlInflator&gt;SourceGen&lt;/MauiXamlInflator&gt;</code></label></li>
    <li><label><input type="radio" name="ch21-q2" value="b"> <code>&lt;XamlCompilation&gt;true&lt;/XamlCompilation&gt;</code></label></li>
    <li><label><input type="radio" name="ch21-q2" value="c"> <code>&lt;EnableXamlSourceGen&gt;true&lt;/EnableXamlSourceGen&gt;</code></label></li>
    <li><label><input type="radio" name="ch21-q2" value="d"> <code>&lt;UseXamlGenerator&gt;SourceGen&lt;/UseXamlGenerator&gt;</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch21-q3" data-correct="d" data-explanation="JsonSerializerContext with source generation eliminates reflection-based serialization, making it AOT-compatible.">
  <h3>Question 3</h3>
  <p class="quiz-question">What is required for JSON serialization to work with Native AOT?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch21-q3" value="a"> Use Newtonsoft.Json instead of System.Text.Json</label></li>
    <li><label><input type="radio" name="ch21-q3" value="b"> Add the <code>[Serializable]</code> attribute to all DTOs</label></li>
    <li><label><input type="radio" name="ch21-q3" value="c"> Disable trimming for JSON-related assemblies</label></li>
    <li><label><input type="radio" name="ch21-q3" value="d"> Use <code>JsonSerializerContext</code> source generators</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Optimize an App

<div class="exercise-container">
  <span class="exercise-badge">Challenge</span>
  <h3>💻 Performance Audit</h3>
  <p>Take your existing MAUI app and apply these optimizations:</p>
  <ol>
    <li>Add <code>x:DataType</code> to all XAML pages for compiled bindings</li>
    <li>Enable the XAML Source Generator</li>
    <li>Replace any <code>JsonSerializer.Serialize()</code> calls with source-generated contexts</li>
    <li>Review service lifetimes — ensure pages are Transient, shared services are Singleton</li>
  </ol>

  <details class="solution">
    <summary>💡 View Optimization Checklist</summary>

**`.csproj` additions:**

```xml
<PropertyGroup>
  <IsAotCompatible>true</IsAotCompatible>
  <MauiXamlInflator>SourceGen</MauiXamlInflator>
  <PublishAot Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios'">true</PublishAot>
  <PublishAot Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'maccatalyst'">true</PublishAot>
</PropertyGroup>
```

**Common issues to fix:**
- String-based `new Binding("PropertyName")` → compiled `Binding.Create(static vm => vm.Property)`
- `typeof()` reflection → direct type references
- Dynamic XAML loading → static XAML with source gen

  </details>
</div>

---

**Previous:** [← 20 — HybridWebView](/docs/20-hybridwebview/) · **Next:** [22 — Real-World Project →](/docs/22-real-world-project/)
