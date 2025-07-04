import { Component, signal, effect, ElementRef, inject } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
  TiptapEditorComponent,
  ToolbarConfig,
  BubbleMenuConfig,
} from "tiptap-editor";
import { MAT_ICON_DEFAULT_OPTIONS } from "@angular/material/icon";

// Import des types pour les slash commands
import {
  SlashCommandsConfig,
  SlashCommandItem,
  DEFAULT_SLASH_COMMANDS,
} from "tiptap-editor";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TiptapEditorComponent,
  ],
  template: `
    <div class="app" #appRef>
      <!-- Header fin -->
      <header class="header">
        <h1>Tiptap Editor</h1>
        <p>Éditeur de texte moderne pour Angular</p>
      </header>

      <!-- Layout principal -->
      <main class="main">
        <!-- Éditeur -->
        <section class="editor-section">
          <div class="editor-header">
            <h2>Éditeur</h2>
            <div class="stats">
              <span class="stat-item" [class.active]="showToolbar()">
                <span class="material-symbols-outlined">build</span>
                Toolbar ({{ getToolbarActiveCount() }})
              </span>
              <span class="stat-item" [class.active]="showBubbleMenuDemo()">
                <span class="material-symbols-outlined">chat_bubble</span>
                Bubble
              </span>
              <span class="stat-item" [class.active]="enableSlashCommands()">
                <span class="material-symbols-outlined">flash_on</span>
                Slash ({{ getSlashCommandsActiveCount() }})
              </span>
            </div>
          </div>

          <div class="editor-wrapper">
            <tiptap-editor
              [content]="demoContent()"
              [toolbar]="currentToolbarConfig()"
              [bubbleMenu]="currentBubbleMenuConfig()"
              [showBubbleMenu]="showBubbleMenuDemo()"
              [enableSlashCommands]="enableSlashCommands()"
              [slashCommandsConfig]="currentSlashCommandsConfig()"
              [showToolbar]="showToolbar()"
              [placeholder]="currentPlaceholder()"
              (contentChange)="onDemoContentChange($event)"
            >
            </tiptap-editor>
          </div>
        </section>

        <!-- Panneau de contrôle -->
        <aside class="controls">
          <div class="controls-header">
            <h3>Configuration</h3>
            <div class="header-actions">
              <button
                class="icon-btn"
                (click)="resetToDefaults()"
                title="Reset"
              >
                <span class="material-symbols-outlined">refresh</span>
              </button>
              <button
                class="icon-btn"
                (click)="clearContent()"
                title="Vider l'éditeur"
              >
                <span class="material-symbols-outlined">clear</span>
              </button>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="control-group">
            <div class="group-header">
              <div class="group-title">
                <span class="material-symbols-outlined">build</span>
                <h4>Toolbar</h4>
              </div>
              <label class="toggle">
                <input
                  type="checkbox"
                  [checked]="showToolbar()"
                  (change)="toggleToolbar()"
                />
                <span></span>
              </label>
            </div>

            <div class="menu-section" #toolbarMenuRef>
              <button
                class="menu-trigger"
                (click)="toggleToolbarMenu()"
                [class.active]="showToolbarMenu()"
              >
                <span class="material-symbols-outlined">tune</span>
                <span>Personnaliser ({{ getToolbarActiveCount() }})</span>
                <span
                  class="material-symbols-outlined chevron"
                  [class.rotated]="showToolbarMenu()"
                >
                  keyboard_arrow_down
                </span>
              </button>

              <div class="menu-dropdown" [class.open]="showToolbarMenu()">
                <div class="menu-grid">
                  <label class="menu-item" *ngFor="let item of toolbarItems">
                    <input
                      type="checkbox"
                      [checked]="isToolbarItemActive(item.key)"
                      (change)="toggleToolbarItem(item.key)"
                    />
                    <span class="checkbox-custom"></span>
                    <span class="material-symbols-outlined">{{
                      item.icon
                    }}</span>
                    <span>{{ item.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Bubble Menu -->
          <div class="control-group">
            <div class="group-header">
              <div class="group-title">
                <span class="material-symbols-outlined">chat_bubble</span>
                <h4>Bubble Menu</h4>
              </div>
              <label class="toggle">
                <input
                  type="checkbox"
                  [checked]="showBubbleMenuDemo()"
                  (change)="toggleBubbleMenu()"
                />
                <span></span>
              </label>
            </div>

            <div class="menu-section" #bubbleMenuRef>
              <button
                class="menu-trigger"
                (click)="toggleBubbleMenuMenu()"
                [class.active]="showBubbleMenuMenu()"
              >
                <span class="material-symbols-outlined">tune</span>
                <span>Personnaliser ({{ getBubbleMenuActiveCount() }})</span>
                <span
                  class="material-symbols-outlined chevron"
                  [class.rotated]="showBubbleMenuMenu()"
                >
                  keyboard_arrow_down
                </span>
              </button>

              <div class="menu-dropdown" [class.open]="showBubbleMenuMenu()">
                <div class="menu-grid">
                  <label class="menu-item" *ngFor="let item of bubbleMenuItems">
                    <input
                      type="checkbox"
                      [checked]="isBubbleMenuItemActive(item.key)"
                      (change)="toggleBubbleMenuItem(item.key)"
                    />
                    <span class="checkbox-custom"></span>
                    <span class="material-symbols-outlined">{{
                      item.icon
                    }}</span>
                    <span>{{ item.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Slash Commands -->
          <div class="control-group">
            <div class="group-header">
              <div class="group-title">
                <span class="material-symbols-outlined">flash_on</span>
                <h4>Slash Commands</h4>
              </div>
              <label class="toggle">
                <input
                  type="checkbox"
                  [checked]="enableSlashCommands()"
                  (change)="toggleSlashCommands()"
                />
                <span></span>
              </label>
            </div>

            <div class="menu-section" #slashMenuRef>
              <button
                class="menu-trigger"
                (click)="toggleSlashCommandsMenu()"
                [class.active]="showSlashCommandsMenu()"
              >
                <span class="material-symbols-outlined">tune</span>
                <span>Personnaliser ({{ getSlashCommandsActiveCount() }})</span>
                <span
                  class="material-symbols-outlined chevron"
                  [class.rotated]="showSlashCommandsMenu()"
                >
                  keyboard_arrow_down
                </span>
              </button>

              <div class="menu-dropdown" [class.open]="showSlashCommandsMenu()">
                <div class="menu-grid">
                  <label
                    class="menu-item"
                    *ngFor="let item of slashCommandItems"
                  >
                    <input
                      type="checkbox"
                      [checked]="isSlashCommandActive(item.key)"
                      (change)="toggleSlashCommand(item.key)"
                    />
                    <span class="checkbox-custom"></span>
                    <span class="material-symbols-outlined">{{
                      item.icon
                    }}</span>
                    <span>{{ item.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Code -->
          <div class="control-group">
            <div class="group-header">
              <div class="group-title">
                <span class="material-symbols-outlined">code</span>
                <h4>Code d'Exemple</h4>
              </div>
              <button
                class="icon-btn"
                (click)="copyCode()"
                title="Copier le code"
              >
                <span class="material-symbols-outlined">content_copy</span>
              </button>
            </div>

            <div class="code-block">
              <pre><code>&lt;tiptap-editor
  [toolbar]="config"
  [bubbleMenu]="bubble"
  [slashCommands]="slash"
  [enableSlashCommands]="true"
/&gt;</code></pre>
            </div>
          </div>
        </aside>
      </main>
    </div>
  `,
  styles: [
    `
      /* Reset */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          sans-serif;
        line-height: 1.5;
        color: #0f172a;
        background: #f8fafc;
        font-size: 14px;
      }

      /* Layout */
      .app {
        min-height: 100vh;
      }

      .header {
        text-align: center;
        padding: 2rem 1rem;
        background: white;
        border-bottom: 1px solid #e2e8f0;
      }

      .header h1 {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: #1e293b;
      }

      .header p {
        color: #64748b;
        font-size: 0.875rem;
      }

      .main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.5rem;
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 1.5rem;
      }

      /* Éditeur */
      .editor-section {
        background: white;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        overflow: hidden;
      }

      .editor-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8fafc;
      }

      .editor-header h2 {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
      }

      .stats {
        display: flex;
        gap: 1rem;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        color: #64748b;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: all 0.15s;
      }

      .stat-item .material-symbols-outlined {
        font-size: 14px;
      }

      .stat-item.active {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .editor-wrapper {
        padding: 1.5rem;
        min-height: 400px;
      }

      /* Contrôles */
      .controls {
        background: white;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        height: fit-content;
        position: sticky;
        top: 1.5rem;
      }

      .controls-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8fafc;
      }

      .controls-header h3 {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e293b;
      }

      .header-actions {
        display: flex;
        gap: 0.5rem;
      }

      .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: transparent;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s;
        color: #64748b;
      }

      .icon-btn:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        color: #1e293b;
      }

      .icon-btn .material-symbols-outlined {
        font-size: 16px;
      }

      /* Groupes de contrôles */
      .control-group {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #f1f5f9;
      }

      .control-group:last-child {
        border-bottom: none;
      }

      .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .group-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .group-title .material-symbols-outlined {
        font-size: 16px;
        color: #64748b;
      }

      .group-title h4 {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
      }

      /* Toggle fin */
      .toggle {
        position: relative;
        display: inline-block;
        width: 32px;
        height: 18px;
        cursor: pointer;
      }

      .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle span {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #cbd5e1;
        transition: 0.2s;
        border-radius: 18px;
      }

      .toggle span:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background: white;
        transition: 0.2s;
        border-radius: 50%;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .toggle input:checked + span {
        background: #3b82f6;
      }

      .toggle input:checked + span:before {
        transform: translateX(14px);
      }

      /* Menu déroulant */
      .menu-section {
        position: relative;
      }

      .menu-trigger {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;
        color: #64748b;
        font-size: 0.875rem;
      }

      .menu-trigger:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        color: #1e293b;
      }

      .menu-trigger.active {
        background: #dbeafe;
        border-color: #3b82f6;
        color: #1d4ed8;
      }

      .menu-trigger .material-symbols-outlined:first-child {
        font-size: 16px;
      }

      .menu-trigger span:nth-child(2) {
        flex: 1;
        text-align: left;
      }

      .chevron {
        font-size: 20px !important;
        transition: transform 0.2s;
      }

      .chevron.rotated {
        transform: rotate(180deg);
      }

      .menu-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-left: 1px solid #e2e8f0;
        border-right: 1px solid #e2e8f0;
        border-radius: 6px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 10;
        max-height: 0;
        overflow: hidden;
        transition: all 0.2s;
        margin-top: 0.25rem;
      }

      .menu-dropdown.open {
        max-height: 400px;
        overflow-y: auto;
      }

      .menu-grid {
        padding: 0.5rem;
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.25rem;
      }

      .menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s;
        font-size: 0.875rem;
        color: #1e293b;
      }

      .menu-item:hover {
        background: #f8fafc;
      }

      .menu-item input {
        display: none;
      }

      .checkbox-custom {
        width: 16px;
        height: 16px;
        border: 2px solid #cbd5e1;
        border-radius: 3px;
        position: relative;
        transition: all 0.15s;
        flex-shrink: 0;
      }

      .menu-item input:checked + .checkbox-custom {
        background: #3b82f6;
        border-color: #3b82f6;
      }

      .menu-item input:checked + .checkbox-custom:after {
        content: "";
        position: absolute;
        left: 4px;
        top: 1px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }

      .menu-item .material-symbols-outlined {
        font-size: 16px;
        color: #64748b;
      }

      .menu-item span:last-child {
        flex: 1;
      }

      /* Code block */
      .code-block {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        padding: 0.75rem;
      }

      .code-block pre {
        font-family: "SF Mono", Monaco, "Cascadia Code", Consolas, monospace;
        font-size: 0.75rem;
        line-height: 1.5;
        color: #475569;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .main {
          grid-template-columns: 1fr;
          padding: 1rem;
        }

        .header {
          padding: 1.5rem 1rem;
        }

        .controls {
          position: static;
        }

        .stats {
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-item {
          justify-content: center;
        }

        .menu-dropdown.open {
          max-height: 300px;
        }
      }
    `,
  ],
})
export class App {
  // Injection des services
  private elementRef = inject(ElementRef);

