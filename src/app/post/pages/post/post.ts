import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

  loading = true;
  error: string | null = null;
  post: any = null;
  username: string | null = null;

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    const postId = this.route.snapshot.paramMap.get('id');

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

  toArray(tags?: string): string[] {
    if (!tags) return [];
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async votePost(postId: string) {
    try {
      const currentVote = this.post?.user_vote;
      const currentVotesCount = this.post?.votes_count ?? 0;
      const newVoteType = currentVote === 1 ? 0 : 1;
      console.log('Enviando voto:', { postId, currentVote, newVoteType });
      const result = await this.postsService.votePost(postId, newVoteType);
      console.log('Respuesta del backend:', result);
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
        console.log('Post actualizado:', this.post);
      }
    } catch (error) {
      console.error('Error al votar la publicación:', error);
    }
  }
}
