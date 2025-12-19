import { Component, inject, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EditorConfigurationService } from "../services/editor-configuration.service";
import { AppI18nService } from "../services/app-i18n.service";

type AutofocusValue = boolean | 'start' | 'end' | 'all';

interface AutofocusOption {
  value: AutofocusValue;
  labelKey: 'autofocusOff' | 'autofocusStart' | 'autofocusEnd' | 'autofocusAll';
  icon: string;
}

@Component({
  selector: "app-autofocus-config",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="config-section">
      <div class="section-header">
        <div class="section-title">
          <span class="material-symbols-outlined">center_focus_strong</span>
          <span>{{ appI18n.config().autofocus }}</span>
        </div>
        <div class="section-status">
          <span class="status-badge" [class.active]="isAutofocusEnabled()">
            {{ isAutofocusEnabled() ? currentLabel() : appI18n.items().autofocusOff }}
          </span>
        </div>
      </div>

      <div class="section-content">
        <div class="dropdown-section" [class.open]="isDropdownOpen()">
          <div class="dropdown-trigger" (click)="onToggleDropdown()">
            <span>{{ appI18n.config().autofocusSettings }}</span>
            <span
              class="material-symbols-outlined chevron"
              [class.rotated]="isDropdownOpen()"
            >
              keyboard_arrow_down
            </span>
          </div>

          <div class="dropdown-content" [class.open]="isDropdownOpen()">
            <div class="options-container">
              @for (option of autofocusOptions; track option.value) {
                <button
                  class="option-btn"
                  [class.active]="isOptionActive(option.value)"
                  (click)="selectOption(option.value)"
                >
                  <span class="material-symbols-outlined">{{ option.icon }}</span>
                  <span class="option-label">{{ getOptionLabel(option.labelKey) }}</span>
                  @if (isOptionActive(option.value)) {
                    <span class="material-symbols-outlined check-icon">check</span>
                  }
                </button>
              }
            </div>

            <div class="config-info">
              <p class="info-text">
                <span class="material-symbols-outlined">info</span>
                {{ getInfoText() }}
              </p>
            </div>

            @if (hasConfigChanged()) {
              <div class="test-action">
                <button class="test-btn" (click)="reloadToTest()">
                  <span class="material-symbols-outlined">refresh</span>
                  <span>{{ getTestButtonText() }}</span>
                </button>
              </div>
            }
          </div>
        </div>
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
        position: sticky;
        top: 0;
        z-index: 5;
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

      .section-status {
        display: flex;
        align-items: center;
      }

      .status-badge {
        background: #f1f5f9;
        color: #64748b;
        font-size: 11px;
        font-weight: 500;
        padding: 4px 10px;
        border-radius: 12px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .status-badge.active {
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;
      }

      .section-content {
        transition: all 0.3s ease;
        overflow: hidden;
      }

      /* Dropdown */
      .dropdown-section {
        position: relative;
        z-index: 10;
      }

      .dropdown-section.open {
        z-index: 50;
      }

      .dropdown-trigger {
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background: #f8f9fa;
        border-top: 1px solid #e2e8f0;
        font-size: 0.85rem;
        color: #64748b;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .dropdown-trigger:hover {
        background: #f1f5f9;
        color: #475569;
      }

      .chevron {
        font-size: 18px !important;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .chevron.rotated {
        transform: rotate(180deg);
      }

      .dropdown-content {
        max-height: 0;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: white;
        position: relative;
        z-index: 10;
      }

      .dropdown-content.open {
        max-height: 500px;
        overflow: visible;
        position: relative;
        z-index: 30;
      }

      .options-container {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .option-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.85rem;
        color: #374151;
      }

      .option-btn:hover {
        background: #f8f9fa;
        border-color: #cbd5e1;
      }

      .option-btn.active {
        background: rgba(99, 102, 241, 0.05);
        border-color: #6366f1;
        color: #6366f1;
      }

      .option-btn .material-symbols-outlined {
        font-size: 18px;
        color: #64748b;
      }

      .option-btn.active .material-symbols-outlined {
        color: #6366f1;
      }

      .option-label {
        flex: 1;
        text-align: left;
      }

      .check-icon {
        font-size: 16px !important;
        color: #6366f1 !important;
      }

      .config-info {
        margin: 0 0.75rem 0.75rem 0.75rem;
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 6px;
        padding: 0.75rem;
      }

      .info-text {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        font-size: 0.8rem;
        color: #0369a1;
        line-height: 1.4;
      }

      .info-text .material-symbols-outlined {
        font-size: 14px;
        flex-shrink: 0;
      }

      .test-action {
        margin: 0 0.75rem 0.75rem 0.75rem;
      }

      .test-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
      }

      .test-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }

      .test-btn:active {
        transform: translateY(0);
      }

      .test-btn .material-symbols-outlined {
        font-size: 18px;
      }
    `,
  ],
})
export class AutofocusConfigComponent {
  private configService = inject(EditorConfigurationService);
  readonly appI18n = inject(AppI18nService);

  readonly editorState = this.configService.editorState;

  // Valeur initiale pour détecter les changements
  private initialAutofocus = signal<boolean | 'start' | 'end' | 'all' | number>(false);

  // État du dropdown
  private _isDropdownOpen = signal(false);
  readonly isDropdownOpen = this._isDropdownOpen.asReadonly();

  // Options disponibles
  readonly autofocusOptions: AutofocusOption[] = [
    { value: false, labelKey: 'autofocusOff', icon: 'block' },
    { value: 'start', labelKey: 'autofocusStart', icon: 'first_page' },
    { value: 'end', labelKey: 'autofocusEnd', icon: 'last_page' },
    { value: 'all', labelKey: 'autofocusAll', icon: 'select_all' },
  ];

  constructor() {
    // Récupérer le paramètre autofocus depuis l'URL si présent
    const urlParams = new URLSearchParams(window.location.search);
    const autofocusParam = urlParams.get('autofocus');
    
    if (autofocusParam) {
      let value: boolean | 'start' | 'end' | 'all' | number = false;
      
      if (autofocusParam === 'false') {
        value = false;
      } else if (autofocusParam === 'true' || autofocusParam === 'start') {
        value = 'start';
      } else if (autofocusParam === 'end') {
        value = 'end';
      } else if (autofocusParam === 'all') {
        value = 'all';
      } else if (!isNaN(Number(autofocusParam))) {
        value = Number(autofocusParam);
      }
      
      // Appliquer la valeur depuis l'URL
      this.configService.updateEditorState({ autofocus: value });
      this.initialAutofocus.set(value);
      
      // Nettoyer l'URL après application
      const url = new URL(window.location.href);
      url.searchParams.delete('autofocus');
      window.history.replaceState({}, '', url.toString());
    } else {
      // Stocker la valeur initiale
      this.initialAutofocus.set(this.editorState().autofocus);
    }
  }

  readonly isAutofocusEnabled = computed(() => {
    const value = this.editorState().autofocus;
    return value !== false;
  });

  readonly currentLabel = computed(() => {
    const value = this.editorState().autofocus;
    const option = this.autofocusOptions.find(o => o.value === value);
    return option ? this.getOptionLabel(option.labelKey) : '';
  });

  // Event handlers
  onToggleDropdown() {
    this._isDropdownOpen.update((open) => !open);
  }

  isOptionActive(value: AutofocusValue): boolean {
    return this.editorState().autofocus === value;
  }

  selectOption(value: AutofocusValue) {
    this.configService.updateEditorState({
      autofocus: value,
    });
  }

  getOptionLabel(labelKey: 'autofocusOff' | 'autofocusStart' | 'autofocusEnd' | 'autofocusAll'): string {
    return this.appI18n.items()[labelKey];
  }

  getInfoText(): string {
    const value = this.editorState().autofocus;
    const items = this.appI18n.items();
    
    if (value === false) {
      return this.appI18n.currentLocale() === 'fr' 
        ? "L'éditeur ne sera pas focusé automatiquement au chargement"
        : "Editor won't be focused automatically on load";
    }
    if (value === 'start') {
      return this.appI18n.currentLocale() === 'fr'
        ? "Le curseur sera placé au début du document"
        : "Cursor will be placed at the start of the document";
    }
    if (value === 'end') {
      return this.appI18n.currentLocale() === 'fr'
        ? "Le curseur sera placé à la fin du document"
        : "Cursor will be placed at the end of the document";
    }
    if (value === 'all') {
      return this.appI18n.currentLocale() === 'fr'
        ? "Tout le contenu sera sélectionné au chargement"
        : "All content will be selected on load";
    }
    return '';
  }

  hasConfigChanged(): boolean {
    return this.editorState().autofocus !== this.initialAutofocus();
  }

  reloadToTest() {
    // Sauvegarder la config dans l'URL pour la restaurer après rechargement
    const autofocus = this.editorState().autofocus;
    const url = new URL(window.location.href);
    url.searchParams.set('autofocus', String(autofocus));
    window.location.href = url.toString();
  }

  getTestButtonText(): string {
    return this.appI18n.currentLocale() === 'fr'
      ? "Recharger pour tester"
      : "Reload to test";
  }
}
