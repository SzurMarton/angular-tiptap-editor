# NgxTiptapEditor

A modern, customizable rich-text editor library for Angular applications, built with Tiptap and featuring complete internationalization support.

## 🚀 Installation

```bash
npm install ngx-tiptap-editor
```

## 📦 Peer Dependencies

Make sure you have these peer dependencies installed:

```bash
npm install @angular/common @angular/core @angular/forms
npm install @tiptap/core @tiptap/starter-kit @tiptap/extension-placeholder
npm install @tiptap/extension-character-count @tiptap/extension-bubble-menu
npm install @tiptap/extension-underline @tiptap/extension-superscript
npm install @tiptap/extension-subscript @tiptap/extension-text-align
npm install @tiptap/extension-link @tiptap/extension-highlight
npm install @intevation/tiptap-extension-office-paste tippy.js
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { Component } from "@angular/core";
import { NgxTiptapEditorComponent } from "ngx-tiptap-editor";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [NgxTiptapEditorComponent],
  template: `
    <ngx-tiptap-editor
      [content]="content"
      (contentChange)="onContentChange($event)"
    />
  `,
})
export class ExampleComponent {
  content = "<p>Hello <strong>World</strong>!</p>";

  onContentChange(newContent: string) {
    this.content = newContent;
  }
}
```

### With Configuration

```typescript
@Component({
  template: `
    <ngx-tiptap-editor
      [content]="content"
      [toolbar]="toolbarConfig"
      [bubbleMenu]="bubbleMenuConfig"
      [locale]="'en'"
      [height]="400"
      [showCharacterCount]="true"
      (contentChange)="onContentChange($event)"
    />
  `,
})
export class AdvancedComponent {
  content = "<h1>Welcome!</h1><p>Start editing...</p>";

  toolbarConfig = {
    bold: true,
    italic: true,
    heading1: true,
    bulletList: true,
    link: true,
    image: true,
  };

  bubbleMenuConfig = {
    bold: true,
    italic: true,
    link: true,
  };

  onContentChange(newContent: string) {
    this.content = newContent;
  }
}
```

### Form Integration

```typescript
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  template: ` <ngx-tiptap-editor [formControl]="contentControl" /> `,
})
export class FormComponent {
  contentControl = new FormControl("<p>Initial content</p>");
}
```

## 📖 API Reference

### Component: NgxTiptapEditorComponent

#### Inputs

| Input                 | Type                    | Default             | Description                |
| --------------------- | ----------------------- | ------------------- | -------------------------- |
| `content`             | `string`                | `""`                | Initial HTML content       |
| `placeholder`         | `string`                | `"Start typing..."` | Placeholder text           |
| `locale`              | `'en' \| 'fr'`          | Auto-detect         | Editor language            |
| `editable`            | `boolean`               | `true`              | Whether editor is editable |
| `height`              | `number`                | `undefined`         | Fixed height in pixels     |
| `maxHeight`           | `number`                | `undefined`         | Maximum height in pixels   |
| `minHeight`           | `number`                | `200`               | Minimum height in pixels   |
| `showToolbar`         | `boolean`               | `true`              | Show toolbar               |
| `showBubbleMenu`      | `boolean`               | `true`              | Show text bubble menu      |
| `showImageBubbleMenu` | `boolean`               | `true`              | Show image bubble menu     |
| `enableSlashCommands` | `boolean`               | `true`              | Enable slash commands      |
| `showCharacterCount`  | `boolean`               | `true`              | Show character counter     |
| `maxCharacters`       | `number`                | `undefined`         | Maximum character limit    |
| `toolbar`             | `ToolbarConfig`         | All enabled         | Toolbar configuration      |
| `bubbleMenu`          | `BubbleMenuConfig`      | All enabled         | Bubble menu configuration  |
| `imageBubbleMenu`     | `ImageBubbleMenuConfig` | All enabled         | Image bubble menu config   |
| `slashCommandsConfig` | `SlashCommandsConfig`   | All enabled         | Slash commands config      |

#### Outputs

| Output          | Type                    | Description                     |
| --------------- | ----------------------- | ------------------------------- |
| `contentChange` | `string`                | Emitted when content changes    |
| `editorCreated` | `Editor`                | Emitted when editor is created  |
| `editorUpdate`  | `{editor, transaction}` | Emitted on editor updates       |
| `editorFocus`   | `{editor, event}`       | Emitted when editor gains focus |
| `editorBlur`    | `{editor, event}`       | Emitted when editor loses focus |

#### Methods

| Method                        | Description              |
| ----------------------------- | ------------------------ |
| `getHTML()`                   | Get current HTML content |
| `getJSON()`                   | Get current JSON content |
| `getText()`                   | Get current plain text   |
| `setContent(content: string)` | Set editor content       |
| `focus()`                     | Focus the editor         |
| `blur()`                      | Blur the editor          |
| `clearContent()`              | Clear all content        |

