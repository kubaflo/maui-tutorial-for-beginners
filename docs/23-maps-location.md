---
title: "Maps & Location"
layout: default
nav_order: 23
parent: "📖 Lessons"
permalink: /docs/23-maps-location/
---

# Chapter 23: Maps & Location Services

Build location-aware apps with maps, pins, geocoding, and GPS tracking.

---

## Setting Up Maps

Install the `Microsoft.Maui.Controls.Maps` NuGet package:

```bash
dotnet add package Microsoft.Maui.Controls.Maps
```

Register the maps handler in `MauiProgram.cs`:

```csharp
var builder = MauiApp.CreateBuilder();
builder
    .UseMauiApp<App>()
    .UseMauiMaps(); // Add this line

return builder.Build();
```

### Platform Configuration

**Android** — Add your Google Maps API key in `Platforms/Android/AndroidManifest.xml`:

```xml
<application>
    <meta-data android:name="com.google.android.geo.API_KEY"
               android:value="YOUR_API_KEY_HERE" />
</application>
```

Also add location permissions:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

**iOS** — Add to `Platforms/iOS/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show nearby places.</string>
```

---

## Displaying a Map

### XAML Approach

```xml
<ContentPage xmlns:maps="http://schemas.microsoft.com/dotnet/2021/maui/maps"
             xmlns:sensors="clr-namespace:Microsoft.Maui.Devices.Sensors;assembly=Microsoft.Maui.Essentials">
    <maps:Map x:Name="map">
        <x:Arguments>
            <maps:MapSpan>
                <x:Arguments>
                    <sensors:Location>
                        <x:Arguments>
                            <x:Double>36.9628066</x:Double>
                            <x:Double>-122.0194722</x:Double>
                        </x:Arguments>
                    </sensors:Location>
                    <x:Double>0.01</x:Double>
                    <x:Double>0.01</x:Double>
                </x:Arguments>
            </maps:MapSpan>
        </x:Arguments>
    </maps:Map>
</ContentPage>
```

### C# Approach

```csharp
using Microsoft.Maui.Maps;
using Map = Microsoft.Maui.Controls.Maps.Map;

Location location = new Location(36.9628066, -122.0194722);
MapSpan mapSpan = new MapSpan(location, 0.01, 0.01);
Map map = new Map(mapSpan);
```

### Map Types

Control the visual style with the `MapType` property:

```csharp
Map map = new Map
{
    MapType = MapType.Satellite
};
```

| MapType | Description |
|:--------|:------------|
| `Street` | Standard street map (default) |
| `Satellite` | Satellite imagery |
| `Hybrid` | Street + satellite combined |

---

## Adding Pins (Markers)

### In XAML

```xml
<maps:Map.Pins>
    <maps:Pin Label="Santa Cruz"
              Address="The city with a boardwalk"
              Type="Place">
        <maps:Pin.Location>
            <sensors:Location>
                <x:Arguments>
                    <x:Double>36.9628066</x:Double>
                    <x:Double>-122.0194722</x:Double>
                </x:Arguments>
            </sensors:Location>
        </maps:Pin.Location>
    </maps:Pin>
</maps:Map.Pins>
```

### In C#

```csharp
using Microsoft.Maui.Controls.Maps;

Pin pin = new Pin
{
    Label = "Santa Cruz",
    Address = "The city with a boardwalk",
    Type = PinType.Place,
    Location = new Location(36.9628066, -122.0194722)
};
map.Pins.Add(pin);
```

### Pin Events

```csharp
pin.MarkerClicked += (s, e) =>
{
    e.HideInfoWindow = true;
    DisplayAlert("Pin Clicked", $"{pin.Label}", "OK");
};

pin.InfoWindowClicked += async (s, e) =>
{
    await DisplayAlert("Info Window", $"Navigate to {pin.Label}?", "OK");
};
```

---

## Geolocation — Getting User Position

Use `Microsoft.Maui.Devices.Sensors.Geolocation` to get the device's GPS position:

```csharp
public async Task<Location?> GetCurrentLocationAsync()
{
    try
    {
        var request = new GeolocationRequest(GeolocationAccuracy.Medium, TimeSpan.FromSeconds(10));
        var location = await Geolocation.Default.GetLocationAsync(request);

        if (location != null)
        {
            Console.WriteLine($"Lat: {location.Latitude}, Lng: {location.Longitude}");
        }

        return location;
    }
    catch (FeatureNotSupportedException)
    {
        // GPS not supported on this device
    }
    catch (PermissionException)
    {
        // Location permission not granted
    }
    return null;
}
```

