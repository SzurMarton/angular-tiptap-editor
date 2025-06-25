import { Injectable, signal, computed } from "@angular/core";
import { Editor } from "@tiptap/core";

export interface ImageData {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  align?: "left" | "center" | "right";
}

export interface ImageUploadResult {
  src: string;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  originalSize?: number;
}

@Injectable({
  providedIn: "root",
})
export class ImageService {
  // Signals pour l'état des images
  selectedImage = signal<ImageData | null>(null);
  isImageSelected = computed(() => this.selectedImage() !== null);
  currentAlignment = signal<"left" | "center" | "right">("center");

  // Méthodes pour la gestion des images
  selectImage(editor: Editor): void {
    if (editor.isActive("image")) {
      const attrs = editor.getAttributes("image");
      this.selectedImage.set({
        src: attrs["src"],
        alt: attrs["alt"],
        title: attrs["title"],
        width: attrs["width"],
        height: attrs["height"],
        align: attrs["align"] || "center",
      });
      this.currentAlignment.set(attrs["align"] || "center");
    } else {
      this.selectedImage.set(null);
    }
  }

  clearSelection(): void {
    this.selectedImage.set(null);
  }

  // Méthodes pour manipuler les images
  insertImage(editor: Editor, imageData: ImageData): void {
    editor.chain().focus().setImage(imageData).run();
  }

  updateImageAttributes(editor: Editor, attributes: Partial<ImageData>): void {
    if (editor.isActive("image")) {
      editor.chain().focus().updateAttributes("image", attributes).run();
      this.updateSelectedImage(attributes);
    }
  }

  alignImage(editor: Editor, alignment: "left" | "center" | "right"): void {
    if (editor.isActive("image")) {
      // Appliquer l'alignement via CSS en modifiant le conteneur parent
      const selection = editor.state.selection;
      const node = editor.state.doc.nodeAt(selection.from);

      if (node && node.type.name === "image") {
        // Trouver l'élément DOM de l'image
        const domNode = editor.view.nodeDOM(selection.from) as HTMLElement;
        if (domNode) {
          // Créer ou mettre à jour le conteneur avec la classe d'alignement
          let container = domNode.parentElement;
          if (!container || !container.classList.contains("image-container")) {
            // Créer un nouveau conteneur
            container = document.createElement("div");
            container.className = `image-container image-align-${alignment}`;
            domNode.parentNode?.insertBefore(container, domNode);
            container.appendChild(domNode);
          } else {
            // Mettre à jour la classe d'alignement
            container.className = `image-container image-align-${alignment}`;
          }
        }
      }

      this.currentAlignment.set(alignment);
      this.updateSelectedImage({ align: alignment });
    }
  }

  deleteImage(editor: Editor): void {
    if (editor.isActive("image")) {
      editor.chain().focus().deleteSelection().run();
      this.clearSelection();
    }
  }

  // Méthodes pour l'upload d'images
  async uploadImage(file: File): Promise<ImageUploadResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          // Créer une image temporaire pour obtenir les dimensions
          const img = new Image();
          img.onload = () => {
            const result: ImageUploadResult = {
              src: base64,
              name: file.name,
              size: file.size,
              type: file.type,
              width: img.width,
              height: img.height,
              originalSize: file.size,
            };
            resolve(result);
          };
          img.onerror = () =>
            reject(new Error("Erreur lors du chargement de l'image"));
          img.src = base64;
        } else {
          reject(new Error("Erreur lors de la lecture du fichier"));
        }
      };

      reader.onerror = () =>
        reject(new Error("Erreur lors de la lecture du fichier"));
      reader.readAsDataURL(file);
    });
  }

  // Méthodes utilitaires
  private updateSelectedImage(attributes: Partial<ImageData>): void {
    const current = this.selectedImage();
    if (current) {
      this.selectedImage.set({ ...current, ...attributes });
    }
  }

  // Validation des images
  validateImage(
    file: File,
    maxSize: number = 5 * 1024 * 1024
  ): { valid: boolean; error?: string } {
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: "Le fichier doit être une image" };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `L'image est trop volumineuse (max ${maxSize / 1024 / 1024}MB)`,
      };
    }

    return { valid: true };
  }

  // Compression d'image
  async compressImage(
    file: File,
    quality: number = 0.8,
    maxWidth: number = 1920,
    maxHeight: number = 1080
  ): Promise<ImageUploadResult> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Redimensionner si nécessaire
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en base64 avec compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64 = e.target?.result as string;
                if (base64) {
                  const result: ImageUploadResult = {
                    src: base64,
                    name: file.name,
                    size: blob.size,
                    type: file.type,
                    width: Math.round(width),
                    height: Math.round(height),
                    originalSize: file.size,
                  };
                  resolve(result);
                } else {
                  reject(new Error("Erreur lors de la compression"));
                }
              };
              reader.readAsDataURL(blob);
            } else {
              reject(new Error("Erreur lors de la compression"));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () =>
        reject(new Error("Erreur lors du chargement de l'image"));
      img.src = URL.createObjectURL(file);
    });
  }
}
