import { Component, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-toggle-switch",
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="toggle">
      <input
        type="checkbox"
        [checked]="checked()"
        (change)="onChange()"
      />
      <span></span>
    </label>
  `,
  styles: [
    `
      .toggle {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
        cursor: pointer;
      }

      .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle span {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #d1d5db;
        transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 20px;
      }

      .toggle span:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background: white;
        transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      .toggle input:checked + span {
        background: #6366f1;
      }

      .toggle input:checked + span:before {
        transform: translateX(16px);
      }
    `,
  ],
})
export class ToggleSwitchComponent {
  checked = input<boolean>(false);
  checkedChange = output<boolean>();

  onChange() {
    this.checkedChange.emit(!this.checked());
  }
}
