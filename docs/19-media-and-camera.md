---
title: "Media & Camera"
layout: default
nav_order: 19
parent: "📖 Lessons"
permalink: /docs/19-media-and-camera/
---

# Media & Camera

## What You'll Learn

- Capture photos and videos with the camera
- Pick files and images from the device
- Play audio and video with MediaElement
- Share content with the native share sheet

## Capturing Photos

Use `MediaPicker` to take photos:

```csharp
private async Task TakePhotoAsync()
{
    if (!MediaPicker.Default.IsCaptureSupported)
    {
        await Shell.Current.DisplayAlert("Error", "Camera not supported", "OK");
        return;
    }

    var photo = await MediaPicker.Default.CapturePhotoAsync(new MediaPickerOptions
    {
        Title = "Take a photo"
    });

    if (photo == null) return;

    // Save to app storage
    var localPath = Path.Combine(FileSystem.CacheDirectory, photo.FileName);
    using var stream = await photo.OpenReadAsync();
    using var fileStream = File.OpenWrite(localPath);
    await stream.CopyToAsync(fileStream);

    // Display
    PhotoImage.Source = ImageSource.FromFile(localPath);
}
```

### Platform Permissions

#### Android — `Platforms/Android/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

#### iOS — `Platforms/iOS/Info.plist`

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to pick photos</string>
```

## Picking Photos from Gallery

```csharp
private async Task PickPhotoAsync()
{
    var photo = await MediaPicker.Default.PickPhotoAsync(new MediaPickerOptions
    {
        Title = "Select a photo"
    });

    if (photo == null) return;

    // Load as ImageSource
    var stream = await photo.OpenReadAsync();
    PhotoImage.Source = ImageSource.FromStream(() => stream);
}
```

## File Picker

Pick any type of file:

```csharp
private async Task PickFileAsync()
{
    var result = await FilePicker.Default.PickAsync(new PickOptions
    {
        PickerTitle = "Select a document",
        FileTypes = new FilePickerFileType(new Dictionary<DevicePlatform, IEnumerable<string>>
        {
            { DevicePlatform.iOS, new[] { "public.pdf", "public.plain-text" } },
            { DevicePlatform.Android, new[] { "application/pdf", "text/plain" } },
            { DevicePlatform.WinUI, new[] { ".pdf", ".txt" } },
            { DevicePlatform.MacCatalyst, new[] { "public.pdf", "public.plain-text" } }
        })
    });

    if (result == null) return;

    var stream = await result.OpenReadAsync();
    // Process the file...
}

// Pick multiple files
private async Task PickMultipleFilesAsync()
{
    var results = await FilePicker.Default.PickMultipleAsync();
    foreach (var file in results)
    {
        Console.WriteLine($"Picked: {file.FileName}");
    }
}
```

## MediaElement (Audio & Video)

Install the Community Toolkit MediaElement:

```bash
dotnet add package CommunityToolkit.Maui.MediaElement
```

Register in `MauiProgram.cs`:

```csharp
builder.UseMauiCommunityToolkitMediaElement();
```

### Play Video

```xml
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"

<toolkit:MediaElement
    x:Name="VideoPlayer"
    Source="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    ShouldAutoPlay="False"
    ShouldShowPlaybackControls="True"
    HeightRequest="300"
    Aspect="AspectFit" />
```

### Play from Local File

```xml
<toolkit:MediaElement
    Source="video.mp4"
    ShouldAutoPlay="True"
    ShouldLoopPlayback="True" />
```

### Control Playback Programmatically

```csharp
VideoPlayer.Play();
VideoPlayer.Pause();
VideoPlayer.Stop();

// Seek to position
VideoPlayer.SeekTo(TimeSpan.FromSeconds(30));

// Get current position
var position = VideoPlayer.Position;
var duration = VideoPlayer.Duration;
```

### Media Events

```csharp
VideoPlayer.MediaOpened += (s, e) => { /* Ready to play */ };
VideoPlayer.MediaEnded += (s, e) => { /* Playback finished */ };
VideoPlayer.MediaFailed += (s, e) => { /* Error occurred */ };
VideoPlayer.PositionChanged += (s, e) =>
{
    ProgressSlider.Value = e.Position.TotalSeconds;
};
```

## Sharing Content

### Share Text

```csharp
await Share.Default.RequestAsync(new ShareTextRequest
{
    Title = "Share via",
    Text = "Check out this amazing app!",
    Uri = "https://github.com/kubaflo/maui-tutorial-for-beginners"
});
```

### Share Files

```csharp
await Share.Default.RequestAsync(new ShareFileRequest
{
    Title = "Share Photo",
    File = new ShareFile(filePath)
});

// Share multiple files
await Share.Default.RequestAsync(new ShareMultipleFilesRequest
{
    Title = "Share Photos",
    Files = new List<ShareFile>
    {
        new ShareFile(path1),
        new ShareFile(path2)
    }
});
```

## Screenshots

Capture a screenshot of the current screen:

```csharp
if (Screenshot.Default.IsCaptureSupported)
{
    var screenshot = await Screenshot.Default.CaptureAsync();
    var stream = await screenshot.OpenReadAsync();

    ScreenshotImage.Source = ImageSource.FromStream(() => stream);
}
```

## Requesting Permissions

Always check and request permissions before using media APIs:

```csharp
public async Task<bool> CheckAndRequestCameraPermission()
{
    var status = await Permissions.CheckStatusAsync<Permissions.Camera>();

    if (status == PermissionStatus.Granted)
        return true;

    if (Permissions.ShouldShowRationale<Permissions.Camera>())
    {
        await Shell.Current.DisplayAlert(
            "Camera Permission",
            "We need camera access to take photos for your profile.",
            "OK");
    }

    status = await Permissions.RequestAsync<Permissions.Camera>();
    return status == PermissionStatus.Granted;
}
```

## ✅ Checkpoint

You can now capture photos, pick files, play media, share content, and manage permissions. Continue to the next chapters for advanced topics!

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch19-q1" data-correct="a" data-explanation="MediaPicker.CapturePhotoAsync() opens the camera, captures a photo, and returns a FileResult with the image path.">
  <h3>Question 1</h3>
  <p class="quiz-question">Which API do you use to capture a photo from the camera?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch19-q1" value="a"> <code>MediaPicker.CapturePhotoAsync()</code></label></li>
    <li><label><input type="radio" name="ch19-q1" value="b"> <code>Camera.TakePhotoAsync()</code></label></li>
    <li><label><input type="radio" name="ch19-q1" value="c"> <code>FilePicker.PickAsync()</code> with camera filter</label></li>
    <li><label><input type="radio" name="ch19-q1" value="d"> <code>DeviceCamera.Capture()</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch19-q2" data-correct="c" data-explanation="You must check and request permissions before accessing camera, location, etc. Use Permissions.CheckStatusAsync and RequestAsync.">
  <h3>Question 2</h3>
  <p class="quiz-question">What should you always do before accessing the camera or microphone?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch19-q2" value="a"> Nothing — MAUI handles permissions automatically</label></li>
    <li><label><input type="radio" name="ch19-q2" value="b"> Add an entry to App.xaml</label></li>
    <li><label><input type="radio" name="ch19-q2" value="c"> Check and request runtime permissions using <code>Permissions.RequestAsync</code></label></li>
    <li><label><input type="radio" name="ch19-q2" value="d"> Install a permissions NuGet package</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

---

**Previous:** [← 18 — Gestures & Touch](/docs/18-gestures-and-touch/) · **Next:** [20 — HybridWebView →](/docs/20-hybridwebview/)
