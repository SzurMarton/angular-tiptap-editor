import { Injectable, inject } from "@angular/core";
import { TiptapI18nService } from "tiptap-editor";
import { AppI18nService } from "./app-i18n.service";
import {
  TOOLBAR_ITEMS,
  BUBBLE_MENU_ITEMS,
  SLASH_COMMAND_ITEMS,
} from "../config/editor-items.config";
import { ConfigItem } from "../types/editor-config.types";
import { EditorConfigurationService } from "./editor-configuration.service";

@Injectable({
  providedIn: "root",
})
export class CodeGeneratorService {
  private configService = inject(EditorConfigurationService);
  private i18nService = inject(TiptapI18nService);
  private appI18nService = inject(AppI18nService);

  generateCode(): string {
    const editorState = this.configService.editorState();
    const toolbarConfig = this.configService.toolbarConfig();
    const bubbleMenuConfig = this.configService.bubbleMenuConfig();
    const activeSlashCommands = this.configService.activeSlashCommands();
    const currentLocale = this.i18nService.currentLocale();
    const codeGen = this.appI18nService.codeGeneration();

    // Générer l'input locale si une langue spécifique est sélectionnée
    const localeInput = currentLocale
      ? `\n      [locale]="${currentLocale}"`
      : "";

    return `${this.generateImports()}

${this.generateComponentDecorator(editorState, localeInput)}
export class TiptapDemoComponent {
  
  ${this.generateDemoContent(codeGen)}

  ${this.generateToolbarConfig(toolbarConfig, codeGen)}

  ${this.generateBubbleMenuConfig(bubbleMenuConfig, codeGen)}

  ${this.generateSlashCommandsConfig(activeSlashCommands, codeGen)}

  ${this.generateContentChangeHandler(codeGen)}
}`;
  }

  private generateImports(): string {
    return `import { Component } from '@angular/core';
import { TiptapEditorComponent } from 'tiptap-editor';`;
  }

  private generateComponentDecorator(
    editorState: any,
    localeInput: string
  ): string {
    return `@Component({
  selector: 'app-tiptap-demo',
  standalone: true,
  imports: [TiptapEditorComponent],
  template: \`
    <tiptap-editor
      [content]="${this.appI18nService.codeGeneration().demoContentVar}"
      [toolbar]="${this.appI18nService.codeGeneration().toolbarConfigVar}"
      [bubbleMenu]="${
        this.appI18nService.codeGeneration().bubbleMenuConfigVar
      }"${localeInput}
      [showBubbleMenu]="${editorState.showBubbleMenu}"
      [enableSlashCommands]="${editorState.enableSlashCommands}"
      [slashCommandsConfig]="${
        this.appI18nService.codeGeneration().slashCommandsConfigVar
      }"
      [showToolbar]="${editorState.showToolbar}"
      [placeholder]="${editorState.placeholder}"
      (contentChange)="${
        this.appI18nService.codeGeneration().onContentChangeVar
      }($event)"
    >
    </tiptap-editor>
  \`
})`;
  }

  private generateDemoContent(codeGen: any): string {
    return `// ${codeGen.demoContentComment}
  ${codeGen.demoContentVar} = '<p>${codeGen.placeholderContent}</p>';`;
  }

  private generateToolbarConfig(toolbarConfig: any, codeGen: any): string {
    return `// ${codeGen.toolbarConfigComment}
  ${codeGen.toolbarConfigVar} = {
${this.generateSimpleConfig(toolbarConfig, TOOLBAR_ITEMS)}
  };`;
  }

  private generateBubbleMenuConfig(
    bubbleMenuConfig: any,
    codeGen: any
  ): string {
    return `// ${codeGen.bubbleMenuConfigComment}
  ${codeGen.bubbleMenuConfigVar} = {
${this.generateSimpleConfig(bubbleMenuConfig, BUBBLE_MENU_ITEMS)}
  };`;
  }

  private generateSlashCommandsConfig(
    activeSlashCommands: any,
    codeGen: any
  ): string {
    return `// ${codeGen.slashCommandsConfigComment}
  ${codeGen.slashCommandsConfigVar} = {
    commands: [
${this.generateCompleteSlashCommandsConfig(activeSlashCommands)}
    ]
  };`;
  }

  private generateContentChangeHandler(codeGen: any): string {
    return `// ${codeGen.onContentChangeComment}
  ${codeGen.onContentChangeVar}(content: string) {
    console.log('${codeGen.contentChangedLog}', content);
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
        return `${comment}    ${item.key}: ${isActive},`;
      })
      .join("\n");
  }

  private generateCompleteSlashCommandsConfig(
    activeCommands: Set<string>
  ): string {
    const slashTranslations = this.i18nService.slashCommands();
    const currentLocale = this.i18nService.currentLocale();

    // Mapping des clés vers les traductions avec accès sécurisé
    const getTranslation = (key: string) => {
      const translations: any = slashTranslations;
      return translations[key] || { title: key, description: "", keywords: [] };
    };

    const activeCommandsArray = Array.from(activeCommands);

    return activeCommandsArray
      .map((key) => {
        const translation = getTranslation(key);
        const iconMap: Record<string, string> = {
          heading1: "format_h1",
          heading2: "format_h2",
          heading3: "format_h3",
          bulletList: "format_list_bulleted",
          orderedList: "format_list_numbered",
          blockquote: "format_quote",
          code: "code",
          image: "image",
          horizontalRule: "horizontal_rule",
        };

        const codeGen = this.appI18nService.codeGeneration();
        return `      {
        title: '${translation.title}',
        description: '${translation.description}',
        icon: '${iconMap[key]}',
        keywords: ${JSON.stringify(translation.keywords)},
        command: (editor) => {
          // ${codeGen.commandImplementation} ${key}
          ${this.generateCommandImplementation(key)}
        }
      }`;
      })
      .join(",\n");
  }

  private generateCommandImplementation(key: string): string {
    const codeGen = this.appI18nService.codeGeneration();
    const implementations: Record<string, string> = {
      heading1: "editor.chain().focus().toggleHeading({ level: 1 }).run();",
      heading2: "editor.chain().focus().toggleHeading({ level: 2 }).run();",
      heading3: "editor.chain().focus().toggleHeading({ level: 3 }).run();",
      bulletList: "editor.chain().focus().toggleBulletList().run();",
      orderedList: "editor.chain().focus().toggleOrderedList().run();",
      blockquote: "editor.chain().focus().toggleBlockquote().run();",
      code: "editor.chain().focus().toggleCodeBlock().run();",
      image: `console.log('${codeGen.implementImageUpload}');`,
      horizontalRule: "editor.chain().focus().setHorizontalRule().run();",
    };

    return (
      implementations[key] ||
      `console.log('${codeGen.commandImplementation} ${key}');`
    );
  }

  // Copier le code dans le presse-papiers
  async copyCode(): Promise<void> {
    try {
      const code = this.generateCode();
      await navigator.clipboard.writeText(code);
      const successMessage =
        this.appI18nService.currentLocale() === "fr"
          ? "Code copié dans le presse-papiers !"
          : "Code copied to clipboard!";
      console.log(successMessage);
    } catch (error) {
      const errorMessage =
        this.appI18nService.currentLocale() === "fr"
          ? "Erreur lors de la copie:"
          : "Error copying code:";
      console.error(errorMessage, error);
    }
  }

  // Méthode pour colorer le code (placeholder pour l'instant)
  highlightCode(code: string): string {
    // Retourner le code brut sans coloration pour éviter les problèmes d'affichage
    return code;
  }
}
