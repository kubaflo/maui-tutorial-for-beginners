# 10 — Local Storage

## What You'll Learn

- Store simple key-value data with `Preferences`
- Use `SecureStorage` for sensitive data
- Persist structured data with SQLite
- Read and write files

## Preferences (Key-Value Storage)

Perfect for settings, flags, and simple values:

```csharp
// Save
Preferences.Default.Set("username", "kubaflo");
Preferences.Default.Set("is_dark_mode", true);
Preferences.Default.Set("font_size", 16);

// Read (with default fallback)
string username = Preferences.Default.Get("username", "Guest");
bool isDarkMode = Preferences.Default.Get("is_dark_mode", false);
int fontSize = Preferences.Default.Get("font_size", 14);

// Check if a key exists
bool hasKey = Preferences.Default.ContainsKey("username");

// Remove
Preferences.Default.Remove("username");

// Clear all
Preferences.Default.Clear();
```

## SecureStorage

For sensitive data like tokens and passwords (uses Keychain on iOS, Keystore on Android):

```csharp
// Save
await SecureStorage.Default.SetAsync("auth_token", "eyJhbGci...");

// Read
string? token = await SecureStorage.Default.GetAsync("auth_token");

// Remove
bool removed = SecureStorage.Default.Remove("auth_token");

// Remove all
SecureStorage.Default.RemoveAll();
```

> ⚠️ `SecureStorage` is not available on all platforms in the same way. Always handle `null` returns.

## SQLite (Structured Data)

For complex, queryable data, use SQLite with the `sqlite-net-pcl` NuGet package.

### 1. Install the Package

```bash
dotnet add package sqlite-net-pcl
dotnet add package SQLitePCLRaw.bundle_green
```

### 2. Define a Model

```csharp
using SQLite;

namespace HelloMaui.Models;

public class TodoItem
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }

    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

### 3. Create a Database Service

```csharp
using SQLite;
using HelloMaui.Models;

namespace HelloMaui.Services;

public class DatabaseService
{
    private SQLiteAsyncConnection? _database;

    private async Task<SQLiteAsyncConnection> GetDatabaseAsync()
    {
        if (_database != null)
            return _database;

        var dbPath = Path.Combine(
            FileSystem.AppDataDirectory, "todos.db3");

        _database = new SQLiteAsyncConnection(dbPath);
        await _database.CreateTableAsync<TodoItem>();

        return _database;
    }

    public async Task<List<TodoItem>> GetItemsAsync()
    {
        var db = await GetDatabaseAsync();
        return await db.Table<TodoItem>()
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<TodoItem>> GetPendingItemsAsync()
    {
        var db = await GetDatabaseAsync();
        return await db.Table<TodoItem>()
            .Where(t => !t.IsCompleted)
            .ToListAsync();
    }

    public async Task<TodoItem?> GetItemAsync(int id)
    {
        var db = await GetDatabaseAsync();
        return await db.Table<TodoItem>()
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<int> SaveItemAsync(TodoItem item)
    {
        var db = await GetDatabaseAsync();
        if (item.Id != 0)
            return await db.UpdateAsync(item);
        else
            return await db.InsertAsync(item);
    }

    public async Task<int> DeleteItemAsync(TodoItem item)
    {
        var db = await GetDatabaseAsync();
        return await db.DeleteAsync(item);
    }
}
```

### 4. Register and Use

```csharp
// MauiProgram.cs
builder.Services.AddSingleton<DatabaseService>();
```

```csharp
// In a ViewModel
public partial class TodoViewModel : ObservableObject
{
    private readonly DatabaseService _db;

    public ObservableCollection<TodoItem> Items { get; } = new();

    [ObservableProperty]
    private string _newTitle = string.Empty;

    public TodoViewModel(DatabaseService db)
    {
        _db = db;
    }

    [RelayCommand]
    private async Task LoadItems()
    {
        var items = await _db.GetItemsAsync();
        Items.Clear();
        foreach (var item in items)
            Items.Add(item);
    }

    [RelayCommand]
    private async Task AddItem()
    {
        if (string.IsNullOrWhiteSpace(NewTitle)) return;

        var item = new TodoItem { Title = NewTitle };
        await _db.SaveItemAsync(item);
        Items.Insert(0, item);
        NewTitle = string.Empty;
    }

    [RelayCommand]
    private async Task ToggleItem(TodoItem item)
    {
        item.IsCompleted = !item.IsCompleted;
        await _db.SaveItemAsync(item);
    }

    [RelayCommand]
    private async Task DeleteItem(TodoItem item)
    {
        await _db.DeleteItemAsync(item);
        Items.Remove(item);
    }
}
```

## File System

Read and write files in the app's data directory:

```csharp
// App data directory (persists across app updates)
var filePath = Path.Combine(FileSystem.AppDataDirectory, "notes.txt");

// Write
await File.WriteAllTextAsync(filePath, "My notes content");

// Read
if (File.Exists(filePath))
{
    string content = await File.ReadAllTextAsync(filePath);
}

// Cache directory (can be cleared by OS)
var cachePath = Path.Combine(FileSystem.CacheDirectory, "temp.json");

// Access bundled raw assets from Resources/Raw/
using var stream = await FileSystem.OpenAppPackageFileAsync("data.json");
using var reader = new StreamReader(stream);
string jsonData = await reader.ReadToEndAsync();
```

## ✅ Checkpoint

You can now persist data using Preferences, SecureStorage, SQLite, and the file system. In the final chapter, we'll publish your app!

---

**Previous:** [← 09 — Working with APIs](../09-Working-With-APIs/README.md) · **Next:** [11 — Publishing & Deployment →](../11-Publishing-Deployment/README.md)
