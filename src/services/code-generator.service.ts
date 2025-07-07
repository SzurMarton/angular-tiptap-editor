import { Injectable, inject } from "@angular/core";
import { EditorConfigurationService } from "./editor-configuration.service";
import { TiptapI18nService } from "tiptap-editor";
import {
  TOOLBAR_ITEMS,
  BUBBLE_MENU_ITEMS,
  SLASH_COMMAND_ITEMS,
} from "../config/editor-items.config";
import { ConfigItem } from "../types/editor-config.types";

@Injectable({
  providedIn: "root",
})
export class CodeGeneratorService {
  private configService = inject(EditorConfigurationService);
  private i18nService = inject(TiptapI18nService);

  generateCode(): string {
    const editorState = this.configService.editorState();
    const toolbarConfig = this.configService.toolbarConfig();
    const bubbleMenuConfig = this.configService.bubbleMenuConfig();
    const activeSlashCommands = this.configService.activeSlashCommands();
    const demoContent = this.configService.demoContent();
    const currentLocale = this.i18nService.currentLocale();

    // Générer l'input locale si une langue spécifique est sélectionnée
    const localeInput = currentLocale
      ? `\n      [locale]="${currentLocale}"`
      : "";

    return `import { Component } from '@angular/core';
import { TiptapEditorComponent } from 'tiptap-editor';

@Component({
  selector: 'app-tiptap-demo',
  standalone: true,
  imports: [TiptapEditorComponent],
  template: \`
    <tiptap-editor
      [content]="demoContent"
      [toolbar]="toolbarConfig"
      [bubbleMenu]="bubbleMenuConfig"${localeInput}
      [showBubbleMenu]="${editorState.showBubbleMenu}"
      [enableSlashCommands]="${editorState.enableSlashCommands}"
      [slashCommandsConfig]="slashCommandsConfig"
      [showToolbar]="${editorState.showToolbar}"
      [placeholder]="${editorState.placeholder}"
      (contentChange)="onContentChange($event)"
    >
    </tiptap-editor>
  \`
})
export class TiptapDemoComponent {
  
  // Contenu de démo
  demoContent = \`${this.escapeTemplateString(demoContent)}\`;

  // Configuration de la toolbar (approche simple - booleans)
  // ✅ Facile à utiliser : toolbar = { bold: true, italic: false }
  // ✅ Configuration rapide pour l'usage quotidien
  // ✅ Moins de code à maintenir
  toolbarConfig = {
${this.generateSimpleConfig(toolbarConfig, TOOLBAR_ITEMS)}
  };

  // Configuration du bubble menu (approche simple - booleans)
  // ✅ Même logique que la toolbar - simple et efficace
  bubbleMenuConfig = {
${this.generateSimpleConfig(bubbleMenuConfig, BUBBLE_MENU_ITEMS)}
  };

  // Configuration des slash commands (approche complète - objets)
  // ✅ Plus de contrôle pour les commandes complexes
  // ✅ Personnalisation avancée (title, description, keywords, command)
  // ✅ Justifie la complexité supplémentaire
  slashCommandsConfig = {
    commands: [
${this.generateCompleteSlashCommandsConfig(activeSlashCommands)}
    ]
  };

  onContentChange(content: string) {
    console.log('Contenu modifié:', content);
  }
}`;
  }

  private generateSimpleConfig(
    config: Record<string, boolean>,
    availableItems: ConfigItem[]
  ): string {
    return availableItems
      .filter((item) => item.key !== "separator")
      .map((item) => {
        const isActive = config[item.key] === true;
        const comment = isActive ? "" : " // ";
        return `${comment}    ${item.key}: ${isActive}, // ${item.label}`;
      })
      .join("\n");
  }

  private generateCompleteSlashCommandsConfig(
    activeCommands: Set<string>
  ): string {
    return SLASH_COMMAND_ITEMS.filter((item) => activeCommands.has(item.key))
      .map(
        (item) => `      {
        title: '${item.label}',
        description: 'Insérer ${item.label.toLowerCase()}',
        icon: '${item.icon}',
        keywords: ['${item.key}', '${item.label.toLowerCase()}'],
        command: (editor) => {
          // Implémentation spécifique pour ${item.key}
          ${this.generateCommandImplementation(item.key)}
        }
      }`
      )
      .join(",\n");
  }

  private generateCommandImplementation(key: string): string {
    const implementations: Record<string, string> = {
      heading1: "editor.chain().focus().toggleHeading({ level: 1 }).run();",
      heading2: "editor.chain().focus().toggleHeading({ level: 2 }).run();",
      heading3: "editor.chain().focus().toggleHeading({ level: 3 }).run();",
      bulletList: "editor.chain().focus().toggleBulletList().run();",
      orderedList: "editor.chain().focus().toggleOrderedList().run();",
      blockquote: "editor.chain().focus().toggleBlockquote().run();",
      code: "editor.chain().focus().toggleCodeBlock().run();",
      image: "console.log('Implémenter upload d\\'image');",
      horizontalRule: "editor.chain().focus().setHorizontalRule().run();",
    };

    return (
      implementations[key] || `console.log('Commande ${key} à implémenter');`
    );
  }

  private escapeTemplateString(content: string): string {
    return content
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$");
  }

  // Copier le code dans le presse-papiers
  async copyCode(): Promise<void> {
    try {
      const code = this.generateCode();
      await navigator.clipboard.writeText(code);
      console.log("Code copié dans le presse-papiers !");
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  }

  // Méthode pour colorer le code (placeholder pour l'instant)
  highlightCode(code: string): string {
    // Retourner le code brut sans coloration pour éviter les problèmes d'affichage
    return code;
  }
}
