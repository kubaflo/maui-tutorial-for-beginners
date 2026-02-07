---
title: "Real-World Project: TaskFlow"
layout: default
nav_order: 22
parent: "📖 Lessons"
permalink: /docs/22-real-world-project/
---

# Capstone Project: TaskFlow — A Full-Featured Task Manager

## What You'll Build

A production-quality task management app called **TaskFlow** that combines everything you've learned across all 21 chapters into a single, polished application.

**Features:**
- 📝 Create, edit, and delete tasks with categories
- 🔍 Search and filter tasks
- 🌓 Light/dark theme support
- 💾 Local SQLite storage with sync-ready architecture
- 🔔 Local notifications for due dates
- 📱 Responsive design for phone, tablet, and desktop
- ♿ Full accessibility support
- 🚀 Optimized with Native AOT and compiled bindings

## Architecture Overview

```
TaskFlow/
├── Models/
│   ├── TaskItem.cs
│   └── Category.cs
├── ViewModels/
│   ├── TaskListViewModel.cs
│   ├── TaskDetailViewModel.cs
│   └── SettingsViewModel.cs
├── Views/
│   ├── TaskListPage.xaml
│   ├── TaskDetailPage.xaml
│   └── SettingsPage.xaml
├── Services/
│   ├── ITaskService.cs
│   ├── TaskService.cs
│   ├── IDatabaseService.cs
│   └── DatabaseService.cs
├── Resources/
│   ├── Styles/
│   └── Fonts/
├── MauiProgram.cs
└── App.xaml
```

## Step 1: Project Setup

```bash
dotnet new maui -n TaskFlow
cd TaskFlow
dotnet add package CommunityToolkit.Mvvm
dotnet add package CommunityToolkit.Maui
dotnet add package sqlite-net-pcl
dotnet add package SQLitePCLRaw.bundle_green
```

**`TaskFlow.csproj` — Add performance settings:**

```xml
<PropertyGroup>
  <IsAotCompatible>true</IsAotCompatible>
  <MauiXamlInflator>SourceGen</MauiXamlInflator>
</PropertyGroup>
```

## Step 2: Models

```csharp
using SQLite;

namespace TaskFlow.Models;

public class TaskItem
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }

    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? DueDate { get; set; }

    public bool IsCompleted { get; set; }

    public TaskPriority Priority { get; set; } = TaskPriority.Normal;

    public int CategoryId { get; set; }
}

public enum TaskPriority
{
    Low,
    Normal,
    High,
    Critical
}

public class Category
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }

    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public string ColorHex { get; set; } = "#7c3aed";

    public string Icon { get; set; } = "📋";
}
```

## Step 3: Database Service

```csharp
using SQLite;
using TaskFlow.Models;

namespace TaskFlow.Services;

public interface IDatabaseService
{
    Task<List<TaskItem>> GetTasksAsync();
    Task<List<TaskItem>> GetTasksByCategoryAsync(int categoryId);
    Task<TaskItem?> GetTaskAsync(int id);
    Task<int> SaveTaskAsync(TaskItem task);
    Task<int> DeleteTaskAsync(TaskItem task);
    Task<List<Category>> GetCategoriesAsync();
    Task<int> SaveCategoryAsync(Category category);
}

public class DatabaseService : IDatabaseService
{
    private SQLiteAsyncConnection? _database;

    private async Task<SQLiteAsyncConnection> GetDatabaseAsync()
    {
        if (_database is not null)
            return _database;

        var dbPath = Path.Combine(
            FileSystem.AppDataDirectory, "taskflow.db3");

        _database = new SQLiteAsyncConnection(dbPath);
        await _database.CreateTableAsync<TaskItem>();
        await _database.CreateTableAsync<Category>();

        // Seed default categories if empty
        var categories = await _database.Table<Category>().CountAsync();
        if (categories == 0)
        {
            await _database.InsertAllAsync(new[]
            {
                new Category { Name = "Personal", ColorHex = "#3b82f6", Icon = "🏠" },
                new Category { Name = "Work", ColorHex = "#ef4444", Icon = "💼" },
                new Category { Name = "Shopping", ColorHex = "#22c55e", Icon = "🛒" },
                new Category { Name = "Health", ColorHex = "#eab308", Icon = "❤️" }
            });
        }

        return _database;
    }

    public async Task<List<TaskItem>> GetTasksAsync()
    {
        var db = await GetDatabaseAsync();
        return await db.Table<TaskItem>()
            .OrderByDescending(t => t.Priority)
            .ThenBy(t => t.DueDate)
            .ToListAsync();
    }

    public async Task<List<TaskItem>> GetTasksByCategoryAsync(int categoryId)
    {
        var db = await GetDatabaseAsync();
        return await db.Table<TaskItem>()
            .Where(t => t.CategoryId == categoryId)
            .ToListAsync();
    }

    public async Task<TaskItem?> GetTaskAsync(int id)
    {
        var db = await GetDatabaseAsync();
        return await db.Table<TaskItem>()
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<int> SaveTaskAsync(TaskItem task)
    {
        var db = await GetDatabaseAsync();
        if (task.Id != 0)
            return await db.UpdateAsync(task);
        return await db.InsertAsync(task);
    }

    public async Task<int> DeleteTaskAsync(TaskItem task)
    {
        var db = await GetDatabaseAsync();
        return await db.DeleteAsync(task);
    }

    public async Task<List<Category>> GetCategoriesAsync()
    {
        var db = await GetDatabaseAsync();
        return await db.Table<Category>().ToListAsync();
    }

    public async Task<int> SaveCategoryAsync(Category category)
    {
        var db = await GetDatabaseAsync();
        if (category.Id != 0)
            return await db.UpdateAsync(category);
        return await db.InsertAsync(category);
    }
}
```

