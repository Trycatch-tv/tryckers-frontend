import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PostsService } from 'src/app/post/services/posts.service';

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  standalone: true,
})
export default class ProfilePage implements OnInit {
  tryckersService = inject(TryckersService);
  postsService = inject(PostsService);

  username: string = '';
  user: any = null;

  // Modal properties
  showCreatePostModal: boolean = false;
  newPost = {
    title: '',
    content: '',
    type: 'article', // article, video, project
    image: null as File | null,
    tags: '',
    status: 'draft', // draft, published
    user_id: null,
  };

  postTypes = [
    { label: 'Artículo', value: 'article' },
    { label: 'Video', value: 'video' },
    { label: 'Proyecto', value: 'project' },
  ];

  constructor(private route: ActivatedRoute) {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  async getProfileData() {
    this.user = await this.tryckersService.getTryckerByUsername(this.username);
    this.user.interests = this.user.interests.split(',') || [];
  }

  ngOnInit() {
    this.getProfileData();
  }

  // Modal methods
  openCreatePostModal() {
    this.showCreatePostModal = true;
  }

  closeCreatePostModal() {
    this.showCreatePostModal = false;
    this.resetPostForm();
  }

  resetPostForm() {
    this.newPost = {
      title: '',
      content: '',
      type: 'article',
      image: null,
      tags: '',
      status: 'draft',
      user_id: null,
    };
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newPost.image = file.name; // TODO: reemplazar con file cuando el backend soporte archivos
    }
  }

  async createPost() {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      // Aquí iría la lógica para crear el post
      console.log('Creating post:', this.newPost);

      this.newPost.user_id = this.user.id;
      const result = await this.postsService.createPost(this.newPost);

      console.log('Post created successfully:', result);

      alert('¡Publicación creada exitosamente!');
      // this.closeCreatePostModal();

      // Refresh profile data to show new post
      // await this.getProfileData();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error al crear la publicación. Inténtalo de nuevo.');
    }
  }
}
