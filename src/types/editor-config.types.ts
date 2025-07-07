export interface ConfigItem {
  key: string;
  label: string;
  icon: string;
}

export interface EditorState {
  showSidebar: boolean;
  showCodeMode: boolean;
  isTransitioning: boolean;
  showToolbar: boolean;
  showBubbleMenu: boolean;
  enableSlashCommands: boolean;
  placeholder: string;
  locale?: string;
}

export interface MenuState {
  showToolbarMenu: boolean;
  showBubbleMenuMenu: boolean;
  showSlashCommandsMenu: boolean;
}

export interface EditorContent {
  content: string;
}