  // Signals pour l'état de la démo
  demoContent = signal(`
    <h1>Guide Complet de l'Éditeur Tiptap</h1>
    <p>Découvrez toutes les fonctionnalités de cet éditeur de texte <strong>moderne</strong> et <em>puissant</em> pour Angular.</p>
    
    <h2>Fonctionnalités de Base</h2>
    <p>L'éditeur supporte une large gamme de formatages :</p>
    <ul>
      <li><strong>Texte en gras</strong> pour mettre en évidence</li>
      <li><em>Texte en italique</em> pour l'emphase</li>
      <li><u>Texte souligné</u> pour l'importance</li>
      <li><s>Texte barré</s> pour les corrections</li>
      <li><code>Code inline</code> pour les extraits techniques</li>
    </ul>
    
    <h2>Listes et Organisation</h2>
    <p>Créez des listes ordonnées et non ordonnées :</p>
    <ol>
      <li>Premier élément important</li>
      <li>Deuxième élément avec <strong>formatage</strong></li>
      <li>Troisième élément avec <a href="https://tiptap.dev">lien vers Tiptap</a></li>
    </ol>
    
    <blockquote>
      <p>Les citations permettent de mettre en valeur des passages importants ou des témoignages clients.</p>
    </blockquote>
    
    <h2>Contenu Multimédia</h2>
    <p>Intégrez facilement des images dans vos contenus :</p>
    <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" class="tiptap-image" alt="Paysage montagneux avec lac">
    <p><em>Cliquez sur l'image ci-dessus pour accéder au menu contextuel et la redimensionner.</em></p>
    
    <h2>Commandes Rapides</h2>
    <p>Utilisez les raccourcis pour une édition efficace :</p>
    <ul>
      <li>Tapez <strong>/</strong> pour ouvrir le menu des slash commands</li>
      <li>Sélectionnez du texte pour voir apparaître le bubble menu</li>
      <li>Utilisez <strong>Ctrl+B</strong> pour mettre en gras</li>
      <li>Utilisez <strong>Ctrl+I</strong> pour mettre en italique</li>
    </ul>
    
    <hr>
    
    <h3>Personnalisation</h3>
    <p>Utilisez le panneau de droite pour :</p>
    <ul>
      <li>Activer/désactiver la toolbar</li>
      <li>Personnaliser les boutons disponibles</li>
      <li>Configurer le bubble menu</li>
      <li>Activer les slash commands</li>
    </ul>
    
    <p>Cet éditeur est parfait pour créer du contenu riche et interactif ! 🚀</p>
  `);