## Step 4: Task Service (Business Logic)

```csharp
using TaskFlow.Models;

namespace TaskFlow.Services;

public interface ITaskService
{
    Task<List<TaskItem>> GetAllTasksAsync();
    Task<List<TaskItem>> SearchTasksAsync(string query);
    Task<List<TaskItem>> GetOverdueTasksAsync();
    Task SaveTaskAsync(TaskItem task);
    Task CompleteTaskAsync(int taskId);
    Task DeleteTaskAsync(int taskId);
    Task<TaskStats> GetStatsAsync();
}

public record TaskStats(
    int Total,
    int Completed,
    int Overdue,
    int DueToday);

public class TaskService(IDatabaseService database) : ITaskService
{
    public async Task<List<TaskItem>> GetAllTasksAsync()
        => await database.GetTasksAsync();

    public async Task<List<TaskItem>> SearchTasksAsync(string query)
    {
        var tasks = await database.GetTasksAsync();
        if (string.IsNullOrWhiteSpace(query))
            return tasks;

        return tasks.Where(t =>
            t.Title.Contains(query, StringComparison.OrdinalIgnoreCase) ||
            t.Description.Contains(query, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public async Task<List<TaskItem>> GetOverdueTasksAsync()
    {
        var tasks = await database.GetTasksAsync();
        return tasks.Where(t =>
            !t.IsCompleted &&
            t.DueDate.HasValue &&
            t.DueDate.Value < DateTime.UtcNow)
            .ToList();
    }

    public async Task SaveTaskAsync(TaskItem task)
        => await database.SaveTaskAsync(task);

    public async Task CompleteTaskAsync(int taskId)
    {
        var task = await database.GetTaskAsync(taskId);
        if (task is null) return;

        task.IsCompleted = true;
        await database.SaveTaskAsync(task);
    }

    public async Task DeleteTaskAsync(int taskId)
    {
        var task = await database.GetTaskAsync(taskId);
        if (task is null) return;

        await database.DeleteTaskAsync(task);
    }

    public async Task<TaskStats> GetStatsAsync()
    {
        var tasks = await database.GetTasksAsync();
        var now = DateTime.UtcNow;
        var today = now.Date;

        return new TaskStats(
            Total: tasks.Count,
            Completed: tasks.Count(t => t.IsCompleted),
            Overdue: tasks.Count(t => !t.IsCompleted && t.DueDate < now),
            DueToday: tasks.Count(t => !t.IsCompleted && t.DueDate?.Date == today));
    }
}
```

## Step 5: ViewModels

### TaskListViewModel