### Configuration Types

#### ToolbarConfig

```typescript
interface ToolbarConfig {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  highlight?: boolean;
  heading1?: boolean;
  heading2?: boolean;
  heading3?: boolean;
  bulletList?: boolean;
  orderedList?: boolean;
  blockquote?: boolean;
  alignLeft?: boolean;
  alignCenter?: boolean;
  alignRight?: boolean;
  alignJustify?: boolean;
  link?: boolean;
  image?: boolean;
  horizontalRule?: boolean;
  undo?: boolean;
  redo?: boolean;
  separator?: boolean;
}
```

#### BubbleMenuConfig

```typescript
interface BubbleMenuConfig {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  highlight?: boolean;
  link?: boolean;
  separator?: boolean;
}
```

#### HeightConfig

```typescript
interface HeightConfig {
  minHeight?: number;
  height?: number;
  maxHeight?: number;
}
```

### Services

#### TiptapI18nService

```typescript
// Change language programmatically
import { TiptapI18nService } from 'ngx-tiptap-editor';

constructor(private i18nService: TiptapI18nService) {}

changeLanguage() {
  this.i18nService.setLocale('fr');
}
```

## 🌍 Internationalization

Built-in support for English and French with automatic browser language detection.

### Supported Languages

- 🇺🇸 English (`en`)
- 🇫🇷 French (`fr`)

### Usage

```typescript
// Auto-detect browser language (default)
<ngx-tiptap-editor />

// Force specific language
<ngx-tiptap-editor [locale]="'en'" />
<ngx-tiptap-editor [locale]="'fr'" />
```

### Custom Translations

```typescript
import { TiptapI18nService } from 'ngx-tiptap-editor';

constructor(private i18nService: TiptapI18nService) {
  // Add custom translations
  this.i18nService.addTranslations('fr', {
    toolbar: {
      bold: 'Mon texte gras personnalisé'
    }
  });
}
```

## 🎨 Styling

The editor comes with beautiful default styles. You can customize the appearance by overriding CSS variables or classes.

### CSS Custom Properties

```css
:root {
  --editor-min-height: 200px;
  --editor-height: auto;
  --editor-max-height: none;
  --editor-overflow: visible;
}
```

### Custom Styles

```css
/* Customize editor border */
.tiptap-editor {
  border: 2px solid #your-color;
  border-radius: 12px;
}

/* Customize toolbar */
.tiptap-toolbar {
  background: #your-background;
}
```

## 🔧 Advanced Usage

### Custom Slash Commands

```typescript
import { createI18nSlashCommands } from "ngx-tiptap-editor";

// Create internationalized slash commands
const customCommands = createI18nSlashCommands(this.i18nService);

// Use in component
slashCommandsConfig = {
  commands: customCommands,
};
```

### Image Handling

The editor includes advanced image features:

- Automatic compression and resizing
- Drag & drop support
- Resizable images with handles
- Image bubble menu for actions

### Height Management

```typescript
// Fixed height with scroll
<ngx-tiptap-editor [height]="400" />

// Maximum height with scroll
<ngx-tiptap-editor [maxHeight]="600" />

// Dynamic height configuration
<ngx-tiptap-editor
  [minHeight]="200"
  [height]="editorHeight"
  [maxHeight]="800"
/>
```

## 🔗 Exports

Available exports from `ngx-tiptap-editor`:

### Components

- `NgxTiptapEditorComponent` (main component)
- `TiptapToolbarComponent`
- `TiptapBubbleMenuComponent`
- `TiptapImageBubbleMenuComponent`
- `TiptapSlashCommandsComponent`
- `TiptapButtonComponent`
- `TiptapSeparatorComponent`

### Services

- `TiptapI18nService`
- `ImageService`
- `EditorCommandsService`

### Types

- `ToolbarConfig`
- `BubbleMenuConfig`
- `ImageBubbleMenuConfig`
- `SlashCommandsConfig`
- `HeightConfig`
- `SupportedLocale`

### Functions

- `createI18nSlashCommands()`

### Constants

- `DEFAULT_TOOLBAR_CONFIG`
- `DEFAULT_BUBBLE_MENU_CONFIG`
- `DEFAULT_IMAGE_BUBBLE_MENU_CONFIG`

## 📝 License

MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please see the main repository for contribution guidelines.

## 📞 Support

- 🐛 [Report Issues](https://github.com/flogeez/ngx-tiptap-editor/issues)
- 💡 [Feature Requests](https://github.com/flogeez/ngx-tiptap-editor/issues)
- 📖 [Documentation](https://github.com/flogeez/ngx-tiptap-editor#readme)

---

Built with ❤️ by [FloGeez](https://github.com/FloGeez)