### Accuracy Levels

| GeolocationAccuracy | Description |
|:---------------------|:------------|
| `Lowest` | ~1-5 km, fastest |
| `Low` | ~100-500 m |
| `Medium` | ~30-100 m |
| `High` | ~10-25 m |
| `Best` | ~1-5 m, slowest |

### Center Map on User Location

```csharp
var location = await GetCurrentLocationAsync();
if (location != null)
{
    map.MoveToRegion(MapSpan.FromCenterAndRadius(
        location,
        Distance.FromKilometers(1)));
}
```

---

## Geocoding — Address ↔ Coordinates

### Address to Coordinates (Forward Geocoding)

```csharp
string address = "Microsoft Building 25 Redmond WA USA";
IEnumerable<Location> locations = await Geocoding.Default.GetLocationsAsync(address);
Location location = locations?.FirstOrDefault();

if (location != null)
{
    Console.WriteLine($"Lat: {location.Latitude}, Lng: {location.Longitude}");
}
```

### Coordinates to Address (Reverse Geocoding)

```csharp
IEnumerable<Placemark> placemarks =
    await Geocoding.Default.GetPlacemarksAsync(47.673988, -122.121513);

Placemark placemark = placemarks?.FirstOrDefault();
if (placemark != null)
{
    string fullAddress = $"{placemark.Thoroughfare}, " +
                         $"{placemark.Locality}, " +
                         $"{placemark.AdminArea} " +
                         $"{placemark.PostalCode}";
    Console.WriteLine(fullAddress);
}
```

---

## Opening the Native Maps App

Launch the default map application:

```csharp
public async Task NavigateToLocation()
{
    var location = new Location(47.645160, -122.1306032);
    var options = new MapLaunchOptions { Name = "Microsoft Building 25" };

    try
    {
        await Map.Default.OpenAsync(location, options);
    }
    catch (Exception ex)
    {
        // No map application available
        await DisplayAlert("Error", "No maps app available", "OK");
    }
}
```

### Navigation Mode

```csharp
var options = new MapLaunchOptions
{
    Name = "Destination",
    NavigationMode = NavigationMode.Driving
};
```

---

## Building a Location-Aware ViewModel

```csharp
public partial class MapViewModel : ObservableObject
{
    [ObservableProperty]
    private Location? currentLocation;

    [ObservableProperty]
    private ObservableCollection<Pin> pins = new();

    [ObservableProperty]
    private MapSpan visibleRegion;

    [RelayCommand]
    private async Task LoadCurrentLocation()
    {
        try
        {
            var request = new GeolocationRequest(GeolocationAccuracy.Medium);
            CurrentLocation = await Geolocation.Default.GetLocationAsync(request);

            if (CurrentLocation != null)
            {
                VisibleRegion = MapSpan.FromCenterAndRadius(
                    CurrentLocation,
                    Distance.FromKilometers(2));
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Location error: {ex.Message}");
        }
    }

    [RelayCommand]
    private async Task SearchAddress(string address)
    {
        var locations = await Geocoding.Default.GetLocationsAsync(address);
        var location = locations?.FirstOrDefault();

        if (location != null)
        {
            Pins.Add(new Pin
            {
                Label = address,
                Location = location,
                Type = PinType.SearchResult
            });

            VisibleRegion = MapSpan.FromCenterAndRadius(
                location,
                Distance.FromKilometers(0.5));
        }
    }
}
```

---

## Tracking Location Changes

Monitor position changes in real-time:

```csharp
public void StartTracking()
{
    Geolocation.Default.LocationChanged += OnLocationChanged;
    Geolocation.Default.StartListeningForegroundAsync(new GeolocationListeningRequest
    {
        DesiredAccuracy = GeolocationAccuracy.High,
        MinimumTime = TimeSpan.FromSeconds(5)
    });
}

private void OnLocationChanged(object? sender, GeolocationLocationChangedEventArgs e)
{
    MainThread.BeginInvokeOnMainThread(() =>
    {
        var loc = e.Location;
        map.MoveToRegion(MapSpan.FromCenterAndRadius(loc, Distance.FromMeters(500)));
    });
}

public void StopTracking()
{
    Geolocation.Default.StopListeningForeground();
    Geolocation.Default.LocationChanged -= OnLocationChanged;
}
```

---

## Best Practices

