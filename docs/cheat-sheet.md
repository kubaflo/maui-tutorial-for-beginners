---
title: "🔖 Cheat Sheet"
layout: default
nav_order: 98
permalink: /cheat-sheet/
---

# .NET MAUI Cheat Sheet

A quick reference for common MAUI patterns, commands, and code snippets.

---

## 🛠️ CLI Commands

```bash
# Install MAUI workload
dotnet workload install maui

# Create a new app
dotnet new maui -n MyApp

# Create a Blazor Hybrid app
dotnet new maui-blazor -n MyBlazorApp

# Build & run
dotnet build -t:Run -f net10.0-android
dotnet build -t:Run -f net10.0-ios
dotnet build -t:Run -f net10.0-maccatalyst
dotnet build -t:Run -f net10.0-windows10.0.19041.0

# Publish for release
dotnet publish -f net10.0-android -c Release
dotnet publish -f net10.0-ios -c Release

# Add common packages
dotnet add package CommunityToolkit.Mvvm
dotnet add package CommunityToolkit.Maui
dotnet add package sqlite-net-pcl
dotnet add package SQLitePCLRaw.bundle_green
```

---

## 📐 XAML Layouts

### Grid

```xml
<Grid RowDefinitions="Auto,*,Auto"
      ColumnDefinitions="*,2*"
      RowSpacing="10"
      ColumnSpacing="10">
    <Label Grid.Row="0" Grid.Column="0" Text="Top-Left" />
    <Label Grid.Row="0" Grid.Column="1" Text="Top-Right" />
    <Label Grid.Row="1" Grid.ColumnSpan="2" Text="Middle (spans 2 cols)" />
</Grid>
```

### VerticalStackLayout

```xml
<VerticalStackLayout Spacing="10" Padding="20">
    <Label Text="Item 1" />
    <Label Text="Item 2" />
</VerticalStackLayout>
```

### FlexLayout

```xml
<FlexLayout Wrap="Wrap"
            JustifyContent="SpaceAround"
            AlignItems="Center">
    <Button Text="A" />
    <Button Text="B" />
    <Button Text="C" />
</FlexLayout>
```

---

## 🔗 Data Binding

### XAML Binding

```xml
<!-- One-way (default) -->
<Label Text="{Binding Title}" />

<!-- Two-way -->
<Entry Text="{Binding Name, Mode=TwoWay}" />

<!-- With formatting -->
<Label Text="{Binding Price, StringFormat='${0:F2}'}" />

<!-- Compiled binding (always use x:DataType) -->
<ContentPage x:DataType="vm:MainViewModel">
    <Label Text="{Binding Title}" />
</ContentPage>
```

### C# Compiled Binding

```csharp
myLabel.SetBinding(
    Label.TextProperty,
    Binding.Create(static (MainViewModel vm) => vm.Title));
```

---

## 🏗️ MVVM with CommunityToolkit.Mvvm

### ViewModel

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

