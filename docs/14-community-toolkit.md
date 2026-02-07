---
title: "Community Toolkit"
layout: default
nav_order: 14
parent: "📖 Lessons"
permalink: /docs/14-community-toolkit/
---

<img src="/maui-tutorial-for-beginners/assets/images/banners/toolkit.svg" alt="Chapter banner" class="chapter-banner">

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

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch14-q1" data-correct="c" data-explanation="The CommunityToolkit.Maui package provides converters, behaviors, views (like AvatarView, Expander), popups, and snackbars.">
  <h3>Question 1</h3>
  <p class="quiz-question">Which package provides Popups, Snackbars, and AvatarView for MAUI?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch14-q1" value="a"> CommunityToolkit.Mvvm</label></li>
    <li><label><input type="radio" name="ch14-q1" value="b"> Microsoft.Maui.Controls.Extras</label></li>
    <li><label><input type="radio" name="ch14-q1" value="c"> CommunityToolkit.Maui</label></li>
    <li><label><input type="radio" name="ch14-q1" value="d"> Xamarin.CommunityToolkit</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch14-q2" data-correct="b" data-explanation="You must call .UseMauiCommunityToolkit() on the MauiAppBuilder in MauiProgram.cs to register all toolkit services.">
  <h3>Question 2</h3>
  <p class="quiz-question">How do you initialize the MAUI Community Toolkit?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch14-q2" value="a"> Add a <code>&lt;using&gt;</code> directive in App.xaml</label></li>
    <li><label><input type="radio" name="ch14-q2" value="b"> Call <code>.UseMauiCommunityToolkit()</code> in MauiProgram.cs</label></li>
    <li><label><input type="radio" name="ch14-q2" value="c"> Import the namespace in each XAML page</label></li>
    <li><label><input type="radio" name="ch14-q2" value="d"> It initializes automatically when the NuGet is added</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Refactor with MVVM Toolkit

<div class="exercise-container">
  <span class="exercise-badge">Hands-On</span>
  <h3>💻 Convert a ViewModel to Use Source Generators</h3>
  <p>Simplify your ViewModel by replacing boilerplate code with CommunityToolkit.Mvvm attributes.</p>
  <ol>
    <li>Replace manual INotifyPropertyChanged with <code>[ObservableProperty]</code></li>
    <li>Replace ICommand implementations with <code>[RelayCommand]</code></li>
    <li>Verify the app still works with the simplified ViewModel</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

**Before (manual boilerplate):**

```csharp
public class TaskViewModel : INotifyPropertyChanged
{
    private string _taskName;
    public string TaskName
    {
        get => _taskName;
        set
        {
            _taskName = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(TaskName)));
        }
    }

    public ICommand AddTaskCommand { get; }

    public TaskViewModel()
    {
        AddTaskCommand = new Command(() =>
        {
            // Add task logic
        });
    }

    public event PropertyChangedEventHandler PropertyChanged;
}
```

**After (with CommunityToolkit.Mvvm source generators):**

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

public partial class TaskViewModel : ObservableObject
{
    [ObservableProperty]
    private string _taskName;

    [RelayCommand]
    private void AddTask()
    {
        // Add task logic
    }
}
```

  </details>
</div>

---

<div class="key-takeaways">
  <h4>📌 Key Takeaways</h4>
  <ul>
    <li><strong>MVVM Toolkit</strong> eliminates boilerplate with source generators</li>
    <li><code>[ObservableProperty]</code> auto-generates properties with change notification</li>
    <li><code>[RelayCommand]</code> auto-generates ICommand implementations from methods</li>
    <li><strong>Behaviors</strong> add functionality to controls without subclassing</li>
    <li><strong>Converters</strong> transform data between binding source and target</li>
  </ul>
</div>

<div class="callout callout-tip">
  <div class="callout-title">💡 Tip</div>
  The MVVM Community Toolkit's source generators require <code>partial class</code> declarations. If your generated properties aren't appearing, check that both the class and the containing type are marked <code>partial</code>.
</div>

---

**Previous:** [← 13 — Advanced Shell](/maui-tutorial-for-beginners/docs/13-shell-advanced/) · **Next:** [15 — Dependency Injection →](/maui-tutorial-for-beginners/docs/15-dependency-injection/)