  // Configuration states
  currentToolbarConfig = signal<Partial<ToolbarConfig>>({
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

  currentBubbleMenuConfig = signal<Partial<BubbleMenuConfig>>({
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    code: true,
    highlight: true,
    link: true,
    separator: true,
  });

  // Configuration des slash commands
  currentSlashCommandsConfig = signal<SlashCommandsConfig>({
    commands: DEFAULT_SLASH_COMMANDS,
  });

  // État des slash commands actifs
  activeSlashCommands = signal<Set<string>>(
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

  showBubbleMenuDemo = signal(true);
  enableSlashCommands = signal(true);
  showToolbar = signal(true);
  currentPlaceholder = signal("Commencez à écrire...");

  // Menu states
  showToolbarMenu = signal(false);
  showBubbleMenuMenu = signal(false);
  showSlashCommandsMenu = signal(false);

  // Configuration des éléments disponibles
  toolbarItems = [
    { key: "bold", label: "Gras", icon: "format_bold" },
    { key: "italic", label: "Italique", icon: "format_italic" },
    { key: "underline", label: "Souligné", icon: "format_underlined" },
    { key: "strike", label: "Barré", icon: "format_strikethrough" },
    { key: "code", label: "Code", icon: "code" },
    { key: "superscript", label: "Exposant", icon: "superscript" },
    { key: "subscript", label: "Indice", icon: "subscript" },
    { key: "highlight", label: "Surligner", icon: "highlight" },
    { key: "heading1", label: "Titre 1", icon: "title" },
    { key: "heading2", label: "Titre 2", icon: "title" },
    { key: "heading3", label: "Titre 3", icon: "title" },
    { key: "bulletList", label: "Liste à puces", icon: "format_list_bulleted" },
    {
      key: "orderedList",
      label: "Liste numérotée",
      icon: "format_list_numbered",
    },
    { key: "blockquote", label: "Citation", icon: "format_quote" },
    { key: "alignLeft", label: "Aligner à gauche", icon: "format_align_left" },
    { key: "alignCenter", label: "Centrer", icon: "format_align_center" },
    {
      key: "alignRight",
      label: "Aligner à droite",
      icon: "format_align_right",
    },
    { key: "alignJustify", label: "Justifier", icon: "format_align_justify" },
    { key: "link", label: "Lien", icon: "link" },
    { key: "image", label: "Image", icon: "image" },
    {
      key: "horizontalRule",
      label: "Ligne horizontale",
      icon: "horizontal_rule",
    },
    { key: "undo", label: "Annuler", icon: "undo" },
    { key: "redo", label: "Refaire", icon: "redo" },
    { key: "separator", label: "Séparateur", icon: "more_vert" },
  ];

  bubbleMenuItems = [
    { key: "bold", label: "Gras", icon: "format_bold" },
    { key: "italic", label: "Italique", icon: "format_italic" },
    { key: "underline", label: "Souligné", icon: "format_underlined" },
    { key: "strike", label: "Barré", icon: "format_strikethrough" },
    { key: "code", label: "Code", icon: "code" },
    { key: "superscript", label: "Exposant", icon: "superscript" },
    { key: "subscript", label: "Indice", icon: "subscript" },
    { key: "highlight", label: "Surligner", icon: "highlight" },
    { key: "link", label: "Lien", icon: "link" },
    { key: "separator", label: "Séparateur", icon: "more_vert" },
  ];

  // Configuration des slash commands disponibles
  slashCommandItems = [
    { key: "heading1", label: "Titre 1", icon: "format_h1" },
    { key: "heading2", label: "Titre 2", icon: "format_h2" },
    { key: "heading3", label: "Titre 3", icon: "format_h3" },
    { key: "bulletList", label: "Liste à puces", icon: "format_list_bulleted" },
    {
      key: "orderedList",
      label: "Liste numérotée",
      icon: "format_list_numbered",
    },
    { key: "blockquote", label: "Citation", icon: "format_quote" },
    { key: "code", label: "Code", icon: "code" },
    { key: "image", label: "Image", icon: "image" },
    {
      key: "horizontalRule",
      label: "Ligne horizontale",
      icon: "horizontal_rule",
    },
  ];

  constructor() {
    // Initialiser la configuration des slash commands
    this.updateSlashCommandsConfig();

    // Ajouter le listener pour fermer les dropdowns
    effect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        const appElement = this.elementRef.nativeElement;

        if (!appElement.contains(target)) {
          return;
        }

        // Vérifier si le clic est à l'intérieur d'un menu ouvert
        const menuSections = appElement.querySelectorAll(".menu-section");
        let isInsideAnyMenu = false;

        menuSections.forEach((section: Element) => {
          if (section.contains(target)) {
            isInsideAnyMenu = true;
          }
        });

        // Si le clic est à l'extérieur de tous les menus, les fermer
        if (!isInsideAnyMenu) {
          this.closeAllMenus();
        }
      };

      document.addEventListener("click", handleClickOutside);

      // Cleanup
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    });
  }

