---
title: "Community Toolkit"
layout: default
nav_order: 14
permalink: /docs/14-community-toolkit/
---

# Community Toolkit

## What You'll Learn

- Install and set up the Community Toolkit
- Use essential converters, behaviors, and views
- Show popups and snackbars
- Use animations from the toolkit

## What Is the Community Toolkit?

The [.NET MAUI Community Toolkit](https://learn.microsoft.com/dotnet/communitytoolkit/maui/) is a collection of reusable elements — converters, behaviors, custom views, and helpers — maintained by Microsoft and the community.

## Installation

```bash
dotnet add package CommunityToolkit.Maui
```

Register in `MauiProgram.cs`:

```csharp
using CommunityToolkit.Maui;

public static MauiApp CreateMauiApp()
{
    var builder = MauiApp.CreateBuilder();
    builder
        .UseMauiApp<App>()
        .UseMauiCommunityToolkit() // Add this line
        .ConfigureFonts(fonts =>
        {
            fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
        });

    return builder.Build();
}
```

Add the XAML namespace:

```xml
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
```

## Essential Converters

### BoolToObjectConverter

```xml
<ContentPage.Resources>
    <toolkit:BoolToObjectConverter x:Key="BoolToColor"
        TrueObject="Green" FalseObject="Red" />
</ContentPage.Resources>

<Label Text="{Binding IsActive}"
       TextColor="{Binding IsActive, Converter={StaticResource BoolToColor}}" />
```

### InvertedBoolConverter

```xml
<ContentPage.Resources>
    <toolkit:InvertedBoolConverter x:Key="InvertedBool" />
</ContentPage.Resources>

<Button Text="Submit"
        IsVisible="{Binding IsLoading, Converter={StaticResource InvertedBool}}" />
```

### IsNullOrEmptyConverter

```xml
<ContentPage.Resources>
    <toolkit:IsNotNullOrEmptyConverter x:Key="IsNotNullOrEmpty" />
</ContentPage.Resources>

<Button Text="Search"
        IsEnabled="{Binding SearchText, Converter={StaticResource IsNotNullOrEmpty}}" />
```

### MultiConverter

Chain multiple converters:

```xml
<ContentPage.Resources>
    <toolkit:InvertedBoolConverter x:Key="InvertedBool" />
    <toolkit:BoolToObjectConverter x:Key="BoolToOpacity"
        TrueObject="1.0" FalseObject="0.5" />

    <toolkit:MultiConverter x:Key="InvertedBoolToOpacity">
        <toolkit:InvertedBoolConverter />
        <toolkit:BoolToObjectConverter TrueObject="1.0" FalseObject="0.5" />
    </toolkit:MultiConverter>
</ContentPage.Resources>
```

## Behaviors

### TextValidationBehavior

Validate text input with visual feedback:

```xml
<Entry Placeholder="Email">
    <Entry.Behaviors>
        <toolkit:TextValidationBehavior
            InvalidStyle="{StaticResource InvalidEntryStyle}"
            ValidStyle="{StaticResource ValidEntryStyle}"
            Flags="ValidateOnValueChanged"
            RegexPattern="^[\w\.-]+@[\w\.-]+\.\w+$" />
    </Entry.Behaviors>
</Entry>
```

### NumericValidationBehavior

```xml
<Entry Placeholder="Age (18-120)" Keyboard="Numeric">
    <Entry.Behaviors>
        <toolkit:NumericValidationBehavior
            InvalidStyle="{StaticResource InvalidEntryStyle}"
            MinimumValue="18"
            MaximumValue="120"
            Flags="ValidateOnValueChanged" />
    </Entry.Behaviors>
</Entry>
```

### EventToCommandBehavior

Convert any event to a command (great for MVVM):

```xml
<Entry Placeholder="Search">
    <Entry.Behaviors>
        <toolkit:EventToCommandBehavior
            EventName="TextChanged"
            Command="{Binding SearchCommand}" />
    </Entry.Behaviors>
</Entry>
```

## Views

### AvatarView

```xml
<toolkit:AvatarView Text="JD"
                     BackgroundColor="#512BD4"
                     TextColor="White"
                     FontSize="18"
                     CornerRadius="25"
                     HeightRequest="50"
                     WidthRequest="50" />
```

### DrawingView

Freehand drawing canvas:

```xml
<toolkit:DrawingView
    HeightRequest="300"
    LineColor="Black"
    LineWidth="5"
    IsMultiLineModeEnabled="True"
    ShouldClearOnFinish="False"
    DrawingLineCompleted="OnDrawingCompleted" />
```

### Expander

Collapsible content sections:

```xml
<toolkit:Expander>
    <toolkit:Expander.Header>
        <HorizontalStackLayout Padding="10">
            <Label Text="FAQ: What is MAUI?" FontAttributes="Bold" />
        </HorizontalStackLayout>
    </toolkit:Expander.Header>
    <Label Text=".NET MAUI is a cross-platform framework..."
           Padding="20,10" />
</toolkit:Expander>
```

## Popups

Show custom modal popups:

### Define a Popup

```csharp
using CommunityToolkit.Maui.Views;

public partial class ConfirmPopup : Popup
{
    public ConfirmPopup(string message)
    {
        InitializeComponent();
        MessageLabel.Text = message;
    }

    private void OnYesClicked(object sender, EventArgs e) => Close(true);
    private void OnNoClicked(object sender, EventArgs e) => Close(false);
}
```

```xml
<toolkit:Popup xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
               x:Class="MyApp.ConfirmPopup">
    <VerticalStackLayout Padding="20" Spacing="15" WidthRequest="300">
        <Label x:Name="MessageLabel" FontSize="16" />
        <HorizontalStackLayout Spacing="10" HorizontalOptions="End">
            <Button Text="No" Clicked="OnNoClicked" />
            <Button Text="Yes" Clicked="OnYesClicked" />
        </HorizontalStackLayout>
    </VerticalStackLayout>
</toolkit:Popup>
```

### Show a Popup

```csharp
var popup = new ConfirmPopup("Delete this item?");
var result = await this.ShowPopupAsync(popup);

if (result is true)
{
    // User confirmed
}
```

## Snackbar and Toast

```csharp
using CommunityToolkit.Maui.Alerts;

// Toast — simple message
await Toast.Make("Item saved!", ToastDuration.Short).Show();

// Snackbar — message with action
await Snackbar.Make(
    "Item deleted",
    action: async () => await UndoDelete(),
    actionButtonText: "Undo",
    duration: TimeSpan.FromSeconds(3)
).Show();
```

## StatusBar Styling

Change the device status bar color:

```csharp
using CommunityToolkit.Maui.Core.Platform;

StatusBar.SetColor(Colors.DarkBlue);
StatusBar.SetStyle(StatusBarStyle.LightContent);
```

## ✅ Checkpoint

The Community Toolkit supercharges your MAUI apps with battle-tested components. Next, we'll dive into dependency injection.

---

**Previous:** [← 13 — Advanced Shell](../13-Shell-Advanced/README.md) · **Next:** [15 — Dependency Injection →](../15-Dependency-Injection/README.md)
