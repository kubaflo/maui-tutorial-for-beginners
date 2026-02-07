---
title: "Gestures & Touch"
layout: default
nav_order: 18
permalink: /docs/18-gestures-and-touch/
---

# Gestures & Touch

## What You'll Learn

- Handle tap, swipe, pan, and pinch gestures
- Add drag-and-drop support
- Use pointer and keyboard gestures
- Build swipe-to-delete and pull-to-refresh

> 💡 **Note (.NET 10):** `ClickGestureRecognizer` has been removed. Use `TapGestureRecognizer` instead.

## Tap Gesture

Detect single or multi-taps on any view:

```xml
<Frame BackgroundColor="#F0F0F0" Padding="20">
    <Frame.GestureRecognizers>
        <TapGestureRecognizer Tapped="OnFrameTapped"
                               NumberOfTapsRequired="1" />
    </Frame.GestureRecognizers>
    <Label Text="Tap me!" HorizontalOptions="Center" />
</Frame>
```

```csharp
private async void OnFrameTapped(object sender, TappedEventArgs e)
{
    if (sender is Frame frame)
    {
        await frame.ScaleToAsync(0.95, 50);
        await frame.ScaleToAsync(1.0, 50);
    }
}
```

### Tap with Command (MVVM)

```xml
<Frame>
    <Frame.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding SelectItemCommand}"
                               CommandParameter="{Binding .}" />
    </Frame.GestureRecognizers>
</Frame>
```

## Swipe Gesture

Detect directional swipes:

```xml
<Frame>
    <Frame.GestureRecognizers>
        <SwipeGestureRecognizer Direction="Left" Swiped="OnSwipedLeft" />
        <SwipeGestureRecognizer Direction="Right" Swiped="OnSwipedRight" />
    </Frame.GestureRecognizers>
    <Label Text="Swipe me left or right" />
</Frame>
```

```csharp
private async void OnSwipedLeft(object sender, SwipedEventArgs e)
{
    await Shell.Current.GoToAsync("next-page");
}
```

## Pan Gesture

Track finger movement for draggable elements:

```xml
<BoxView x:Name="DraggableBox"
         Color="#512BD4"
         WidthRequest="100" HeightRequest="100"
         CornerRadius="10">
    <BoxView.GestureRecognizers>
        <PanGestureRecognizer PanUpdated="OnPanUpdated" />
    </BoxView.GestureRecognizers>
</BoxView>
```

```csharp
private double _x, _y;

private void OnPanUpdated(object sender, PanUpdatedEventArgs e)
{
    switch (e.StatusType)
    {
        case GestureStatus.Running:
            DraggableBox.TranslationX = _x + e.TotalX;
            DraggableBox.TranslationY = _y + e.TotalY;
            break;

        case GestureStatus.Completed:
            _x = DraggableBox.TranslationX;
            _y = DraggableBox.TranslationY;
            break;
    }
}
```

## Pinch Gesture

Zoom/scale with two fingers:

```xml
<Image Source="photo.jpg" x:Name="ZoomableImage">
    <Image.GestureRecognizers>
        <PinchGestureRecognizer PinchUpdated="OnPinchUpdated" />
    </Image.GestureRecognizers>
</Image>
```

```csharp
private double _currentScale = 1;

private void OnPinchUpdated(object sender, PinchGestureUpdatedEventArgs e)
{
    switch (e.Status)
    {
        case GestureStatus.Running:
            _currentScale += (e.Scale - 1) * _currentScale;
            _currentScale = Math.Clamp(_currentScale, 0.5, 4.0);
            ZoomableImage.Scale = _currentScale;
            break;
    }
}
```

## Drag and Drop

### Drag Source

```xml
<Image Source="icon.png" WidthRequest="80" HeightRequest="80">
    <Image.GestureRecognizers>
        <DragGestureRecognizer CanDrag="True"
                                DragStarting="OnDragStarting" />
    </Image.GestureRecognizers>
</Image>
```

```csharp
private void OnDragStarting(object sender, DragStartingEventArgs e)
{
    e.Data.Text = "item-id-123";
    e.Data.Properties["Item"] = myItem;
}
```

### Drop Target

```xml
<Frame BackgroundColor="#E0E0E0" Padding="30">
    <Frame.GestureRecognizers>
        <DropGestureRecognizer AllowDrop="True"
                                DragOver="OnDragOver"
                                Drop="OnDrop" />
    </Frame.GestureRecognizers>
    <Label Text="Drop here" HorizontalOptions="Center" />
</Frame>
```

```csharp
private void OnDragOver(object sender, DragEventArgs e)
{
    e.AcceptedOperation = DataPackageOperation.Copy;
}

private async void OnDrop(object sender, DropEventArgs e)
{
    var text = await e.Data.View.GetTextAsync();
    // Handle dropped item
}
```

## SwipeView (Swipe Actions on List Items)

