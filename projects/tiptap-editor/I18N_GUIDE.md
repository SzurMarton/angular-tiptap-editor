# 🌍 Guide d'Internationalisation - Tiptap Editor

Ce guide explique comment utiliser l'internationalisation (i18n) avec l'éditeur Tiptap pour Angular.

## 🚀 Fonctionnalités supportées

- ✅ **Détection automatique** de la langue du navigateur
- ✅ **Support complet** : Anglais (en) et Français (fr)
- ✅ **Changement dynamique** de langue sans rechargement
- ✅ **Tous les composants** : Toolbar, Bubble Menu, Slash Commands, Compteurs
- ✅ **API simple** et TypeScript-safe

## 📦 Installation

L'internationalisation est incluse par défaut dans la librairie. Aucune installation supplémentaire nécessaire.

## 🎯 Utilisation rapide

### 1. Configuration basique

```typescript
import { Component } from "@angular/core";
import { TiptapEditorComponent } from "tiptap-editor";

@Component({
  template: `
    <tiptap-editor [content]="content" [locale]="'fr'" <!-- Français -->
      [toolbar]="{ bold: true, italic: true }" [showBubbleMenu]="true"
      [enableSlashCommands]="true" >
    </tiptap-editor>
  `,
})
export class MyComponent {
  content = "<p>Bonjour le monde !</p>";
}
```

### 2. Changement dynamique de langue

```typescript
@Component({
  template: `
    <select [(ngModel)]="currentLocale">
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>

    <tiptap-editor [locale]="currentLocale"> </tiptap-editor>
  `,
})
export class MyComponent {
  currentLocale: "en" | "fr" = "fr";
}
```

## 🔧 Configuration avancée

### Service d'internationalisation

```typescript
import { Component, inject } from '@angular/core';
import { TiptapI18nService } from 'tiptap-editor';

@Component({...})
export class MyComponent {
  private i18nService = inject(TiptapI18nService);

  ngOnInit() {
    // Changer la langue programmatiquement
    this.i18nService.setLocale('fr');

    // Écouter les changements
    console.log('Langue actuelle:', this.i18nService.currentLocale());

    // Accéder aux traductions
    console.log('Traductions toolbar:', this.i18nService.toolbar());
  }
}
```

### Slash Commands internationalisés

```typescript
import {
  createI18nSlashCommands,
  TiptapI18nService
} from 'tiptap-editor';

@Component({...})
export class MyComponent {
  private i18nService = inject(TiptapI18nService);

  // Slash commands traduits automatiquement
  slashCommandsConfig = {
    commands: createI18nSlashCommands(this.i18nService)
  };
}
```

## 🎨 Traductions disponibles

### Toolbar (Barre d'outils)

- **Bold** / **Gras**
- **Italic** / **Italique**
- **Underline** / **Souligné**
- **Heading 1** / **Titre 1**
- **Bullet List** / **Liste à puces**
- **Add Link** / **Ajouter un lien**
- **Add Image** / **Ajouter une image**
- **Undo** / **Annuler**
- **Redo** / **Refaire**

### Bubble Menu (Menu contextuel)

- **Bold** / **Gras**
- **Add Link** / **Ajouter un lien**
- **Edit Link** / **Modifier le lien**
- **Remove Link** / **Supprimer le lien**

### Slash Commands (Commandes rapides)

- **Heading 1** / **Titre 1** - "Large section heading" / "Grand titre de section"
- **Bullet List** / **Liste à puces** - "Create a bullet list" / "Créer une liste à puces"
- **Image** / **Image** - "Insert an image" / "Insérer une image"

### Interface générale

- **Start typing...** / **Commencez à écrire...**
- **characters** / **caractères**
- **words** / **mots**

## 🌐 Détection automatique

Par défaut, la librairie détecte automatiquement la langue du navigateur :

```typescript
// Détection automatique
navigator.language = 'fr-FR' → Français
navigator.language = 'en-US' → Anglais
navigator.language = 'es-ES' → Anglais (fallback)
```

## 🎛️ API complète

### TiptapI18nService

