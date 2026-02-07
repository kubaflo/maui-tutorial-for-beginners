---
title: "Layouts & Controls"
layout: default
nav_order: 4
permalink: /docs/04-layouts-and-controls/
---

# Layouts & Controls

## What You'll Learn

- Use common layout containers
- Work with input controls
- Display lists of data with `CollectionView`
- Understand `LayoutOptions`

## Layout Containers

### VerticalStackLayout / HorizontalStackLayout

Stack children vertically or horizontally:

```xml
<VerticalStackLayout Spacing="10" Padding="20">
    <Label Text="Name:" />
    <Entry Placeholder="Enter name" />
    <Button Text="Submit" />
</VerticalStackLayout>

<HorizontalStackLayout Spacing="15">
    <Button Text="Save" />
    <Button Text="Cancel" />
</HorizontalStackLayout>
```

### Grid

Arrange elements in rows and columns:

```xml
<Grid RowDefinitions="Auto,Auto,*"
      ColumnDefinitions="*,*"
      RowSpacing="10"
      ColumnSpacing="10"
      Padding="20">

    <!-- Row 0: spans both columns -->
    <Label Text="Login Form" FontSize="24"
           Grid.Row="0" Grid.ColumnSpan="2"
           HorizontalOptions="Center" />

    <!-- Row 1 -->
    <Label Text="Username:" Grid.Row="1" Grid.Column="0"
           VerticalOptions="Center" />
    <Entry Placeholder="username" Grid.Row="1" Grid.Column="1" />

    <!-- Row 2 -->
    <Button Text="Log In" Grid.Row="2" Grid.ColumnSpan="2" />
</Grid>
```

**Row/Column Definitions:**

| Value | Meaning |
|-------|---------|
| `Auto` | Sized to fit content |
| `*` | Takes remaining space equally |
| `2*` | Takes twice the remaining space |
| `150` | Fixed size in device-independent pixels |

### FlexLayout

CSS Flexbox-inspired layout:

```xml
<FlexLayout Direction="Row" Wrap="Wrap"
            JustifyContent="SpaceAround" AlignItems="Center">
    <Frame WidthRequest="100" HeightRequest="100" BackgroundColor="Red" />
    <Frame WidthRequest="100" HeightRequest="100" BackgroundColor="Green" />
    <Frame WidthRequest="100" HeightRequest="100" BackgroundColor="Blue" />
</FlexLayout>
```

### AbsoluteLayout

Position elements at exact coordinates (useful for overlays):

```xml
<AbsoluteLayout>
    <BoxView Color="LightGray"
             AbsoluteLayout.LayoutBounds="0,0,1,1"
             AbsoluteLayout.LayoutFlags="All" />
    <Label Text="Centered"
           AbsoluteLayout.LayoutBounds="0.5,0.5,-1,-1"
           AbsoluteLayout.LayoutFlags="PositionProportional" />
</AbsoluteLayout>
```

## Common Controls

### Labels and Text

```xml
<Label Text="Bold text" FontAttributes="Bold" FontSize="18" />
<Span> <!-- Rich text -->
<FormattedString>
    <Span Text="Hello " />
    <Span Text="World" FontAttributes="Bold" TextColor="Blue" />
</FormattedString>
</Label>
```

### Buttons and ImageButtons

```xml
<Button Text="Click Me"
        BackgroundColor="#512BD4"
        TextColor="White"
        CornerRadius="10"
        Clicked="OnButtonClicked" />

<ImageButton Source="icon.png"
             WidthRequest="48"
             HeightRequest="48"
             Clicked="OnImageButtonClicked" />
```

### Input Controls

```xml
<!-- Single-line text -->
<Entry Placeholder="Email" Keyboard="Email" />

<!-- Multi-line text -->
<Editor Placeholder="Write a comment..." HeightRequest="100" />

<!-- Toggle -->
<Switch IsToggled="true" Toggled="OnSwitchToggled" />

<!-- Slider -->
<Slider Minimum="0" Maximum="100" Value="50" ValueChanged="OnSliderChanged" />

<!-- Picker (dropdown) -->
<Picker Title="Select a color">
    <Picker.ItemsSource>
        <x:Array Type="{x:Type x:String}">
            <x:String>Red</x:String>
            <x:String>Green</x:String>
            <x:String>Blue</x:String>
        </x:Array>
    </Picker.ItemsSource>
</Picker>

<!-- Date and Time -->
<DatePicker MinimumDate="01/01/2024" MaximumDate="12/31/2026" />
<TimePicker Time="09:00:00" />
```

### Images

```xml
<!-- From Resources/Images/ -->
<Image Source="dotnet_bot.png" HeightRequest="150" Aspect="AspectFit" />

<!-- From URL -->
<Image Source="https://example.com/photo.png" />
```

## CollectionView

The primary control for displaying lists:

```xml
<CollectionView ItemsSource="{Binding Animals}">
    <CollectionView.ItemTemplate>
        <DataTemplate>
            <HorizontalStackLayout Padding="10" Spacing="10">
                <Image Source="{Binding ImageUrl}"
                       WidthRequest="50" HeightRequest="50" />
                <VerticalStackLayout VerticalOptions="Center">
                    <Label Text="{Binding Name}" FontAttributes="Bold" />
                    <Label Text="{Binding Location}" FontSize="12"
                           TextColor="Gray" />
                </VerticalStackLayout>
            </HorizontalStackLayout>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

### Empty View

Show a message when there's no data:

```xml
<CollectionView ItemsSource="{Binding Items}">
    <CollectionView.EmptyView>
        <Label Text="No items found."
               HorizontalOptions="Center"
               VerticalOptions="Center" />
    </CollectionView.EmptyView>
</CollectionView>
```

## ScrollView

Wrap content that may exceed the screen:

```xml
<ScrollView>
    <VerticalStackLayout Spacing="10" Padding="20">
        <!-- Many items here -->
    </VerticalStackLayout>
</ScrollView>
```

> ⚠️ **Never** put a `CollectionView` inside a `ScrollView` — `CollectionView` handles its own scrolling.

> 💡 **New in .NET 9/10:** `CollectionView` and `CarouselView` use new native handlers by default, bringing significantly better performance and stability on iOS and Mac Catalyst.

## LayoutOptions

Control how an element is positioned within its parent:

| Value | Behavior |
|-------|----------|
| `Start` | Align to the start (left/top) |
| `Center` | Center within available space |
| `End` | Align to the end (right/bottom) |
| `Fill` | Stretch to fill available space |

```xml
<Button Text="Centered" HorizontalOptions="Center" />
<Button Text="Stretch" HorizontalOptions="Fill" />
```

## ✅ Checkpoint

You can now build complete user interfaces with layouts and controls. Next, we'll learn how to connect data to these UIs with data binding and MVVM.

---

**Previous:** [← 03 — XAML Basics](../03-XAML-Basics/README.md) · **Next:** [05 — Data Binding & MVVM →](../05-Data-Binding-MVVM/README.md)
