import { Component, inject, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToggleSwitchComponent } from "./toggle-switch.component";
import { EditorConfigurationService } from "../services/editor-configuration.service";
import { AppI18nService } from "../services/app-i18n.service";

@Component({
  selector: "app-fill-container-config",
  standalone: true,
  imports: [CommonModule, ToggleSwitchComponent],
  template: `
    <section class="config-section">
      <div class="section-header">
        <div class="section-title">
          <span class="material-symbols-outlined">fullscreen</span>
          <span>{{ label() }}</span>
        </div>
        <app-toggle-switch
          [checked]="isEnabled()"
          (checkedChange)="onToggle()"
        />
      </div>
    </section>
  `,
  styles: [
    `
      .config-section {
        border-bottom: 1px solid #e2e8f0;
      }

      .section-header {
        padding: 1.25rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        color: #1a1a1a;
        font-size: 0.9rem;
      }

      .section-title .material-symbols-outlined {
        font-size: 18px;
        color: #64748b;
      }
    `,
  ],
})
export class FillContainerConfigComponent {
  private configService = inject(EditorConfigurationService);
  readonly appI18n = inject(AppI18nService);

  readonly isEnabled = computed(() => this.configService.editorState().fillContainer);

  readonly label = computed(() => {
    return this.appI18n.currentLocale() === "fr" 
      ? "Remplir le conteneur" 
      : "Fill Container";
  });

  onToggle() {
    this.configService.toggleFillContainer();
  }
}
