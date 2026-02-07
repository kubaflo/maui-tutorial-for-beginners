# 05 — Data Binding and MVVM

## What You'll Learn

- Understand data binding fundamentals
- Implement the MVVM pattern
- Use `INotifyPropertyChanged` and `ObservableCollection`
- Simplify MVVM with the MVVM Community Toolkit

## What Is Data Binding?

Data binding connects UI elements to data sources so they stay in sync automatically. Instead of manually updating labels and fields, you **bind** them to properties.

```xml
<Label Text="{Binding UserName}" />
```

When `UserName` changes, the label updates automatically — no manual code needed.

## Binding Modes

| Mode | Direction | Use Case |
|------|-----------|----------|
| `OneWay` | Source → Target | Display values (default) |
| `TwoWay` | Source ↔ Target | Input fields |
| `OneWayToSource` | Target → Source | Rare, write-only to source |
| `OneTime` | Source → Target (once) | Static data |

```xml
<Entry Text="{Binding UserName, Mode=TwoWay}" />
```

## The MVVM Pattern

**Model-View-ViewModel** separates concerns:

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Model** | Data and business logic | `User.cs` |
| **View** | UI layout (XAML) | `UserPage.xaml` |
| **ViewModel** | Presentation logic, state | `UserViewModel.cs` |

### Project Structure

```
HelloMaui/
├── Models/
│   └── User.cs
├── ViewModels/
│   └── UserViewModel.cs
├── Views/
│   └── UserPage.xaml
│   └── UserPage.xaml.cs
```

## Implementing MVVM from Scratch

### 1. The Model

```csharp
namespace HelloMaui.Models;

public class User
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
```

### 2. The ViewModel

Implement `INotifyPropertyChanged` so bindings update:

```csharp
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using HelloMaui.Models;

namespace HelloMaui.ViewModels;

public class UserViewModel : INotifyPropertyChanged
{
    private string _name = string.Empty;
    private string _greeting = string.Empty;

    public string Name
    {
        get => _name;
        set
        {
            if (_name != value)
            {
                _name = value;
                OnPropertyChanged();
            }
        }
    }

    public string Greeting
    {
        get => _greeting;
        set
        {
            if (_greeting != value)
            {
                _greeting = value;
                OnPropertyChanged();
            }
        }
    }

    public ICommand GreetCommand { get; }

    public UserViewModel()
    {
        GreetCommand = new Command(OnGreet);
    }

    private void OnGreet()
    {
        Greeting = $"Hello, {Name}!";
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string? name = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
    }
}
```

### 3. The View

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:HelloMaui.ViewModels"
             x:Class="HelloMaui.Views.UserPage"
             x:DataType="vm:UserViewModel"
             Title="User">

    <ContentPage.BindingContext>
        <vm:UserViewModel />
    </ContentPage.BindingContext>

    <VerticalStackLayout Padding="30" Spacing="15">
        <Entry Placeholder="Enter your name"
               Text="{Binding Name, Mode=TwoWay}" />

        <Button Text="Greet Me"
                Command="{Binding GreetCommand}" />

        <Label Text="{Binding Greeting}"
               FontSize="24"
               HorizontalOptions="Center" />
    </VerticalStackLayout>

</ContentPage>
```

> 💡 **`x:DataType`** enables compiled bindings for better performance and compile-time checking.

## ObservableCollection

For lists that update the UI when items are added or removed:

```csharp
using System.Collections.ObjectModel;

public class TodoViewModel : INotifyPropertyChanged
{
    public ObservableCollection<string> Tasks { get; } = new();

    private string _newTask = string.Empty;
    public string NewTask
    {
        get => _newTask;
        set { _newTask = value; OnPropertyChanged(); }
    }

    public ICommand AddTaskCommand { get; }

    public TodoViewModel()
    {
        AddTaskCommand = new Command(
            () =>
            {
                if (!string.IsNullOrWhiteSpace(NewTask))
                {
                    Tasks.Add(NewTask);
                    NewTask = string.Empty;
                }
            });
    }

    // ... INotifyPropertyChanged implementation
}
```

## Simplifying with MVVM Community Toolkit

The [CommunityToolkit.Mvvm](https://learn.microsoft.com/dotnet/communitytoolkit/mvvm/) NuGet package eliminates boilerplate:

```bash
dotnet add package CommunityToolkit.Mvvm
```

Rewrite the ViewModel using source generators:

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace HelloMaui.ViewModels;

public partial class UserViewModel : ObservableObject
{
    [ObservableProperty]
    private string _name = string.Empty;

    [ObservableProperty]
    private string _greeting = string.Empty;

    [RelayCommand]
    private void Greet()
    {
        Greeting = $"Hello, {Name}!";
    }
}
```

That's it! The toolkit auto-generates `INotifyPropertyChanged`, property setters, and commands.

## Compiled Bindings in C# (.NET 9+)

You can also create compiled bindings in C# code using `Binding.Create`:

```csharp
// Compiled lambda binding (replaces string-based "new Binding()")
myLabel.SetBinding(
    Label.TextProperty,
    Binding.Create(static (UserViewModel vm) => vm.Name));
```

This provides compile-time safety and better performance, especially important for Native AOT.

## Dependency Injection for ViewModels

Register ViewModels and pages in `MauiProgram.cs`:

```csharp
builder.Services.AddTransient<UserViewModel>();
builder.Services.AddTransient<UserPage>();
```

Then inject via constructor:

```csharp
public partial class UserPage : ContentPage
{
    public UserPage(UserViewModel vm)
    {
        InitializeComponent();
        BindingContext = vm;
    }
}
```

## ✅ Checkpoint

You now understand data binding and MVVM — the core architectural pattern for MAUI apps. Next, we'll learn how to navigate between pages.

---

**Previous:** [← 04 — Layouts & Controls](../04-Layouts-And-Controls/README.md) · **Next:** [06 — Navigation →](../06-Navigation/README.md)
