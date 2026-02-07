---
title: "🎮 XAML Playground"
layout: default
nav_order: 1
parent: "🛠️ Tools"
permalink: /playground/
---

# 🎮 Interactive XAML Playground

Experiment with MAUI XAML layouts right in your browser. Edit the code and see a live preview!

> **Note:** This is a simplified HTML-based preview — it demonstrates layout concepts but won't render actual MAUI controls. Use it to learn layout patterns before building in Visual Studio.

<div style="margin: 2rem 0;">

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; min-height: 400px;" id="playground">
  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <span style="font-weight: 600; color: var(--accent-purple);">📝 XAML Code</span>
      <select id="templateSelect" style="background: var(--bg-card); border: 1px solid var(--border-subtle); color: var(--text-primary); border-radius: var(--radius-sm); padding: 4px 8px; font-size: 0.85rem;">
        <option value="stack">VerticalStackLayout</option>
        <option value="grid">Grid Layout</option>
        <option value="horizontal">HorizontalStackLayout</option>
        <option value="flex">FlexLayout</option>
        <option value="login">Login Form</option>
        <option value="card">Card Component</option>
        <option value="list">List View</option>
      </select>
    </div>
    <textarea id="xamlInput" spellcheck="false" style="flex: 1; background: rgba(15, 12, 41, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; padding: 1rem; resize: none; line-height: 1.6; tab-size: 2;"></textarea>
  </div>
  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <span style="font-weight: 600; color: var(--accent-cyan);">👁️ Preview</span>
      <button id="resetBtn" class="btn-secondary" style="padding: 4px 12px; font-size: 0.8rem;">Reset</button>
    </div>
    <div id="preview" style="flex: 1; background: #1a1a2e; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; overflow: auto;"></div>
  </div>
</div>

</div>

<div class="section-header">
  <span class="section-icon">📖</span>
  <h2>Layout Quick Reference</h2>
</div>

| Layout | Purpose | Key Properties |
|:-------|:--------|:---------------|
| `VerticalStackLayout` | Stack children top-to-bottom | `Spacing` |
| `HorizontalStackLayout` | Stack children left-to-right | `Spacing` |
| `Grid` | Rows & columns | `RowDefinitions`, `ColumnDefinitions` |
| `FlexLayout` | CSS Flexbox-like | `Direction`, `Wrap`, `JustifyContent` |
| `AbsoluteLayout` | Exact positioning | `LayoutBounds`, `LayoutFlags` |

