---
title: "Navigation"
layout: default
nav_order: 6
parent: "📖 Lessons"
permalink: /docs/06-navigation/
---

<img src="/maui-tutorial-for-beginners/assets/images/banners/navigation.svg" alt="Chapter banner" class="chapter-banner">

# Navigation

## What You'll Learn

- Navigate with .NET MAUI Shell
- Pass data between pages
- Use tabs and flyout menus
- Navigate programmatically from ViewModels

## Shell Navigation (Recommended)

Shell is MAUI's primary navigation system. It provides:

- URI-based routing
- Flyout menus
- Tab bars
- Back-button handling

### Defining Routes in AppShell.xaml

```xml
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:views="clr-namespace:HelloMaui.Views"
       x:Class="HelloMaui.AppShell">

    <ShellContent Title="Home"
                  Icon="home.png"
                  ContentTemplate="{DataTemplate views:HomePage}"
                  Route="home" />

    <ShellContent Title="Settings"
                  Icon="settings.png"
                  ContentTemplate="{DataTemplate views:SettingsPage}"
                  Route="settings" />
</Shell>
```

### Registering Routes for Detail Pages

Pages that aren't in the Shell visual hierarchy need explicit registration:

```csharp
// In AppShell.xaml.cs
public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();

        Routing.RegisterRoute("details", typeof(DetailsPage));
        Routing.RegisterRoute("profile", typeof(ProfilePage));
    }
}
```

### Navigating Programmatically

```csharp
// Navigate to a registered route
await Shell.Current.GoToAsync("details");

// Navigate back
await Shell.Current.GoToAsync("..");

// Navigate to an absolute route (resets the stack)
await Shell.Current.GoToAsync("//home");
```

> 💡 **New in .NET 9+:** `BackButtonBehavior.IsVisible` and `BackButtonBehavior.IsEnabled` now default to `BindingMode.OneWay`, making it easier to dynamically control the back button via data binding.

## Passing Data Between Pages

### Using Query Parameters

Define receivable parameters with `QueryProperty`:

```csharp
[QueryProperty(nameof(ItemId), "id")]
public partial class DetailsPage : ContentPage
{
    private string _itemId = string.Empty;
    public string ItemId
    {
        get => _itemId;
        set
        {
            _itemId = value;
            LoadItem(value);
        }
    }

    private void LoadItem(string id)
    {
        // Load item by ID
    }
}
```

Navigate with parameters:

```csharp
await Shell.Current.GoToAsync($"details?id={item.Id}");
```

### Using Dictionary Parameters (Complex Objects)

```csharp
var parameters = new Dictionary<string, object>
{
    { "Item", selectedItem }
};

await Shell.Current.GoToAsync("details", parameters);
```

Receive with `IQueryAttributable`:

```csharp
public partial class DetailsPage : ContentPage, IQueryAttributable
{
    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        if (query.TryGetValue("Item", out var item))
        {
            BindingContext = item;
        }
    }
}
```

## Tab Navigation

```xml
<Shell>
    <TabBar>
        <ShellContent Title="Home" Icon="home.png"
                      ContentTemplate="{DataTemplate views:HomePage}" />
        <ShellContent Title="Search" Icon="search.png"
                      ContentTemplate="{DataTemplate views:SearchPage}" />
        <ShellContent Title="Profile" Icon="profile.png"
                      ContentTemplate="{DataTemplate views:ProfilePage}" />
    </TabBar>
</Shell>
```

## Flyout Navigation

```xml
<Shell FlyoutBehavior="Flyout">
    <FlyoutItem Title="Home" Icon="home.png">
        <ShellContent ContentTemplate="{DataTemplate views:HomePage}" />
    </FlyoutItem>

    <FlyoutItem Title="Settings" Icon="settings.png">
        <ShellContent ContentTemplate="{DataTemplate views:SettingsPage}" />
    </FlyoutItem>

    <Shell.FlyoutHeader>
        <VerticalStackLayout Padding="20" BackgroundColor="#512BD4">
            <Image Source="logo.png" HeightRequest="80" />
            <Label Text="My MAUI App" TextColor="White" FontSize="20" />
        </VerticalStackLayout>
    </Shell.FlyoutHeader>
</Shell>
```

## Navigation from ViewModels

To keep ViewModels testable, navigate via Shell:

```csharp
using CommunityToolkit.Mvvm.Input;

public partial class HomeViewModel : ObservableObject
{
    [RelayCommand]
    private async Task GoToDetails(Item item)
    {
        var parameters = new Dictionary<string, object>
        {
            { "Item", item }
        };

        await Shell.Current.GoToAsync("details", parameters);
    }
}
```

```xml
<CollectionView ItemsSource="{Binding Items}">
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="models:Item">
            <Frame>
                <Frame.GestureRecognizers>
                    <TapGestureRecognizer
                        Command="{Binding Source={RelativeSource
                            AncestorType={x:Type vm:HomeViewModel}},
                            Path=GoToDetailsCommand}"
                        CommandParameter="{Binding .}" />
                </Frame.GestureRecognizers>
                <Label Text="{Binding Name}" />
            </Frame>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

## Modal Pages

Display a page modally (overlay):

```csharp
await Navigation.PushModalAsync(new ModalPage());

