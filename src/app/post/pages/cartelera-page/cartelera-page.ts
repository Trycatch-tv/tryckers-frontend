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

  private postsService = inject(PostsService);

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      this.posts = await this.postsService.getCartelera();
    } catch (error) {
      console.error('Error loading cartelera:', error);
      this.posts = [];
    } finally {
      this.loading = false;
    }
  }
}
