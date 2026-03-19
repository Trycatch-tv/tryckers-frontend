import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  async ngOnInit(): Promise<void> {
    await this.loadCartelera();
  }

  async loadCartelera(): Promise<void> {
    try {
      this.loading = true;
      this.errorMessage = null;
      this.posts = await this.postsService.getCartelera();
    } catch (error) {
      console.error('Error loading cartelera:', error);
      this.posts = [];
      this.errorMessage =
        'No se pudo cargar la cartelera. Inténtalo nuevamente.';
    } finally {
      this.loading = false;
    }
  }
}
