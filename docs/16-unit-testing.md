---
title: "Unit Testing"
layout: default
nav_order: 16
permalink: /docs/16-unit-testing/
---

# Unit Testing

## What You'll Learn

- Set up a test project for .NET MAUI
- Test ViewModels with xUnit
- Mock services with NSubstitute
- Test commands, async methods, and data binding

## Project Setup

### 1. Create a Test Project

```bash
dotnet new xunit -n HelloMaui.Tests
cd HelloMaui.Tests
```

### 2. Add Dependencies

```bash
dotnet add reference ../HelloMaui/HelloMaui.csproj
dotnet add package NSubstitute
dotnet add package FluentAssertions
```

### 3. Update Target Framework

In `HelloMaui.Tests.csproj`:

```xml
<PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
</PropertyGroup>
```

Make sure your MAUI class library also targets `net10.0`:

```xml
<!-- In the MAUI project .csproj -->
<TargetFrameworks>net10.0;net10.0-android;net10.0-ios;net10.0-maccatalyst</TargetFrameworks>
```

## Testing ViewModels

### Basic ViewModel Test

```csharp
using FluentAssertions;
using HelloMaui.ViewModels;

namespace HelloMaui.Tests;

public class UserViewModelTests
{
    [Fact]
    public void Greet_SetsGreetingMessage()
    {
        // Arrange
        var vm = new UserViewModel { Name = "Alice" };

        // Act
        vm.GreetCommand.Execute(null);

        // Assert
        vm.Greeting.Should().Be("Hello, Alice!");
    }

    [Fact]
    public void Name_DefaultsToEmpty()
    {
        var vm = new UserViewModel();
        vm.Name.Should().BeEmpty();
    }
}
```

### Testing with Mocked Services

```csharp
using NSubstitute;
using HelloMaui.Services;
using HelloMaui.ViewModels;
using HelloMaui.Models;

public class PostsViewModelTests
{
    private readonly IPostService _postService;
    private readonly PostsViewModel _viewModel;

    public PostsViewModelTests()
    {
        _postService = Substitute.For<IPostService>();
        _viewModel = new PostsViewModel(_postService);
    }

    [Fact]
    public async Task LoadPosts_PopulatesList()
    {
        // Arrange
        var fakePosts = new List<Post>
        {
            new() { Id = 1, Title = "First Post", Body = "Content" },
            new() { Id = 2, Title = "Second Post", Body = "More content" }
        };

        _postService.GetPostsAsync().Returns(fakePosts);

        // Act
        await _viewModel.LoadPostsCommand.ExecuteAsync(null);

        // Assert
        _viewModel.Posts.Should().HaveCount(2);
        _viewModel.Posts[0].Title.Should().Be("First Post");
        _viewModel.IsLoading.Should().BeFalse();
        _viewModel.ErrorMessage.Should().BeNull();
    }

    [Fact]
    public async Task LoadPosts_OnNetworkError_SetsErrorMessage()
    {
        // Arrange
        _postService.GetPostsAsync()
            .ThrowsAsync(new HttpRequestException("Network error"));

        // Act
        await _viewModel.LoadPostsCommand.ExecuteAsync(null);

        // Assert
        _viewModel.Posts.Should().BeEmpty();
        _viewModel.ErrorMessage.Should().Contain("Network error");
    }
}
```

## Testing Observable Properties

Verify that `PropertyChanged` fires correctly:

```csharp
[Fact]
public void Name_RaisesPropertyChanged()
{
    // Arrange
    var vm = new UserViewModel();
    var propertyNames = new List<string>();
    vm.PropertyChanged += (s, e) => propertyNames.Add(e.PropertyName!);

    // Act
    vm.Name = "Bob";

    // Assert
    propertyNames.Should().Contain("Name");
}
```

## Testing ObservableCollection Changes

```csharp
[Fact]
public async Task AddItem_AddsToCollection()
{
    // Arrange
    var db = Substitute.For<IDatabaseService>();
    db.SaveItemAsync(Arg.Any<TodoItem>()).Returns(1);

    var vm = new TodoViewModel(db) { NewTitle = "Buy groceries" };

    // Act
    await vm.AddItemCommand.ExecuteAsync(null);

    // Assert
    vm.Items.Should().ContainSingle(i => i.Title == "Buy groceries");
    vm.NewTitle.Should().BeEmpty(); // Cleared after adding
}
```

## Testing Navigation

Mock Shell.Current for navigation tests:

```csharp
[Fact]
public async Task GoToDetails_NavigatesWithParameters()
{
    // For navigation testing, consider using an INavigationService
    // abstraction that wraps Shell.Current.GoToAsync()

    var navService = Substitute.For<INavigationService>();
    var vm = new HomeViewModel(navService);
    var item = new Item { Id = 42, Name = "Test" };

    // Act
    await vm.GoToDetailsCommand.ExecuteAsync(item);

    // Assert
    await navService.Received(1).GoToAsync(
        "details",
        Arg.Is<Dictionary<string, object>>(d => d.ContainsKey("Item")));
}
```

## Running Tests

```bash
# Run all tests
dotnet test

# Run with verbose output
dotnet test --verbosity normal

# Run a specific test class
dotnet test --filter "FullyQualifiedName~PostsViewModelTests"

# Run with code coverage
dotnet test --collect:"XPlat Code Coverage"
```

## Test Organization Tips

```
HelloMaui.Tests/
├── ViewModels/
│   ├── UserViewModelTests.cs
│   ├── PostsViewModelTests.cs
│   └── TodoViewModelTests.cs
├── Services/
│   ├── PostServiceTests.cs
│   └── DatabaseServiceTests.cs
└── Helpers/
    └── TestDataFactory.cs
```

## ✅ Checkpoint

You can now write unit tests for your ViewModels and services with mocking and assertions. Next, we'll explore MAUI Blazor Hybrid apps.

---

**Previous:** [← 15 — Dependency Injection](../15-Dependency-Injection/README.md) · **Next:** [17 — MAUI Blazor Hybrid →](../17-MAUI-Blazor-Hybrid/README.md)
