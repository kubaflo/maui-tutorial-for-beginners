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

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch04-q1" data-correct="b" data-explanation="Grid is the most flexible layout, supporting rows, columns, spanning, and precise positioning — ideal for complex UIs.">
  <h3>Question 1</h3>
  <p class="quiz-question">Which layout is best for creating complex, multi-row/column interfaces?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch04-q1" value="a"> VerticalStackLayout</label></li>
    <li><label><input type="radio" name="ch04-q1" value="b"> Grid</label></li>
    <li><label><input type="radio" name="ch04-q1" value="c"> FlexLayout</label></li>
    <li><label><input type="radio" name="ch04-q1" value="d"> AbsoluteLayout</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch04-q2" data-correct="c" data-explanation="CollectionView is the modern, virtualized list control in MAUI. ListView is older and less performant. Always prefer CollectionView.">
  <h3>Question 2</h3>
  <p class="quiz-question">What is the recommended control for displaying scrollable lists of data in MAUI?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch04-q2" value="a"> ListView</label></li>
    <li><label><input type="radio" name="ch04-q2" value="b"> ScrollView with StackLayout</label></li>
    <li><label><input type="radio" name="ch04-q2" value="c"> CollectionView</label></li>
    <li><label><input type="radio" name="ch04-q2" value="d"> TableView</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Login Form

<div class="exercise-container">
  <span class="exercise-badge">Hands-On</span>
  <h3>💻 Build a Login Page</h3>
  <p>Create a responsive login page using:</p>
  <ol>
    <li>A <code>Grid</code> layout with centered content</li>
    <li>An app logo (Image), username Entry, password Entry, and Login Button</li>
    <li>A "Forgot Password?" label below the button</li>
    <li>Proper spacing and padding for a clean look</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```xml
<ContentPage>
    <Grid RowDefinitions="*,Auto,Auto,Auto,Auto,Auto,*"
          Padding="30">
        <Image Grid.Row="1" Source="logo.png"
               HeightRequest="100" Aspect="AspectFit" />
        <Entry Grid.Row="2" Placeholder="Username"
               Margin="0,20,0,0" />
        <Entry Grid.Row="3" Placeholder="Password"
               IsPassword="True" Margin="0,10,0,0" />
        <Button Grid.Row="4" Text="Log In"
                BackgroundColor="#7c3aed" TextColor="White"
                CornerRadius="8" Margin="0,20,0,0" />
        <Label Grid.Row="5" Text="Forgot Password?"
               HorizontalOptions="Center" Margin="0,10,0,0"
               TextColor="#7c3aed" />
    </Grid>
</ContentPage>
```

  </details>
</div>

---

**Previous:** [← 03 — XAML Basics](../03-XAML-Basics/README.md) · **Next:** [05 — Data Binding & MVVM →](../05-Data-Binding-MVVM/README.md)