```csharp
using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using TaskFlow.Models;
using TaskFlow.Services;

namespace TaskFlow.ViewModels;

public partial class TaskListViewModel : ObservableObject
{
    private readonly ITaskService _taskService;

    [ObservableProperty]
    private ObservableCollection<TaskItem> _tasks = [];

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private bool _isEmpty;

    [ObservableProperty]
    private string _searchQuery = string.Empty;

    [ObservableProperty]
    private TaskStats? _stats;

    public TaskListViewModel(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [RelayCommand]
    private async Task LoadTasksAsync()
    {
        if (IsLoading) return;

        try
        {
            IsLoading = true;
            var tasks = string.IsNullOrWhiteSpace(SearchQuery)
                ? await _taskService.GetAllTasksAsync()
                : await _taskService.SearchTasksAsync(SearchQuery);

            Tasks = new ObservableCollection<TaskItem>(tasks);
            IsEmpty = Tasks.Count == 0;
            Stats = await _taskService.GetStatsAsync();
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task CompleteTaskAsync(TaskItem task)
    {
        await _taskService.CompleteTaskAsync(task.Id);
        await LoadTasksAsync();
    }

    [RelayCommand]
    private async Task DeleteTaskAsync(TaskItem task)
    {
        await _taskService.DeleteTaskAsync(task.Id);
        await LoadTasksAsync();
    }

    [RelayCommand]
    private async Task GoToDetailAsync(TaskItem? task)
    {
        var route = task is null
            ? "detail"
            : $"detail?id={task.Id}";

        await Shell.Current.GoToAsync(route);
    }

    partial void OnSearchQueryChanged(string value)
    {
        // Debounce would be ideal here — for simplicity, search on change
        LoadTasksCommand.Execute(null);
    }
}
```

### TaskDetailViewModel

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using TaskFlow.Models;
using TaskFlow.Services;

namespace TaskFlow.ViewModels;

[QueryProperty(nameof(TaskId), "id")]
public partial class TaskDetailViewModel : ObservableObject
{
    private readonly ITaskService _taskService;
    private readonly IDatabaseService _databaseService;

    [ObservableProperty]
    private string _taskId = string.Empty;

    [ObservableProperty]
    private string _title = string.Empty;

    [ObservableProperty]
    private string _description = string.Empty;

    [ObservableProperty]
    private DateTime _dueDate = DateTime.Today.AddDays(1);

    [ObservableProperty]
    private TaskPriority _priority = TaskPriority.Normal;

    [ObservableProperty]
    private bool _isEditing;

    [ObservableProperty]
    private List<Category> _categories = [];

    [ObservableProperty]
    private Category? _selectedCategory;

    private TaskItem? _existingTask;

    public TaskDetailViewModel(ITaskService taskService, IDatabaseService databaseService)
    {
        _taskService = taskService;
        _databaseService = databaseService;
    }

    [RelayCommand]
    private async Task LoadAsync()
    {
        Categories = await _databaseService.GetCategoriesAsync();

        if (int.TryParse(TaskId, out var id))
        {
            _existingTask = await _databaseService.GetTaskAsync(id);
            if (_existingTask is not null)
            {
                Title = _existingTask.Title;
                Description = _existingTask.Description;
                DueDate = _existingTask.DueDate ?? DateTime.Today;
                Priority = _existingTask.Priority;
                SelectedCategory = Categories
                    .FirstOrDefault(c => c.Id == _existingTask.CategoryId);
                IsEditing = true;
            }
        }
    }

    [RelayCommand]
    private async Task SaveAsync()
    {
        var task = _existingTask ?? new TaskItem();
        task.Title = Title;
        task.Description = Description;
        task.DueDate = DueDate;
        task.Priority = Priority;
        task.CategoryId = SelectedCategory?.Id ?? 0;

        await _taskService.SaveTaskAsync(task);
        await Shell.Current.GoToAsync("..");
    }

