import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';
import { UxMetricsService } from '@shared/services/ux-metrics.service';
import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';

export type CarteleraErrorType =
  | 'auth'
  | 'network'
  | 'server'
  | 'client'
  | 'unknown';

@Component({
  selector: 'app-cartelera-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './cartelera-page.html',
  styleUrl: './cartelera-page.css',
  standalone: true,
})
export default class CarteleraPage implements OnInit {
  posts: Post[] = [];
  loading = true;
  errorMessage: string | null = null;
  errorType: CarteleraErrorType | null = null;

  private postsService = inject(PostsService);
  private notificationService = inject(NotificationService);
  private uxMetrics = inject(UxMetricsService);

  async ngOnInit(): Promise<void> {
    await this.loadCartelera();
  }

  async loadCartelera(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;
    this.errorType = null;
    this.safeMetrics(() => this.uxMetrics.startTiming('cartelera-load'));

    try {
      const fetchedPosts = await this.postsService.getCartelera();
      this.posts = [...fetchedPosts].sort(
        (a, b) => (b.votes_count ?? 0) - (a.votes_count ?? 0),
      );
    } catch (error) {
      const classified = this.classifyError(error);
      this.posts = [];
      this.errorType = classified.type;
      this.errorMessage = classified.userMessage;

      console.error('Error loading cartelera:', {
        errorType: classified.type,
        status: classified.status,
      });

      this.safeMetrics(() => {
        this.uxMetrics.track('cartelera_load_error', {
          errorType: classified.type,
          status: classified.status,
        });
        this.uxMetrics.endTiming('cartelera-load', 'perceived_cartelera_load', {
          success: false,
          errorType: classified.type,
          status: classified.status,
        });
      });
      return;
    } finally {
      this.loading = false;
    }

    // Registrar telemetría fuera del try/catch de carga para que fallos secundarios no rompan la UI
    this.safeMetrics(() => {
      this.uxMetrics.track('cartelera_impression', {
        postsCount: this.posts.length,
      });
      this.uxMetrics.endTiming('cartelera-load', 'perceived_cartelera_load', {
        success: true,
        postsCount: this.posts.length,
      });
    });
  }

  trackPostClick(
    postId: string,
    position: number,
    source: 'title' | 'read_button',
  ): void {
    this.safeMetrics(() =>
      this.uxMetrics.track('cartelera_post_click', {
        postId,
        position,
        source,
      }),
    );
  }

  async votePost(postId: string): Promise<void> {
    try {
      const index = this.posts.findIndex((post) => post.id === postId);
      if (index < 0) {
        return;
      }

      const post = this.posts[index];
      const currentVote = post.user_vote;
      const currentVotesCount = post.votes_count ?? 0;
      const newVoteType: 0 | 1 = currentVote === 1 ? 0 : 1;
      const result = await this.postsService.votePost(postId, newVoteType);

      if (!result) {
        this.notificationService.error('No se pudo registrar tu voto.');
        return;
      }

      const updatedUserVote =
        result.user_vote !== undefined ? result.user_vote : newVoteType;
      const updatedVotesCount =
        result.votes_count !== undefined
          ? result.votes_count
          : newVoteType === 1
            ? currentVotesCount + 1
            : Math.max(0, currentVotesCount - 1);

      this.posts[index] = {
        ...post,
        user_vote: updatedUserVote,
        votes_count: updatedVotesCount,
      };

      this.posts = [...this.posts].sort(
        (a, b) => (b.votes_count ?? 0) - (a.votes_count ?? 0),
      );

      this.notificationService.success(
        newVoteType === 1 ? 'Voto registrado.' : 'Voto removido.',
      );
    } catch (error) {
      console.error('Error voting post in cartelera:', error);
      if (!(error instanceof HttpErrorResponse)) {
        this.notificationService.error('Error al votar la publicación.');
      }
    }
  }

  textPreview(content: string | null | undefined): string {
    const safeContent = content ?? '';
    return safeContent.length > 140
      ? `${safeContent.substring(0, 140)}...`
      : safeContent;
  }

  private classifyError(error: unknown): {
    type: CarteleraErrorType;
    status: number | null;
    userMessage: string;
  } {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return {
          type: 'auth',
          status: 401,
          userMessage:
            'Tu sesión ha expirado. Inicia sesión nuevamente para ver la cartelera.',
        };
      }
      if (error.status === 0) {
        return {
          type: 'network',
          status: 0,
          userMessage:
            'No pudimos conectarnos con el servidor. Verifica tu conexión e inténtalo nuevamente.',
        };
      }
      if (error.status >= 500) {
        return {
          type: 'server',
          status: error.status,
          userMessage:
            'Ocurrió un problema temporal en el servidor. Inténtalo nuevamente en unos momentos.',
        };
      }
      return {
        type: 'client',
        status: error.status,
        userMessage: 'No se pudo cargar la cartelera. Inténtalo nuevamente.',
      };
    }

    return {
      type: 'unknown',
      status: null,
      userMessage: 'No se pudo cargar la cartelera. Inténtalo nuevamente.',
    };
  }

  private safeMetrics(fn: () => void): void {
    try {
      fn();
    } catch {
      // Los errores de telemetría nunca deben interrumpir la experiencia principal
    }
  }
}
