---
title: "Publishing & Deployment"
layout: default
nav_order: 11
permalink: /docs/11-publishing-deployment/
---

# Publishing & Deployment

## What You'll Learn

- Prepare your app for release
- Publish to Google Play Store (Android)
- Publish to Apple App Store (iOS)
- Publish to Microsoft Store (Windows)
- Create a macOS distributable

## Preparing for Release

### 1. Update App Information

In your `.csproj` file:

```xml
<PropertyGroup>
    <ApplicationTitle>My MAUI App</ApplicationTitle>
    <ApplicationId>com.kubaflo.mymauiapp</ApplicationId>
    <ApplicationDisplayVersion>1.0.0</ApplicationDisplayVersion>
    <ApplicationVersion>1</ApplicationVersion>
</PropertyGroup>
```

### 2. Use Async Animation APIs (.NET 10)

Older animation methods (`FadeTo`, `ScaleTo`, etc.) are deprecated in .NET 10. Use their `Async` variants:

```csharp
// ❌ Deprecated
await myView.FadeTo(1.0, 500);

// ✅ New
await myView.FadeToAsync(1.0, 500);
await myView.ScaleToAsync(1.2, 300);
```

### 2. Set App Icons

Place your app icon SVG in `Resources/AppIcon/`:

```xml
<!-- .csproj -->
<MauiIcon Include="Resources\AppIcon\appicon.svg"
          ForegroundFile="Resources\AppIcon\appiconfg.svg"
          Color="#512BD4" />
```

### 3. Set Splash Screen

```xml
<MauiSplashScreen Include="Resources\Splash\splash.svg"
                   Color="#512BD4"
                   BaseSize="128,128" />
```

### 4. Remove Debug Code

Ensure debug-only code is wrapped:

```csharp
#if DEBUG
builder.Logging.AddDebug();
#endif
```

### 5. Consider Native AOT (iOS)

.NET 10 officially supports **Native AOT** for iOS, reducing app size and improving startup time:

```xml
<PropertyGroup Condition="$(TargetFramework.Contains('-ios')) and '$(Configuration)' == 'Release'">
    <PublishAot>true</PublishAot>
</PropertyGroup>
```

> ⚠️ Native AOT requires all XAML and bindings to be compiled. Ensure `x:DataType` is set on all pages.

## Android — Google Play Store

### 1. Create a Keystore

```bash
keytool -genkeypair -v -keystore myapp.keystore \
  -alias myapp -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing in `.csproj`

```xml
<PropertyGroup Condition="$(TargetFramework.Contains('-android')) and '$(Configuration)' == 'Release'">
    <AndroidKeyStore>true</AndroidKeyStore>
    <AndroidSigningKeyStore>myapp.keystore</AndroidSigningKeyStore>
    <AndroidSigningKeyAlias>myapp</AndroidSigningKeyAlias>
    <AndroidSigningKeyPass>your-key-password</AndroidSigningKeyPass>
    <AndroidSigningStorePass>your-store-password</AndroidSigningStorePass>
</PropertyGroup>
```

> ⚠️ **Don't commit passwords to source control.** Use environment variables or CI/CD secrets.

### 3. Build the Release AAB

```bash
dotnet publish -f net10.0-android -c Release
```

The `.aab` file will be in `bin/Release/net8.0-android/publish/`.

### 4. Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Upload the `.aab` file under **Production → Create new release**
4. Fill in the store listing (screenshots, description, etc.)
5. Submit for review

## iOS — Apple App Store

### Prerequisites

- Mac with Xcode installed
- Apple Developer account ($99/year)
- Valid provisioning profile and signing certificate

### 1. Configure Signing

In `Platforms/iOS/Info.plist`, ensure your bundle ID matches your Apple Developer account.

### 2. Build for Release

```bash
dotnet publish -f net10.0-ios -c Release \
  -p:ArchiveOnBuild=true \
  -p:RuntimeIdentifier=ios-arm64 \
  -p:CodesignKey="Apple Distribution: Your Name (TEAMID)" \
  -p:CodesignProvision="Your Provisioning Profile"
```

### 3. Upload via Xcode or Transporter

1. Open the `.ipa` in **Xcode → Organizer** or **Transporter**
2. Upload to App Store Connect
3. Fill in app metadata and screenshots
4. Submit for review

## Windows — Microsoft Store

### 1. Create an MSIX Package

```bash
dotnet publish -f net10.0-windows10.0.19041.0 -c Release
```

### 2. Configure Package Identity

In `Platforms/Windows/Package.appxmanifest`:

```xml
<Identity Name="com.kubaflo.mymauiapp"
          Publisher="CN=YourPublisher"
          Version="1.0.0.0" />
```

### 3. Publish to Microsoft Store

1. Go to [Partner Center](https://partner.microsoft.com/)
2. Create a new app submission
3. Upload the `.msix` package
4. Submit for certification

## macOS — Distribution

### Build for Mac Catalyst

```bash
dotnet publish -f net10.0-maccatalyst -c Release
```

You can distribute via:

- **Mac App Store** (requires Apple Developer account)
- **Direct download** (`.app` or `.pkg` — requires notarization)

### Notarization (Direct Distribution)

```bash
xcrun notarytool submit MyApp.pkg \
  --apple-id your@email.com \
  --team-id TEAMID \
  --password app-specific-password \
  --wait
```

## CI/CD Tips

### GitHub Actions Example

```yaml
name: Build MAUI App

on:
  push:
    branches: [main]

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - run: dotnet workload install maui-android
      - run: dotnet publish -f net10.0-android -c Release
      - uses: actions/upload-artifact@v4
        with:
          name: android-build
          path: '**/publish/*.aab'

  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - run: dotnet workload install maui
      - run: dotnet publish -f net10.0-ios -c Release -p:ArchiveOnBuild=true
```

## ✅ Congratulations!

You've completed the entire .NET MAUI tutorial! You now know how to:

1. ✅ Set up a MAUI development environment
2. ✅ Build UIs with XAML, layouts, and controls
3. ✅ Architect apps with MVVM and data binding
4. ✅ Navigate between pages
5. ✅ Style and theme your app
6. ✅ Write platform-specific code and use HybridWebView
7. ✅ Connect to REST APIs
8. ✅ Persist data locally
9. ✅ Publish to app stores with Native AOT support

## What's Next?

- 📖 [Official .NET MAUI Documentation](https://learn.microsoft.com/dotnet/maui/)
- 🎓 [.NET MAUI Workshop (GitHub)](https://github.com/dotnet-presentations/dotnet-maui-workshop)
- 📦 [Awesome .NET MAUI (GitHub)](https://github.com/jsuarezruiz/awesome-dotnet-maui)
- 💬 [.NET MAUI Community](https://dotnet.microsoft.com/platform/community)

---

**Previous:** [← 10 — Local Storage](../10-Local-Storage/README.md) · **Next:** [12 — Animations →](../12-Animations/README.md)
