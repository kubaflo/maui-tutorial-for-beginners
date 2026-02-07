---
title: "Advanced Shell"
layout: default
nav_order: 13
parent: "📖 Lessons"
permalink: /docs/13-shell-advanced/
---

<img src="/maui-tutorial-for-beginners/assets/images/banners/shell.svg" alt="Chapter banner" class="chapter-banner">

# Advanced Shell

## What You'll Learn

- Customize the Shell appearance
- Use search handlers
- Implement navigation guards
- Create custom flyout items and headers

## Shell Search

Add a search bar to any page using `SearchHandler`:

```csharp
public class AnimalSearchHandler : SearchHandler
{
    private readonly List<Animal> _animals;

    public AnimalSearchHandler(List<Animal> animals)
    {
        _animals = animals;
        Placeholder = "Search animals...";
        ShowsResults = true;
    }

    protected override void OnQueryChanged(string oldValue, string newValue)
    {
        base.OnQueryChanged(oldValue, newValue);

        if (string.IsNullOrWhiteSpace(newValue))
        {
            ItemsSource = null;
            return;
        }

        ItemsSource = _animals
            .Where(a => a.Name.Contains(newValue, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    protected override async void OnItemSelected(object item)
    {
        base.OnItemSelected(item);

        if (item is Animal animal)
        {
            await Shell.Current.GoToAsync($"details?id={animal.Id}");
        }
    }
}
```

Register it in XAML:

```xml
<ContentPage>
    <Shell.SearchHandler>
        <local:AnimalSearchHandler />
    </Shell.SearchHandler>

    <!-- Page content -->
</ContentPage>
```

## Navigation Guards

Prevent navigation under certain conditions (e.g., unsaved changes):

```csharp
public partial class EditPage : ContentPage
{
    private bool _hasUnsavedChanges;

    protected override async void OnNavigatingFrom(NavigatingFromEventArgs args)
    {
        base.OnNavigatingFrom(args);

        // Not available to cancel in OnNavigatingFrom directly,
        // but you can use Shell.Current.Navigation and BackButtonBehavior
    }
}
```

Use `BackButtonBehavior` to intercept the back button:

```xml
<ContentPage>
    <Shell.BackButtonBehavior>
        <BackButtonBehavior Command="{Binding BackCommand}"
                            IsEnabled="{Binding CanGoBack}" />
    </Shell.BackButtonBehavior>
</ContentPage>
```

```csharp
[RelayCommand]
private async Task Back()
{
    if (_hasUnsavedChanges)
    {
        bool discard = await Shell.Current.DisplayAlert(
            "Unsaved Changes",
            "Discard changes?",
            "Discard", "Cancel");

        if (!discard) return;
    }

    await Shell.Current.GoToAsync("..");
}
```

## Custom Shell Appearance

### Title View

Replace the default title bar with a custom view:

```xml
<ContentPage>
    <Shell.TitleView>
        <HorizontalStackLayout VerticalOptions="Center" Spacing="10">
            <Image Source="logo.png" HeightRequest="30" />
            <Label Text="My App" FontSize="18" FontAttributes="Bold"
                   VerticalOptions="Center" />
        </HorizontalStackLayout>
    </Shell.TitleView>
</ContentPage>
```

### Shell Colors

```xml
<Shell BackgroundColor="#512BD4"
       ForegroundColor="White"
       TitleColor="White"
       UnselectedColor="#B0B0B0"
       TabBarBackgroundColor="White"
       TabBarForegroundColor="#512BD4"
       TabBarUnselectedColor="#999999">
```

### Per-Page Shell Styling

```xml
<ContentPage Shell.BackgroundColor="#1E1E2E"
             Shell.ForegroundColor="White"
             Shell.TabBarIsVisible="False"
             Shell.NavBarIsVisible="True">
```

## Custom Flyout

### Custom Flyout Items

```xml
<Shell FlyoutBehavior="Flyout">
    <Shell.ItemTemplate>
        <DataTemplate>
            <Grid ColumnDefinitions="Auto,*" Padding="15,10">
                <Image Source="{Binding FlyoutIcon}"
                       HeightRequest="24" WidthRequest="24"
                       Grid.Column="0" />
                <Label Text="{Binding Title}" FontSize="16"
                       VerticalOptions="Center"
                       Grid.Column="1" Margin="15,0,0,0" />
            </Grid>
        </DataTemplate>
    </Shell.ItemTemplate>

    <FlyoutItem Title="Home" Icon="home.png">
        <ShellContent ContentTemplate="{DataTemplate views:HomePage}" />
    </FlyoutItem>
</Shell>
```

### Flyout Footer

```xml
<Shell.FlyoutFooter>
    <VerticalStackLayout Padding="20">
        <Label Text="Version 1.0.0" FontSize="12" TextColor="Gray"
               HorizontalOptions="Center" />
    </VerticalStackLayout>
</Shell.FlyoutFooter>
```

