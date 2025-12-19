import { Component, inject, viewChild, signal, effect } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
  AngularTiptapEditorComponent,
  TiptapI18nService,
} from "angular-tiptap-editor";
import { MAT_ICON_DEFAULT_OPTIONS } from "@angular/material/icon";

// Import des composants
import { EditorActionsComponent } from "./components/editor-actions.component";
import { CodeViewComponent } from "./components/code-view.component";
import { ConfigurationPanelComponent } from "./components/configuration-panel.component";

// Import des services
import { EditorConfigurationService } from "./services/editor-configuration.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularTiptapEditorComponent,
    EditorActionsComponent,
    CodeViewComponent,
    ConfigurationPanelComponent,
  ],
  template: `
    <div class="app" #appRef>
      <!-- Layout principal -->
      <div
        class="container"
        [class.sidebar-hidden]="!editorState().showSidebar"
        [class.sidebar-open]="
          editorState().showSidebar || editorState().isTransitioning
        "
      >
        <!-- Éditeur principal -->
        <main class="editor-main">
          <!-- Actions de l'éditeur - Toujours visibles -->
          <app-editor-actions />

          <!-- Contenu principal -->
          <div class="main-content">
            <!-- Mode éditeur -->
            <div class="editor-view" 
                 *ngIf="!editorState().showCodeMode"
                 [class.fill-container-active]="editorState().fillContainer">
              <angular-tiptap-editor
                #editorRef
                [content]="demoContent()"
                [toolbar]="toolbarConfig()"
                [bubbleMenu]="bubbleMenuConfig()"
                [locale]="currentLocale()"
                [showBubbleMenu]="editorState().showBubbleMenu"
                [enableSlashCommands]="editorState().enableSlashCommands"
                [slashCommandsConfig]="slashCommandsConfig()"
                [showToolbar]="editorState().showToolbar"
                [placeholder]="editorState().placeholder"
                [minHeight]="editorState().minHeight"
                [height]="editorState().height"
                [maxHeight]="editorState().maxHeight"
                [fillContainer]="editorState().fillContainer"
                [autofocus]="editorState().autofocus"
                (contentChange)="onContentChange($event)"
              />
            </div>

            <!-- Mode code -->
            <app-code-view *ngIf="editorState().showCodeMode" />
          </div>
        </main>

        <!-- Panneau de configuration -->
        <app-configuration-panel />
      </div>
    </div>
  `,
  styles: [
    `
      /* Reset et base */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          sans-serif;
        line-height: 1.5;
        color: #1a1a1a;
        background: #fafafa;
        font-size: 14px;
      }

      /* Layout principal */
      .app {
        min-height: 100vh;
        background: #fafafa;
      }

      .container {
        display: block;
        min-height: 100vh;
      }

      /* Éditeur principal */
      .editor-main {
        width: var(--editor-width);
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
        background: #fafafa;
        min-height: 100vh;
        position: relative;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateX(0);
      }

      /* Ajustement de l'éditeur quand le sidebar est ouvert */
      .sidebar-open .editor-main {
        width: var(--editor-width-with-panel);
        max-width: 900px;
        transform: translateX(calc((-2 * var(--panel-width)) + 50%));
      }

      /* Ajustement pour les écrans moyens */
      @media (min-width: 769px) and (max-width: 1199px) {
        .sidebar-open .editor-main {
          transform: translateX(calc(-50vw + 50% + 2rem));
        }
      }

      /* Mobile: l'éditeur ne se déplace pas, le panel passe au-dessus */
      @media (max-width: 768px) {
        .editor-main {
          width: var(--editor-width);
          max-width: 100%;
          margin: 0 auto;
          transform: none;
        }

        .sidebar-open .editor-main {
          width: var(--editor-width);
          max-width: 100%;
          margin: 0 auto;
          transform: none;
          transition-delay: 0s;
        }
      }

      /* Contenu principal */
      .main-content {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        padding-top: 60px; /* Espace pour les actions */
      }

      .editor-view {
        animation: fadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Surbrillance quand fillContainer est activé */
      .editor-view.fill-container-active {
        position: relative;
        border: 2px dashed #6366f1;
        border-radius: 12px;
        padding: 8px;
        padding-top: 20px;
        background: rgba(99, 102, 241, 0.03);
        animation: fadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1), fillContainerPulse 2s ease-in-out infinite;
        /* Hauteur fixe pour démontrer l'effet de fillContainer */
        height: 450px;
        margin-top: 16px;
      }

      .editor-view.fill-container-active::before {
        content: 'fillContainer: true • height: 450px';
        position: absolute;
        top: -12px;
        left: 12px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 10px;
        z-index: 10;
        letter-spacing: 0.3px;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
      }

      @keyframes fillContainerPulse {
        0%, 100% {
          border-color: #6366f1;
          box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.1);
        }
        50% {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class App {
  // ViewChild pour l'éditeur
  private editorRef = viewChild<AngularTiptapEditorComponent>("editorRef");

  // Injection des services
  private configService = inject(EditorConfigurationService);
  private i18nService = inject(TiptapI18nService);

  // Signaux depuis le service
  readonly editorState = this.configService.editorState;
  readonly demoContent = this.configService.demoContent;
  readonly toolbarConfig = this.configService.toolbarConfig;
  readonly bubbleMenuConfig = this.configService.bubbleMenuConfig;
  readonly slashCommandsConfig = this.configService.slashCommandsConfig;
  readonly currentLocale = this.i18nService.currentLocale;

  constructor() {
    // Effet pour passer la référence de l'éditeur au service
    effect(() => {
      const editor = this.editorRef()?.editor();
      if (editor) {
        this.configService.setEditorReference(editor);
      }
    });
  }

  // Method to handle content changes
  onContentChange(content: string) {
    this.configService.updateDemoContent(content);
  }
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
