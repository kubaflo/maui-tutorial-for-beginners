---
title: "Working with APIs"
layout: default
nav_order: 9
parent: "📖 Lessons"
permalink: /docs/09-working-with-apis/
---

# Working with APIs

## What You'll Learn

- Use `HttpClient` to consume REST APIs
- Deserialize JSON with `System.Text.Json`
- Display API data in the UI
- Handle loading states and errors

## Setting Up HttpClient

### 1. Configure in MauiProgram.cs

```csharp
builder.Services.AddHttpClient("api", client =>
{
    client.BaseAddress = new Uri("https://jsonplaceholder.typicode.com/");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});
```

### 2. Create a Service

```csharp
// Services/IPostService.cs
namespace HelloMaui.Services;

public interface IPostService
{
    Task<List<Post>> GetPostsAsync();
    Task<Post?> GetPostAsync(int id);
}
```

```csharp
// Models/Post.cs
using System.Text.Json.Serialization;

namespace HelloMaui.Models;

public class Post
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("userId")]
    public int UserId { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("body")]
    public string Body { get; set; } = string.Empty;
}
```

```csharp
// Services/PostService.cs
using System.Net.Http.Json;
using HelloMaui.Models;

namespace HelloMaui.Services;

public class PostService : IPostService
{
    private readonly HttpClient _httpClient;

    public PostService(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient("api");
    }

    public async Task<List<Post>> GetPostsAsync()
    {
        var posts = await _httpClient.GetFromJsonAsync<List<Post>>("posts");
        return posts ?? new List<Post>();
    }

    public async Task<Post?> GetPostAsync(int id)
    {
        return await _httpClient.GetFromJsonAsync<Post>($"posts/{id}");
    }
}
```

### 3. Register the Service

```csharp
// MauiProgram.cs
builder.Services.AddSingleton<IPostService, PostService>();
```

## Building the ViewModel

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using HelloMaui.Models;
using HelloMaui.Services;
using System.Collections.ObjectModel;

namespace HelloMaui.ViewModels;

public partial class PostsViewModel : ObservableObject
{
    private readonly IPostService _postService;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    public ObservableCollection<Post> Posts { get; } = new();

    public PostsViewModel(IPostService postService)
    {
        _postService = postService;
    }