// Dismiss
await Navigation.PopModalAsync();
```

## ✅ Checkpoint

You can now navigate between pages, pass data, and build tabbed or flyout navigation structures. Next, we'll style and theme your app.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch06-q1" data-correct="b" data-explanation="Shell.Current.GoToAsync() is the modern way to navigate in MAUI Shell apps, supporting URI-based routes and query parameters.">
  <h3>Question 1</h3>
  <p class="quiz-question">What is the recommended way to navigate between pages in a Shell-based MAUI app?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch06-q1" value="a"> <code>Navigation.PushAsync(new Page())</code></label></li>
    <li><label><input type="radio" name="ch06-q1" value="b"> <code>Shell.Current.GoToAsync("route")</code></label></li>
    <li><label><input type="radio" name="ch06-q1" value="c"> <code>Application.Current.MainPage = new Page()</code></label></li>
    <li><label><input type="radio" name="ch06-q1" value="d"> <code>NavigationService.Navigate("route")</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch06-q2" data-correct="d" data-explanation="[QueryProperty] maps URL query parameters to ViewModel properties, e.g. ?id=5 sets the TaskId property.">
  <h3>Question 2</h3>
  <p class="quiz-question">How do you receive navigation parameters in a ViewModel?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch06-q2" value="a"> Override <code>OnNavigatedTo()</code> method</label></li>
    <li><label><input type="radio" name="ch06-q2" value="b"> Use constructor injection</label></li>
    <li><label><input type="radio" name="ch06-q2" value="c"> Read from <code>Application.Current.Properties</code></label></li>
    <li><label><input type="radio" name="ch06-q2" value="d"> Use <code>[QueryProperty]</code> attribute or implement <code>IQueryAttributable</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Multi-Page App

<div class="exercise-container">
  <span class="exercise-badge">Intermediate</span>
  <h3>💻 Build a Notes App Navigation</h3>
  <p>Create a Shell-based app with:</p>
  <ol>
    <li>A <code>TabBar</code> with "Notes" and "About" tabs</li>
    <li>A detail route registered for editing individual notes</li>
    <li>Pass the note ID via query parameter when navigating to the detail page</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```xml
<!-- AppShell.xaml -->
<Shell FlyoutBehavior="Disabled">
    <TabBar>
        <ShellContent Title="Notes" Route="notes"
                      ContentTemplate="{DataTemplate views:NotesPage}" />
        <ShellContent Title="About" Route="about"
                      ContentTemplate="{DataTemplate views:AboutPage}" />
    </TabBar>
</Shell>
```

```csharp
// AppShell.xaml.cs
Routing.RegisterRoute("notedetail", typeof(NoteDetailPage));

// Navigate with parameter
await Shell.Current.GoToAsync($"notedetail?id={note.Id}");

// NoteDetailViewModel.cs
[QueryProperty(nameof(NoteId), "id")]
public partial class NoteDetailViewModel : ObservableObject
{
    [ObservableProperty]
    private string _noteId = string.Empty;
}
```

  </details>
</div>

<div class="key-takeaways">
  <h4>📌 Key Takeaways</h4>
  <ul>
    <li><strong>Shell</strong> provides tabs, flyout, and URI-based routing in one place</li>
    <li>Register routes with <code>Routing.RegisterRoute()</code> for programmatic navigation</li>
    <li>Pass data between pages using <strong>query parameters</strong> and <code>[QueryProperty]</code></li>
    <li><code>Shell.Current.GoToAsync()</code> is the primary navigation method</li>
    <li>Use <code>".."</code> to navigate back instead of managing the stack manually</li>
  </ul>
</div>

<div class="callout callout-info">
  <div class="callout-title">ℹ️ Info</div>
  In .NET MAUI 10, Shell supports <code>BackButtonBehavior</code> for custom back button icons and commands. See <a href="/maui-tutorial-for-beginners/docs/13-shell-advanced/">Chapter 13 — Shell Advanced</a> for details.
</div>

<div class="related-chapters">
  <h4>📖 Related Chapters</h4>
  <ul>
    <li><a href="/maui-tutorial-for-beginners/docs/13-shell-advanced/">Ch 13 — Shell Advanced (search, guards, deep links)</a></li>
    <li><a href="/maui-tutorial-for-beginners/docs/05-data-binding-mvvm/">Ch 05 — Data Binding & MVVM</a></li>
  </ul>
</div>

---

**Previous:** [← 05 — Data Binding & MVVM](/maui-tutorial-for-beginners/docs/05-data-binding-mvvm/) · **Next:** [07 — Styling & Theming →](/maui-tutorial-for-beginners/docs/07-styling-and-theming/)
