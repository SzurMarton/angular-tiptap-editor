import { Injectable, computed } from "@angular/core";
import {
  ToolbarConfig,
  BubbleMenuConfig,
  SlashCommandsConfig,
} from "tiptap-editor";
import { EditorConfigurationService } from "./editor-configuration.service";

@Injectable({
  providedIn: "root",
})
export class CodeGeneratorService {
  constructor(private configService: EditorConfigurationService) {}

  // Computed pour le code généré
  readonly generatedCode = computed(() => {
    const toolbarConfig = this.configService.toolbarConfig();
    const bubbleMenuConfig = this.configService.bubbleMenuConfig();
    const slashCommandsConfig = this.configService.slashCommandsConfig();
    const editorState = this.configService.editorState();

    // Filtrer les propriétés actives seulement
    const activeToolbar = Object.entries(toolbarConfig)
      .filter(([_, value]) => value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const activeBubbleMenu = Object.entries(bubbleMenuConfig)
      .filter(([_, value]) => value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const toolbarConfigStr = JSON.stringify(activeToolbar, null, 2);
    const bubbleMenuConfigStr = JSON.stringify(activeBubbleMenu, null, 2);

    // Simplifier la config des slash commands
    const hasSlashCommands =
      slashCommandsConfig.commands && slashCommandsConfig.commands.length > 0;
    const slashCommandsStr = hasSlashCommands
      ? `{\n  commands: [\n    // ${
          slashCommandsConfig.commands?.length || 0
        } commandes configurées\n  ]\n}`
      : "{ commands: [] }";

    return `import { Component } from '@angular/core';
import { TiptapEditorComponent } from 'tiptap-editor';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TiptapEditorComponent],
  template: \`
    <tiptap-editor
      [content]="content"
      [toolbar]="toolbarConfig"
      [bubbleMenu]="bubbleMenuConfig"
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
export class ExampleComponent {
  content = '<p>Votre contenu initial...</p>';
  
  toolbarConfig = ${toolbarConfigStr};
  
  bubbleMenuConfig = ${bubbleMenuConfigStr};
  
  slashCommandsConfig = ${slashCommandsStr};
  
  onContentChange(content: string) {
    console.log('Content changed:', content);
  }
}`;
  });

  // Copier le code dans le presse-papiers
  async copyCode(): Promise<void> {
    try {
      const code = this.generatedCode();
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
