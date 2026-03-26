import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';
import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';

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

  private postsService = inject(PostsService);
  private notificationService = inject(NotificationService);

  async ngOnInit(): Promise<void> {
    await this.loadCartelera();
  }

  async loadCartelera(): Promise<void> {
    try {
      this.loading = true;
      this.errorMessage = null;
      this.posts = await this.postsService.getCartelera();
      this.posts.sort((a, b) => (b.votes_count ?? 0) - (a.votes_count ?? 0));
    } catch (error) {
      console.error('Error loading cartelera:', error);
      this.posts = [];
      this.errorMessage =
        'No se pudo cargar la cartelera. Inténtalo nuevamente.';
    } finally {
      this.loading = false;
    }
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
      this.notificationService.error('Error al votar la publicación.');
    }
  }

  textPreview(content: string): string {
    return content.length > 140 ? `${content.substring(0, 140)}...` : content;
  }
}
