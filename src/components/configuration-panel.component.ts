import { Component, inject, ElementRef, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfigSectionComponent } from "./config-section.component";
import { EditorConfigurationService } from "../services/editor-configuration.service";
import { CodeGeneratorService } from "../services/code-generator.service";
import {
  TOOLBAR_ITEMS,
  BUBBLE_MENU_ITEMS,
  SLASH_COMMAND_ITEMS,
} from "../config/editor-items.config";

@Component({
  selector: "app-configuration-panel",
  standalone: true,
  imports: [CommonModule, ConfigSectionComponent],
  template: `
    <!-- Sidebar de configuration -->
    <aside class="sidebar" [class.hidden]="!editorState().showSidebar">
      <div class="sidebar-container">
        <!-- Header du sidebar -->
        <div class="sidebar-header">
          <div class="header-content">
            <div class="logo">
              <span class="material-symbols-outlined">tune</span>
              <h1>Configuration</h1>
            </div>
            <div class="header-actions">
              <button
                class="panel-btn secondary"
                (click)="resetToDefaults()"
                title="Réinitialiser la configuration"
              >
                <span class="material-symbols-outlined">restart_alt</span>
              </button>
              <button
                class="panel-btn danger"
                (click)="toggleSidebar()"
                title="Fermer le panneau"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <!-- Status bar intégré -->
          <div class="status-bar">
            <div class="status-item" [class.active]="editorState().showToolbar">
              <span class="material-symbols-outlined">build</span>
              <span>{{ toolbarActiveCount() }}</span>
            </div>
            <div
              class="status-item"
              [class.active]="editorState().showBubbleMenu"
            >
              <span class="material-symbols-outlined">chat_bubble</span>
              <span>Bubble</span>
            </div>
            <div
              class="status-item"
              [class.active]="editorState().enableSlashCommands"
            >
              <span class="material-symbols-outlined">flash_on</span>
              <span>{{ slashCommandsActiveCount() }}</span>
            </div>
          </div>
        </div>

        <!-- Actions de l'éditeur dans la sidebar -->
        <div class="editor-controls">
          <button
            class="editor-control-btn"
            (click)="clearContent()"
            title="Vider l'éditeur"
          >
            <span class="material-symbols-outlined">delete</span>
            <span>Vider l'éditeur</span>
          </button>
        </div>

        <!-- Configuration sections -->
        <div class="config-sections">
          <!-- Toolbar -->
          <app-config-section
            title="Toolbar"
            icon="build"
            [items]="toolbarItems"
            [isEnabled]="editorState().showToolbar"
            [activeCount]="toolbarActiveCount()"
            [isDropdownOpen]="menuState().showToolbarMenu"
            [itemCheckFunction]="isToolbarItemActive.bind(this)"
            (toggleEnabled)="toggleToolbar()"
            (toggleDropdown)="toggleToolbarMenu()"
            (toggleItem)="toggleToolbarItem($event)"
          />

          <!-- Bubble Menu -->
          <app-config-section
            title="Bubble Menu"
            icon="chat_bubble"
            [items]="bubbleMenuItems"
            [isEnabled]="editorState().showBubbleMenu"
            [activeCount]="bubbleMenuActiveCount()"
            [isDropdownOpen]="menuState().showBubbleMenuMenu"
            [itemCheckFunction]="isBubbleMenuItemActive.bind(this)"
            (toggleEnabled)="toggleBubbleMenu()"
            (toggleDropdown)="toggleBubbleMenuMenu()"
            (toggleItem)="toggleBubbleMenuItem($event)"
          />

          <!-- Slash Commands -->
          <app-config-section
            title="Slash Commands"
            icon="flash_on"
            [items]="slashCommandItems"
            [isEnabled]="editorState().enableSlashCommands"
            [activeCount]="slashCommandsActiveCount()"
            [isDropdownOpen]="menuState().showSlashCommandsMenu"
            [itemCheckFunction]="isSlashCommandActive.bind(this)"
            (toggleEnabled)="toggleSlashCommands()"
            (toggleDropdown)="toggleSlashCommandsMenu()"
            (toggleItem)="toggleSlashCommand($event)"
          />
        </div>

        <!-- Footer -->
        <div class="sidebar-footer">
          <button class="copy-btn" (click)="copyCode()">
            <span class="material-symbols-outlined">content_copy</span>
            <span>Copier le code</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Bouton d'ouverture (quand sidebar fermée) -->
    <button
      class="open-sidebar-btn"
      *ngIf="!editorState().showSidebar && !editorState().isTransitioning"
      (click)="toggleSidebar()"
      title="Ouvrir la configuration"
    >
      <span class="material-symbols-outlined">tune</span>
    </button>

    <!-- Élément de transition pour l'animation -->
    <div class="transition-element" *ngIf="editorState().isTransitioning">
      <div class="transition-content">
        <span class="material-symbols-outlined transition-icon">tune</span>
      </div>

      <div class="transition-panel-content">
        <div class="sidebar-container">
          <!-- Header du sidebar -->
          <div class="sidebar-header">
            <div class="header-content">
              <div class="logo">
                <span class="material-symbols-outlined">tune</span>
                <h1>Configuration</h1>
              </div>
              <div class="header-actions">
                <button
                  class="panel-btn secondary"
                  (click)="resetToDefaults()"
                  title="Réinitialiser la configuration"
                >
                  <span class="material-symbols-outlined">restart_alt</span>
                </button>
                <button
                  class="panel-btn danger"
                  (click)="toggleSidebar()"
                  title="Fermer le panneau"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <!-- Status bar intégré -->
            <div class="status-bar">
              <div
                class="status-item"
                [class.active]="editorState().showToolbar"
              >
                <span class="material-symbols-outlined">build</span>
                <span>{{ toolbarActiveCount() }}</span>
              </div>
              <div
                class="status-item"
                [class.active]="editorState().showBubbleMenu"
              >
                <span class="material-symbols-outlined">chat_bubble</span>
                <span>Bubble</span>
              </div>
              <div
                class="status-item"
                [class.active]="editorState().enableSlashCommands"
              >
                <span class="material-symbols-outlined">flash_on</span>
                <span>{{ slashCommandsActiveCount() }}</span>
              </div>
            </div>
          </div>

          <!-- Actions de l'éditeur dans la sidebar -->
          <div class="editor-controls">
            <button
              class="editor-control-btn"
              (click)="clearContent()"
              title="Vider l'éditeur"
            >
              <span class="material-symbols-outlined">delete</span>
              <span>Vider l'éditeur</span>
            </button>
          </div>

          <!-- Configuration sections -->
          <div class="config-sections">
            <!-- Contenu simplifié pour la transition -->
            <div style="padding: 1rem; text-align: center; color: #64748b;">
              Configuration en cours de chargement...
            </div>
          </div>

          <!-- Footer -->
          <div class="sidebar-footer">
            <button class="copy-btn" (click)="copyCode()">
              <span class="material-symbols-outlined">content_copy</span>
              <span>Copier le code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Sidebar styles */
      .sidebar {
        position: fixed;
        top: 2rem;
        right: 1.5rem;
        width: 360px;
        height: calc(100vh - 4rem);
        background: transparent;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 0;
        box-sizing: border-box;
        z-index: 100;
        opacity: 1;
        transform: none;
      }

      .sidebar.hidden {
        display: none;
      }

      .sidebar-container {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      .sidebar-header {
        background: #f8f9fa;
        border-bottom: 1px solid #e2e8f0;
        border-radius: 16px 16px 0 0;
        flex-shrink: 0;
      }

      .header-content {
        padding: 1.25rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .logo .material-symbols-outlined {
        font-size: 20px;
        color: #6366f1;
      }

      .logo h1 {
        font-size: 1rem;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .panel-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .panel-btn.secondary {
        color: #64748b;
      }

      .panel-btn.danger {
        color: #ef4444;
      }

      .panel-btn:hover {
        transform: translateY(-1px);
      }

      .status-bar {
        padding: 1rem 1.5rem;
        background: white;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 4px;
        justify-content: space-between;
      }

      .status-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        font-size: 0.8rem;
        color: #64748b;
        background: #f8f9fa;
        flex: 1;
        justify-content: center;
      }

      .status-item.active {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.1);
      }

      .editor-controls {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e2e8f0;
        background: white;
      }

      .editor-control-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 12px;
        height: 32px;
        background: transparent;
        color: #ef4444;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        width: 100%;
        justify-content: center;
      }

      .config-sections {
        flex: 1;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .config-sections::-webkit-scrollbar {
        display: none;
      }

      .sidebar-footer {
        padding: 1.5rem;
        border-top: 1px solid #e2e8f0;
        background: #f8f9fa;
        border-radius: 0 0 16px 16px;
      }

      .copy-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0 12px;
        height: 40px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .open-sidebar-btn {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 100;
        width: 48px;
        height: 48px;
        background: white;
        color: #64748b;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .open-sidebar-btn:hover {
        color: #6366f1;
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
      }

      .open-sidebar-btn .material-symbols-outlined {
        font-size: 24px;
      }

      /* Animations - Nettoyées */

      /* Élément de transition */
      .transition-element {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 150;
        width: 48px;
        height: 48px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .transition-element.expanding {
        width: 360px;
        height: calc(100vh - 4rem);
        right: 1.5rem;
      }

      .transition-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s ease;
      }

      .transition-element.expanding .transition-content {
        opacity: 0;
        pointer-events: none;
      }

      .transition-icon {
        font-size: 24px;
        color: #64748b;
        transition: all 0.3s ease;
      }

      /* Contenu du panel dans la transition */
      .transition-panel-content {
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.4s ease 0.4s;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .transition-element.expanding .transition-panel-content {
        opacity: 1;
        transform: scale(1);
      }
    `,
  ],
})
export class ConfigurationPanelComponent {
  private configService = inject(EditorConfigurationService);
  private codeGeneratorService = inject(CodeGeneratorService);
  private elementRef = inject(ElementRef);

