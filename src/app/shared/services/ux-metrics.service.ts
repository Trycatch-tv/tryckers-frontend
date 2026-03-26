import { Injectable } from '@angular/core';

type MetricMeta = Record<string, string | number | boolean | null | undefined>;

interface UxMetricEvent {
  id: string;
  name: string;
  timestamp: number;
  route: string;
  durationMs?: number;
  meta?: MetricMeta;
}

interface PendingTiming {
  startedAt: number;
  route: string;
  meta?: MetricMeta;
}

const STORAGE_KEY = 'ux_metrics_events';
const MAX_EVENTS = 1000;

@Injectable({ providedIn: 'root' })
export class UxMetricsService {
  private events: UxMetricEvent[] = [];
  private pendingTimings = new Map<string, PendingTiming>();

  constructor() {
    this.load();
  }

  track(name: string, meta?: MetricMeta, durationMs?: number): void {
    const event: UxMetricEvent = {
      id: this.generateId(),
      name,
      timestamp: Date.now(),
      route: this.getCurrentRoute(),
      durationMs,
      meta,
    };

    this.events.push(event);
    if (this.events.length > MAX_EVENTS) {
      this.events = this.events.slice(this.events.length - MAX_EVENTS);
    }
    this.save();
  }

  startTiming(key: string, meta?: MetricMeta): void {
    this.pendingTimings.set(key, {
      startedAt: performance.now(),
      route: this.getCurrentRoute(),
      meta,
    });
  }

  endTiming(key: string, eventName: string, meta?: MetricMeta): number | null {
    const pending = this.pendingTimings.get(key);
    if (!pending) {
      return null;
    }

    this.pendingTimings.delete(key);
    const durationMs = Math.round(performance.now() - pending.startedAt);

    this.track(
      eventName,
      {
        ...pending.meta,
        ...meta,
      },
      durationMs,
    );

    return durationMs;
  }

  getSummary() {
    const loginViews = this.count('login_view');
    const loginSuccess = this.count('login_success');
    const loginFailure = this.count('login_failure');
    const loginAbandon = this.count('login_abandon');

    const postCreateAttempt = this.count('post_create_attempt');
    const postCreateSuccess = this.count('post_create_success');
    const postCreateFailure = this.count('post_create_failure');

    const carteleraClicks = this.count('cartelera_post_click');
    const carteleraImpressions = this.sumMeta(
      'cartelera_impression',
      'postsCount',
    );

    const loginAbandonRate =
      loginViews > 0 ? Number((loginAbandon / loginViews).toFixed(4)) : 0;
    const postCreateSuccessRate =
      postCreateAttempt > 0
        ? Number((postCreateSuccess / postCreateAttempt).toFixed(4))
        : 0;
    const carteleraCTR =
      carteleraImpressions > 0
        ? Number((carteleraClicks / carteleraImpressions).toFixed(4))
        : 0;

    return {
      kpis: {
        loginAbandonRate,
        postCreateSuccessRate,
        carteleraCTR,
      },
      counts: {
        loginViews,
        loginSuccess,
        loginFailure,
        loginAbandon,
        postCreateAttempt,
        postCreateSuccess,
        postCreateFailure,
        carteleraClicks,
        carteleraImpressions,
      },
      perceivedTimingMs: {
        initialLoadAvg: this.avgDuration('perceived_initial_load'),
        carteleraLoadAvg: this.avgDuration('perceived_cartelera_load'),
        profileLoadAvg: this.avgDuration('perceived_profile_load'),
        postLoadAvg: this.avgDuration('perceived_post_load'),
        loginSubmitAvg: this.avgDuration('perceived_login_submit'),
        postCreateAvg: this.avgDuration('perceived_post_create_submit'),
      },
      recommendations: this.getPrioritizedRecommendations(),
    };
  }

  getPrioritizedRecommendations(): string[] {
    const summary = this.getSummary();
    const recommendations: string[] = [];

    if (summary.kpis.loginAbandonRate >= 0.35) {
      recommendations.push(
        'Alta prioridad: reducir abandono en login (simplificar formulario y revisar mensajes de error).',
      );
    }

    if (
      summary.kpis.postCreateSuccessRate > 0 &&
      summary.kpis.postCreateSuccessRate < 0.8
    ) {
      recommendations.push(
        'Alta prioridad: mejorar flujo de publicación (validaciones y feedback para elevar éxito).',
      );
    }

    if (summary.kpis.carteleraCTR > 0 && summary.kpis.carteleraCTR < 0.08) {
      recommendations.push(
        'Media prioridad: optimizar CTA y jerarquía visual en cartelera para aumentar CTR.',
      );
    }

    if (summary.perceivedTimingMs.initialLoadAvg > 2200) {
      recommendations.push(
        'Alta prioridad: optimizar carga inicial (bundle y carga diferida adicional).',
      );
    }

    if (summary.perceivedTimingMs.carteleraLoadAvg > 1800) {
      recommendations.push(
        'Media prioridad: optimizar consulta/render de cartelera para reducir espera percibida.',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Mantener la estrategia actual y recolectar más datos para decidir la próxima iteración.',
      );
    }

    return recommendations;
  }

  getEvents(): UxMetricEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
    this.pendingTimings.clear();
    localStorage.removeItem(STORAGE_KEY);
  }

  private count(name: string): number {
    return this.events.filter((event) => event.name === name).length;
  }

  private sumMeta(name: string, key: string): number {
    return this.events
      .filter((event) => event.name === name)
      .reduce((acc, event) => {
        const raw = event.meta?.[key];
        const value = typeof raw === 'number' ? raw : 0;
        return acc + value;
      }, 0);
  }

  private avgDuration(name: string): number {
    const durations = this.events
      .filter(
        (event) => event.name === name && typeof event.durationMs === 'number',
      )
      .map((event) => event.durationMs as number);

    if (!durations.length) {
      return 0;
    }

    const total = durations.reduce((acc, duration) => acc + duration, 0);
    return Math.round(total / durations.length);
  }

  private getCurrentRoute(): string {
    if (typeof window === 'undefined') {
      return '/';
    }
    return `${window.location.pathname}${window.location.search}`;
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as UxMetricEvent[];
      if (Array.isArray(parsed)) {
        this.events = parsed.slice(-MAX_EVENTS);
      }
    } catch {
      this.events = [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
  }

  private generateId(): string {
    return `ux-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
