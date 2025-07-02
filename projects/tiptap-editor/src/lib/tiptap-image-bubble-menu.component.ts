import {
  Component,
  input,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  computed,
  inject,
  effect,
} from "@angular/core";
import tippy, { Instance as TippyInstance } from "tippy.js";
import type { Editor } from "@tiptap/core";
import { TiptapButtonComponent } from "./tiptap-button.component";
import { TiptapSeparatorComponent } from "./tiptap-separator.component";
import { ImageService } from "./services/image.service";
import { ImageBubbleMenuConfig } from "./models/bubble-menu.model";

@Component({
  selector: "tiptap-image-bubble-menu",
  standalone: true,
  imports: [TiptapButtonComponent, TiptapSeparatorComponent],
  template: `
    <div #menuRef class="bubble-menu">
      @if (imageBubbleMenuConfig().changeImage) {
      <tiptap-button
        icon="edit"
        title="Changer l'image"
        (click)="onCommand('changeImage', $event)"
      ></tiptap-button>
      } @if (imageBubbleMenuConfig().separator && hasResizeButtons()) {
      <tiptap-separator></tiptap-separator>
      } @if (imageBubbleMenuConfig().resizeSmall) {
      <tiptap-button
        icon="crop_square"
        title="Petite (300×200)"
        (click)="onCommand('resizeSmall', $event)"
      ></tiptap-button>
      } @if (imageBubbleMenuConfig().resizeMedium) {
      <tiptap-button
        icon="crop_landscape"
        title="Moyenne (500×350)"
        (click)="onCommand('resizeMedium', $event)"
      ></tiptap-button>
      } @if (imageBubbleMenuConfig().resizeLarge) {
      <tiptap-button
        icon="crop_free"
        title="Grande (800×600)"
        (click)="onCommand('resizeLarge', $event)"
      ></tiptap-button>
      } @if (imageBubbleMenuConfig().resizeOriginal) {
      <tiptap-button
        icon="restore"
        title="Taille originale"
        (click)="onCommand('resizeOriginal', $event)"
      ></tiptap-button>
      } @if (imageBubbleMenuConfig().separator &&
      imageBubbleMenuConfig().deleteImage) {
      <tiptap-separator></tiptap-separator>
      } @if (imageBubbleMenuConfig().deleteImage) {
      <tiptap-button
        icon="delete"
        title="Supprimer l'image"
        variant="danger"
        (click)="onCommand('deleteImage', $event)"
      ></tiptap-button>
      }
    </div>
  `,
  styles: [],
})
export class TiptapImageBubbleMenuComponent implements OnInit, OnDestroy {
  editor = input.required<Editor>();
  config = input<ImageBubbleMenuConfig>({
    changeImage: true,
    resizeSmall: true,
    resizeMedium: true,
    resizeLarge: true,
    resizeOriginal: true,
    deleteImage: true,
    separator: true,
  });

  @ViewChild("menuRef", { static: false }) menuRef!: ElementRef<HTMLDivElement>;

  private tippyInstance: TippyInstance | null = null;
  private imageService = inject(ImageService);
  private updateTimeout: any = null;

  imageBubbleMenuConfig = computed(() => ({
    changeImage: true,
    resizeSmall: true,
    resizeMedium: true,
    resizeLarge: true,
    resizeOriginal: true,
    deleteImage: true,
    separator: true,
    ...this.config(),
  }));

  hasResizeButtons = computed(() => {
    const config = this.imageBubbleMenuConfig();
    return (
      config.resizeSmall ||
      config.resizeMedium ||
      config.resizeLarge ||
      config.resizeOriginal
    );
  });

  constructor() {
    effect(() => {
      const ed = this.editor();
      if (!ed) return;

      // Nettoyer les anciens listeners
      ed.off("selectionUpdate", this.updateMenu);
      ed.off("transaction", this.updateMenu);
      ed.off("focus", this.updateMenu);
      ed.off("blur", this.handleBlur);

      // Ajouter les nouveaux listeners
      ed.on("selectionUpdate", this.updateMenu);
      ed.on("transaction", this.updateMenu);
      ed.on("focus", this.updateMenu);
      ed.on("blur", this.handleBlur);
      this.updateMenu();
    });
  }

  ngOnInit() {
    // Initialiser Tippy de manière synchrone après que le component soit ready
    this.initTippy();
  }

  ngOnDestroy() {
    const ed = this.editor();
    if (ed) {
      ed.off("selectionUpdate", this.updateMenu);
      ed.off("transaction", this.updateMenu);
      ed.off("focus", this.updateMenu);
      ed.off("blur", this.handleBlur);
    }

    // Nettoyer les timeouts
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    // Nettoyer Tippy
    if (this.tippyInstance) {
      this.tippyInstance.destroy();
      this.tippyInstance = null;
    }
  }

