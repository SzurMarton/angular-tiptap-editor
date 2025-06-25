import { Component, input, output } from "@angular/core";

export interface TiptapButtonConfig {
  icon: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  variant?: "default" | "text" | "danger";
  size?: "small" | "medium" | "large";
}

@Component({
  selector: "tiptap-button",
  standalone: true,
  template: `
    <button
      class="tiptap-button"
      [class.is-active]="active()"
      [class.is-disabled]="disabled()"
      [class.text-button]="variant() === 'text'"
      [class.danger-button]="variant() === 'danger'"
      [class.size-small]="size() === 'small'"
      [class.size-large]="size() === 'large'"
      [disabled]="disabled()"
      [attr.title]="title()"
      (mousedown)="onMouseDown($event)"
      (click)="onClick.emit($event)"
      type="button"
    >
      <span class="material-symbols-outlined">{{ icon() }}</span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      .tiptap-button {
        background: none;
        border: 1px solid transparent;
        border-radius: 4px;
        padding: 6px;
        cursor: pointer;
        font-size: 13px;
        color: #4a5568;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
        position: relative;
      }

      .tiptap-button:hover:not(.is-disabled) {
        background: #f1f5f9;
        color: #2d3748;
      }

      .tiptap-button.is-active {
        background: #3182ce;
        color: white;
        border-color: #3182ce;
      }

      .tiptap-button.is-disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .tiptap-button.text-button {
        font-weight: 600;
        font-size: 12px;
        min-width: 32px;
        height: 32px;
      }

      .tiptap-button.danger-button:hover:not(.is-disabled) {
        background: #fed7d7;
        color: #c53030;
      }

      .tiptap-button.size-small {
        min-width: 28px;
        height: 28px;
        padding: 4px;
        font-size: 12px;
      }

      .tiptap-button.size-large {
        min-width: 40px;
        height: 40px;
        padding: 8px;
        font-size: 16px;
      }

      .tiptap-button .material-symbols-outlined {
        font-size: 16px;
        width: 16px;
        height: 16px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tiptap-button.size-small .material-symbols-outlined {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      .tiptap-button.size-large .material-symbols-outlined {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export class TiptapButtonComponent {
  // Inputs
  icon = input.required<string>();
  title = input.required<string>();
  active = input(false);
  disabled = input(false);
  variant = input<"default" | "text" | "danger">("default");
  size = input<"small" | "medium" | "large">("medium");

  // Outputs
  onClick = output<Event>();

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
  }
}
