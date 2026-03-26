import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';
import { Post as PostInterface } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post implements OnInit {
  private route = inject(ActivatedRoute);
  private postsService = inject(PostsService);
  private notificationService = inject(NotificationService);

  loading = true;
  error: string | null = null;
  post: PostInterface | null = null;
  username: string | null = null;
  backLabel = 'Volver al perfil';
  backCommands: string[] = ['/home'];

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    const postId = this.route.snapshot.paramMap.get('id');
    const from = this.route.snapshot.queryParamMap.get('from');

    if (from === 'cartelera') {
      this.backLabel = 'Volver a cartelera';
      this.backCommands = ['/cartelera'];
    } else if (this.username) {
      this.backLabel = 'Volver al perfil';
      this.backCommands = ['/profile', this.username];
    } else {
      this.backLabel = 'Volver al inicio';
      this.backCommands = ['/home'];
    }

    if (!postId) {
      this.error = 'No se encontró el identificador de la publicación.';
      this.loading = false;
      return;
    }

    this.loadPost(postId);
  }

  async loadPost(postId: string): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      this.post = await this.postsService.getPostById(postId);
      if (!this.post) {
        this.error = 'No se encontró la publicación.';
      }
    } catch (err) {
      this.error = 'Error al cargar la publicación.';
    } finally {
      this.loading = false;
    }
  }

  toArray(tags?: string | string[]): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags.map((t) => t.trim()).filter(Boolean);
    }
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async votePost(postId: string) {
    try {
      if (!this.post) return;

      const currentVote = this.post.user_vote;
      const currentVotesCount = this.post.votes_count ?? 0;
      const newVoteType = currentVote === 1 ? 0 : 1;
      const result = await this.postsService.votePost(postId, newVoteType);
      if (result) {
        // Si el backend devuelve user_vote lo usamos, sino usamos el valor calculado
        const updatedUserVote =
          result.user_vote !== undefined ? result.user_vote : newVoteType;

        // Calcular el nuevo conteo de votos
        // Si el backend lo devuelve, usarlo; sino calcular localmente
        let updatedVotesCount = result.votes_count;
        if (updatedVotesCount === undefined) {
          // Calcular localmente: si votamos (1) sumamos, si quitamos voto (0) restamos
          if (newVoteType === 1) {
            updatedVotesCount = currentVotesCount + 1;
          } else {
            updatedVotesCount = Math.max(0, currentVotesCount - 1);
          }
        }

        this.post = {
          ...this.post,
          user_vote: updatedUserVote,
          votes_count: updatedVotesCount,
        };
        this.notificationService.success(
          newVoteType === 1 ? 'Voto registrado.' : 'Voto removido.',
        );
      }
    } catch (error) {
      console.error('Error al votar la publicación:', error);
      this.notificationService.error('Error al votar la publicación.');
    }
  }
}
