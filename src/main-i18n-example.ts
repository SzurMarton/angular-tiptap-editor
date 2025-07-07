import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TiptapEditorComponent } from "tiptap-editor";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { MAT_ICON_DEFAULT_OPTIONS } from "@angular/material/icon";

@Component({
  selector: "app-i18n-example",
  standalone: true,
  imports: [CommonModule, FormsModule, TiptapEditorComponent],
  template: `
    <div class="app">
      <div class="header">
        <h1>🌍 Tiptap Editor - Internationalisation</h1>
        <div class="language-selector">
          <label for="language">Langue :</label>
          <select
            id="language"
            [(ngModel)]="selectedLocale"
            class="language-select"
          >
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇫🇷 Français</option>
          </select>
        </div>
      </div>

      <div class="editor-container">
        <tiptap-editor
          [content]="demoContent"
          [toolbar]="toolbarConfig"
          [bubbleMenu]="bubbleMenuConfig"
          [locale]="selectedLocale"
          [showBubbleMenu]="true"
          [enableSlashCommands]="true"
          [showToolbar]="true"
          [placeholder]="''"
          (contentChange)="onContentChange($event)"
        >
        </tiptap-editor>
      </div>

      <div class="info">
        <h3>✨ Fonctionnalités testées :</h3>
        <ul>
          <li>🔧 <strong>Toolbar</strong> - Tooltips traduits en temps réel</li>
          <li>
            💬 <strong>Bubble Menu</strong> - Interface contextuelle multilingue
          </li>
          <li>
            ⚡ <strong>Slash Commands</strong> - Commandes avec descriptions
            traduites
          </li>
          <li>
            📊 <strong>Compteur</strong> - "caractères/mots" vs
            "characters/words"
          </li>
          <li>
            🔄 <strong>Changement dynamique</strong> - Sans rechargement de page
          </li>
        </ul>

        <div class="test-instructions">
          <h4>🧪 Instructions de test :</h4>
          <ol>
            <li>Changez la langue avec le sélecteur ci-dessus</li>
            <li>Survolez les boutons de la toolbar → tooltips traduits</li>
            <li>Sélectionnez du texte → bubble menu traduit</li>
            <li>Tapez "/" → slash commands avec descriptions traduites</li>
            <li>Regardez le compteur en bas → unités traduites</li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .app {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          sans-serif;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
      }

      .header h1 {
        margin: 0;
        color: #1a202c;
        font-size: 2rem;
      }

      .language-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .language-selector label {
        font-weight: 600;
        color: #4a5568;
      }

      .language-select {
        padding: 0.5rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        font-size: 1rem;
        cursor: pointer;
        transition: border-color 0.2s ease;
      }

      .language-select:hover {
        border-color: #6366f1;
      }

      .language-select:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .editor-container {
        margin-bottom: 2rem;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .info {
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #6366f1;
      }

      .info h3 {
        margin: 0 0 1rem 0;
        color: #1a202c;
      }

      .info ul {
        margin: 0 0 1.5rem 0;
        padding-left: 1.5rem;
      }

      .info li {
        margin-bottom: 0.5rem;
        color: #4a5568;
      }

      .test-instructions {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }

      .test-instructions h4 {
        margin: 0 0 0.5rem 0;
        color: #1a202c;
      }

      .test-instructions ol {
        margin: 0;
        padding-left: 1.5rem;
      }

      .test-instructions li {
        margin-bottom: 0.25rem;
        color: #4a5568;
        font-size: 0.9rem;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .app {
          padding: 1rem;
        }

        .header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .header h1 {
          font-size: 1.5rem;
        }
      }
    `,
  ],
})
export class I18nExampleApp {
  selectedLocale: "en" | "fr" = "fr"; // Français par défaut

  // Configuration simple pour la démo
  toolbarConfig = {
    bold: true,
    italic: true,
    underline: true,
    heading1: true,
    heading2: true,
    bulletList: true,
    orderedList: true,
    blockquote: true,
    link: true,
    image: true,
    undo: true,
    redo: true,
    separator: true,
  };

  bubbleMenuConfig = {
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    code: true,
    highlight: true,
    link: true,
    separator: true,
  };

  // Contenu de démo bilingue
  demoContent = `
    <h1>🌍 Test d'Internationalisation</h1>
    <p>Cette démo teste l'<strong>internationalisation</strong> de l'éditeur Tiptap.</p>
    
    <h2>🔧 Fonctionnalités testées</h2>
    <ul>
      <li><strong>Toolbar</strong> - Changez la langue et survolez les boutons</li>
      <li><em>Bubble Menu</em> - Sélectionnez ce texte pour voir le menu</li>
      <li><code>Slash Commands</code> - Tapez "/" pour voir les commandes</li>
    </ul>

    <blockquote>
      <p>💡 L'internationalisation permet de créer des applications accessibles à un public mondial.</p>
    </blockquote>

    <h2>🚀 Instructions</h2>
    <ol>
      <li>Changez la langue avec le sélecteur en haut</li>
      <li>Interagissez avec l'éditeur</li>
      <li>Observez les traductions en temps réel</li>
    </ol>

    <p>Parfait pour créer du contenu multilingue ! 🎯</p>
  `;

  onContentChange(content: string) {
    console.log("Contenu modifié:", content);
  }
}

bootstrapApplication(I18nExampleApp, {
  providers: [
    provideAnimationsAsync(),
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: "material-symbols-outlined" },
    },
  ],
});
