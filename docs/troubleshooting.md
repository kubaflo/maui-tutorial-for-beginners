---
title: "🐛 Troubleshooting"
layout: default
nav_order: 7
parent: "📚 Reference"
permalink: /troubleshooting/
---

# 🐛 Common Mistakes & Troubleshooting

A collection of frequently encountered issues when building .NET MAUI apps, with solutions.

---

## Build Errors

### ❌ "MAUI workload not found"

```
error NETSDK1147: To build this project, the .NET MAUI workload must be installed.
```

**Fix:**
```bash
dotnet workload install maui
dotnet workload repair
```

---

### ❌ "XamlC: Type 'MyViewModel' not found"

**Cause:** Missing or incorrect `xmlns` namespace declaration in XAML.

**Fix:** Ensure the namespace is correct:
```xml
<!-- ✅ Correct -->
xmlns:vm="clr-namespace:MyApp.ViewModels"

<!-- ❌ Wrong (typo in namespace) -->
xmlns:vm="clr-namespace:MyApp.ViewModel"
```

---

### ❌ Build fails with trimming/AOT warnings

```
warning IL2026: Using 'System.Text.Json.JsonSerializer.Serialize' which requires...
```

**Fix:** Use source-generated JSON serialization:
```csharp
// ❌ Reflection-based (not AOT-safe)
JsonSerializer.Serialize(myObject);

// ✅ Source-generated (AOT-safe)
JsonSerializer.Serialize(myObject, AppJsonContext.Default.MyType);
```

---

## Runtime Errors

### ❌ Binding not updating the UI

**Common causes:**

1. **Missing INotifyPropertyChanged:**
```csharp
// ❌ No notification
public string Name { get; set; }

// ✅ With CommunityToolkit.Mvvm
[ObservableProperty]
private string _name;
```

2. **Wrong BindingContext:**
```csharp
// ❌ BindingContext not set
public MyPage() { InitializeComponent(); }

// ✅ Set the BindingContext
public MyPage(MyViewModel vm)
{
    InitializeComponent();
    BindingContext = vm;
}
```

3. **Missing x:DataType for compiled bindings:**
```xml
<!-- ❌ Will silently fail with XAML Source Gen -->
<ContentPage>
    <Label Text="{Binding Title}" />

<!-- ✅ Compiled binding with type -->
<ContentPage x:DataType="vm:MainViewModel">
    <Label Text="{Binding Title}" />
```

---

### ❌ "Object reference not set" on navigation

**Cause:** Page or ViewModel not registered in DI.

**Fix:**
```csharp
// MauiProgram.cs
builder.Services.AddTransient<DetailsPage>();
builder.Services.AddTransient<DetailsViewModel>();

// AppShell.xaml.cs
Routing.RegisterRoute("details", typeof(DetailsPage));
```

---

### ❌ CollectionView items not updating

**Cause:** Using `List<T>` instead of `ObservableCollection<T>`.

```csharp
// ❌ UI won't update when items are added/removed
public List<Item> Items { get; set; } = new();

// ✅ UI updates automatically
public ObservableCollection<Item> Items { get; } = new();
```

---

### ❌ Command not firing

**Common causes:**

1. **Method name mismatch:**
```csharp
// ❌ The generated command name is "GreetCommand", not "Greet"
[RelayCommand]
private void Greet() { }

// XAML: Command="{Binding GreetCommand}" ✅
// XAML: Command="{Binding Greet}" ❌
```

2. **Button inside a DataTemplate** — needs `RelativeSource`:
```xml
<!-- ❌ Won't find command (looks in Item's scope) -->
<Button Command="{Binding DeleteCommand}" />

<!-- ✅ Reaches up to the ViewModel -->
<Button Command="{Binding Source={RelativeSource AncestorType={x:Type vm:ListViewModel}}, Path=DeleteCommand}"
        CommandParameter="{Binding .}" />
```

---

## Platform-Specific Issues

### ❌ Android: "Permission denied" for camera/storage

**Fix:** Request runtime permissions:
```csharp
var status = await Permissions.CheckStatusAsync<Permissions.Camera>();
if (status != PermissionStatus.Granted)
    status = await Permissions.RequestAsync<Permissions.Camera>();
```

And ensure the permissions are declared in `Platforms/Android/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

---

### ❌ iOS: App rejected — missing privacy descriptions

**Fix:** Add required descriptions to `Platforms/iOS/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to select images.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs your location for weather data.</string>
```

---

### ❌ Windows: HybridWebView shows blank page

**Fix:** Ensure web content is in the correct location:
```
Resources/
  Raw/
    wwwroot/
      index.html   ← Must be here
      app.js
      styles.css
```

And files must have `Build Action: MauiAsset` (automatic for `Resources/Raw/`).

---

## Performance Issues

### ❌ App startup is slow

**Checklist:**
1. Enable XAML Source Generator: `<MauiXamlInflator>SourceGen</MauiXamlInflator>`
2. Use compiled bindings everywhere: `x:DataType="..."`
3. Register heavy pages as `Transient` (only created when navigated to)
4. Minimize work in `MauiProgram.CreateMauiApp()`
5. Use `ContentTemplate` for Shell pages (lazy loading)

---

### ❌ CollectionView stutters/lags

**Fixes:**
```xml
<!-- Use fixed-size items when possible -->
<CollectionView ItemSizingStrategy="MeasureFirstItem">

<!-- Keep templates simple — avoid nested layouts -->
<DataTemplate>
    <Grid ColumnDefinitions="Auto,*" Padding="8">
        <!-- Simple, flat layout -->
    </Grid>
</DataTemplate>
```

---

## Hot Reload Issues

### ❌ Hot Reload not working

**Checklist:**
1. Ensure you're running in **Debug** mode (not Release)
2. Check Visual Studio: **Tools → Options → .NET Hot Reload** is enabled
3. Restart the app if structural XAML changes don't apply
4. Some changes (new files, namespace changes) require a full rebuild

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ts-q1" data-correct="b" data-explanation="ObservableCollection raises CollectionChanged events that the UI binds to. Regular List does not, so the UI never knows items were added.">
  <h3>Quick Check</h3>
  <p class="quiz-question">Why might a CollectionView not show newly added items?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ts-q1" value="a"> The CollectionView needs to be refreshed manually</label></li>
    <li><label><input type="radio" name="ts-q1" value="b"> The backing collection is a List instead of ObservableCollection</label></li>
    <li><label><input type="radio" name="ts-q1" value="c"> CollectionView only supports static data</label></li>
    <li><label><input type="radio" name="ts-q1" value="d"> The items need an Id property to be tracked</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>
