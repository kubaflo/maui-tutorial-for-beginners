---
title: "Accessibility"
layout: default
nav_order: 24
parent: "📖 Lessons"
permalink: /docs/24-accessibility/
---

<img src="/maui-tutorial-for-beginners/assets/images/banners/accessibility.svg" alt="Chapter banner" class="chapter-banner">

# Chapter 24: Building Accessible MAUI Apps

Make your apps usable by everyone — including users with screen readers, motor impairments, and low vision.

---

## Why Accessibility Matters

- **15% of the world's population** lives with some form of disability
- **Legal requirements** in many countries (ADA, WCAG, Section 508)
- **Better UX for everyone** — accessible apps are easier for all users
- **App store requirements** — Apple and Google review accessibility

---

## Semantic Properties

.NET MAUI uses `SemanticProperties` attached properties to provide accessibility information to screen readers.

### Description

The most important property — tells the screen reader what an element is:

```xml
<Image Source="logo.png"
       SemanticProperties.Description="Company logo" />

<Button Text="Submit"
        SemanticProperties.Description="Submit your application form" />
```

```csharp
var image = new Image { Source = "logo.png" };
SemanticProperties.SetDescription(image, "Company logo");
```

### Hint

Provides additional context about what happens when you interact with a control:

```xml
<Button Text="Delete"
        SemanticProperties.Description="Delete item"
        SemanticProperties.Hint="Double-tap to permanently delete this item" />
```

### Heading Levels

Organize your UI into a navigable structure:

```xml
<Label Text="Settings"
       SemanticProperties.HeadingLevel="Level1"
       FontSize="24" FontAttributes="Bold" />

<Label Text="Account"
       SemanticProperties.HeadingLevel="Level2"
       FontSize="18" FontAttributes="Bold" />

<Label Text="Notifications"
       SemanticProperties.HeadingLevel="Level2"
       FontSize="18" FontAttributes="Bold" />
```

> **💡 Note:** On Android and iOS, all heading levels map to a single heading indicator. Windows supports distinct levels 1–9.

---

## AutomationProperties

For elements that need explicit accessibility tree management:

```xml
<!-- Include an element in the accessibility tree -->
<ActivityIndicator IsRunning="True"
                   AutomationProperties.IsInAccessibleTree="true"
                   SemanticProperties.Description="Loading content" />

<!-- Exclude decorative elements -->
<Image Source="decorative_border.png"
       AutomationProperties.IsInAccessibleTree="false" />
```

### Labeling Controls

Associate labels with their input controls:

```xml
<Label x:Name="emailLabel" Text="Email Address" />
<Entry AutomationProperties.LabeledBy="{x:Reference emailLabel}"
       Placeholder="Enter your email" />
```

---

## SemanticScreenReader

Programmatically announce text to the screen reader:

```csharp
// Announce important state changes
SemanticScreenReader.Default.Announce("Item deleted successfully");

// After a long operation
SemanticScreenReader.Default.Announce("Download complete. File saved.");

// After navigation
SemanticScreenReader.Default.Announce($"Now viewing {pageTitle}");
```

---

## Accessible Colors & Contrast

### Minimum Contrast Ratios (WCAG 2.1)

| Element | Minimum Ratio | Recommended |
|:--------|:-------------|:------------|
| Normal text | 4.5:1 | 7:1 (AAA) |
| Large text (18pt+) | 3:1 | 4.5:1 |
| UI components | 3:1 | 4.5:1 |

### Good vs Bad Examples

```xml
<!-- ❌ Bad: Low contrast -->
<Label Text="Important info"
       TextColor="#999999"
       BackgroundColor="#FFFFFF" />

<!-- ✅ Good: High contrast -->
<Label Text="Important info"
       TextColor="#333333"
       BackgroundColor="#FFFFFF" />
```

### Supporting Dynamic Text Sizes

Respect the user's system font size preferences:

```xml
<!-- ✅ Use named font sizes — they scale with system settings -->
<Label Text="Scalable text" FontSize="Body" />
<Label Text="Heading" FontSize="Title" />

<!-- ❌ Avoid hard-coded pixel sizes for body text -->
<Label Text="Fixed text" FontSize="14" />
```

---

## Touch Target Sizes

Ensure interactive elements are large enough to tap:

```xml
<!-- ✅ Minimum 44x44 points -->
<Button Text="Save"
        HeightRequest="48"
        MinimumWidthRequest="48" />

<!-- ✅ Use padding to increase tap area without changing visual size -->
<ImageButton Source="close.png"
             Padding="12"
             WidthRequest="44"
             HeightRequest="44" />
```

---

## Focus Management

Control navigation order for keyboard and screen reader users:

```xml
<!-- Set tab order -->
<Entry TabIndex="1" Placeholder="First name" />
<Entry TabIndex="2" Placeholder="Last name" />
<Entry TabIndex="3" Placeholder="Email" />
<Button TabIndex="4" Text="Submit" />

<!-- Remove from tab order -->
<Label TabIndex="-1" Text="Decorative text" />
```

### Programmatic Focus

```csharp
// Move focus to a specific control
emailEntry.Focus();

// After a validation error, focus the first invalid field
if (string.IsNullOrEmpty(viewModel.Email))
{
    emailEntry.Focus();
    SemanticScreenReader.Default.Announce("Email is required");
}
```

