---
title: "🎯 Coding Challenges"
layout: default
nav_order: 6
parent: "📚 Reference"
permalink: /challenges/
---

# 🎯 Coding Challenges

Put your .NET MAUI skills to the test with these practical challenges. Each one combines concepts from multiple chapters.

---

## Challenge 1: Tip Calculator
{: .d-inline-block }

Beginner
{: .label .label-green }

Build a tip calculator app with:

- Entry for bill amount
- Slider for tip percentage (10%–30%)
- Labels showing tip amount and total
- TwoWay binding for real-time updates
- A "Split Bill" feature with a stepper for number of people

**Concepts used:** Chapters 3, 4, 5

<details class="solution">
<summary>💡 Hints</summary>

**ViewModel properties:**
```csharp
[ObservableProperty]
private decimal _billAmount;

[ObservableProperty]
[NotifyPropertyChangedFor(nameof(TipAmount))]
[NotifyPropertyChangedFor(nameof(Total))]
[NotifyPropertyChangedFor(nameof(PerPerson))]
private double _tipPercentage = 0.15;

[ObservableProperty]
[NotifyPropertyChangedFor(nameof(PerPerson))]
private int _splitCount = 1;

public decimal TipAmount => BillAmount * (decimal)TipPercentage;
public decimal Total => BillAmount + TipAmount;
public decimal PerPerson => SplitCount > 0 ? Total / SplitCount : Total;
```

**XAML snippet:**
```xml
<Slider Minimum="0.1" Maximum="0.3"
        Value="{Binding TipPercentage}" />
<Label Text="{Binding TipPercentage, StringFormat='Tip: {0:P0}'}" />
```

</details>

---

## Challenge 2: Note-Taking App
{: .d-inline-block }

Intermediate
{: .label .label-yellow }

Build a complete note-taking app with:

- Create, edit, and delete notes
- SQLite persistence
- Shell navigation with query parameters
- Search functionality via Shell SearchHandler
- Swipe-to-delete on each note
- Categories with color-coding

**Concepts used:** Chapters 5, 6, 10, 13, 18

<details class="solution">
<summary>💡 Architecture Hints</summary>

**Models:**
```csharp
public class Note
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;
}
```

**Shell structure:**
```xml
<TabBar>
    <ShellContent Title="All Notes" Route="notes"
                  ContentTemplate="{DataTemplate views:NotesPage}" />
    <ShellContent Title="Categories" Route="categories"
                  ContentTemplate="{DataTemplate views:CategoriesPage}" />
</TabBar>
```

**DI setup:**
```csharp
builder.Services.AddSingleton<INoteService, NoteService>();
builder.Services.AddSingleton<NotesViewModel>();
builder.Services.AddTransient<NoteDetailViewModel>();
builder.Services.AddSingleton<NotesPage>();
builder.Services.AddTransient<NoteDetailPage>();
```

</details>

---

## Challenge 3: Weather Dashboard
{: .d-inline-block }

Intermediate
{: .label .label-yellow }

Build a weather dashboard that:

- Fetches weather from a public API (e.g., Open-Meteo — no API key needed)
- Shows current temperature, humidity, and conditions
- Displays a 5-day forecast in a horizontal CollectionView
- Uses the device's location via `Geolocation`
- Handles loading states and errors gracefully
- Caches the last response with `Preferences`
- Supports pull-to-refresh

**Concepts used:** Chapters 5, 8, 9, 10, 14

<details class="solution">
<summary>💡 API & Service Hints</summary>

**Free API (no key needed):**
```
https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto
```

**Service pattern:**
```csharp
public class WeatherService(HttpClient http) : IWeatherService
{
    public async Task<WeatherForecast> GetForecastAsync(double lat, double lon)
    {
        var url = $"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto";
        return await http.GetFromJsonAsync<WeatherForecast>(url)
            ?? throw new Exception("Failed to fetch weather");
    }
}
```

**Pull-to-refresh:**
```xml
<RefreshView IsRefreshing="{Binding IsRefreshing}"
             Command="{Binding RefreshCommand}">
    <CollectionView ItemsSource="{Binding DailyForecasts}" />
</RefreshView>
```

</details>

---

## Challenge 4: Habit Tracker
{: .d-inline-block }

Advanced
{: .label .label-red }

Build a habit tracker with:

- Define habits with name, icon, and target frequency (daily/weekly)
- Mark habits as completed for each day
- Calendar view showing completion streaks
- Statistics page with completion percentages
- Local notifications for habit reminders
- Animations for completing a habit (confetti-style bounce)
- Dark/light theme support
- SQLite persistence
- Full MVVM architecture with DI

**Concepts used:** Chapters 5, 6, 7, 10, 12, 14, 15

<details class="solution">
<summary>💡 Data Model Hints</summary>

```csharp
public class Habit
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = "✅";
    public string ColorHex { get; set; } = "#7c3aed";
    public HabitFrequency Frequency { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class HabitCompletion
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public int HabitId { get; set; }
    public DateTime CompletedDate { get; set; }
}

public enum HabitFrequency { Daily, Weekly, Monthly }
```

**Streak calculation:**
```csharp
public int CalculateStreak(List<HabitCompletion> completions)
{
    var sorted = completions
        .OrderByDescending(c => c.CompletedDate.Date)
        .Select(c => c.CompletedDate.Date)
        .Distinct()
        .ToList();

    if (!sorted.Any() || sorted[0] != DateTime.Today)
        return 0;

    int streak = 1;
    for (int i = 1; i < sorted.Count; i++)
    {
        if ((sorted[i - 1] - sorted[i]).Days == 1)
            streak++;
        else
            break;
    }
    return streak;
}
```

</details>

---

## Challenge 5: Expense Splitter
{: .d-inline-block }

Advanced
{: .label .label-red }

Build a group expense splitting app:

- Create groups with multiple members
- Add expenses with who paid and who participates
- Calculate "who owes whom" with a debt simplification algorithm
- Share summaries via the Share API
- Export to a simple HTML report
- HybridWebView for an interactive chart showing expenses by category
- Unit tests for the splitting algorithm

**Concepts used:** Chapters 5, 10, 16, 19, 20

<details class="solution">
<summary>💡 Algorithm Hint</summary>

The debt simplification algorithm:
1. Calculate each person's net balance (total paid - total owed)
2. Separate into creditors (positive balance) and debtors (negative balance)
3. Match the largest debtor with the largest creditor
4. Create a transfer for min(debt, credit)
5. Update balances and repeat

```csharp
public static List<Transfer> SimplifyDebts(Dictionary<string, decimal> balances)
{
    var transfers = new List<Transfer>();
    var creditors = new SortedList<decimal, string>(
        Comparer<decimal>.Create((a, b) => b.CompareTo(a)));
    var debtors = new SortedList<decimal, string>();

    foreach (var (person, balance) in balances)
    {
        if (balance > 0) creditors.Add(balance, person);
        else if (balance < 0) debtors.Add(-balance, person);
    }

    // Match and simplify...
    return transfers;
}

public record Transfer(string From, string To, decimal Amount);
```

</details>

---

## 📊 Track Your Challenge Progress

Use the [Progress Tracker](/maui-tutorial-for-beginners/progress/) to monitor your quiz scores across all chapters, then come back here to apply what you've learned!
