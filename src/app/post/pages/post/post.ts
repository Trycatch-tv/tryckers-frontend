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
}
