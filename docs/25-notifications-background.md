---
title: "Notifications & Background Tasks"
layout: default
nav_order: 25
parent: "📖 Lessons"
permalink: /docs/25-notifications-background/
---

<img src="/maui-tutorial-for-beginners/assets/images/banners/notifications.svg" alt="Chapter banner" class="chapter-banner">

# Chapter 25: Notifications & Background Tasks

Send local notifications, handle push notifications, and run background work.

---

## Local Notifications

Use the [Plugin.LocalNotification](https://github.com/thudugala/Plugin.LocalNotification) NuGet package:

```bash
dotnet add package Plugin.LocalNotification
```

### Setup in MauiProgram.cs

```csharp
var builder = MauiApp.CreateBuilder();
builder
    .UseMauiApp<App>()
    .UseLocalNotification();

return builder.Build();
```

### Send a Simple Notification

```csharp
using Plugin.LocalNotification;

var notification = new NotificationRequest
{
    NotificationId = 100,
    Title = "Task Reminder",
    Description = "Don't forget to complete your MAUI tutorial!",
    BadgeNumber = 1,
    Schedule = new NotificationRequestSchedule
    {
        NotifyTime = DateTime.Now.AddSeconds(5)
    }
};

await LocalNotificationCenter.Current.Show(notification);
```

### Schedule a Repeating Notification

```csharp
var notification = new NotificationRequest
{
    NotificationId = 200,
    Title = "Daily Practice",
    Description = "Time for your daily coding practice!",
    Schedule = new NotificationRequestSchedule
    {
        NotifyTime = DateTime.Now.AddHours(24),
        RepeatType = NotificationRepeat.Daily
    }
};

await LocalNotificationCenter.Current.Show(notification);
```

### Cancel Notifications

```csharp
// Cancel a specific notification
LocalNotificationCenter.Current.Cancel(100);

// Cancel all notifications
LocalNotificationCenter.Current.CancelAll();
```

### Handle Notification Taps

```csharp
// In App.xaml.cs or a service
LocalNotificationCenter.Current.NotificationActionTapped += (e) =>
{
    // Navigate to specific page based on notification data
    if (e.Request.NotificationId == 100)
    {
        Shell.Current.GoToAsync("//tasks");
    }
};
```

---

## Platform Permissions

### Android

Add to `Platforms/Android/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

For Android 13+, request permission at runtime:

```csharp
if (OperatingSystem.IsAndroidVersionAtLeast(33))
{
    var status = await Permissions.RequestAsync<Permissions.PostNotifications>();
    if (status != PermissionStatus.Granted)
    {
        await DisplayAlert("Permission", "Notifications permission is required", "OK");
    }
}
```

### iOS

No special permission entries needed for local notifications. The plugin handles authorization requests automatically.

---

## Background Tasks

### Using IDispatcherTimer

For simple periodic tasks while the app is in the foreground:

```csharp
public partial class MainViewModel : ObservableObject
{
    private IDispatcherTimer _timer;

    public MainViewModel()
    {
        _timer = Application.Current.Dispatcher.CreateTimer();
        _timer.Interval = TimeSpan.FromSeconds(30);
        _timer.Tick += async (s, e) => await SyncDataAsync();
    }

    public void StartSync()
    {
        _timer.Start();
    }

    public void StopSync()
    {
        _timer.Stop();
    }

    private async Task SyncDataAsync()
    {
        // Sync data with server
        await _dataService.SyncAsync();
    }
}
```

### App Lifecycle Events

Handle background/foreground transitions:

```csharp
// In App.xaml.cs
protected override Window CreateWindow(IActivationState? activationState)
{
    var window = base.CreateWindow(activationState);

    window.Resumed += (s, e) =>
    {
        // App came back to foreground
        Debug.WriteLine("App resumed");
    };

    window.Stopped += (s, e) =>
    {
        // App went to background
        Debug.WriteLine("App stopped");
    };

    window.Destroying += (s, e) =>
    {
        // App is being destroyed
        Debug.WriteLine("App destroying");
    };

    return window;
}
```

### Platform-Specific Background Services (Android)

For real background work on Android, create a foreground service:

```csharp
// Platforms/Android/Services/SyncService.cs
[Service(ForegroundServiceType = Android.Content.PM.ForegroundService.TypeDataSync)]
public class SyncService : Service
{
    public override IBinder? OnBind(Intent? intent) => null;

    public override StartCommandResult OnStartCommand(Intent? intent, StartCommandFlags flags, int startId)
    {
        var notification = new Android.App.Notification.Builder(this, "sync_channel")
            .SetContentTitle("Syncing Data")
            .SetContentText("Your data is being synchronized...")
            .SetSmallIcon(Resource.Drawable.ic_sync)
            .Build();

        StartForeground(1, notification);

        Task.Run(async () =>
        {
            await DoBackgroundWork();
            StopSelf();
        });

        return StartCommandResult.Sticky;
    }

    private async Task DoBackgroundWork()
    {
        // Your background logic here
        await Task.Delay(5000);
    }
}
```

---

## Connectivity Monitoring

Check and monitor network connectivity:

```csharp
public class ConnectivityService
{
    public bool IsConnected =>
        Connectivity.Current.NetworkAccess == NetworkAccess.Internet;

    public void StartMonitoring()
    {
        Connectivity.Current.ConnectivityChanged += OnConnectivityChanged;
    }

    public void StopMonitoring()
    {
        Connectivity.Current.ConnectivityChanged -= OnConnectivityChanged;
    }

    private void OnConnectivityChanged(object? sender, ConnectivityChangedEventArgs e)
    {
        if (e.NetworkAccess == NetworkAccess.Internet)
        {
            // Back online — sync pending changes
            MainThread.BeginInvokeOnMainThread(async () =>
            {
                await SyncPendingChangesAsync();
            });
        }
    }

    private async Task SyncPendingChangesAsync()
    {
        // Upload queued changes
    }
}
```

---

## Best Practices

> **💡 Tips:**
> - Request notification permissions early but **explain why** before asking
> - Use **notification channels** on Android 8+ for user control
> - Save notification state in case the app restarts
> - Keep background tasks **short and efficient** — mobile OSes kill long-running tasks
> - Use `Connectivity.Current` to check network before sync operations
> - Test on real devices — notification behavior differs between emulators and hardware

---

## 📝 Knowledge Check

<div class="quiz-container" data-quiz-id="ch25-q1" data-correct="b" data-explanation="Plugin.LocalNotification is a cross-platform NuGet package that handles local notifications on all platforms.">
<h4>Quiz 1: Which package is commonly used for local notifications in MAUI?</h4>
<div class="quiz-options">
  <label><input type="radio" name="ch25-q1" value="a"> Microsoft.Maui.Notifications</label>
  <label><input type="radio" name="ch25-q1" value="b"> Plugin.LocalNotification</label>
  <label><input type="radio" name="ch25-q1" value="c"> Xamarin.Essentials.Notify</label>
</div>
<div class="quiz-feedback"></div>
<button class="quiz-btn quiz-check-btn">Check Answer</button>
</div>

<div class="quiz-container" data-quiz-id="ch25-q2" data-correct="a" data-explanation="Connectivity.Current.NetworkAccess returns the current network state. NetworkAccess.Internet means the device has internet access.">
<h4>Quiz 2: How do you check if the device has internet access?</h4>
<div class="quiz-options">
  <label><input type="radio" name="ch25-q2" value="a"> <code>Connectivity.Current.NetworkAccess == NetworkAccess.Internet</code></label>
  <label><input type="radio" name="ch25-q2" value="b"> <code>Network.IsAvailable()</code></label>
  <label><input type="radio" name="ch25-q2" value="c"> <code>HttpClient.IsConnected</code></label>
</div>
<div class="quiz-feedback"></div>
<button class="quiz-btn quiz-check-btn">Check Answer</button>
</div>

---

## 🏋️ Exercise: Build a Reminder Feature

Create a simple reminder page where users can set a notification for a future time.

<details class="exercise">
<summary>Show Solution</summary>

```xml
<VerticalStackLayout Padding="20" Spacing="15">
    <Label Text="Set Reminder"
           FontSize="24"
           SemanticProperties.HeadingLevel="Level1" />

    <Entry x:Name="reminderText"
           Placeholder="What should I remind you about?" />

    <DatePicker x:Name="reminderDate"
                MinimumDate="{Binding Source={x:Static sys:DateTime.Today}}" />

    <TimePicker x:Name="reminderTime" />

    <Button Text="Set Reminder"
            Clicked="OnSetReminder"
            Style="{StaticResource PrimaryButton}" />

    <Label x:Name="statusLabel"
           TextColor="Green" />
</VerticalStackLayout>
```

```csharp
private async void OnSetReminder(object sender, EventArgs e)
{
    var text = reminderText.Text;
    if (string.IsNullOrWhiteSpace(text)) return;

    var reminderDateTime = reminderDate.Date + reminderTime.Time;
    if (reminderDateTime <= DateTime.Now)
    {
        statusLabel.Text = "Please select a future date/time.";
        statusLabel.TextColor = Colors.Red;
        return;
    }

    var notification = new NotificationRequest
    {
        NotificationId = new Random().Next(1000, 9999),
        Title = "Reminder",
        Description = text,
        Schedule = new NotificationRequestSchedule
        {
            NotifyTime = reminderDateTime
        }
    };

    await LocalNotificationCenter.Current.Show(notification);
    statusLabel.Text = $"Reminder set for {reminderDateTime:g}";
    statusLabel.TextColor = Colors.Green;
}
```

</details>

---

[← Chapter 24: Accessibility]({% link docs/24-accessibility.md %})
