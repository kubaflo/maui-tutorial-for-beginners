---
title: "Data Binding & MVVM"
layout: default
nav_order: 5
parent: "📖 Lessons"
permalink: /docs/05-data-binding-mvvm/
---

<img src="/maui-tutorial-for-beginners/assets/images/banners/data-binding.svg" alt="Chapter banner" class="chapter-banner">

# Data Binding & MVVM

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

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch05-q1" data-correct="b" data-explanation="TwoWay binding keeps both the UI and the source property in sync — when either changes, the other updates automatically.">
  <h3>Question 1</h3>
  <p class="quiz-question">Which binding mode should you use for an Entry that both displays and updates a property?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch05-q1" value="a"> OneWay</label></li>
    <li><label><input type="radio" name="ch05-q1" value="b"> TwoWay</label></li>
    <li><label><input type="radio" name="ch05-q1" value="c"> OneTime</label></li>
    <li><label><input type="radio" name="ch05-q1" value="d"> OneWayToSource</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch05-q2" data-correct="c" data-explanation="[ObservableProperty] auto-generates the public property with INotifyPropertyChanged support. [RelayCommand] generates an ICommand.">
  <h3>Question 2</h3>
  <p class="quiz-question">What does <code>[ObservableProperty]</code> from CommunityToolkit.Mvvm do?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch05-q2" value="a"> Registers the property with dependency injection</label></li>
    <li><label><input type="radio" name="ch05-q2" value="b"> Makes the property observable in the database</label></li>
    <li><label><input type="radio" name="ch05-q2" value="c"> Generates a public property with INotifyPropertyChanged notification</label></li>
    <li><label><input type="radio" name="ch05-q2" value="d"> Creates a two-way binding automatically in XAML</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch05-q3" data-correct="a" data-explanation="ObservableCollection notifies the UI when items are added/removed. A regular List does not trigger UI updates.">
  <h3>Question 3</h3>
  <p class="quiz-question">Why use <code>ObservableCollection&lt;T&gt;</code> instead of <code>List&lt;T&gt;</code> for bound collections?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch05-q3" value="a"> ObservableCollection raises change notifications when items are added or removed</label></li>
    <li><label><input type="radio" name="ch05-q3" value="b"> List is not supported in MAUI data binding</label></li>
    <li><label><input type="radio" name="ch05-q3" value="c"> ObservableCollection is faster for large datasets</label></li>
    <li><label><input type="radio" name="ch05-q3" value="d"> List cannot be used with CollectionView</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Build a Contact List

<div class="exercise-container">
  <span class="exercise-badge">Intermediate</span>
  <h3>💻 Try It Yourself</h3>
  <p>Build a contact list using MVVM with these requirements:</p>
  <ol>
    <li>A <code>Contact</code> model with Name, Phone, and Email</li>
    <li>A ViewModel using <code>[ObservableProperty]</code> and <code>[RelayCommand]</code></li>
    <li>An "Add Contact" form with TwoWay bindings</li>
    <li>A CollectionView displaying all contacts</li>
    <li>A "Delete" swipe action on each contact</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```csharp
// Models/Contact.cs
public class Contact
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

// ViewModels/ContactViewModel.cs
public partial class ContactViewModel : ObservableObject
{
    [ObservableProperty]
    private string _name = string.Empty;

    [ObservableProperty]
    private string _phone = string.Empty;

    [ObservableProperty]
    private string _email = string.Empty;

    public ObservableCollection<Contact> Contacts { get; } = new();

    [RelayCommand]
    private void AddContact()
    {
        if (string.IsNullOrWhiteSpace(Name)) return;

        Contacts.Add(new Contact
        {
            Name = Name,
            Phone = Phone,
            Email = Email
        });

        Name = Phone = Email = string.Empty;
    }

    [RelayCommand]
    private void DeleteContact(Contact contact)
    {
        Contacts.Remove(contact);
    }
}
```

  </details>
</div>

<div class="key-takeaways">
  <h4>📌 Key Takeaways</h4>
  <ul>
    <li><strong>Data binding</strong> connects UI to data — changes flow automatically</li>
    <li><strong>MVVM pattern</strong> separates View (XAML), ViewModel (logic), and Model (data)</li>
    <li><code>INotifyPropertyChanged</code> tells the UI when properties update</li>
    <li><code>ObservableCollection&lt;T&gt;</code> notifies the UI when items are added/removed</li>
    <li>The <strong>MVVM Community Toolkit</strong> eliminates boilerplate with <code>[ObservableProperty]</code> and <code>[RelayCommand]</code></li>
  </ul>
</div>

<div class="callout callout-important">
  <div class="callout-title">⚠️ Important</div>
  In .NET MAUI 10, always use <code>x:DataType</code> on your pages and templates to enable <strong>compiled bindings</strong>. This catches binding errors at compile time and improves performance.
</div>

<div class="related-chapters">
  <h4>📖 Related Chapters</h4>
  <ul>
    <li><a href="/maui-tutorial-for-beginners/docs/14-community-toolkit/">Ch 14 — Community Toolkit (MVVM helpers)</a></li>
    <li><a href="/maui-tutorial-for-beginners/docs/15-dependency-injection/">Ch 15 — Dependency Injection</a></li>
    <li><a href="/maui-tutorial-for-beginners/docs/09-working-with-apis/">Ch 09 — Working with APIs</a></li>
  </ul>
</div>

---

**Previous:** [← 04 — Layouts & Controls](/docs/04-layouts-and-controls/) · **Next:** [06 — Navigation →](/docs/06-navigation/)
