import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import {
  COUNTRIES,
  isValidCanonicalCountry,
  normalizeCountryValue,
} from '@shared/constants/countries';
import {
  ApiError,
  extractBackendErrorMessage,
  extractFieldErrors,
  formatFieldErrors,
} from '@shared/interfaces/error';
import { Trycker } from '@tryckers/interfaces';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { NotificationService } from 'src/app/shared/services/notification.service';

interface ProfileFormState {
  name: string;
  birth_date: string;
  headline: string;
  bio: string;
  country: string;
  seniority: string;
  english_level: string;
  efset_score: string;
  availability: string;
  interests: string;
  github_url: string;
  linkedin_url: string;
  pitch_video: string;
}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="settings-container max-w-4xl mx-auto px-4 py-8">
      <!-- Breadcrumb / Back button -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="goBack()"
            class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer flex items-center gap-2 text-sm font-medium"
          >
            <span>←</span> Volver al perfil
          </button>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tight">
              Configuración de Perfil
            </h1>
            <p class="text-sm text-slate-400">
              Actualiza tu información personal, fecha de cumpleaños y preferencias.
            </p>
          </div>
        </div>
      </div>

      @if (!authStore.user()) {
        <div class="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <p class="text-slate-400 mb-4">Debes iniciar sesión para editar tu perfil.</p>
          <a
            routerLink="/auth/login"
            class="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
          >
            Iniciar Sesión
          </a>
        </div>
      } @else {
        <form (ngSubmit)="saveProfile()" class="space-y-6">
          <!-- Sección 1: Datos Personales & Fecha de Cumpleaños -->
          <div class="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm shadow-xl space-y-5">
            <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                  <span>👤</span> Información Personal
                </h2>
                <p class="text-xs text-slate-400 mt-0.5">
                  Datos visibles en tu tarjeta de presentación comunitaria.
                </p>
              </div>
              <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                &#64;{{ authStore.user()?.username }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Nombre -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Nombre Completo <span class="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  placeholder="Tu nombre completo"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              <!-- Fecha de Nacimiento / Cumpleaños (WI-001) -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>🎂 Fecha de Nacimiento (Cumpleaños)</span>
                  <span class="text-[11px] font-normal text-blue-400">Día y mes visibles</span>
                </label>
                <input
                  type="date"
                  name="birth_date"
                  [(ngModel)]="formData.birth_date"
                  [max]="maxDate"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                />
                <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <span>💡</span> Usada para celebraciones comunitarias y reconocimiento en tu perfil.
                </p>
              </div>

              <!-- Titular / Headline -->
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Titular Profesional / Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  [(ngModel)]="formData.headline"
                  placeholder="Ej: Senior Full Stack Engineer | Go & Angular"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              <!-- País -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  País
                </label>
                <select
                  name="country"
                  [(ngModel)]="formData.country"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                >
                  <option value="">Sin especificar</option>
                  <option *ngFor="let c of countries" [value]="c.value">
                    {{ c.flag }} {{ c.label }}
                  </option>
                </select>
              </div>

              <!-- Disponibilidad -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Disponibilidad de Trabajo
                </label>
                <select
                  name="availability"
                  [(ngModel)]="formData.availability"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                >
                  <option value="full-time">Tiempo Completo (Full-time)</option>
                  <option value="part-time">Medio Tiempo (Part-time)</option>
                  <option value="freelance">Freelance / Proyectos</option>
                  <option value="unavailable">No disponible actualmente</option>
                </select>
              </div>

              <!-- Biografía -->
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Biografía / Presentación
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  [(ngModel)]="formData.bio"
                  placeholder="Cuéntanos un poco sobre tu experiencia, pasión y proyectos destacados..."
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Sección 2: Nivel Técnico y Habilidades -->
          <div class="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm shadow-xl space-y-5">
            <div class="border-b border-slate-800 pb-3">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <span>🚀</span> Habilidades & Experiencia
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Nivel técnico, dominio de idiomas e intereses tecnológicos.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <!-- Seniority -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Seniority
                </label>
                <select
                  name="seniority"
                  [(ngModel)]="formData.seniority"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                >
                  <option value="Junior">Junior</option>
                  <option value="Semi-Senior">Semi-Senior</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Tech Lead</option>
                  <option value="Principal">Principal / Architect</option>
                </select>
              </div>

              <!-- Nivel de Inglés -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Nivel de Inglés
                </label>
                <select
                  name="english_level"
                  [(ngModel)]="formData.english_level"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                >
                  <option value="A1">A1 (Principiante)</option>
                  <option value="A2">A2 (Básico)</option>
                  <option value="B1">B1 (Intermedio)</option>
                  <option value="B2">B2 (Intermedio Alto)</option>
                  <option value="C1">C1 (Avanzado)</option>
                  <option value="C2">C2 (Dominio / Nativo)</option>
                </select>
              </div>

              <!-- EF Set Score -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Puntaje EF SET
                </label>
                <input
                  type="text"
                  name="efset_score"
                  [(ngModel)]="formData.efset_score"
                  placeholder="Ej: 75/100 (C2)"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              <!-- Intereses / Tags -->
              <div class="md:col-span-3">
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Intereses y Tecnologías (separados por coma)
                </label>
                <input
                  type="text"
                  name="interests"
                  [(ngModel)]="formData.interests"
                  placeholder="Ej: Go, Angular, TypeScript, PostgreSQL, Docker, Tailwind"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Sección 3: Redes & Portafolio -->
          <div class="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm shadow-xl space-y-5">
            <div class="border-b border-slate-800 pb-3">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <span>🔗</span> Enlaces Profesionales
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Conecta tus perfiles de desarrollo y redes de contacto.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- GitHub URL -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Perfil de GitHub
                </label>
                <input
                  type="url"
                  name="github_url"
                  [(ngModel)]="formData.github_url"
                  placeholder="https://github.com/tu-usuario"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              <!-- LinkedIn URL -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Perfil de LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  [(ngModel)]="formData.linkedin_url"
                  placeholder="https://linkedin.com/in/tu-perfil"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              <!-- Video Pitch -->
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Video Pitch / Presentación (YouTube, Loom, Vimeo)
                </label>
                <input
                  type="url"
                  name="pitch_video"
                  [(ngModel)]="formData.pitch_video"
                  placeholder="https://www.youtube.com/watch?v=..."
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          @if (validationError) {
            <div
              role="alert"
              class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm whitespace-pre-line"
            >
              {{ validationError }}
            </div>
          }

          <!-- Botones de Acción -->
          <div class="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              (click)="goBack()"
              class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-medium transition-all text-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="saving"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (saving) {
                <span class="animate-spin text-sm">⏳</span> Guardando...
              } @else {
                <span>💾</span> Guardar Cambios
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: calc(100vh - 4rem);
      }
    `,
  ],
})
export default class SettingsPageComponent implements OnInit {
  authStore = inject(AuthStore);
  private authService = inject(AuthService);
  private tryckersService = inject(TryckersService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  saving = false;
  validationError: string | null = null;
  maxDate = new Date().toISOString().split('T')[0];

  formData: ProfileFormState = {
    name: '',
    birth_date: '',
    headline: '',
    bio: '',
    country: '',
    seniority: 'Senior',
    english_level: 'B2',
    efset_score: '',
    availability: 'full-time',
    interests: '',
    github_url: '',
    linkedin_url: '',
    pitch_video: '',
  };

  readonly countries = COUNTRIES;

  constructor() {
    effect(() => {
      const user = this.authStore.user();
      if (user) {
        this.populateForm(user);
      }
    });
  }

  ngOnInit(): void {
    const user = this.authStore.user();
    if (user) {
      this.populateForm(user);
    }
  }

  private populateForm(user: Trycker): void {
    let dateStr = '';
    if (user.birth_date) {
      try {
        const d = new Date(user.birth_date);
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString().split('T')[0];
        }
      } catch {
        dateStr = '';
      }
    }

    this.formData = {
      name: user.name || '',
      birth_date: dateStr,
      headline: user.headline || '',
      bio: user.bio || '',
      country: normalizeCountryValue(user.country),
      seniority: user.seniority || 'Senior',
      english_level: user.english_level || 'B2',
      efset_score: user.efset_score || '',
      availability: user.availability || 'full-time',
      interests: user.interests || '',
      github_url: user.github_url || '',
      linkedin_url: user.linkedin_url || '',
      pitch_video: user.pitch_video || '',
    };
  }

  async saveProfile(): Promise<void> {
    this.validationError = null;

    if (!this.formData.name.trim()) {
      this.validationError = 'El nombre completo es obligatorio.';
      this.notificationService.warning(this.validationError);
      return;
    }

    if (this.formData.birth_date) {
      const selected = new Date(this.formData.birth_date);
      if (selected > new Date()) {
        this.validationError = 'La fecha de nacimiento no puede ser futura.';
        this.notificationService.warning(this.validationError);
        return;
      }
    }

    const selectedCountry = this.formData.country.trim();
    if (selectedCountry && !isValidCanonicalCountry(selectedCountry)) {
      this.validationError = 'El país seleccionado no es válido.';
      this.notificationService.warning(this.validationError);
      return;
    }

    this.saving = true;

    try {
      const payload: Partial<Trycker> = {
        name: this.formData.name.trim(),
        headline: this.formData.headline.trim(),
        bio: this.formData.bio.trim(),
        seniority: this.formData.seniority,
        english_level: this.formData.english_level,
        efset_score: this.formData.efset_score.trim(),
        availability: this.formData.availability,
        interests: this.formData.interests.trim(),
        github_url: this.formData.github_url.trim(),
        linkedin_url: this.formData.linkedin_url.trim(),
        pitch_video: this.formData.pitch_video.trim(),
      };

      // Omitir country cuando no exista un valor canónico seleccionado
      if (selectedCountry) {
        payload.country = selectedCountry.toLowerCase();
      }

      if (this.formData.birth_date) {
        // Enviar en formato ISO UTC
        const dateObj = new Date(this.formData.birth_date + 'T00:00:00Z');
        payload.birth_date = dateObj.toISOString();
      }

      const updatedUser = await this.tryckersService.updateProfile(payload);

      if (updatedUser) {
        this.authStore.setUser(updatedUser);
        this.authService.setUserData(updatedUser);
        this.notificationService.success(
          'Perfil guardado exitosamente.',
        );
      } else {
        this.notificationService.info('Perfil actualizado.');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      const specificMessage = this.extractSpecificErrorMessage(error);
      this.validationError =
        specificMessage ||
        'No se pudo actualizar el perfil. Revisa los datos ingresados.';

      // Evitar toast duplicado si errorInterceptor ya notificó el HttpErrorResponse
      if (!(error instanceof HttpErrorResponse)) {
        this.notificationService.error(this.validationError);
      }
    } finally {
      this.saving = false;
    }
  }

  private extractSpecificErrorMessage(error: unknown): string | null {
    if (!(error instanceof HttpErrorResponse)) {
      return null;
    }
    const apiErr = error.error as ApiError | undefined;
    const fieldErrors = extractFieldErrors(apiErr);
    if (fieldErrors) {
      return formatFieldErrors(fieldErrors);
    }
    return extractBackendErrorMessage(apiErr);
  }

  goBack(): void {
    const user = this.authStore.user();
    if (user?.username) {
      void this.router.navigate(['/profile', user.username]);
    } else {
      void this.router.navigate(['/cartelera']);
    }
  }
}
