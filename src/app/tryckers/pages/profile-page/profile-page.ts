import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

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

  username: string = '';
  user: any = null;

  // Modal properties
  showCreatePostModal: boolean = false;
  newPost = {
    title: '',
    content: '',
    type: 'article', // article, video, project
    coverImage: null as File | null,
    tags: '',
    status: 'draft', // draft, published
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
      coverImage: null,
      tags: '',
      status: 'draft',
    };
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newPost.coverImage = file;
    }
  }

  //TODO: Vamos a crear el servicio de Post y crear el método createPost
  async createPost() {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      // Aquí iría la lógica para crear el post
      console.log('Creating post:', this.newPost);

      // Simulated API call
      // await this.tryckersService.createPost(this.newPost);

      alert('¡Publicación creada exitosamente!');
      this.closeCreatePostModal();

      // Refresh profile data to show new post
      // await this.getProfileData();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error al crear la publicación. Inténtalo de nuevo.');
    }
  }
}