  private initTippy() {
    // Attendre que l'élément soit disponible
    if (!this.menuRef?.nativeElement) {
      setTimeout(() => this.initTippy(), 50);
      return;
    }

    const menuElement = this.menuRef.nativeElement;

    // S'assurer qu'il n'y a pas déjà une instance
    if (this.tippyInstance) {
      this.tippyInstance.destroy();
    }

    // Créer l'instance Tippy
    this.tippyInstance = tippy(document.body, {
      content: menuElement,
      trigger: "manual",
      placement: "top-start",
      appendTo: () => document.body,
      interactive: true,
      arrow: false,
      offset: [0, 8],
      hideOnClick: false,
      onShow: (instance) => {
        // S'assurer que les autres menus sont fermés
        this.hideOtherMenus();
      },
      getReferenceClientRect: () => this.getImageRect(),
    });
  }

  private getImageRect(): DOMRect {
    const ed = this.editor();
    if (!ed) return new DOMRect(0, 0, 0, 0);

    // Trouver l'image sélectionnée dans le DOM
    const { from } = ed.state.selection;
    const node = ed.view.domAtPos(from).node;

    // Chercher l'élément image
    let imageElement: HTMLElement | null = null;
    if (node.nodeType === Node.ELEMENT_NODE) {
      imageElement = node as HTMLElement;
      if (
        !imageElement.tagName ||
        imageElement.tagName.toLowerCase() !== "img"
      ) {
        imageElement = imageElement.querySelector("img");
      }
    } else if (node.parentElement) {
      imageElement = node.parentElement.querySelector("img");
    }

    if (imageElement) {
      return imageElement.getBoundingClientRect();
    }

    return new DOMRect(0, 0, 0, 0);
  }

  updateMenu = () => {
    // Debounce pour éviter les appels trop fréquents
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      const ed = this.editor();
      if (!ed) return;

      const isImageSelected =
        ed.isActive("resizableImage") || ed.isActive("image");
      const { from, to } = ed.state.selection;
      const hasTextSelection = from !== to;

      // Debug temporaire
      console.log("Image menu debug:", {
        isImageSelected,
        hasTextSelection,
        isEditable: ed.isEditable,
        from,
        to,
      });

      // Ne montrer le menu image que si :
      // - Une image est sélectionnée
      // - L'éditeur est éditable
      const shouldShow = isImageSelected && ed.isEditable;

      console.log("Image menu shouldShow:", shouldShow);

      if (shouldShow) {
        this.showTippy();
      } else {
        this.hideTippy();
      }
    }, 10);
  };

  handleBlur = () => {
    // Masquer le menu quand l'éditeur perd le focus
    setTimeout(() => {
      this.hideTippy();
    }, 100);
  };

  private hideOtherMenus() {
    // Cette méthode peut être étendue pour fermer d'autres menus si nécessaire
    // Pour l'instant, elle sert de placeholder pour une future coordination entre menus
  }

  private showTippy() {
    if (!this.tippyInstance) return;

    // Mettre à jour la position
    this.tippyInstance.setProps({
      getReferenceClientRect: () => this.getImageRect(),
    });

    this.tippyInstance.show();
  }

  private hideTippy() {
    if (this.tippyInstance) {
      this.tippyInstance.hide();
    }
  }

  onCommand(command: string, event: MouseEvent) {
    event.preventDefault();
    const ed = this.editor();
    if (!ed) return;

    switch (command) {
      case "changeImage":
        this.changeImage();
        break;
      case "resizeSmall":
        this.imageService.resizeImageToSmall(ed);
        break;
      case "resizeMedium":
        this.imageService.resizeImageToMedium(ed);
        break;
      case "resizeLarge":
        this.imageService.resizeImageToLarge(ed);
        break;
      case "resizeOriginal":
        this.imageService.resizeImageToOriginal(ed);
        break;
      case "deleteImage":
        this.deleteImage();
        break;
    }
  }

  private changeImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const result = await this.imageService.compressImage(file);
        const ed = this.editor();
        if (ed) {
          // Remplacer l'image existante
          ed.chain()
            .focus()
            .updateAttributes("resizableImage", {
              src: result.src,
              alt: result.name,
              width: result.width,
              height: result.height,
            })
            .run();
        }
      } catch (error) {
        console.error("Erreur lors du changement d'image:", error);
      }
    });

    input.click();
  }

  private deleteImage() {
    const ed = this.editor();
    if (ed) {
      ed.chain().focus().deleteSelection().run();
    }
  }
}