```xml
<CollectionView ItemsSource="{Binding Items}">
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="models:TodoItem">
            <SwipeView>
                <SwipeView.RightItems>
                    <SwipeItems>
                        <SwipeItem Text="Delete"
                                   BackgroundColor="Red"
                                   Command="{Binding Source={RelativeSource
                                       AncestorType={x:Type vm:TodoViewModel}},
                                       Path=DeleteCommand}"
                                   CommandParameter="{Binding .}" />
                    </SwipeItems>
                </SwipeView.RightItems>

                <SwipeView.LeftItems>
                    <SwipeItems>
                        <SwipeItem Text="Complete"
                                   BackgroundColor="Green"
                                   Command="{Binding Source={RelativeSource
                                       AncestorType={x:Type vm:TodoViewModel}},
                                       Path=ToggleCommand}"
                                   CommandParameter="{Binding .}" />
                    </SwipeItems>
                </SwipeView.LeftItems>

                <!-- Main content -->
                <Frame Padding="15">
                    <Label Text="{Binding Title}" />
                </Frame>
            </SwipeView>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

## Keyboard Accelerators (.NET 10)

Replace the deprecated `Accelerator` with `KeyboardAccelerator`:

```xml
<MenuBarItem Text="File">
    <MenuFlyoutItem Text="Save">
        <MenuFlyoutItem.KeyboardAccelerators>
            <KeyboardAccelerator Modifiers="Ctrl" Key="S" />
        </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
</MenuBarItem>
```

## ✅ Checkpoint

You can now handle all types of user input — from simple taps to complex drag-and-drop. Next, we'll explore media and camera integration.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch18-q1" data-correct="d" data-explanation="GestureRecognizers can be added to any visual element — Labels, Images, Frames, Grids, etc. — not just buttons.">
  <h3>Question 1</h3>
  <p class="quiz-question">Can you add gesture recognizers to a Label or Image?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch18-q1" value="a"> No, only Button and ImageButton support gestures</label></li>
    <li><label><input type="radio" name="ch18-q1" value="b"> Only on Android and iOS</label></li>
    <li><label><input type="radio" name="ch18-q1" value="c"> Only TapGestureRecognizer, not others</label></li>
    <li><label><input type="radio" name="ch18-q1" value="d"> Yes, any View can have GestureRecognizers added to it</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch18-q2" data-correct="b" data-explanation="SwipeView wraps content and provides swipe-to-reveal actions like delete, archive, etc.">
  <h3>Question 2</h3>
  <p class="quiz-question">What control provides swipe-to-delete actions on list items?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch18-q2" value="a"> SwipeGestureRecognizer</label></li>
    <li><label><input type="radio" name="ch18-q2" value="b"> SwipeView</label></li>
    <li><label><input type="radio" name="ch18-q2" value="c"> CollectionView with SwipeMode</label></li>
    <li><label><input type="radio" name="ch18-q2" value="d"> DragGestureRecognizer</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Draggable Card Stack

<div class="exercise-container">
  <span class="exercise-badge">Advanced</span>
  <h3>💻 Build a Swipe Card Interface</h3>
  <p>Create a Tinder-style card swiping interface:</p>
  <ol>
    <li>A card (Frame) that can be panned left/right with <code>PanGestureRecognizer</code></li>
    <li>The card rotates slightly as it's dragged (using <code>RotateTo</code>)</li>
    <li>When released past a threshold, it animates off-screen and loads the next card</li>
    <li>If not past the threshold, it springs back to center</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution</summary>

```csharp
private double _startX;

private void OnPanUpdated(object sender, PanUpdatedEventArgs e)
{
    var card = (View)sender;

    switch (e.StatusType)
    {
        case GestureStatus.Started:
            _startX = card.TranslationX;
            break;

        case GestureStatus.Running:
            card.TranslationX = _startX + e.TotalX;
            card.Rotation = card.TranslationX / 20; // slight tilt
            break;

        case GestureStatus.Completed:
            var threshold = Width / 3;
            if (Math.Abs(card.TranslationX) > threshold)
            {
                // Swipe away
                var direction = card.TranslationX > 0 ? Width : -Width;
                Task.WhenAll(
                    card.TranslateTo(direction * 2, 0, 300),
                    card.FadeTo(0, 300));
                // Load next card...
            }
            else
            {
                // Spring back
                Task.WhenAll(
                    card.TranslateTo(0, 0, 250, Easing.SpringOut),
                    card.RotateTo(0, 250));
            }
            break;
    }
}
```

```xml
<Frame x:Name="SwipeCard" Padding="20" CornerRadius="16"
       BackgroundColor="{AppThemeBinding Light=#FFFFFF, Dark=#2d2d44}">
    <Frame.GestureRecognizers>
        <PanGestureRecognizer PanUpdated="OnPanUpdated" />
    </Frame.GestureRecognizers>
    <VerticalStackLayout Spacing="10">
        <Image Source="{Binding ImageUrl}" HeightRequest="200" />
        <Label Text="{Binding Title}" FontSize="20" FontAttributes="Bold" />
        <Label Text="{Binding Description}" />
    </VerticalStackLayout>
</Frame>
```

  </details>
</div>

---

**Previous:** [← 17 — MAUI Blazor Hybrid](../17-MAUI-Blazor-Hybrid/README.md) · **Next:** [19 — Media & Camera →](../19-Media-And-Camera/README.md)