> **💡 Tips:**
> - Always request location permission gracefully and explain *why* you need it
> - Use `GeolocationAccuracy.Medium` for most use cases — `Best` drains battery
> - Cache the last known location with `Geolocation.Default.GetLastKnownLocationAsync()`
> - Use `IMap.OpenAsync()` for turn-by-turn navigation instead of building your own
> - On Android, always include both `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION`
> - Test with real devices — emulator GPS can be unreliable

---

## 📝 Knowledge Check

<div class="quiz-container" data-quiz-id="ch23-q1" data-correct="b" data-explanation="UseMauiMaps() is called on the MauiAppBuilder in MauiProgram.cs to register the maps handler.">
<h4>Quiz 1: How do you enable Maps in a MAUI app?</h4>
<div class="quiz-options">
  <label><input type="radio" name="ch23-q1" value="a"> Add <code>&lt;uses-maps /&gt;</code> to XAML</label>
  <label><input type="radio" name="ch23-q1" value="b"> Call <code>.UseMauiMaps()</code> in MauiProgram.cs</label>
  <label><input type="radio" name="ch23-q1" value="c"> Install Maps from the App Store</label>
</div>
<div class="quiz-feedback"></div>
<button class="quiz-btn quiz-check-btn">Check Answer</button>
</div>

<div class="quiz-container" data-quiz-id="ch23-q2" data-correct="c" data-explanation="Geocoding.Default.GetPlacemarksAsync() takes coordinates and returns human-readable address information (Placemark objects).">
<h4>Quiz 2: Which API converts coordinates to a street address?</h4>
<div class="quiz-options">
  <label><input type="radio" name="ch23-q2" value="a"> <code>Geolocation.GetLocationAsync()</code></label>
  <label><input type="radio" name="ch23-q2" value="b"> <code>Geocoding.GetLocationsAsync()</code></label>
  <label><input type="radio" name="ch23-q2" value="c"> <code>Geocoding.GetPlacemarksAsync()</code></label>
</div>
<div class="quiz-feedback"></div>
<button class="quiz-btn quiz-check-btn">Check Answer</button>
</div>

<div class="quiz-container" data-quiz-id="ch23-q3" data-correct="a" data-explanation="GeolocationAccuracy.Medium provides 30-100m accuracy and is the best balance of accuracy and battery life for most apps.">
<h4>Quiz 3: Which accuracy level is best for battery-friendly location?</h4>
<div class="quiz-options">
  <label><input type="radio" name="ch23-q3" value="a"> <code>GeolocationAccuracy.Medium</code></label>
  <label><input type="radio" name="ch23-q3" value="b"> <code>GeolocationAccuracy.Best</code></label>
  <label><input type="radio" name="ch23-q3" value="c"> <code>GeolocationAccuracy.Lowest</code></label>
</div>
<div class="quiz-feedback"></div>
<button class="quiz-btn quiz-check-btn">Check Answer</button>
</div>

---

## 🏋️ Exercise: Build a Place Finder

Create a page that lets users search for an address and displays it on a map with a pin.

<details class="exercise">
<summary>Show Solution</summary>

**PlaceFinderPage.xaml:**

```xml
<ContentPage xmlns:maps="http://schemas.microsoft.com/dotnet/2021/maui/maps">
    <VerticalStackLayout Spacing="10" Padding="20">
        <SearchBar x:Name="searchBar"
                   Placeholder="Enter an address..."
                   SearchButtonPressed="OnSearch" />

        <maps:Map x:Name="map"
                  HeightRequest="400"
                  MapType="Street" />

        <Label x:Name="resultLabel"
               FontSize="14"
               TextColor="Gray" />
    </VerticalStackLayout>
</ContentPage>
```

**PlaceFinderPage.xaml.cs:**

```csharp
private async void OnSearch(object sender, EventArgs e)
{
    var address = searchBar.Text;
    if (string.IsNullOrWhiteSpace(address)) return;

    var locations = await Geocoding.Default.GetLocationsAsync(address);
    var location = locations?.FirstOrDefault();

    if (location != null)
    {
        map.Pins.Clear();
        map.Pins.Add(new Pin
        {
            Label = address,
            Location = location,
            Type = PinType.SearchResult
        });

        map.MoveToRegion(MapSpan.FromCenterAndRadius(
            location,
            Distance.FromKilometers(1)));

        resultLabel.Text = $"Found: {location.Latitude:F4}, {location.Longitude:F4}";
    }
    else
    {
        resultLabel.Text = "Address not found.";
    }
}
```

</details>

---

[← Chapter 22: Real-World Project]({% link docs/22-real-world-project.md %}) · [Chapter 24: Accessibility →]({% link docs/24-accessibility.md %})
