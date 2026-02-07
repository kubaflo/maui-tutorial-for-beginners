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

## 📝 Quiz

<div class="quiz-container" data-quiz-id="ch16-q1" data-correct="a" data-explanation="Since ViewModels are plain C# classes with no MAUI dependencies (when using interfaces), they can be unit tested with standard xUnit.">
  <h3>Question 1</h3>
  <p class="quiz-question">Why are ViewModels the easiest part of a MAUI app to unit test?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch16-q1" value="a"> They are plain C# classes with no direct UI framework dependencies</label></li>
    <li><label><input type="radio" name="ch16-q1" value="b"> MAUI provides built-in test helpers for ViewModels</label></li>
    <li><label><input type="radio" name="ch16-q1" value="c"> ViewModels run on a special test thread</label></li>
    <li><label><input type="radio" name="ch16-q1" value="d"> xUnit has MAUI-specific assertions</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch16-q2" data-correct="c" data-explanation="Mocking frameworks like NSubstitute create fake implementations of interfaces, so you can test ViewModels in isolation.">
  <h3>Question 2</h3>
  <p class="quiz-question">What is the purpose of NSubstitute (or Moq) in MAUI unit testing?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch16-q2" value="a"> To generate test data automatically</label></li>
    <li><label><input type="radio" name="ch16-q2" value="b"> To run tests on physical devices</label></li>
    <li><label><input type="radio" name="ch16-q2" value="c"> To create fake implementations of interfaces for isolated testing</label></li>
    <li><label><input type="radio" name="ch16-q2" value="d"> To measure code coverage</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Exercise: Test a ViewModel

<div class="exercise-container">
  <span class="exercise-badge">Intermediate</span>
  <h3>💻 Write Tests for a Todo ViewModel</h3>
  <p>Given this ViewModel, write xUnit tests for:</p>
  <ol>
    <li><code>AddTodoCommand</code> — adds a task when title is not empty</li>
    <li><code>AddTodoCommand</code> — does NOT add a task when title is empty</li>
    <li><code>DeleteTodoCommand</code> — removes the specified task</li>
    <li><code>CompleteTodoCommand</code> — marks the task as completed</li>
  </ol>

```csharp
// The ViewModel to test
public partial class TodoViewModel : ObservableObject
{
    private readonly ITodoService _service;

    [ObservableProperty] private string _newTitle = string.Empty;
    public ObservableCollection<TodoItem> Todos { get; } = [];

    public TodoViewModel(ITodoService service) => _service = service;

    [RelayCommand]
    private async Task AddTodoAsync()
    {
        if (string.IsNullOrWhiteSpace(NewTitle)) return;
        var todo = new TodoItem { Title = NewTitle };
        await _service.SaveAsync(todo);
        Todos.Add(todo);
        NewTitle = string.Empty;
    }

    [RelayCommand]
    private async Task DeleteTodoAsync(TodoItem todo)
    {
        await _service.DeleteAsync(todo.Id);
        Todos.Remove(todo);
    }
}
```

  <details class="solution">
    <summary>💡 View Test Solution</summary>

```csharp
public class TodoViewModelTests
{
    private readonly ITodoService _mockService;
    private readonly TodoViewModel _vm;

    public TodoViewModelTests()
    {
        _mockService = Substitute.For<ITodoService>();
        _vm = new TodoViewModel(_mockService);
    }

    [Fact]
    public async Task AddTodo_WithTitle_AddsToCollection()
    {
        _vm.NewTitle = "Buy groceries";

        await _vm.AddTodoCommand.ExecuteAsync(null);

        Assert.Single(_vm.Todos);
        Assert.Equal("Buy groceries", _vm.Todos[0].Title);
        Assert.Equal(string.Empty, _vm.NewTitle);
        await _mockService.Received(1).SaveAsync(Arg.Any<TodoItem>());
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public async Task AddTodo_EmptyTitle_DoesNotAdd(string? title)
    {
        _vm.NewTitle = title ?? string.Empty;

        await _vm.AddTodoCommand.ExecuteAsync(null);

        Assert.Empty(_vm.Todos);
        await _mockService.DidNotReceive().SaveAsync(Arg.Any<TodoItem>());
    }

    [Fact]
    public async Task DeleteTodo_RemovesFromCollection()
    {
        var todo = new TodoItem { Id = 1, Title = "Test" };
        _vm.Todos.Add(todo);

        await _vm.DeleteTodoCommand.ExecuteAsync(todo);

        Assert.Empty(_vm.Todos);
        await _mockService.Received(1).DeleteAsync(1);
    }
}
```

  </details>
</div>

---

**Previous:** [← 15 — Dependency Injection](../15-Dependency-Injection/README.md) · **Next:** [17 — MAUI Blazor Hybrid →](../17-MAUI-Blazor-Hybrid/README.md)