### Menu Items (Non-Navigation)

Add actions to the flyout that don't navigate:

```xml
<MenuItem Text="Log Out" IconImageSource="logout.png"
          Clicked="OnLogoutClicked" />
```

## Shell Sections and Grouping

Group tabs under sections:

```xml
<Shell>
    <TabBar>
        <Tab Title="Feed">
            <ShellContent Title="All" ContentTemplate="{DataTemplate views:AllPostsPage}" />
            <ShellContent Title="Popular" ContentTemplate="{DataTemplate views:PopularPostsPage}" />
        </Tab>
        <Tab Title="Profile">
            <ShellContent ContentTemplate="{DataTemplate views:ProfilePage}" />
        </Tab>
    </TabBar>
</Shell>
```

This creates a bottom tab bar with "Feed" having two sub-tabs.

## ✅ Checkpoint

You now know how to use Shell for search, custom styling, navigation guards, and advanced flyout menus. Next, we'll explore the .NET MAUI Community Toolkit.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch13-q1" data-correct="b" data-explanation="Implement OnNavigating event handler or Shell.OnNavigating to intercept navigation and conditionally cancel it.">
  <h3>Question 1</h3>
  <p class="quiz-question">How do you prevent navigation away from a page (e.g., unsaved changes)?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch13-q1" value="a"> Override <code>OnDisappearing()</code> and throw an exception</label></li>
    <li><label><input type="radio" name="ch13-q1" value="b"> Handle the <code>Shell.Navigating</code> event and set <code>Cancel = true</code></label></li>
    <li><label><input type="radio" name="ch13-q1" value="c"> Disable all navigation buttons programmatically</label></li>
    <li><label><input type="radio" name="ch13-q1" value="d"> Set <code>IsEnabled = false</code> on the Shell</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch13-q2" data-correct="a" data-explanation="Shell.SearchHandler is set as an attached property on a ContentPage to add search functionality to the Shell's navigation bar.">
  <h3>Question 2</h3>
  <p class="quiz-question">How do you add search to a Shell page?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch13-q2" value="a"> Set <code>Shell.SearchHandler</code> as an attached property on the page</label></li>
    <li><label><input type="radio" name="ch13-q2" value="b"> Add a <code>SearchBar</code> control to the page layout</label></li>
    <li><label><input type="radio" name="ch13-q2" value="c"> Override <code>OnSearchRequested</code> in the Shell class</label></li>
    <li><label><input type="radio" name="ch13-q2" value="d"> Use <code>NavigationPage.SetSearchHandler()</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Build a Searchable Shell App

<div class="exercise-container">
  <span class="exercise-badge">Hands-On</span>
  <h3>💻 Implement Shell Search with SearchHandler</h3>
  <p>Add a search experience to your Shell app that filters items and navigates to a detail page.</p>
  <ol>
    <li>Create a custom SearchHandler that filters a list of items</li>
    <li>Add it to your Shell page using <code>Shell.SearchHandler</code></li>
    <li>Navigate to a detail page when a search result is tapped</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```csharp
public class AnimalSearchHandler : SearchHandler
{
    protected override void OnQueryChanged(string oldValue, string newValue)
    {
        base.OnQueryChanged(oldValue, newValue);

        if (string.IsNullOrWhiteSpace(newValue))
        {
            ItemsSource = null;
            return;
        }

        var animals = new List<string> { "Dog", "Cat", "Dolphin", "Duck", "Deer" };
        ItemsSource = animals
            .Where(a => a.StartsWith(newValue, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    protected override async void OnItemSelected(object item)
    {
        base.OnItemSelected(item);
        await Shell.Current.GoToAsync($"details?name={item}");
    }
}
```

```xml
<!-- In your Shell page XAML: -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:local="clr-namespace:MyApp">
    <Shell.SearchHandler>
        <local:AnimalSearchHandler Placeholder="Search animals..."
                                   ShowsResults="true" />
    </Shell.SearchHandler>
    <!-- Page content -->
</ContentPage>
```

  </details>
</div>

---


<div class="key-takeaways">
  <h4>📌 Key Takeaways</h4>
  <ul>
    <li><strong>SearchHandler</strong> adds search to the Shell navigation bar</li>
    <li><strong>Navigation guards</strong> prevent leaving pages with unsaved changes</li>
    <li><strong>Deep linking</strong> allows opening specific pages via URIs</li>
    <li>Customize flyout items, icons, and behavior programmatically</li>
    <li>Use <code>Shell.BackButtonBehavior</code> for custom back navigation</li>
  </ul>
</div>

---

**Previous:** [← 12 — Animations](/docs/12-animations/) · **Next:** [14 — Community Toolkit →](/docs/14-community-toolkit/)
