import { Injectable, signal, computed } from "@angular/core";
import {
  ToolbarConfig,
  BubbleMenuConfig,
  SlashCommandsConfig,
  DEFAULT_SLASH_COMMANDS,
  SlashCommandItem,
} from "tiptap-editor";
import { EditorState, MenuState } from "../types/editor-config.types";
import { DEFAULT_DEMO_CONTENT } from "../config/editor-items.config";

@Injectable({
  providedIn: "root",
})
export class EditorConfigurationService {
  // État de l'éditeur
  private _editorState = signal<EditorState>({
    showSidebar: true,
    showCodeMode: false,
    isTransitioning: false,
    showToolbar: true,
    showBubbleMenu: true,
    enableSlashCommands: true,
    placeholder: "Commencez à écrire...",
  });

  // État des menus
  private _menuState = signal<MenuState>({
    showToolbarMenu: false,
    showBubbleMenuMenu: false,
    showSlashCommandsMenu: false,
  });

  // Contenu de l'éditeur
  private _demoContent = signal(DEFAULT_DEMO_CONTENT);

  // Configurations
  private _toolbarConfig = signal<Partial<ToolbarConfig>>({
    bold: true,
    italic: true,
    underline: true,
    heading1: true,
    heading2: true,
    bulletList: true,
    orderedList: true,
    link: true,
    image: true,
    undo: true,
    redo: true,
    separator: true,
  });

  private _bubbleMenuConfig = signal<Partial<BubbleMenuConfig>>({
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    code: true,
    highlight: true,
    link: true,
    separator: true,
  });

  private _activeSlashCommands = signal<Set<string>>(
    new Set([
      "heading1",
      "heading2",
      "heading3",
      "bulletList",
      "orderedList",
      "blockquote",
      "code",
      "image",
      "horizontalRule",
    ])
  );

  private _slashCommandsConfig = signal<SlashCommandsConfig>({
    commands: DEFAULT_SLASH_COMMANDS,
  });

  // Signaux publics (lecture seule)
  readonly editorState = this._editorState.asReadonly();
  readonly menuState = this._menuState.asReadonly();
  readonly demoContent = this._demoContent.asReadonly();
  readonly toolbarConfig = this._toolbarConfig.asReadonly();
  readonly bubbleMenuConfig = this._bubbleMenuConfig.asReadonly();
  readonly slashCommandsConfig = this._slashCommandsConfig.asReadonly();
  readonly activeSlashCommands = this._activeSlashCommands.asReadonly();

  // Computed values
  readonly toolbarActiveCount = computed(() => {
    const config = this._toolbarConfig();
    return Object.values(config).filter(Boolean).length;
  });

  readonly bubbleMenuActiveCount = computed(() => {
    const config = this._bubbleMenuConfig();
    return Object.values(config).filter(Boolean).length;
  });

  readonly slashCommandsActiveCount = computed(() => {
    return this._activeSlashCommands().size;
  });

  constructor() {
    this.updateSlashCommandsConfig();
  }

  // Méthodes pour l'état de l'éditeur
  updateEditorState(partialState: Partial<EditorState>) {
    this._editorState.update((state) => ({ ...state, ...partialState }));
  }

  updateMenuState(partialState: Partial<MenuState>) {
    this._menuState.update((state) => ({ ...state, ...partialState }));
  }

  updateDemoContent(content: string) {
    this._demoContent.set(content);
  }

  // Méthodes pour les configurations
  toggleToolbarItem(key: string) {
    this._toolbarConfig.update((config) => ({
      ...config,
      [key]: !(config as any)[key],
    }));
  }

  toggleBubbleMenuItem(key: string) {
    this._bubbleMenuConfig.update((config) => ({
      ...config,
      [key]: !(config as any)[key],
    }));
  }

  toggleSlashCommand(key: string) {
    this._activeSlashCommands.update((active) => {
      const newActive = new Set(active);
      if (newActive.has(key)) {
        newActive.delete(key);
      } else {
        newActive.add(key);
      }
      return newActive;
    });
    this.updateSlashCommandsConfig();
  }

  // Méthodes de vérification
  isToolbarItemActive(key: string): boolean {
    const config = this._toolbarConfig();
    return !!(config as any)[key];
  }

  isBubbleMenuItemActive(key: string): boolean {
    const config = this._bubbleMenuConfig();
    return !!(config as any)[key];
  }

  isSlashCommandActive(key: string): boolean {
    return this._activeSlashCommands().has(key);
  }

  // Méthodes de fermeture des menus
  closeAllMenus() {
    this._menuState.set({
      showToolbarMenu: false,
      showBubbleMenuMenu: false,
      showSlashCommandsMenu: false,
    });
  }

  // Réinitialiser aux valeurs par défaut
  resetToDefaults() {
    this._toolbarConfig.set({
      bold: true,
      italic: true,
      underline: true,
      heading1: true,
      heading2: true,
      bulletList: true,
      orderedList: true,
      link: true,
      image: true,
      undo: true,
      redo: true,
      separator: true,
    });

    this._bubbleMenuConfig.set({
      bold: true,
      italic: true,
      underline: true,
      strike: true,
      code: true,
      highlight: true,
      link: true,
      separator: true,
    });

    this._activeSlashCommands.set(
      new Set([
        "heading1",
        "heading2",
        "heading3",
        "bulletList",
        "orderedList",
        "blockquote",
        "code",
        "image",
        "horizontalRule",
      ])
    );

    this.updateSlashCommandsConfig();

    this._editorState.update((state) => ({
      ...state,
      showToolbar: true,
      showBubbleMenu: true,
      enableSlashCommands: true,
    }));

    this.closeAllMenus();
  }

  // Vider le contenu
  clearContent() {
    this._demoContent.set("<p></p>");
  }

  private updateSlashCommandsConfig() {
    const activeCommands = this._activeSlashCommands();
    const filteredCommands = DEFAULT_SLASH_COMMANDS.filter((command) => {
      const commandKey = this.getSlashCommandKey(command);
      return activeCommands.has(commandKey);
    });

    this._slashCommandsConfig.set({
      commands: filteredCommands,
    });
  }

  private getSlashCommandKey(command: SlashCommandItem): string {
    const keyMap: { [key: string]: string } = {
      "Titre 1": "heading1",
      "Titre 2": "heading2",
      "Titre 3": "heading3",
      "Liste à puces": "bulletList",
      "Liste numérotée": "orderedList",
      Citation: "blockquote",
      Code: "code",
      Image: "image",
      "Ligne horizontale": "horizontalRule",
    };
    return keyMap[command.title] || command.title.toLowerCase();
  }
}