  // Méthode pour fermer tous les menus
  private closeAllMenus() {
    this.showToolbarMenu.set(false);
    this.showBubbleMenuMenu.set(false);
    this.showSlashCommandsMenu.set(false);
  }

  // Methods for demo content changes
  onDemoContentChange(content: string) {
    this.demoContent.set(content);
  }

  // Menu toggle methods
  toggleToolbarMenu() {
    this.showToolbarMenu.update((show) => !show);
    // Fermer les autres menus
    this.showBubbleMenuMenu.set(false);
    this.showSlashCommandsMenu.set(false);
  }

  toggleBubbleMenuMenu() {
    this.showBubbleMenuMenu.update((show) => !show);
    // Fermer les autres menus
    this.showToolbarMenu.set(false);
    this.showSlashCommandsMenu.set(false);
  }

  toggleSlashCommandsMenu() {
    this.showSlashCommandsMenu.update((show) => !show);
    // Fermer les autres menus
    this.showToolbarMenu.set(false);
    this.showBubbleMenuMenu.set(false);
  }

  // Toolbar configuration methods
  toggleToolbarItem(key: string) {
    this.currentToolbarConfig.update((config) => ({
      ...config,
      [key]: !(config as any)[key],
    }));
  }

  // Bubble menu configuration methods
  toggleBubbleMenuItem(key: string) {
    this.currentBubbleMenuConfig.update((config) => ({
      ...config,
      [key]: !(config as any)[key],
    }));
  }

