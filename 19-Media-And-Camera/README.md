# 19 — Media and Camera

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

You can now capture photos, pick files, play media, share content, and manage permissions. You've completed the entire tutorial!

---

**Previous:** [← 18 — Gestures & Touch](../18-Gestures-And-Touch/README.md) · **Back to:** [📚 Table of Contents](../README.md)
