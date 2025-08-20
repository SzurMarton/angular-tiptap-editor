import { Injectable } from "@angular/core";
import { Editor } from "@tiptap/core";

@Injectable({
  providedIn: "root",
})
export class EditorCommandsService {
  // Méthodes pour vérifier l'état actif
  isActive(
    editor: Editor,
    name: string,
    attributes?: Record<string, any>
  ): boolean {
    return editor.isActive(name, attributes);
  }

  // Méthodes pour vérifier si une commande peut être exécutée
  canExecute(editor: Editor, command: string): boolean {
    if (!editor) return false;

    switch (command) {
      case "toggleBold":
        return editor.can().chain().focus().toggleBold().run();
      case "toggleItalic":
        return editor.can().chain().focus().toggleItalic().run();
      case "toggleStrike":
        return editor.can().chain().focus().toggleStrike().run();
      case "toggleCode":
        return editor.can().chain().focus().toggleCode().run();
      case "toggleUnderline":
        return editor.can().chain().focus().toggleUnderline().run();
      case "toggleSuperscript":
        return editor.can().chain().focus().toggleSuperscript().run();
      case "toggleSubscript":
        return editor.can().chain().focus().toggleSubscript().run();
      case "setTextAlign":
        return editor.can().chain().focus().setTextAlign("left").run();
      case "toggleLink":
        return editor.can().chain().focus().toggleLink({ href: "" }).run();
      case "insertHorizontalRule":
        return editor.can().chain().focus().setHorizontalRule().run();
      case "toggleHighlight":
        return editor.can().chain().focus().toggleHighlight().run();
      case "undo":
        return editor.can().chain().focus().undo().run();
      case "redo":
        return editor.can().chain().focus().redo().run();
      default:
        return false;
    }
  }

  // Méthodes pour exécuter les commandes
  toggleBold(editor: Editor): void {
    editor.chain().focus().toggleBold().run();
  }

  toggleItalic(editor: Editor): void {
    editor.chain().focus().toggleItalic().run();
  }

  toggleStrike(editor: Editor): void {
    editor.chain().focus().toggleStrike().run();
  }

  toggleCode(editor: Editor): void {
    editor.chain().focus().toggleCode().run();
  }

  toggleHeading(editor: Editor, level: 1 | 2 | 3): void {
    editor.chain().focus().toggleHeading({ level }).run();
  }

  toggleBulletList(editor: Editor): void {
    editor.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList(editor: Editor): void {
    editor.chain().focus().toggleOrderedList().run();
  }

  toggleBlockquote(editor: Editor): void {
    editor.chain().focus().toggleBlockquote().run();
  }

  undo(editor: Editor): void {
    editor.chain().focus().undo().run();
  }

  redo(editor: Editor): void {
    editor.chain().focus().redo().run();
  }

  // Nouvelles méthodes pour les formatages supplémentaires
  toggleUnderline(editor: Editor): void {
    editor.chain().focus().toggleUnderline().run();
  }

  toggleSuperscript(editor: Editor): void {
    editor.chain().focus().toggleSuperscript().run();
  }

  toggleSubscript(editor: Editor): void {
    editor.chain().focus().toggleSubscript().run();
  }

  setTextAlign(
    editor: Editor,
    alignment: "left" | "center" | "right" | "justify"
  ): void {
    editor.chain().focus().setTextAlign(alignment).run();
  }

  toggleLink(editor: Editor, url?: string): void {
    if (url) {
      editor.chain().focus().toggleLink({ href: url }).run();
    } else {
      // Si pas d'URL fournie, on demande à l'utilisateur
      const href = window.prompt("URL du lien:");
      if (href) {
        editor.chain().focus().toggleLink({ href }).run();
      }
    }
  }

  insertHorizontalRule(editor: Editor): void {
    editor.chain().focus().setHorizontalRule().run();
  }

  toggleHighlight(editor: Editor, color?: string): void {
    if (color) {
      editor.chain().focus().toggleHighlight({ color }).run();
    } else {
      editor.chain().focus().toggleHighlight().run();
    }
  }
}