  // Slash commands configuration methods
  toggleSlashCommand(key: string) {
    this.activeSlashCommands.update((active) => {
      const newActive = new Set(active);
      if (newActive.has(key)) {
        newActive.delete(key);
      } else {
        newActive.add(key);
      }
      return newActive;
    });

    // Mettre à jour la configuration des slash commands
    this.updateSlashCommandsConfig();
  }

  private updateSlashCommandsConfig() {
    const activeCommands = this.activeSlashCommands();
    const filteredCommands = DEFAULT_SLASH_COMMANDS.filter((command) => {
      // Mapper les commandes aux clés
      const commandKey = this.getSlashCommandKey(command);
      return activeCommands.has(commandKey);
    });

    console.log("Updating slash commands config:", {
      activeCommands: Array.from(activeCommands),
      filteredCommands: filteredCommands.map((c) => c.title),
    });

    this.currentSlashCommandsConfig.set({
      commands: filteredCommands,
    });
  }

  private getSlashCommandKey(command: SlashCommandItem): string {
    // Mapper les titres aux clés
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

  // Toggle methods
  toggleToolbar() {
    this.showToolbar.update((show) => !show);
  }

  toggleBubbleMenu() {
    this.showBubbleMenuDemo.update((show) => !show);
  }

  toggleSlashCommands() {
    this.enableSlashCommands.update((enabled) => !enabled);
  }

  // Reset to defaults
  resetToDefaults() {
    this.currentToolbarConfig.set({
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
    this.currentBubbleMenuConfig.set({
      bold: true,
      italic: true,
      underline: true,
      strike: true,
      code: true,
      highlight: true,
      link: true,
      separator: true,
    });
    this.activeSlashCommands.set(
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
    this.showToolbar.set(true);
    this.showBubbleMenuDemo.set(true);
    this.enableSlashCommands.set(true);
    this.closeAllMenus();
  }

  clearContent() {
    this.demoContent.set("<p></p>");
  }

  // Copy code functionality
  copyCode() {
    const code = `<tiptap-editor
  [toolbar]="config"
  [bubbleMenu]="bubble"
  [slashCommands]="slash"
  [enableSlashCommands]="true"
/>`;
    navigator.clipboard.writeText(code);
  }

  // Utility methods
  isToolbarItemActive(key: string): boolean {
    const config = this.currentToolbarConfig();
    return !!(config as any)[key];
  }

  isBubbleMenuItemActive(key: string): boolean {
    const config = this.currentBubbleMenuConfig();
    return !!(config as any)[key];
  }

  isSlashCommandActive(key: string): boolean {
    return this.activeSlashCommands().has(key);
  }

  getToolbarActiveCount(): number {
    const config = this.currentToolbarConfig();
    return Object.values(config).filter(Boolean).length;
  }

  getBubbleMenuActiveCount(): number {
    const config = this.currentBubbleMenuConfig();
    return Object.values(config).filter(Boolean).length;
  }

  getSlashCommandsActiveCount(): number {
    return this.activeSlashCommands().size;
  }

  // Utility for JSON display
  JSON = JSON;
}

bootstrapApplication(App, {
  providers: [
    provideAnimationsAsync(),
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: "material-symbols-outlined" },
    },
  ],
});
