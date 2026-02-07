---
title: "📋 Controls Gallery"
layout: default
nav_order: 4
parent: "🛠️ Tools"
permalink: /controls/
---

# Visual Controls Gallery

A quick visual reference of all major .NET MAUI controls with code snippets you can copy directly.

---

## Input Controls

<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin: 1.5rem 0;">

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-purple);">Button</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem; text-align:center;">
<div style="display:inline-block; padding:8px 24px; background: linear-gradient(135deg,#a855f7,#6366f1); border-radius:8px; color:white; font-weight:600; font-size:0.85rem;">Click Me</div>
</div>

```xml
<Button Text="Click Me"
        Clicked="OnButtonClicked"
        BackgroundColor="#512BD4"
        TextColor="White"
        CornerRadius="8" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-cyan);">Entry (Text Input)</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem;">
<div style="border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:8px 12px; color: var(--text-muted); font-size:0.85rem;">Enter your name...</div>
</div>

```xml
<Entry Placeholder="Enter your name"
       Text="{Binding Name}"
       Keyboard="Text"
       MaxLength="50" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-green);">Editor (Multi-line)</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem;">
<div style="border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:8px 12px; color: var(--text-muted); font-size:0.85rem; min-height:50px;">Type a longer message here...</div>
</div>

```xml
<Editor Placeholder="Type a message"
        Text="{Binding Message}"
        HeightRequest="100"
        AutoSize="TextChanges" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-orange);">Switch</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem; display:flex; align-items:center; gap:12px;">
<div style="width:44px; height:24px; border-radius:12px; background:linear-gradient(135deg,#a855f7,#6366f1); position:relative;">
<div style="width:20px; height:20px; border-radius:50%; background:white; position:absolute; right:2px; top:2px;"></div>
</div>
<span style="color: var(--text-secondary); font-size:0.85rem;">Dark Mode</span>
</div>

```xml
<Switch IsToggled="{Binding IsDarkMode}"
        OnColor="#512BD4"
        ThumbColor="White" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-pink);">Slider</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem;">
<div style="position:relative; height:20px; display:flex; align-items:center;">
<div style="width:100%; height:4px; border-radius:2px; background:rgba(255,255,255,0.1);"></div>
<div style="position:absolute; left:0; width:60%; height:4px; border-radius:2px; background:linear-gradient(90deg,#f472b6,#a855f7);"></div>
<div style="position:absolute; left:58%; width:16px; height:16px; border-radius:50%; background:#f472b6; border:2px solid white;"></div>
</div>
<div style="text-align:center; color:var(--text-muted); font-size:0.8rem; margin-top:4px;">60%</div>
</div>

```xml
<Slider Minimum="0"
        Maximum="100"
        Value="{Binding Volume}"
        MinimumTrackColor="#F472B6"
        ThumbColor="#F472B6" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-cyan);">Picker</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem;">
<div style="border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:8px 12px; color: var(--text-secondary); font-size:0.85rem; display:flex; justify-content:space-between;">
<span>Select a country</span>
<span style="color:var(--text-muted);">▼</span>
</div>
</div>

```xml
<Picker Title="Select a country"
        ItemsSource="{Binding Countries}"
        SelectedItem="{Binding SelectedCountry}" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-green);">CheckBox</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem; display:flex; align-items:center; gap:10px;">
<div style="width:20px; height:20px; border-radius:4px; background:linear-gradient(135deg,#34d399,#22d3ee); display:flex; align-items:center; justify-content:center; color:white; font-size:12px;">✓</div>
<span style="color: var(--text-secondary); font-size:0.85rem;">I accept the terms</span>
</div>

```xml
<CheckBox IsChecked="{Binding AcceptTerms}"
          Color="#34D399" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-orange);">DatePicker</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem;">
<div style="border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:8px 12px; color: var(--text-secondary); font-size:0.85rem; display:flex; justify-content:space-between;">
<span>July 15, 2025</span>
<span style="color:var(--text-muted);">📅</span>
</div>
</div>

```xml
<DatePicker Date="{Binding SelectedDate}"
            MinimumDate="01/01/2020"
            MaximumDate="12/31/2030"
            Format="MMMM dd, yyyy" />
```
</div>

</div>

---

## Display Controls

<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin: 1.5rem 0;">

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-purple);">Label</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem;">
<div style="color: var(--text-primary); font-size:1.1rem; font-weight:600;">Hello, .NET MAUI!</div>
<div style="color: var(--text-muted); font-size:0.85rem; margin-top:4px;">A subtitle with muted color</div>
</div>

```xml
<Label Text="Hello, .NET MAUI!"
       FontSize="20"
       FontAttributes="Bold"
       TextColor="#F0F0F5" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-cyan);">Image</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem; text-align:center;">
