import {
    Component,
    ElementRef,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
    viewChild,
} from "@angular/core";
import type { Editor } from "@tiptap/core";
import { ColorPickerService } from "../services/color-picker.service";
import { TiptapButtonComponent } from "../tiptap-button.component";
import { TiptapI18nService } from "../services/i18n.service";

export type ColorPickerMode = "text" | "highlight";

@Component({
    selector: "tiptap-color-picker",
    standalone: true,
    imports: [TiptapButtonComponent],
    template: `
    <div class="color-picker-container" [class.is-highlight]="mode() === 'highlight'">
      <tiptap-button
        [icon]="buttonIcon()"
        [title]="mode() === 'text' ? t().textColor : t().highlight"
        [color]="buttonTextColor()"
        [backgroundColor]="buttonBgColor()"
        (onClick)="triggerPicker()"
      >
        <input
          #colorInput
          type="color"
          [value]="currentColor()"
          (mousedown)="onColorMouseDown($event)"
          (input)="onColorInput($event)"
          (change)="onColorPickerClose()"
          (blur)="onColorPickerClose()"
        />
      </tiptap-button>

      @if (hasColorApplied()) {
      <button
        class="btn-clear-badge"
        type="button"
        [title]="t().clear"
        (mousedown)="onClearBadgeMouseDown($event)"
        (click)="onClearBadgeClick($event)"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
      }
    </div>
  `,
    styles: [
        `
      .color-picker-container {
        position: relative;
        display: inline-flex;
        align-items: center;
      }

      .color-picker-container tiptap-button {
        position: relative;
      }

      .btn-clear-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 14px;
        height: 14px;
        padding: 0;
        border: none;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.75);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        opacity: 0;
        pointer-events: none;
        transition: opacity 120ms ease;
      }

      .color-picker-container:hover .btn-clear-badge {
        opacity: 1;
        pointer-events: auto;
      }

      .btn-clear-badge .material-symbols-outlined {
        font-size: 10px;
        line-height: 1;
      }

      input[type="color"] {
        position: absolute;
        inset: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        z-index: 5;
      }
    `,
    ],
})
export class TiptapColorPickerComponent {
    editor = input.required<Editor>();
    mode = input<ColorPickerMode>("text");

    interactionChange = output<boolean>();
    requestUpdate = output<void>();

    private colorInputRef = viewChild<ElementRef<HTMLInputElement>>("colorInput");
    private colorPickerSvc = inject(ColorPickerService);
    private i18nService = inject(TiptapI18nService);

    readonly t = this.i18nService.toolbar;

    private previewColor = signal<string | null>(null);
    private isPicking = signal(false);
    private editorChange = signal(0);

    constructor() {
        effect(() => {
            const ed = this.editor();
            if (!ed) return;

            const update = () => this.notifyEditorChange();

            ed.on("transaction", update);
            ed.on("selectionUpdate", update);
            ed.on("focus", update);

            return () => {
                ed.off("transaction", update);
                ed.off("selectionUpdate", update);
                ed.off("focus", update);
            };
        });
    }

    /**
     * Notify Angular that the editor state should be re-read.
     */
    private notifyEditorChange() {
        this.editorChange.update((v) => v + 1);
    }

    readonly currentColor = computed(() => {
        this.editorChange();
        if (this.previewColor()) return this.previewColor()!;

        const editor = this.editor();
        return this.mode() === "text"
            ? this.colorPickerSvc.getCurrentColor(editor)
            : this.colorPickerSvc.getCurrentHighlight(editor);
    });

    readonly hasColorApplied = computed(() => {
        this.editorChange();
        if (this.previewColor()) return true;

        const editor = this.editor();
        return this.mode() === "text"
            ? this.colorPickerSvc.hasColorApplied(editor)
            : this.colorPickerSvc.hasHighlightApplied(editor);
    });

    /**
     * Determine the icon to display.
     */
    readonly buttonIcon = computed(() => {
        if (this.mode() === "text") return "format_color_text";
        return "format_color_fill";
    });

    /**
     * Determine the background color of the button.
     */
    readonly buttonBgColor = computed(() => {
        const color = this.currentColor();
        if (this.mode() === "highlight") {
            return this.hasColorApplied() ? color : "";
        }

        // Mode TEXT: Provide contrast background if the text color is too light
        // (especially useful when the text color is white on a light toolbar)
        if (this.hasColorApplied() && this.colorPickerSvc.getLuminance(color) > 200) {
            return "#333333";
        }

        return "";
    });

    /**
     * Determine the text/icon color of the button.
     */
    readonly buttonTextColor = computed(() => {
        const color = this.currentColor();
        if (this.mode() === "text") {
            return this.hasColorApplied() ? color : "var(--ate-text-secondary)";
        }

        // For highlight, if background is set, use black/white contrast for icon
        if (this.hasColorApplied()) {
            return this.colorPickerSvc.getLuminance(color) > 128 ? "#000000" : "#ffffff";
        }

        return "var(--ate-text-secondary)";
    });

    private _syncEffect = void effect(() => {
        const el = this.colorInputRef()?.nativeElement;
        if (!el) return;
        el.value = this.currentColor();
    });

    /**
     * Keep the native <input type="color"> in sync with selection changes.
     */
    syncColorInputValue() {
        this.previewColor.set(null);
        this.isPicking.set(false);
        this.notifyEditorChange();
    }

    triggerPicker() {
        this.colorInputRef()?.nativeElement.click();
    }

    onColorMouseDown(event: MouseEvent) {
        event.stopPropagation();
        this.colorPickerSvc.captureSelection(this.editor());
        this.isPicking.set(true);
        this.interactionChange.emit(true);
    }

    onColorPickerClose() {
        this.previewColor.set(null);
        this.isPicking.set(false);

        const inputEl = this.colorInputRef()?.nativeElement;
        if (inputEl) {
            if (this.mode() === "text") {
                this.colorPickerSvc.applyColor(this.editor(), inputEl.value, {
                    addToHistory: true,
                });
            } else {
                this.colorPickerSvc.applyHighlight(this.editor(), inputEl.value, {
                    addToHistory: true,
                });
            }
        }

        this.colorPickerSvc.done();
        this.interactionChange.emit(false);
        this.requestUpdate.emit();
    }

    onColorInput(event: Event) {
        const inputEl = event.target as HTMLInputElement;
        const color = inputEl.value;

        this.previewColor.set(this.colorPickerSvc.normalizeColor(color));

        if (this.mode() === "text") {
            this.colorPickerSvc.applyColor(this.editor(), color, {
                addToHistory: false,
            });
        } else {
            this.colorPickerSvc.applyHighlight(this.editor(), color, {
                addToHistory: false,
            });
        }

        this.requestUpdate.emit();
    }

    onClearBadgeMouseDown(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onClearBadgeClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.previewColor.set(null);
        this.isPicking.set(false);

        if (this.mode() === "text") {
            this.colorPickerSvc.unsetColor(this.editor());
        } else {
            this.colorPickerSvc.unsetHighlight(this.editor());
        }

        this.requestUpdate.emit();
    }

    done() {
        this.colorPickerSvc.done();
    }
}