    [RelayCommand]
    private async Task CancelAsync()
    {
        await Shell.Current.GoToAsync("..");
    }
}
```

## Step 6: Views (XAML)

### TaskListPage

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:TaskFlow.ViewModels"
             xmlns:models="clr-namespace:TaskFlow.Models"
             x:Class="TaskFlow.Views.TaskListPage"
             x:DataType="vm:TaskListViewModel"
             Title="TaskFlow">

    <Shell.SearchHandler>
        <SearchHandler Placeholder="Search tasks..."
                       Query="{Binding SearchQuery}"
                       SearchBoxVisibility="Collapsible" />
    </Shell.SearchHandler>

    <Grid RowDefinitions="Auto,*,Auto">
        <!-- Stats Bar -->
        <HorizontalStackLayout Spacing="15" Padding="15,10"
                               x:DataType="vm:TaskListViewModel">
            <Label Text="{Binding Stats.Total, StringFormat='{0} tasks'}"
                   FontSize="14" />
            <Label Text="{Binding Stats.Completed, StringFormat='✅ {0} done'}"
                   FontSize="14" TextColor="#22c55e" />
            <Label Text="{Binding Stats.Overdue, StringFormat='⚠️ {0} overdue'}"
                   FontSize="14" TextColor="#ef4444" />
        </HorizontalStackLayout>

        <!-- Task List -->
        <CollectionView Grid.Row="1"
                        ItemsSource="{Binding Tasks}"
                        ItemSizingStrategy="MeasureFirstItem"
                        SelectionMode="None"
                        EmptyView="No tasks yet. Tap + to create one!">

            <CollectionView.ItemTemplate>
                <DataTemplate x:DataType="models:TaskItem">
                    <SwipeView>
                        <SwipeView.RightItems>
                            <SwipeItems>
                                <SwipeItem Text="Delete"
                                           BackgroundColor="#ef4444"
                                           Command="{Binding Source={RelativeSource AncestorType={x:Type vm:TaskListViewModel}}, Path=DeleteTaskCommand}"
                                           CommandParameter="{Binding .}" />
                            </SwipeItems>
                        </SwipeView.RightItems>

                        <Grid ColumnDefinitions="Auto,*,Auto"
                              Padding="15,10" Margin="5"
                              BackgroundColor="Transparent">
                            <Grid.GestureRecognizers>
                                <TapGestureRecognizer
                                    Command="{Binding Source={RelativeSource AncestorType={x:Type vm:TaskListViewModel}}, Path=GoToDetailCommand}"
                                    CommandParameter="{Binding .}" />
                            </Grid.GestureRecognizers>

                            <CheckBox IsChecked="{Binding IsCompleted}"
                                      Color="#7c3aed"
                                      VerticalOptions="Center" />

                            <VerticalStackLayout Grid.Column="1"
                                                 VerticalOptions="Center"
                                                 Spacing="2">
                                <Label Text="{Binding Title}"
                                       FontSize="16"
                                       FontAttributes="Bold" />
                                <Label Text="{Binding DueDate, StringFormat='{0:MMM dd, yyyy}'}"
                                       FontSize="12"
                                       Opacity="0.7" />
                            </VerticalStackLayout>

                            <Border Grid.Column="2"
                                    StrokeShape="RoundRectangle 4"
                                    Padding="6,2"
                                    VerticalOptions="Center">
                                <Label Text="{Binding Priority}"
                                       FontSize="11" />
                            </Border>
                        </Grid>
                    </SwipeView>
                </DataTemplate>
            </CollectionView.ItemTemplate>
        </CollectionView>

        <!-- FAB -->
        <Button Grid.Row="2"
                Text="+ New Task"
                Command="{Binding GoToDetailCommand}"
                FontAttributes="Bold"
                Margin="15"
                CornerRadius="25"
                BackgroundColor="#7c3aed"
                TextColor="White" />
    </Grid>

</ContentPage>
```

## Step 7: Dependency Injection Setup

```csharp
using CommunityToolkit.Maui;
using TaskFlow.Services;
using TaskFlow.ViewModels;
using TaskFlow.Views;

namespace TaskFlow;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Services
        builder.Services.AddSingleton<IDatabaseService, DatabaseService>();
        builder.Services.AddSingleton<ITaskService, TaskService>();

        // ViewModels
        builder.Services.AddSingleton<TaskListViewModel>();
        builder.Services.AddTransient<TaskDetailViewModel>();
        builder.Services.AddTransient<SettingsViewModel>();

        // Pages
        builder.Services.AddSingleton<TaskListPage>();
        builder.Services.AddTransient<TaskDetailPage>();
        builder.Services.AddTransient<SettingsPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
```

## Step 8: Shell Navigation

```xml
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:views="clr-namespace:TaskFlow.Views"
       x:Class="TaskFlow.AppShell"
       FlyoutBehavior="Disabled">

    <TabBar>
        <ShellContent Title="Tasks"
                      Icon="tasks_icon.png"
                      ContentTemplate="{DataTemplate views:TaskListPage}"
                      Route="tasks" />

        <ShellContent Title="Settings"
                      Icon="settings_icon.png"
                      ContentTemplate="{DataTemplate views:SettingsPage}"
                      Route="settings" />
    </TabBar>

</Shell>
```

**Register the detail route in `AppShell.xaml.cs`:**

```csharp
public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        Routing.RegisterRoute("detail", typeof(TaskDetailPage));
    }
}
```

## Step 9: Adding Polish

### Swipe-to-Complete Animation

```csharp
[RelayCommand]
private async Task CompleteTaskAsync(TaskItem task)
{
    // Find the visual element and animate it
    await _taskService.CompleteTaskAsync(task.Id);

    // Refresh with animation
    await Task.Delay(300); // Let the swipe animation finish
    await LoadTasksAsync();
}
```

### Empty State