<script>
(function() {
  var templates = {
    stack: '<VerticalStackLayout Spacing="15" Padding="20">\n  <Label Text="Welcome!" FontSize="28" FontAttributes="Bold" TextColor="#a855f7" />\n  <Label Text="This is a VerticalStackLayout demo." TextColor="#a0a0b8" />\n  <Entry Placeholder="Enter your name" />\n  <Button Text="Say Hello" BackgroundColor="#7c3aed" TextColor="White" CornerRadius="12" />\n  <Label Text="Items are stacked vertically with spacing between them." TextColor="#6b6b80" FontSize="12" />\n</VerticalStackLayout>',

    grid: '<Grid RowDefinitions="Auto,*,Auto" ColumnDefinitions="*,*" Padding="20" RowSpacing="10" ColumnSpacing="10">\n  <Label Text="Dashboard" Grid.Row="0" Grid.ColumnSpan="2" FontSize="24" FontAttributes="Bold" TextColor="#a855f7" />\n  <Frame Grid.Row="1" Grid.Column="0" BackgroundColor="#1e1b4b" CornerRadius="12" Padding="15">\n    <VerticalStackLayout>\n      <Label Text="📊" FontSize="32" />\n      <Label Text="Stats" FontAttributes="Bold" TextColor="White" />\n      <Label Text="1,234" FontSize="20" TextColor="#22d3ee" />\n    </VerticalStackLayout>\n  </Frame>\n  <Frame Grid.Row="1" Grid.Column="1" BackgroundColor="#1e1b4b" CornerRadius="12" Padding="15">\n    <VerticalStackLayout>\n      <Label Text="🎯" FontSize="32" />\n      <Label Text="Goals" FontAttributes="Bold" TextColor="White" />\n      <Label Text="8/10" FontSize="20" TextColor="#34d399" />\n    </VerticalStackLayout>\n  </Frame>\n  <Button Grid.Row="2" Grid.ColumnSpan="2" Text="View All" BackgroundColor="#7c3aed" TextColor="White" CornerRadius="12" />\n</Grid>',

    horizontal: '<VerticalStackLayout Spacing="15" Padding="20">\n  <Label Text="Horizontal Layout" FontSize="24" FontAttributes="Bold" TextColor="#a855f7" />\n  <HorizontalStackLayout Spacing="10">\n    <Frame BackgroundColor="#7c3aed" CornerRadius="8" Padding="12">\n      <Label Text="Item 1" TextColor="White" />\n    </Frame>\n    <Frame BackgroundColor="#6366f1" CornerRadius="8" Padding="12">\n      <Label Text="Item 2" TextColor="White" />\n    </Frame>\n    <Frame BackgroundColor="#2563eb" CornerRadius="8" Padding="12">\n      <Label Text="Item 3" TextColor="White" />\n    </Frame>\n  </HorizontalStackLayout>\n  <Label Text="Items flow left to right." TextColor="#6b6b80" />\n</VerticalStackLayout>',

    flex: '<FlexLayout Direction="Row" Wrap="Wrap" JustifyContent="SpaceEvenly" Padding="20">\n  <Frame BackgroundColor="#7c3aed" CornerRadius="12" Padding="20" Margin="5">\n    <Label Text="🏠 Home" TextColor="White" FontAttributes="Bold" />\n  </Frame>\n  <Frame BackgroundColor="#6366f1" CornerRadius="12" Padding="20" Margin="5">\n    <Label Text="📊 Stats" TextColor="White" FontAttributes="Bold" />\n  </Frame>\n  <Frame BackgroundColor="#2563eb" CornerRadius="12" Padding="20" Margin="5">\n    <Label Text="⚙️ Settings" TextColor="White" FontAttributes="Bold" />\n  </Frame>\n  <Frame BackgroundColor="#059669" CornerRadius="12" Padding="20" Margin="5">\n    <Label Text="👤 Profile" TextColor="White" FontAttributes="Bold" />\n  </Frame>\n</FlexLayout>',

    login: '<VerticalStackLayout Spacing="20" Padding="30" VerticalOptions="Center">\n  <Label Text="🔐" FontSize="48" HorizontalOptions="Center" />\n  <Label Text="Sign In" FontSize="28" FontAttributes="Bold" HorizontalOptions="Center" TextColor="#a855f7" />\n  <Label Text="Welcome back! Please sign in." HorizontalOptions="Center" TextColor="#6b6b80" />\n  <Entry Placeholder="Email address" Keyboard="Email" />\n  <Entry Placeholder="Password" IsPassword="True" />\n  <Button Text="Sign In" BackgroundColor="#7c3aed" TextColor="White" CornerRadius="25" HeightRequest="50" />\n  <Label Text="Forgot password?" HorizontalOptions="Center" TextColor="#6366f1" />\n</VerticalStackLayout>',

    card: '<VerticalStackLayout Padding="20" Spacing="15">\n  <Frame BackgroundColor="#1e1b4b" CornerRadius="16" Padding="0" HasShadow="True">\n    <VerticalStackLayout>\n      <BoxView HeightRequest="150" BackgroundColor="#312e81" />\n      <VerticalStackLayout Padding="20" Spacing="8">\n        <Label Text="Learn .NET MAUI" FontSize="20" FontAttributes="Bold" TextColor="White" />\n        <Label Text="Build cross-platform apps with C# and XAML" TextColor="#a0a0b8" />\n        <HorizontalStackLayout Spacing="10">\n          <Frame BackgroundColor="#7c3aed" CornerRadius="12" Padding="6,3">\n            <Label Text="Tutorial" TextColor="White" FontSize="12" />\n          </Frame>\n          <Frame BackgroundColor="#059669" CornerRadius="12" Padding="6,3">\n            <Label Text="Beginner" TextColor="White" FontSize="12" />\n          </Frame>\n        </HorizontalStackLayout>\n        <Button Text="Start Learning →" BackgroundColor="#7c3aed" TextColor="White" CornerRadius="12" Margin="0,10,0,0" />\n      </VerticalStackLayout>\n    </VerticalStackLayout>\n  </Frame>\n</VerticalStackLayout>',

    list: '<VerticalStackLayout Spacing="10" Padding="20">\n  <Label Text="Task List" FontSize="24" FontAttributes="Bold" TextColor="#a855f7" />\n  <Frame BackgroundColor="#1e1b4b" CornerRadius="12" Padding="15">\n    <HorizontalStackLayout Spacing="12">\n      <CheckBox IsChecked="True" Color="#34d399" />\n      <Label Text="Complete MAUI tutorial" TextColor="#a0a0b8" VerticalOptions="Center" />\n    </HorizontalStackLayout>\n  </Frame>\n  <Frame BackgroundColor="#1e1b4b" CornerRadius="12" Padding="15">\n    <HorizontalStackLayout Spacing="12">\n      <CheckBox Color="#a855f7" />\n      <Label Text="Build first app" TextColor="White" VerticalOptions="Center" />\n    </HorizontalStackLayout>\n  </Frame>\n  <Frame BackgroundColor="#1e1b4b" CornerRadius="12" Padding="15">\n    <HorizontalStackLayout Spacing="12">\n      <CheckBox Color="#a855f7" />\n      <Label Text="Publish to app store" TextColor="White" VerticalOptions="Center" />\n    </HorizontalStackLayout>\n  </Frame>\n</VerticalStackLayout>'
  };

  var input = document.getElementById('xamlInput');
  var preview = document.getElementById('preview');
  var select = document.getElementById('templateSelect');
  var resetBtn = document.getElementById('resetBtn');

  function renderPreview(xaml) {
    var html = xamlToHtml(xaml);
    preview.innerHTML = html;
  }

  function xamlToHtml(xaml) {
    // Simple XAML-to-HTML converter for preview
    var html = xaml;

    // Process layout containers
    html = html.replace(/<VerticalStackLayout([^>]*)>/g, function(m, attrs) {
      var style = 'display:flex;flex-direction:column;';
      var spacing = getAttr(attrs, 'Spacing');
      var padding = getAttr(attrs, 'Padding');
      if (spacing) style += 'gap:' + spacing + 'px;';
      if (padding) style += 'padding:' + parsePadding(padding) + ';';
      var vOpt = getAttr(attrs, 'VerticalOptions');
      if (vOpt === 'Center') style += 'justify-content:center;height:100%;';
      return '<div style="' + style + '">';
    });
    html = html.replace(/<\/VerticalStackLayout>/g, '</div>');

    html = html.replace(/<HorizontalStackLayout([^>]*)>/g, function(m, attrs) {
      var style = 'display:flex;flex-direction:row;align-items:center;';
      var spacing = getAttr(attrs, 'Spacing');
      if (spacing) style += 'gap:' + spacing + 'px;';
      return '<div style="' + style + '">';
    });
    html = html.replace(/<\/HorizontalStackLayout>/g, '</div>');

    html = html.replace(/<Grid([^>]*)>/g, function(m, attrs) {
      var cols = getAttr(attrs, 'ColumnDefinitions') || '*';
      var style = 'display:grid;';
      var colParts = cols.split(',');
      var colTemplate = colParts.map(function(c) { return c.trim() === 'Auto' ? 'auto' : '1fr'; }).join(' ');
      style += 'grid-template-columns:' + colTemplate + ';';
      var rs = getAttr(attrs, 'RowSpacing');
      var cs = getAttr(attrs, 'ColumnSpacing');
      if (rs || cs) style += 'gap:' + (rs || '0') + 'px ' + (cs || '0') + 'px;';
      var padding = getAttr(attrs, 'Padding');
      if (padding) style += 'padding:' + parsePadding(padding) + ';';
      return '<div style="' + style + '">';
    });
    html = html.replace(/<\/Grid>/g, '</div>');

    html = html.replace(/<FlexLayout([^>]*)>/g, function(m, attrs) {
      var style = 'display:flex;';
      var dir = getAttr(attrs, 'Direction');
      if (dir === 'Row') style += 'flex-direction:row;';
      if (dir === 'Column') style += 'flex-direction:column;';
      var wrap = getAttr(attrs, 'Wrap');
      if (wrap === 'Wrap') style += 'flex-wrap:wrap;';
      var jc = getAttr(attrs, 'JustifyContent');
      if (jc === 'SpaceEvenly') style += 'justify-content:space-evenly;';
      if (jc === 'SpaceBetween') style += 'justify-content:space-between;';
      var padding = getAttr(attrs, 'Padding');
      if (padding) style += 'padding:' + parsePadding(padding) + ';';
      return '<div style="' + style + '">';
    });
    html = html.replace(/<\/FlexLayout>/g, '</div>');

    // Process UI elements
    html = html.replace(/<Label([^\/]*)\/>/g, function(m, attrs) {
      var text = getAttr(attrs, 'Text') || '';
      var style = 'margin:0;';
      var fontSize = getAttr(attrs, 'FontSize');
      if (fontSize) style += 'font-size:' + fontSize + 'px;';
      var color = getAttr(attrs, 'TextColor');
      if (color) style += 'color:' + color + ';';
      var bold = getAttr(attrs, 'FontAttributes');
      if (bold === 'Bold') style += 'font-weight:700;';
      var hAlign = getAttr(attrs, 'HorizontalOptions');
      if (hAlign === 'Center') style += 'text-align:center;width:100%;';
      var gridRow = getAttr(attrs, 'Grid.Row');
      var gridCol = getAttr(attrs, 'Grid.Column');
      var gridColSpan = getAttr(attrs, 'Grid.ColumnSpan');
      if (gridRow) style += 'grid-row:' + (parseInt(gridRow)+1) + ';';
      if (gridCol) style += 'grid-column:' + (parseInt(gridCol)+1) + ';';
      if (gridColSpan) style += 'grid-column:span ' + gridColSpan + ';';
      return '<p style="' + style + '">' + text + '</p>';
    });

    html = html.replace(/<Button([^\/]*)\/>/g, function(m, attrs) {
      var text = getAttr(attrs, 'Text') || 'Button';
      var bg = getAttr(attrs, 'BackgroundColor') || '#7c3aed';
      var color = getAttr(attrs, 'TextColor') || 'white';
      var cr = getAttr(attrs, 'CornerRadius') || '8';
      var height = getAttr(attrs, 'HeightRequest');
      var style = 'background:' + bg + ';color:' + color + ';border:none;border-radius:' + cr + 'px;padding:10px 20px;font-weight:600;cursor:pointer;font-size:14px;';
      if (height) style += 'height:' + height + 'px;';
      var margin = getAttr(attrs, 'Margin');
      if (margin) style += 'margin:' + parsePadding(margin) + ';';
      var gridRow = getAttr(attrs, 'Grid.Row');
      var gridColSpan = getAttr(attrs, 'Grid.ColumnSpan');
      if (gridRow) style += 'grid-row:' + (parseInt(gridRow)+1) + ';';
      if (gridColSpan) style += 'grid-column:span ' + gridColSpan + ';';
      return '<button style="' + style + '">' + text + '</button>';
    });

    html = html.replace(/<Entry([^\/]*)\/>/g, function(m, attrs) {
      var placeholder = getAttr(attrs, 'Placeholder') || '';
      var isPass = getAttr(attrs, 'IsPassword') === 'True';
      return '<input type="' + (isPass ? 'password' : 'text') + '" placeholder="' + placeholder + '" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:10px 14px;color:white;font-size:14px;width:100%;box-sizing:border-box;">';
    });

    html = html.replace(/<Frame([^>]*)>([\s\S]*?)<\/Frame>/g, function(m, attrs, inner) {
      var bg = getAttr(attrs, 'BackgroundColor') || 'rgba(255,255,255,0.04)';
      var cr = getAttr(attrs, 'CornerRadius') || '8';
      var padding = getAttr(attrs, 'Padding') || '12';
      var style = 'background:' + bg + ';border-radius:' + cr + 'px;padding:' + parsePadding(padding) + ';border:1px solid rgba(255,255,255,0.1);';
      var margin = getAttr(attrs, 'Margin');
      if (margin) style += 'margin:' + parsePadding(margin) + ';';
      var gridRow = getAttr(attrs, 'Grid.Row');
      var gridCol = getAttr(attrs, 'Grid.Column');
      if (gridRow) style += 'grid-row:' + (parseInt(gridRow)+1) + ';';
      if (gridCol) style += 'grid-column:' + (parseInt(gridCol)+1) + ';';
      return '<div style="' + style + '">' + inner + '</div>';
    });

    html = html.replace(/<BoxView([^\/]*)\/>/g, function(m, attrs) {
      var height = getAttr(attrs, 'HeightRequest') || '50';
      var bg = getAttr(attrs, 'BackgroundColor') || '#333';
      return '<div style="height:' + height + 'px;background:' + bg + ';border-radius:12px 12px 0 0;"></div>';
    });

    html = html.replace(/<CheckBox([^\/]*)\/>/g, function(m, attrs) {
      var checked = getAttr(attrs, 'IsChecked') === 'True';
      var color = getAttr(attrs, 'Color') || '#a855f7';
      return '<input type="checkbox"' + (checked ? ' checked' : '') + ' style="accent-color:' + color + ';width:18px;height:18px;">';
    });

    return html;
  }

  function getAttr(attrs, name) {
    var regex = new RegExp(name + '="([^"]*)"');
    var match = attrs.match(regex);
    return match ? match[1] : null;
  }

  function parsePadding(val) {
    var parts = val.split(',');
    if (parts.length === 1) return parts[0] + 'px';
    if (parts.length === 2) return parts[1] + 'px ' + parts[0] + 'px';
    if (parts.length === 4) return parts[1] + 'px ' + parts[2] + 'px ' + parts[3] + 'px ' + parts[0] + 'px';
    return val + 'px';
  }

  // Load initial template
  input.value = templates.stack;
  renderPreview(input.value);

  // Live preview on input
  var debounceTimer;
  input.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      renderPreview(input.value);
    }, 300);
  });

  // Template selection
  select.addEventListener('change', function() {
    input.value = templates[this.value] || '';
    renderPreview(input.value);
  });

  // Reset button
  resetBtn.addEventListener('click', function() {
    input.value = templates[select.value] || templates.stack;
    renderPreview(input.value);
  });

  // Tab key support in textarea
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
      this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
      renderPreview(this.value);
    }
  });
})();
</script>

---

**Try it out!** Edit the XAML code on the left and watch the preview update in real-time. Select different templates from the dropdown to explore various layout patterns.