```typescript
interface TiptapI18nService {
  // Propriétés
  currentLocale: Signal<"en" | "fr">;
  translations: Signal<TiptapTranslations>;

  // Méthodes
  setLocale(locale: "en" | "fr"): void;
  getSupportedLocales(): ("en" | "fr")[];
  getToolbarTitle(key: string): string;
  getBubbleMenuTitle(key: string): string;
  getSlashCommand(key: string): { title: string; description: string };
}
```

### Input du composant

```typescript
// Dans TiptapEditorComponent
@Input() locale?: 'en' | 'fr'
```

## 🛠️ Personnalisation des traductions

### Ajouter des traductions custom

```typescript
import { TiptapI18nService } from 'tiptap-editor';

@Component({...})
export class MyComponent {
  constructor(private i18nService: TiptapI18nService) {
    // Ajouter des traductions personnalisées
    this.i18nService.addTranslations('fr', {
      toolbar: {
        bold: 'Mon texte gras personnalisé'
      }
    });
  }
}
```

## 🧪 Exemple complet

```typescript
import { Component } from "@angular/core";
import { TiptapEditorComponent, TiptapI18nService } from "tiptap-editor";

@Component({
  selector: "app-multilingual-editor",
  template: `
    <div class="editor-container">
      <!-- Sélecteur de langue -->
      <div class="language-selector">
        <button
          (click)="setLanguage('en')"
          [class.active]="currentLang === 'en'"
        >
          🇺🇸 English
        </button>
        <button
          (click)="setLanguage('fr')"
          [class.active]="currentLang === 'fr'"
        >
          🇫🇷 Français
        </button>
      </div>

      <!-- Éditeur -->
      <tiptap-editor
        [content]="content"
        [locale]="currentLang"
        [toolbar]="toolbarConfig"
        [bubbleMenu]="bubbleMenuConfig"
        [showBubbleMenu]="true"
        [enableSlashCommands]="true"
        [showToolbar]="true"
        (contentChange)="onContentChange($event)"
      >
      </tiptap-editor>

      <!-- Infos de débogage -->
      <div class="debug-info">
        <p>Langue actuelle: {{ currentLang }}</p>
        <p>Titre du bouton gras: {{ getToolbarTitle("bold") }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .language-selector button {
        margin-right: 10px;
        padding: 8px 16px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      .language-selector button.active {
        background: #007bff;
        color: white;
      }
      .debug-info {
        margin-top: 20px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 4px;
      }
    `,
  ],
})
export class MultilingualEditorComponent {
  currentLang: "en" | "fr" = "fr";

  toolbarConfig = {
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
  };

  bubbleMenuConfig = {
    bold: true,
    italic: true,
    underline: true,
    link: true,
  };

  content = `
    <h1>Éditeur Multilingue</h1>
    <p>Testez les fonctionnalités en <strong>français</strong> et en <em>anglais</em>.</p>
    <ul>
      <li>Changez la langue avec les boutons</li>
      <li>Survolez les boutons de la toolbar</li>
      <li>Sélectionnez du texte pour le bubble menu</li>
      <li>Tapez "/" pour les slash commands</li>
    </ul>
  `;

  constructor(private i18nService: TiptapI18nService) {}

  setLanguage(lang: "en" | "fr") {
    this.currentLang = lang;
  }

  getToolbarTitle(key: string): string {
    return this.i18nService.getToolbarTitle(key);
  }

  onContentChange(content: string) {
    this.content = content;
  }
}
```

## 🚀 Démarrage rapide

1. **Importez** le composant avec l'internationalisation
2. **Définissez** la langue via l'input `[locale]`
3. **Testez** en changeant la langue dynamiquement
4. **Profitez** des traductions automatiques !

## 🤝 Contribution

Pour ajouter une nouvelle langue :

1. Ajoutez la langue dans `SupportedLocale`
2. Créez les traductions dans `TiptapTranslations`
3. Mettez à jour la détection automatique
4. Testez tous les composants

## 📝 Notes importantes

- ⚠️ **Rechargement** : Les traductions changent en temps réel, sans rechargement
- 🔄 **Fallback** : Si une traduction manque, l'anglais est utilisé par défaut
- 🎯 **Performance** : Les traductions utilisent les signaux Angular pour une réactivité optimale
- 🧪 **Tests** : Utilisez `src/main-i18n-example.ts` pour tester les fonctionnalités

---

Créé avec ❤️ selon la [documentation Angular i18n](https://angular.dev/guide/i18n)