---

## Accessible Collection Views

```xml
<CollectionView ItemsSource="{Binding Items}"
                SemanticProperties.Description="List of tasks">
    <CollectionView.ItemTemplate>
        <DataTemplate x:DataType="models:TaskItem">
            <Frame SemanticProperties.Description="{Binding AccessibleDescription}">
                <VerticalStackLayout>
                    <Label Text="{Binding Title}"
                           SemanticProperties.HeadingLevel="Level3" />
                    <Label Text="{Binding DueDate, StringFormat='Due: {0:d}'}" />
                    <CheckBox IsChecked="{Binding IsComplete}"
                              SemanticProperties.Description="{Binding Title, 
                                  StringFormat='Mark {0} as complete'}" />
                </VerticalStackLayout>
            </Frame>
        </DataTemplate>
    </CollectionView.ItemTemplate>
</CollectionView>
```

---

## Accessibility Checklist

Use this checklist for every page in your app:

- [ ] **All images** have `SemanticProperties.Description` (or are excluded from accessibility tree)
- [ ] **All buttons** have descriptive labels (not just icons)
- [ ] **Headings** use `SemanticProperties.HeadingLevel` for structure
- [ ] **Color contrast** meets 4.5:1 minimum ratio
- [ ] **Touch targets** are at least 44x44 points
- [ ] **Form fields** are labeled with `AutomationProperties.LabeledBy`
- [ ] **Error messages** are announced via `SemanticScreenReader`
- [ ] **Dynamic content** changes are announced to screen readers
- [ ] **Tab order** is logical and sequential
- [ ] **App works** with system font scaling at 200%

---

## Testing Accessibility

| Platform | Screen Reader | How to Test |
|:---------|:-------------|:------------|
| **Android** | TalkBack | Settings → Accessibility → TalkBack |
| **iOS** | VoiceOver | Settings → Accessibility → VoiceOver |
| **Windows** | Narrator | Win + Ctrl + Enter |
| **macOS** | VoiceOver | Cmd + F5 |

### Accessibility Inspector (iOS/macOS)

1. Open Xcode → Open Developer Tool → Accessibility Inspector
2. Point it at your running app
3. Inspect each element's accessibility properties

### Android Accessibility Scanner

1. Install "Accessibility Scanner" from Google Play
2. Run it on your MAUI app
3. Review suggestions for touch target sizes, contrast, and labels

---

## 📝 Knowledge Check

<div class="quiz-container" data-quiz-id="ch24-q1" data-correct="b" data-explanation="SemanticProperties.Description provides the text that screen readers announce for an element.">
<h4>Quiz 1: Which property tells a screen reader what an element is?</h4>
<div class="quiz-options">
  <label><input type="radio" name="ch24-q1" value="a"> <code>AutomationProperties.Name</code> (deprecated)</label>
  <label><input type="radio" name="ch24-q1" value="b"> <code>SemanticProperties.Description</code></label>
  <label><input type="radio" name="ch24-q1" value="c"> <code>SemanticProperties.Hint</code></label>
</div>
<div class="quiz-feedback"></div>
<button class="quiz-btn quiz-check-btn">Check Answer</button>
</div>

<div class="quiz-container" data-quiz-id="ch24-q2" data-correct="c" data-explanation="WCAG 2.1 requires a minimum contrast ratio of 4.5:1 for normal text against its background.">
<h4>Quiz 2: What is the minimum contrast ratio for normal text (WCAG 2.1)?</h4>
<div class="quiz-options">
  <label><input type="radio" name="ch24-q2" value="a"> 2:1</label>
  <label><input type="radio" name="ch24-q2" value="b"> 3:1</label>
  <label><input type="radio" name="ch24-q2" value="c"> 4.5:1</label>
</div>
<div class="quiz-feedback"></div>
<button class="quiz-btn quiz-check-btn">Check Answer</button>
</div>

---

## 🏋️ Exercise: Make a Form Accessible

Take this inaccessible form and add proper accessibility properties:

```xml
<!-- Inaccessible form -->
<Entry Placeholder="Name" />
<Entry Placeholder="Email" />
<ImageButton Source="send.png" />
```

<details class="exercise">
<summary>Show Solution</summary>

```xml
<Label x:Name="nameLabel" Text="Full Name"
       SemanticProperties.HeadingLevel="Level2" />
<Entry AutomationProperties.LabeledBy="{x:Reference nameLabel}"
       Placeholder="Enter your full name"
       TabIndex="1" />

<Label x:Name="emailLabel" Text="Email Address"
       SemanticProperties.HeadingLevel="Level2" />
<Entry AutomationProperties.LabeledBy="{x:Reference emailLabel}"
       Placeholder="Enter your email address"
       Keyboard="Email"
       TabIndex="2" />

<ImageButton Source="send.png"
             SemanticProperties.Description="Send message"
             SemanticProperties.Hint="Double-tap to send your message"
             HeightRequest="48"
             WidthRequest="48"
             TabIndex="3" />
```

</details>

---

[← Chapter 23: Maps & Location]({% link docs/23-maps-location.md %}) · [Chapter 25: Notifications →]({% link docs/25-notifications-background.md %})
