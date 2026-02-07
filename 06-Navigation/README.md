# 06 — Navigation

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

**Previous:** [← 05 — Data Binding & MVVM](../05-Data-Binding-MVVM/README.md) · **Next:** [07 — Styling & Theming →](../07-Styling-And-Theming/README.md)
