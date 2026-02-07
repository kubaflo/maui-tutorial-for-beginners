---
title: "✨ Best Practices"
layout: default
nav_order: 92
permalink: /best-practices/
---

# .NET MAUI Best Practices

A curated set of best practices for building production-quality .NET MAUI applications.

---

## 🏗️ Project Setup

### Use the Modern .csproj Format

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net10.0-android;net10.0-ios;net10.0-maccatalyst</TargetFrameworks>
    <TargetFrameworks Condition="$([MSBuild]::IsOSPlatform('windows'))">
      $(TargetFrameworks);net10.0-windows10.0.19041.0
    </TargetFrameworks>

    <ApplicationTitle>MyApp</ApplicationTitle>
    <ApplicationId>com.company.myapp</ApplicationId>
    <ApplicationDisplayVersion>1.0.0</ApplicationDisplayVersion>
    <ApplicationVersion>1</ApplicationVersion>

    <!-- Performance -->
    <IsAotCompatible>true</IsAotCompatible>
    <MauiXamlInflator>SourceGen</MauiXamlInflator>
  </PropertyGroup>
</Project>
```

### Organize with Feature Folders (Alternative)

For large apps, consider organizing by feature instead of by type:

```
MyApp/
├── Features/
│   ├── Auth/
│   │   ├── LoginPage.xaml(.cs)
│   │   ├── LoginViewModel.cs
│   │   ├── AuthService.cs
│   │   └── IAuthService.cs
│   ├── Products/
│   │   ├── ProductListPage.xaml(.cs)
│   │   ├── ProductListViewModel.cs
│   │   ├── ProductDetailPage.xaml(.cs)
│   │   └── ProductDetailViewModel.cs
│   └── Settings/
│       ├── SettingsPage.xaml(.cs)
│       └── SettingsViewModel.cs
├── Shared/
│   ├── Models/
│   ├── Controls/
│   └── Converters/
```

---

## 📐 XAML Best Practices

### ✅ Always Use Compiled Bindings

```xml
<!-- ✅ Compiled — type-safe, fast -->
<ContentPage x:DataType="vm:MainViewModel">
    <Label Text="{Binding Title}" />
</ContentPage>

<!-- ❌ String-based — no compile-time checking -->
<ContentPage>
    <Label Text="{Binding Title}" />
</ContentPage>
```

### ✅ Prefer VerticalStackLayout Over StackLayout

```xml
<!-- ✅ Better performance (single orientation) -->
<VerticalStackLayout Spacing="10">

<!-- ❌ Slower (supports both orientations) -->
<StackLayout Orientation="Vertical" Spacing="10">
```

### ✅ Use Grid for Complex Layouts

```xml
<!-- ✅ Efficient — single measure/arrange pass -->
<Grid RowDefinitions="Auto,*" ColumnDefinitions="*,Auto">

<!-- ❌ Nested stacks are slower -->
<VerticalStackLayout>
    <HorizontalStackLayout>
        <VerticalStackLayout>
```

### ✅ Set ItemSizingStrategy on CollectionView

```xml
<!-- ✅ Faster for uniform items -->
<CollectionView ItemSizingStrategy="MeasureFirstItem">

<!-- ❌ Measures every item (slower) -->
<CollectionView>
```

---

## 🔗 Data Binding Best Practices

### ✅ Use CommunityToolkit.Mvvm Source Generators

```csharp
// ✅ Modern — generates boilerplate
public partial class MyViewModel : ObservableObject
{
    [ObservableProperty]
    private string _title = string.Empty;

    [RelayCommand]
    private async Task SaveAsync() { }
}

// ❌ Manual — verbose, error-prone
public class MyViewModel : INotifyPropertyChanged
{
    private string _title;
    public string Title
    {
        get => _title;
        set { _title = value; OnPropertyChanged(); }
    }
    // ... lots of boilerplate
}
```

### ✅ Notify Dependent Properties

```csharp
[ObservableProperty]
[NotifyPropertyChangedFor(nameof(FullName))]
[NotifyPropertyChangedFor(nameof(IsValid))]
private string _firstName = string.Empty;

[ObservableProperty]
[NotifyPropertyChangedFor(nameof(FullName))]
private string _lastName = string.Empty;

public string FullName => $"{FirstName} {LastName}";
public bool IsValid => !string.IsNullOrWhiteSpace(FirstName);
```

### ✅ Use CanExecute for Commands

```csharp
[ObservableProperty]
[NotifyCanExecuteChangedFor(nameof(SaveCommand))]
private string _title = string.Empty;

[RelayCommand(CanExecute = nameof(CanSave))]
private async Task SaveAsync() { /* ... */ }

private bool CanSave() => !string.IsNullOrWhiteSpace(Title);
```

---

## 💉 Dependency Injection Best Practices

### ✅ Program to Interfaces

```csharp
// ✅ Testable, swappable
builder.Services.AddSingleton<IDataService, DataService>();