  // Signaux depuis le service
  readonly editorState = this.configService.editorState;
  readonly menuState = this.configService.menuState;
  readonly toolbarActiveCount = this.configService.toolbarActiveCount;
  readonly bubbleMenuActiveCount = this.configService.bubbleMenuActiveCount;
  readonly slashCommandsActiveCount =
    this.configService.slashCommandsActiveCount;

  // Configuration des items
  readonly toolbarItems = TOOLBAR_ITEMS;
  readonly bubbleMenuItems = BUBBLE_MENU_ITEMS;
  readonly slashCommandItems = SLASH_COMMAND_ITEMS;

  constructor() {
    // Ajouter le listener pour fermer les dropdowns
    effect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        const appElement = this.elementRef.nativeElement;

        if (!appElement.contains(target)) {
          return;
        }

        // Vérifier si le clic est à l'intérieur d'un menu ouvert
        const menuSections = appElement.querySelectorAll(".dropdown-section");
        let isInsideAnyMenu = false;

        menuSections.forEach((section: Element) => {
          if (section.contains(target)) {
            isInsideAnyMenu = true;
          }
        });

        // Si le clic est à l'extérieur de tous les menus, les fermer
        if (!isInsideAnyMenu) {
          this.configService.closeAllMenus();
        }
      };

