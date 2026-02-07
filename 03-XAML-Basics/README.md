# 03 — XAML Basics

## What You'll Learn

- Understand XAML syntax and structure
- Use markup extensions
- Define and reference resources
- Work with namespaces

## What Is XAML?

**XAML** (eXtensible Application Markup Language) is an XML-based language used to define UI in .NET MAUI. It separates the UI layout from the application logic (C#).

## Basic Syntax

Every XAML element maps to a .NET class. Attributes map to properties:

```xml
<Label Text="Hello, MAUI!"
       FontSize="24"
       TextColor="Blue"
       HorizontalOptions="Center" />
```

This is equivalent to:

```csharp
var label = new Label
{
    Text = "Hello, MAUI!",
    FontSize = 24,
    TextColor = Colors.Blue,
    HorizontalOptions = LayoutOptions.Center
};
```

## Content Properties

Some elements have a **content property** — the default child element. For `ContentPage`, it's `Content`:

```xml
<ContentPage>
    <!-- This Label is set as the Content property -->
    <Label Text="I am the content" />
</ContentPage>
```

For layout elements like `VerticalStackLayout`, the content property is `Children`:

```xml
<VerticalStackLayout>
    <Label Text="First" />
    <Label Text="Second" />
    <Label Text="Third" />
</VerticalStackLayout>
```

## Namespaces

XAML files typically start with two default namespaces:

```xml
xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
```

| Namespace | Purpose |
|-----------|---------|
| Default (`xmlns`) | Maps to MAUI controls (Label, Button, etc.) |
| `x:` | XAML language features (`x:Name`, `x:Class`, `x:DataType`) |

To reference your own classes:

```xml
xmlns:local="clr-namespace:HelloMaui"
xmlns:vm="clr-namespace:HelloMaui.ViewModels"
```

## Markup Extensions

Markup extensions are surrounded by `{}` and provide dynamic values:

### `{StaticResource}`

References a resource defined in a resource dictionary:

```xml
<Label Text="Styled text" Style="{StaticResource TitleStyle}" />
```

### `{DynamicResource}`

Like `StaticResource`, but updates at runtime if the resource changes:

```xml
<Label TextColor="{DynamicResource PrimaryColor}" />
```

### `{Binding}`

Binds a property to a data source (covered in depth in Chapter 05):

```xml
<Label Text="{Binding UserName}" />
```

### `{x:Static}`

References a static property or field:

```xml
<Label Text="{x:Static local:AppConstants.Version}" />
```

## Resources and Resource Dictionaries

Resources let you define reusable values:

### Page-Level Resources

```xml
<ContentPage>
    <ContentPage.Resources>
        <Color x:Key="AccentColor">#512BD4</Color>
        <x:Double x:Key="HeaderFontSize">28</x:Double>
    </ContentPage.Resources>

    <Label Text="Hello"
           TextColor="{StaticResource AccentColor}"
           FontSize="{StaticResource HeaderFontSize}" />
</ContentPage>
```

### Application-Level Resources

Define in `App.xaml` to share across all pages:

```xml
<Application.Resources>
    <ResourceDictionary>
        <Color x:Key="Primary">#512BD4</Color>
        <Style TargetType="Button">
            <Setter Property="BackgroundColor" Value="{StaticResource Primary}" />
            <Setter Property="TextColor" Value="White" />
        </Style>
    </ResourceDictionary>
</Application.Resources>
```

## Naming Elements with `x:Name`

Use `x:Name` to reference a XAML element from code-behind:

```xml
<Entry x:Name="NameEntry" Placeholder="Enter your name" />
<Label x:Name="GreetingLabel" />
<Button Text="Greet" Clicked="OnGreetClicked" />
```

```csharp
private void OnGreetClicked(object sender, EventArgs e)
{
    GreetingLabel.Text = $"Hello, {NameEntry.Text}!";
}
```

## ✅ Checkpoint

You now know how to write XAML, use markup extensions, define resources, and reference elements in code. Next, we'll explore layouts and controls to build real UIs.

---

**Previous:** [← 02 — Project Structure](../02-ProjectStructure/README.md) · **Next:** [04 — Layouts & Controls →](../04-Layouts-And-Controls/README.md)