// ❌ Tight coupling
builder.Services.AddSingleton<DataService>();
```

### ✅ Match Page/ViewModel Lifetimes

```csharp
// Main pages — Singleton (persist state, load once)
builder.Services.AddSingleton<MainPage>();
builder.Services.AddSingleton<MainViewModel>();

// Detail pages — Transient (fresh state per navigation)
builder.Services.AddTransient<DetailPage>();
builder.Services.AddTransient<DetailViewModel>();
```

### ✅ Use Primary Constructors (C# 12)

```csharp
// ✅ Concise
public class ProductService(HttpClient http, IDatabaseService db) : IProductService
{
    public async Task<List<Product>> GetAllAsync()
        => await http.GetFromJsonAsync<List<Product>>("api/products") ?? [];
}

// ❌ Verbose
public class ProductService : IProductService
{
    private readonly HttpClient _http;
    private readonly IDatabaseService _db;
    public ProductService(HttpClient http, IDatabaseService db)
    {
        _http = http;
        _db = db;
    }
}
```

---

## 🌐 Networking Best Practices

### ✅ Use IHttpClientFactory or Singleton HttpClient

```csharp
// ✅ Singleton — reuses connections
builder.Services.AddSingleton(new HttpClient
{
    BaseAddress = new Uri("https://api.example.com/")
});

// ❌ Creates new connections per request (socket exhaustion)
var client = new HttpClient();
```

### ✅ Handle Connectivity Changes

```csharp
public partial class MainViewModel : ObservableObject
{
    private readonly IConnectivity _connectivity;

    public MainViewModel(IConnectivity connectivity)
    {
        _connectivity = connectivity;
        _connectivity.ConnectivityChanged += OnConnectivityChanged;
    }

    private void OnConnectivityChanged(object? s, ConnectivityChangedEventArgs e)
    {
        IsOffline = e.NetworkAccess != NetworkAccess.Internet;
    }
}
```

### ✅ Use AOT-Safe JSON Serialization

```csharp
// ✅ Source-generated — AOT-safe
[JsonSerializable(typeof(List<Product>))]
internal partial class AppJsonContext : JsonSerializerContext { }

await http.GetFromJsonAsync("api/products", AppJsonContext.Default.ListProduct);
```

---

## 🎨 UI/UX Best Practices

### ✅ Show Loading States

```xml
<ActivityIndicator IsRunning="{Binding IsLoading}"
                   IsVisible="{Binding IsLoading}"
                   HorizontalOptions="Center" />
```

### ✅ Handle Empty States

```xml
<CollectionView.EmptyView>
    <VerticalStackLayout HorizontalOptions="Center" VerticalOptions="Center">
        <Label Text="📋" FontSize="48" HorizontalOptions="Center" />
        <Label Text="Nothing here yet" FontSize="18" FontAttributes="Bold" />
        <Label Text="Tap + to add your first item" Opacity="0.6" />
    </VerticalStackLayout>
</CollectionView.EmptyView>
```

### ✅ Support Accessibility

```xml
<Image Source="logo.png"
       SemanticProperties.Description="Company logo" />

<Button Text="Submit"
        SemanticProperties.Hint="Submits the form" />

<!-- Announce dynamic changes -->
SemanticScreenReader.Announce("Item deleted successfully");
```

---

## 🧪 Testing Best Practices

### ✅ Test ViewModels, Not Views

```csharp
// ✅ Fast, reliable unit tests
[Fact]
public async Task LoadCommand_PopulatesItems()
{
    var mock = Substitute.For<IDataService>();
    mock.GetAllAsync().Returns([new Item()]);

    var vm = new MainViewModel(mock);
    await vm.LoadCommand.ExecuteAsync(null);

    Assert.Single(vm.Items);
}
```

### ✅ Use Theory for Multiple Cases

```csharp
[Theory]
[InlineData("", false)]
[InlineData("  ", false)]
[InlineData("Valid Title", true)]
public void CanSave_ValidatesTitle(string title, bool expected)
{
    var vm = new ItemViewModel { Title = title };
    Assert.Equal(expected, vm.CanSave());
}
```

---

## 📝 Quick Reference

| Category | ✅ Do | ❌ Don't |
|:---------|:------|:---------|
| **Bindings** | Use `x:DataType` everywhere | Use string-based bindings |
| **MVVM** | Use source generators | Write INotifyPropertyChanged manually |
| **Layouts** | Use Grid for complex UIs | Nest multiple StackLayouts |
| **DI** | Register services with interfaces | Use `new Service()` in ViewModels |
| **HTTP** | Singleton HttpClient | `new HttpClient()` per request |
| **JSON** | JsonSerializerContext | Reflection-based serialization |
| **Lists** | CollectionView with MeasureFirstItem | ListView (deprecated) |
| **Navigation** | Shell URI-based routing | Manual page creation |
| **Testing** | Test ViewModels in isolation | Skip testing or test UI directly |