public partial class MyViewModel : ObservableObject
{
    [ObservableProperty]
    private string _title = string.Empty;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(FullName))]
    private string _firstName = string.Empty;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(FullName))]
    private string _lastName = string.Empty;

    public string FullName => $"{FirstName} {LastName}";

    [ObservableProperty]
    private bool _isLoading;

    public ObservableCollection<Item> Items { get; } = [];

    [RelayCommand]
    private async Task LoadDataAsync()
    {
        if (IsLoading) return;
        try
        {
            IsLoading = true;
            var data = await _service.GetItemsAsync();
            Items.Clear();
            foreach (var item in data)
                Items.Add(item);
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task DeleteItemAsync(Item item)
    {
        Items.Remove(item);
        await _service.DeleteAsync(item.Id);
    }
}
```

---

## 🧭 Shell Navigation

### Routes

```csharp
// Register in AppShell constructor
Routing.RegisterRoute("details", typeof(DetailsPage));
Routing.RegisterRoute("settings", typeof(SettingsPage));

// Navigate
await Shell.Current.GoToAsync("details");
await Shell.Current.GoToAsync($"details?id={item.Id}");
await Shell.Current.GoToAsync(".."); // go back

// Navigate with complex data
await Shell.Current.GoToAsync("details", new Dictionary<string, object>
{
    ["Item"] = selectedItem
});
```

### Receive Parameters

```csharp
[QueryProperty(nameof(ItemId), "id")]
public partial class DetailsViewModel : ObservableObject
{
    [ObservableProperty]
    private string _itemId = string.Empty;
}
```

---

## 💉 Dependency Injection

### Registration

```csharp
// MauiProgram.cs
builder.Services.AddSingleton<IDataService, DataService>();  // one instance
builder.Services.AddTransient<DetailsViewModel>();            // new each time
builder.Services.AddTransient<DetailsPage>();

// Platform APIs
builder.Services.AddSingleton(Connectivity.Current);
builder.Services.AddSingleton(Geolocation.Default);
builder.Services.AddSingleton(FilePicker.Default);
```

### Constructor Injection

```csharp
public partial class DetailsPage : ContentPage
{
    public DetailsPage(DetailsViewModel vm)
    {
        InitializeComponent();
        BindingContext = vm;
    }
}
```

---

## 🎨 Styling Quick Reference

### Implicit Style (applies to all)

```xml
<Style TargetType="Button">
    <Setter Property="BackgroundColor" Value="#7c3aed" />
    <Setter Property="TextColor" Value="White" />
    <Setter Property="CornerRadius" Value="8" />
</Style>
```

### Explicit Style (opt-in)

```xml
<Style x:Key="PrimaryButton" TargetType="Button">
    <Setter Property="BackgroundColor" Value="#7c3aed" />
</Style>

<Button Style="{StaticResource PrimaryButton}" Text="Click" />
```

### Theme-Aware Colors

```xml
<Color x:Key="PageBg">{AppThemeBinding Light=#FFFFFF, Dark=#1a1a2e}</Color>

<Label TextColor="{AppThemeBinding Light=Black, Dark=White}" />
```

---

## 📦 CollectionView Patterns

### Basic

```xml
<CollectionView ItemsSource="{Binding Items}"
                ItemSizingStrategy="MeasureFirstItem"
                SelectionMode="None">
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="models:Item">
            <Grid Padding="10" ColumnDefinitions="*,Auto">
                <Label Text="{Binding Name}" />
                <Label Grid.Column="1" Text="{Binding Price, StringFormat='${0:F2}'}" />
            </Grid>
        </DataTemplate>
    </CollectionView.ItemTemplate>

    <CollectionView.EmptyView>
        <Label Text="No items found" HorizontalOptions="Center" />
    </CollectionView.EmptyView>
</CollectionView>
```

### With Swipe Actions

```xml
<CollectionView.ItemTemplate>
    <DataTemplate x:DataType="models:Item">
        <SwipeView>
            <SwipeView.RightItems>
                <SwipeItems>
                    <SwipeItem Text="Delete" BackgroundColor="Red"
                               Command="{Binding Source={RelativeSource AncestorType={x:Type vm:MainViewModel}}, Path=DeleteItemCommand}"
                               CommandParameter="{Binding .}" />
                </SwipeItems>
            </SwipeView.RightItems>
            <Grid Padding="10">
                <Label Text="{Binding Name}" />
            </Grid>
        </SwipeView>
    </DataTemplate>
</CollectionView.ItemTemplate>
```

---

## 🔐 Storage

### Preferences

```csharp
Preferences.Set("username", "john");
var name = Preferences.Get("username", "default");
Preferences.Remove("username");
```

### SecureStorage

```csharp
await SecureStorage.SetAsync("auth_token", token);
var token = await SecureStorage.GetAsync("auth_token");
SecureStorage.Remove("auth_token");
```

### SQLite

```csharp
var db = new SQLiteAsyncConnection(
    Path.Combine(FileSystem.AppDataDirectory, "app.db3"));
await db.CreateTableAsync<TodoItem>();

// CRUD
await db.InsertAsync(new TodoItem { Title = "Buy groceries" });
var items = await db.Table<TodoItem>().ToListAsync();
var item = await db.Table<TodoItem>().FirstOrDefaultAsync(t => t.Id == 1);
await db.UpdateAsync(item);
await db.DeleteAsync(item);
```

---

## 🚀 Performance (.NET 10)

### Native AOT

```xml
<PropertyGroup>
  <IsAotCompatible>true</IsAotCompatible>
  <PublishAot Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios'">true</PublishAot>
</PropertyGroup>
```

### XAML Source Generator

```xml
<PropertyGroup>
  <MauiXamlInflator>SourceGen</MauiXamlInflator>
</PropertyGroup>
```

### AOT-Safe JSON

```csharp
[JsonSerializable(typeof(List<TodoItem>))]
[JsonSerializable(typeof(TodoItem))]
internal partial class AppJsonContext : JsonSerializerContext { }

// Usage
var items = await http.GetFromJsonAsync("api/todos", AppJsonContext.Default.ListTodoItem);
```

---

## 🎭 Animations

```csharp
// Basic animations
await view.FadeTo(1, 500);
await view.ScaleTo(1.5, 250);
await view.TranslateTo(100, 0, 300);
await view.RotateTo(360, 500);

// Parallel
await Task.WhenAll(
    view.FadeTo(1, 500),
    view.ScaleTo(1.2, 500));

// Sequential
await view.FadeTo(0, 250);
await view.FadeTo(1, 250);

// With easing
await view.ScaleTo(1.2, 500, Easing.SpringOut);
```

---

## 📱 Platform Detection

```csharp
// Runtime check
if (DeviceInfo.Platform == DevicePlatform.Android) { ... }
if (DeviceInfo.Platform == DevicePlatform.iOS) { ... }
if (DeviceInfo.Idiom == DeviceIdiom.Phone) { ... }

// XAML
<Label Text="{OnPlatform Android='Android!', iOS='iOS!', Default='Other'}" />
<Label FontSize="{OnIdiom Phone=14, Tablet=18, Desktop=16}" />
```

---

## 🔑 Keyboard Shortcuts (Visual Studio)

| Shortcut | Action |
|:---------|:-------|
| <kbd>F5</kbd> | Run with debugging |
| <kbd>Ctrl</kbd>+<kbd>F5</kbd> | Run without debugging |
| <kbd>Ctrl</kbd>+<kbd>.</kbd> | Quick actions / refactor |
| <kbd>F12</kbd> | Go to definition |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> | Build solution |
