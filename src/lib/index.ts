// Composants principaux
export { TiptapEditorComponent } from "./tiptap-editor.component";
export { TiptapToolbarComponent } from "./toolbar.component";
export { TiptapBubbleMenuComponent } from "./bubble-menu.component";

// Composants réutilisables
export { TiptapButtonComponent } from "./tiptap-button.component";
export { TiptapSeparatorComponent } from "./tiptap-separator.component";
export { TiptapImageUploadComponent } from "./tiptap-image-upload.component";
// Services
export { ImageService } from "./services/image.service";

// Extensions
export { SlashCommands } from "./slash-commands.extension";

// Types et interfaces
export type { ToolbarConfig } from "./toolbar.component";
export type { BubbleMenuConfig } from "./bubble-menu.component";
export type { TiptapButtonConfig } from "./tiptap-button.component";
export type {
  ImageUploadConfig,
  ImageUploadResult,
} from "./tiptap-image-upload.component";
export type { ImageData } from "./services/image.service";