    [RelayCommand]
    private async Task LoadPosts()
    {
        if (IsLoading) return;

        try
        {
            IsLoading = true;
            ErrorMessage = null;

            var posts = await _postService.GetPostsAsync();

            Posts.Clear();
            foreach (var post in posts)
            {
                Posts.Add(post);
            }
        }
        catch (HttpRequestException ex)
        {
            ErrorMessage = $"Network error: {ex.Message}";
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }
}
```

## Building the View

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:HelloMaui.ViewModels"
             x:Class="HelloMaui.Views.PostsPage"
             x:DataType="vm:PostsViewModel"
             Title="Posts">

    <Grid RowDefinitions="Auto,*">

        <!-- Error message -->
        <Label Text="{Binding ErrorMessage}"
               TextColor="Red"
               IsVisible="{Binding ErrorMessage, Converter={StaticResource IsNotNullConverter}}"
               Padding="10"
               Grid.Row="0" />

        <!-- Loading indicator -->
        <ActivityIndicator IsRunning="{Binding IsLoading}"
                           IsVisible="{Binding IsLoading}"
                           HorizontalOptions="Center"
                           VerticalOptions="Center"
                           Grid.Row="1" />

        <!-- Posts list -->
        <CollectionView ItemsSource="{Binding Posts}"
                        Grid.Row="1">
            <CollectionView.ItemTemplate>
                <DataTemplate x:DataType="models:Post">
                    <Frame Margin="10,5" Padding="15" CornerRadius="8">
                        <VerticalStackLayout Spacing="5">
                            <Label Text="{Binding Title}"
                                   FontAttributes="Bold"
                                   FontSize="16"
                                   LineBreakMode="TailTruncation" />
                            <Label Text="{Binding Body}"
                                   MaxLines="2"
                                   FontSize="13"
                                   TextColor="Gray" />
                        </VerticalStackLayout>
                    </Frame>
                </DataTemplate>
            </CollectionView.ItemTemplate>

            <CollectionView.EmptyView>
                <Label Text="No posts loaded. Pull to refresh!"
                       HorizontalOptions="Center"
                       VerticalOptions="Center" />
            </CollectionView.EmptyView>
        </CollectionView>

        <!-- Refresh -->
        <RefreshView Command="{Binding LoadPostsCommand}"
                     IsRefreshing="{Binding IsLoading}"
                     Grid.Row="1">
            <!-- Wrap the CollectionView here in a real app -->
        </RefreshView>
    </Grid>

</ContentPage>
```

### Load Data on Page Appearing

```csharp
public partial class PostsPage : ContentPage
{
    private readonly PostsViewModel _viewModel;

    public PostsPage(PostsViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = _viewModel = viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        if (_viewModel.Posts.Count == 0)
        {
            await _viewModel.LoadPostsCommand.ExecuteAsync(null);
        }
    }
}
```

## Android Network Security

For Android, allow cleartext traffic (for development) in `Platforms/Android/AndroidManifest.xml`:

```xml
<application android:usesCleartextTraffic="true" ... />
```

For production, always use HTTPS.

## POST / PUT / DELETE Requests

```csharp
// POST
var newPost = new Post { Title = "New Post", Body = "Content", UserId = 1 };
var response = await _httpClient.PostAsJsonAsync("posts", newPost);
var created = await response.Content.ReadFromJsonAsync<Post>();

// PUT
await _httpClient.PutAsJsonAsync($"posts/{id}", updatedPost);

// DELETE
await _httpClient.DeleteAsync($"posts/{id}");
```

## ✅ Checkpoint

You can now fetch and display data from REST APIs with proper loading and error handling. Next, we'll learn how to store data locally.

---

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch09-q1" data-correct="d" data-explanation="HttpClient should be registered as a Singleton (or use IHttpClientFactory) because creating new instances per request can exhaust socket connections.">
  <h3>Question 1</h3>
  <p class="quiz-question">What is the recommended lifetime for HttpClient in a MAUI app?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch09-q1" value="a"> Transient — new instance per request</label></li>
    <li><label><input type="radio" name="ch09-q1" value="b"> Scoped — per navigation scope</label></li>
    <li><label><input type="radio" name="ch09-q1" value="c"> Create with <code>new HttpClient()</code> each time</label></li>
    <li><label><input type="radio" name="ch09-q1" value="d"> Singleton or via IHttpClientFactory</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch09-q2" data-correct="a" data-explanation="GetFromJsonAsync deserializes the JSON response directly into a typed object, combining the HTTP call and deserialization.">
  <h3>Question 2</h3>
  <p class="quiz-question">Which method simplifies fetching and deserializing JSON from an API?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch09-q2" value="a"> <code>httpClient.GetFromJsonAsync&lt;T&gt;()</code></label></li>
    <li><label><input type="radio" name="ch09-q2" value="b"> <code>httpClient.GetStringAsync()</code> then manual parsing</label></li>
    <li><label><input type="radio" name="ch09-q2" value="c"> <code>httpClient.DownloadJson&lt;T&gt;()</code></label></li>
    <li><label><input type="radio" name="ch09-q2" value="d"> <code>JsonSerializer.DeserializeStream()</code></label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Weather App

<div class="exercise-container">
  <span class="exercise-badge">Intermediate</span>
  <h3>💻 Build a Weather Display</h3>
  <p>Create a page that fetches weather data from a public API:</p>
  <ol>
    <li>Use <code>IHttpClientFactory</code> registered in DI</li>
    <li>Display a loading indicator with <code>ActivityIndicator</code></li>
    <li>Show temperature, condition, and an icon</li>
    <li>Handle errors gracefully with a retry button</li>
  </ol>

  <details class="solution">
    <summary>💡 View Solution Skeleton</summary>

```csharp
public partial class WeatherViewModel : ObservableObject
{
    private readonly HttpClient _http;

    [ObservableProperty] private bool _isLoading;
    [ObservableProperty] private string _temperature = "--°";
    [ObservableProperty] private string _condition = "Loading...";
    [ObservableProperty] private string _errorMessage = string.Empty;

    public WeatherViewModel(IHttpClientFactory httpFactory)
    {
        _http = httpFactory.CreateClient("weather");
    }

    [RelayCommand]
    private async Task LoadWeatherAsync()
    {
        try
        {
            IsLoading = true;
            ErrorMessage = string.Empty;
            var data = await _http.GetFromJsonAsync<WeatherResponse>("current.json?q=London");
            Temperature = $"{data?.Current.TempC}°C";
            Condition = data?.Current.Condition.Text ?? "Unknown";
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Failed to load: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }
}
```

  </details>
</div>

---

**Previous:** [← 08 — Platform-Specific Code](/docs/08-platform-specific-code/) · **Next:** [10 — Local Storage →](/docs/10-local-storage/)
