# 01 — Getting Started with .NET MAUI

## What You'll Learn

- Install the .NET MAUI workload
- Create your first MAUI application
- Run the app on an emulator or device

> **Note:** This tutorial uses **.NET 10** (LTS) and .NET MAUI 10. If you're on .NET 9, the concepts are the same — just replace `net10.0` with `net9.0` in target frameworks.

## Step 1: Install Prerequisites

### Visual Studio 2022 (Recommended)

1. Download [Visual Studio 2022](https://visualstudio.microsoft.com/) (Community edition is free, v17.12+).
2. During installation, select the **.NET Multi-platform App UI development** workload.
3. Ensure the **Android SDK** is selected in the individual components tab.

### Command Line (Alternative)

```bash
# Install the MAUI workload via the .NET CLI
dotnet workload install maui
```

Verify your setup:

```bash
dotnet workload list
```

You should see `maui` in the output.

## Step 2: Create Your First App

### Using the CLI

```bash
dotnet new maui -n HelloMaui
cd HelloMaui
```

### Using Visual Studio

1. **File → New → Project**
2. Search for **.NET MAUI App**
3. Name the project `HelloMaui` and click **Create**

## Step 3: Explore the Default App

Open `MainPage.xaml` — this is the main UI file:

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="HelloMaui.MainPage">

    <ScrollView>
        <VerticalStackLayout Padding="30,0" Spacing="25">
            <Image Source="dotnet_bot.png"
                   HeightRequest="185"
                   Aspect="AspectFit" />

            <Label Text="Hello, World!"
                   FontSize="32"
                   HorizontalOptions="Center" />

            <Label Text="Welcome to &#10;.NET Multi-platform App UI"
                   FontSize="18"
                   HorizontalOptions="Center" />

            <Button x:Name="CounterBtn"
                    Text="Click me"
                    Clicked="OnCounterClicked"
                    HorizontalOptions="Fill" />
        </VerticalStackLayout>
    </ScrollView>

</ContentPage>
```

Open `MainPage.xaml.cs` — this is the code-behind:

```csharp
namespace HelloMaui;

public partial class MainPage : ContentPage
{
    int count = 0;

    public MainPage()
    {
        InitializeComponent();
    }

    private void OnCounterClicked(object sender, EventArgs e)
    {
        count++;
        CounterBtn.Text = count == 1
            ? $"Clicked {count} time"
            : $"Clicked {count} times";

        SemanticScreenReader.Announce(CounterBtn.Text);
    }
}
```

## Step 4: Run the App

### Android

```bash
dotnet build -t:Run -f net10.0-android
```

Or press **F5** in Visual Studio with an Android emulator selected.

### Windows

```bash
dotnet build -t:Run -f net10.0-windows10.0.19041.0
```

### iOS (macOS only)

```bash
dotnet build -t:Run -f net10.0-ios
```

### macOS (Mac Catalyst)

```bash
dotnet build -t:Run -f net10.0-maccatalyst
```

## ✅ Checkpoint

You should see the default MAUI counter app running. Clicking the button increments a counter. Congratulations — you've built your first .NET MAUI app!

---

**Next:** [02 — Project Structure →](../02-ProjectStructure/README.md)