      document.addEventListener("click", handleClickOutside);

      // Cleanup
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    });

    // Effect pour démarrer automatiquement l'animation d'expansion
    effect(() => {
      const isTransitioning = this.editorState().isTransitioning;

      if (isTransitioning) {
        // Démarrer l'animation après un court délai
        setTimeout(() => {
          const transitionElement = this.elementRef.nativeElement.querySelector(
            ".transition-element"
          );
          if (transitionElement) {
            transitionElement.classList.add("expanding");
          }
        }, 50);
      }
    });
  }

  // Méthodes pour la toolbar
  toggleToolbar() {
    this.configService.updateEditorState({
      showToolbar: !this.editorState().showToolbar,
    });
  }

  toggleToolbarMenu() {
    this.configService.updateMenuState({
      showToolbarMenu: !this.menuState().showToolbarMenu,
      showBubbleMenuMenu: false,
      showSlashCommandsMenu: false,
    });
  }

  toggleToolbarItem(key: string) {
    this.configService.toggleToolbarItem(key);
  }

  isToolbarItemActive(key: string): boolean {
    return this.configService.isToolbarItemActive(key);
  }

  // Méthodes pour le bubble menu
  toggleBubbleMenu() {
    this.configService.updateEditorState({
      showBubbleMenu: !this.editorState().showBubbleMenu,
    });
  }

  toggleBubbleMenuMenu() {
    this.configService.updateMenuState({
      showBubbleMenuMenu: !this.menuState().showBubbleMenuMenu,
      showToolbarMenu: false,
      showSlashCommandsMenu: false,
    });
  }

  toggleBubbleMenuItem(key: string) {
    this.configService.toggleBubbleMenuItem(key);
  }

  isBubbleMenuItemActive(key: string): boolean {
    return this.configService.isBubbleMenuItemActive(key);
  }

  // Méthodes pour les slash commands
  toggleSlashCommands() {
    this.configService.updateEditorState({
      enableSlashCommands: !this.editorState().enableSlashCommands,
    });
  }

  toggleSlashCommandsMenu() {
    this.configService.updateMenuState({
      showSlashCommandsMenu: !this.menuState().showSlashCommandsMenu,
      showToolbarMenu: false,
      showBubbleMenuMenu: false,
    });
  }

  toggleSlashCommand(key: string) {
    this.configService.toggleSlashCommand(key);
  }

  isSlashCommandActive(key: string): boolean {
    return this.configService.isSlashCommandActive(key);
  }

  // Méthodes générales
  toggleSidebar() {
    const currentState = this.editorState().showSidebar;

    if (currentState) {
      // Fermeture du sidebar
      this.configService.updateEditorState({ showSidebar: false });
    } else {
      // Ouverture avec animation de transformation
      this.configService.updateEditorState({ isTransitioning: true });

      // Après l'animation, remplacer directement par le sidebar
      setTimeout(() => {
        this.configService.updateEditorState({
          isTransitioning: false,
          showSidebar: true,
        });
      }, 850);
    }
  }

  resetToDefaults() {
    this.configService.resetToDefaults();
  }

  clearContent() {
    this.configService.clearContent();
  }

  copyCode() {
    this.codeGeneratorService.copyCode();
  }
}