<div style="width:80px; height:80px; border-radius:12px; background:linear-gradient(135deg,rgba(34,211,238,0.2),rgba(99,102,241,0.2)); margin:0 auto; display:flex; align-items:center; justify-content:center; font-size:2rem;">🖼️</div>
</div>

```xml
<Image Source="dotnet_bot.png"
       HeightRequest="100"
       WidthRequest="100"
       Aspect="AspectFit" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-green);">ActivityIndicator</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem; text-align:center;">
<div style="width:30px; height:30px; border:3px solid rgba(52,211,153,0.2); border-top-color:#34d399; border-radius:50%; margin:0 auto; animation:spin 1s linear infinite;"></div>
</div>
<style>@keyframes spin{to{transform:rotate(360deg)}}</style>

```xml
<ActivityIndicator IsRunning="{Binding IsLoading}"
                   Color="#34D399" />
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-pink);">ProgressBar</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem;">
<div style="width:100%; height:8px; border-radius:4px; background:rgba(255,255,255,0.08);">
<div style="width:65%; height:100%; border-radius:4px; background:linear-gradient(90deg,#f472b6,#a855f7);"></div>
</div>
<div style="text-align:right; color:var(--text-muted); font-size:0.75rem; margin-top:4px;">65%</div>
</div>

```xml
<ProgressBar Progress="{Binding Progress}"
             ProgressColor="#F472B6" />
```
</div>

</div>

---

## Collection Controls

<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin: 1.5rem 0;">

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-purple);">CollectionView</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:8px; margin-bottom:0.75rem;">
<div style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.06); color:var(--text-secondary); font-size:0.85rem;">📱 Item 1 — Description text</div>
<div style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.06); color:var(--text-secondary); font-size:0.85rem;">📱 Item 2 — Description text</div>
<div style="padding:8px; color:var(--text-secondary); font-size:0.85rem;">📱 Item 3 — Description text</div>
</div>

```xml
<CollectionView ItemsSource="{Binding Items}">
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="model:Item">
            <Grid Padding="10">
                <Label Text="{Binding Name}" />
            </Grid>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```
</div>

<div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
<h4 style="margin:0 0 0.5rem 0; color: var(--accent-orange);">CarouselView</h4>
<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:0.75rem; text-align:center;">
<div style="display:flex; gap:8px; justify-content:center; align-items:center;">
<div style="width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.15);"></div>
<div style="width:24px; height:8px; border-radius:4px; background:#fb923c;"></div>
<div style="width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.15);"></div>
</div>
<div style="color:var(--text-muted); font-size:0.8rem; margin-top:8px;">← Swipe →</div>
</div>

```xml
<CarouselView ItemsSource="{Binding Images}"
              PeekAreaInsets="40"
              Loop="True">
    <CarouselView.ItemTemplate>
        <DataTemplate>
            <Image Source="{Binding Url}"
                   Aspect="AspectFill" />
        </DataTemplate>
    </CarouselView.ItemTemplate>
</CarouselView>
```
</div>

</div>

---

## Layout Containers

| Layout | Use Case |
|---|---|
| `StackLayout` | Stack children vertically or horizontally |
| `Grid` | Row/column-based precise positioning |
| `FlexLayout` | CSS-like flexible layouts |
| `AbsoluteLayout` | Pixel-perfect positioning |
| `HorizontalStackLayout` | Optimized horizontal stack (no wrapping) |
| `VerticalStackLayout` | Optimized vertical stack (no wrapping) |
| `ScrollView` | Makes content scrollable |
| `Frame` | Bordered container with shadow |
| `Border` | Modern replacement for Frame (.NET 7+) |

> **Tip:** Prefer `VerticalStackLayout` / `HorizontalStackLayout` over `StackLayout` for better performance. They skip the `Orientation` property check.

---

## Quick Reference: Common Properties

```xml
<!-- Most controls share these properties -->
<AnyControl
    x:Name="myControl"
    IsVisible="{Binding ShowControl}"
    IsEnabled="{Binding CanInteract}"
    Opacity="0.8"
    BackgroundColor="Transparent"
    Margin="10,5,10,5"
    Padding="8"
    HorizontalOptions="Center"
    VerticalOptions="Start"
    SemanticProperties.Description="Accessible label"
    AutomationId="test-id" />
```

---

*For the full API reference, see the [official .NET MAUI Controls docs](https://learn.microsoft.com/en-us/dotnet/maui/user-interface/controls/).*
