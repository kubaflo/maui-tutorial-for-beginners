# 07 — Styling and Theming

## What You'll Learn

- Apply implicit and explicit styles
- Customize colors and fonts
- Implement light/dark theme support
- Use custom fonts

## Styles in MAUI

Styles let you define a set of property values once and apply them to multiple controls.

### Explicit Styles (with `x:Key`)

Must be referenced by name:

```xml
<ContentPage.Resources>
    <Style x:Key="HeaderLabel" TargetType="Label">
        <Setter Property="FontSize" Value="28" />
        <Setter Property="FontAttributes" Value="Bold" />
        <Setter Property="TextColor" Value="#512BD4" />
    </Style>
</ContentPage.Resources>

<Label Text="Welcome" Style="{StaticResource HeaderLabel}" />
```

### Implicit Styles (without `x:Key`)

Applied automatically to all matching controls in scope:

```xml
<ContentPage.Resources>
    <Style TargetType="Button">
        <Setter Property="BackgroundColor" Value="#512BD4" />
        <Setter Property="TextColor" Value="White" />
        <Setter Property="CornerRadius" Value="8" />
        <Setter Property="Padding" Value="14,10" />
    </Style>
</ContentPage.Resources>

<!-- All buttons on this page get the style automatically -->
<Button Text="Save" />
<Button Text="Cancel" />
```

### Style Inheritance

Use `BasedOn` to extend existing styles:

```xml
<Style x:Key="BaseButton" TargetType="Button">
    <Setter Property="FontSize" Value="16" />
    <Setter Property="CornerRadius" Value="8" />
</Style>

<Style x:Key="PrimaryButton" TargetType="Button" BasedOn="{StaticResource BaseButton}">
    <Setter Property="BackgroundColor" Value="#512BD4" />
    <Setter Property="TextColor" Value="White" />
</Style>

<Style x:Key="DangerButton" TargetType="Button" BasedOn="{StaticResource BaseButton}">
    <Setter Property="BackgroundColor" Value="#E53935" />
    <Setter Property="TextColor" Value="White" />
</Style>
```

## Application-Level Styles

Define in `Resources/Styles/Styles.xaml` to share across the entire app:

```xml
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Style TargetType="Page" ApplyToDerivedTypes="True">
        <Setter Property="BackgroundColor" Value="{AppThemeBinding Light=White, Dark=#1C1C1E}" />
    </Style>

    <Style TargetType="Label">
        <Setter Property="TextColor" Value="{AppThemeBinding Light=Black, Dark=White}" />
    </Style>
</ResourceDictionary>
```

## Colors

Define your color palette in `Resources/Styles/Colors.xaml`:

```xml
<ResourceDictionary>
    <Color x:Key="Primary">#512BD4</Color>
    <Color x:Key="PrimaryDark">#3B1F9E</Color>
    <Color x:Key="Accent">#DFD8F7</Color>
    <Color x:Key="TextPrimary">#1A1A1A</Color>
    <Color x:Key="TextSecondary">#6B6B6B</Color>
    <Color x:Key="Background">#FFFFFF</Color>
    <Color x:Key="Surface">#F5F5F5</Color>
</ResourceDictionary>
```

## Light/Dark Theme Support

### Using `AppThemeBinding`

Automatically switch values based on the system theme:

```xml
<Label Text="Adaptive Text"
       TextColor="{AppThemeBinding Light=#1A1A1A, Dark=#FFFFFF}" />

<ContentPage BackgroundColor="{AppThemeBinding Light=White, Dark=#1C1C1E}">
```

### Detecting Theme Changes in Code

```csharp
Application.Current!.RequestedThemeChanged += (s, e) =>
{
    var theme = e.RequestedTheme; // Light, Dark, or Unspecified
};
```

### Forcing a Theme

```csharp
Application.Current!.UserAppTheme = AppTheme.Dark;
```

## Custom Fonts

### 1. Add Font Files

Place `.ttf` or `.otf` files in `Resources/Fonts/`.

### 2. Register in MauiProgram.cs

```csharp
builder.ConfigureFonts(fonts =>
{
    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
    fonts.AddFont("MaterialIcons-Regular.ttf", "MaterialIcons");
});
```

### 3. Use in XAML

```xml
<Label Text="Custom Font"
       FontFamily="OpenSansSemibold"
       FontSize="20" />

<!-- Icon font -->
<Label Text="&#xe87c;"
       FontFamily="MaterialIcons"
       FontSize="32" />
```

## Visual States

Change appearance based on control state:

```xml
<Style TargetType="Button">
    <Setter Property="VisualStateManager.VisualStateGroups">
        <VisualStateGroupList>
            <VisualStateGroup x:Name="CommonStates">
                <VisualState x:Name="Normal">
                    <VisualState.Setters>
                        <Setter Property="BackgroundColor" Value="#512BD4" />
                    </VisualState.Setters>
                </VisualState>
                <VisualState x:Name="Pressed">
                    <VisualState.Setters>
                        <Setter Property="BackgroundColor" Value="#3B1F9E" />
                        <Setter Property="Scale" Value="0.96" />
                    </VisualState.Setters>
                </VisualState>
                <VisualState x:Name="Disabled">
                    <VisualState.Setters>
                        <Setter Property="BackgroundColor" Value="#CCCCCC" />
                    </VisualState.Setters>
                </VisualState>
            </VisualStateGroup>
        </VisualStateGroupList>
    </Setter>
</Style>
```

## Safe Area Support (.NET 10)

.NET MAUI 10 introduces a `SafeAreaEdges` property on layouts and pages, giving granular control over rendering content under device cutouts, home indicators, or keyboard overlays:

```xml
<ContentPage SafeAreaEdges="All">
    <!-- Content stays within safe area on all edges -->
</ContentPage>

<VerticalStackLayout SafeAreaEdges="Top,Bottom">
    <!-- Only respects top and bottom safe areas -->
</VerticalStackLayout>
```

## ✅ Checkpoint

Your apps can now look polished with consistent styles, custom fonts, safe area handling, and theme support. Next, we'll explore platform-specific code.

---

**Previous:** [← 06 — Navigation](../06-Navigation/README.md) · **Next:** [08 — Platform-Specific Code →](../08-Platform-Specific-Code/README.md)