```xml
<CollectionView.EmptyView>
    <VerticalStackLayout HorizontalOptions="Center"
                         VerticalOptions="Center"
                         Spacing="10">
        <Label Text="📋" FontSize="64"
               HorizontalOptions="Center" />
        <Label Text="No tasks yet"
               FontSize="20" FontAttributes="Bold"
               HorizontalOptions="Center" />
        <Label Text="Tap the + button to create your first task"
               FontSize="14" Opacity="0.7"
               HorizontalOptions="Center" />
    </VerticalStackLayout>
</CollectionView.EmptyView>
```

## ✅ What You've Built

Congratulations! You've built a complete, production-quality MAUI app that uses:

- ✅ **MVVM** with CommunityToolkit.Mvvm source generators
- ✅ **Dependency Injection** for all services and ViewModels
- ✅ **Shell Navigation** with query parameters
- ✅ **SQLite** local storage with async operations
- ✅ **CollectionView** with swipe actions and empty states
- ✅ **Compiled Bindings** with `x:DataType`
- ✅ **Search** via Shell SearchHandler
- ✅ **Native AOT** ready with `IsAotCompatible`

---

## 📝 Final Quiz

<div class="quiz-container" data-quiz-id="ch22-q1" data-correct="c" data-explanation="Primary constructors (C# 12) like TaskService(IDatabaseService database) combine the constructor parameter declaration with the class declaration.">
  <h3>Question 1</h3>
  <p class="quiz-question">In the TaskService class, what C# feature simplifies the constructor?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch22-q1" value="a"> Record types</label></li>
    <li><label><input type="radio" name="ch22-q1" value="b"> Static abstract members</label></li>
    <li><label><input type="radio" name="ch22-q1" value="c"> Primary constructors</label></li>
    <li><label><input type="radio" name="ch22-q1" value="d"> Required members</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch22-q2" data-correct="b" data-explanation="Transient services create a new instance each time they're requested, which is ideal for detail pages that need fresh state.">
  <h3>Question 2</h3>
  <p class="quiz-question">Why is TaskDetailPage registered as Transient while TaskListPage is Singleton?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch22-q2" value="a"> Transient pages load faster</label></li>
    <li><label><input type="radio" name="ch22-q2" value="b"> Detail pages need fresh state for each navigation, while the list persists</label></li>
    <li><label><input type="radio" name="ch22-q2" value="c"> Singleton pages cannot use Shell navigation</label></li>
    <li><label><input type="radio" name="ch22-q2" value="d"> It's a MAUI framework requirement</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

<div class="quiz-container" data-quiz-id="ch22-q3" data-correct="a" data-explanation="ObservableProperty generates INotifyPropertyChanged boilerplate, and RelayCommand generates ICommand implementations — both via source generators.">
  <h3>Question 3</h3>
  <p class="quiz-question">What do [ObservableProperty] and [RelayCommand] attributes do?</p>
  <ul class="quiz-options">
    <li><label><input type="radio" name="ch22-q3" value="a"> Generate INotifyPropertyChanged and ICommand implementations via source generators</label></li>
    <li><label><input type="radio" name="ch22-q3" value="b"> Enable data binding at runtime via reflection</label></li>
    <li><label><input type="radio" name="ch22-q3" value="c"> Register the ViewModel with the DI container automatically</label></li>
    <li><label><input type="radio" name="ch22-q3" value="d"> Create database columns matching the properties</label></li>
  </ul>
  <button class="quiz-btn">Check Answer</button>
  <div class="quiz-feedback"></div>
</div>

## 🏋️ Extension Challenges

<div class="exercise-container">
  <span class="exercise-badge">Advanced</span>
  <h3>💪 Keep Building!</h3>
  <p>Extend TaskFlow with these features:</p>
  <ol>
    <li><span class="difficulty-badge intermediate">Intermediate</span> Add recurring tasks (daily, weekly, monthly)</li>
    <li><span class="difficulty-badge intermediate">Intermediate</span> Implement a dashboard with charts using MAUI Graphics</li>
    <li><span class="difficulty-badge advanced">Advanced</span> Add cloud sync with a REST API</li>
    <li><span class="difficulty-badge advanced">Advanced</span> Implement push notifications for task reminders</li>
    <li><span class="difficulty-badge advanced">Advanced</span> Add a HybridWebView analytics dashboard</li>
  </ol>
</div>

---

**Previous:** [← 21 — Native AOT & Performance](/docs/21-native-aot-performance/) · **Next:** [23 — Maps & Location →](/docs/23-maps-location/)
