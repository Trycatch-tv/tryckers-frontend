import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Trycker } from '@tryckers/interfaces';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  CreatePostDto,
  Post,
  PostStatus,
  PostType,
  UpdatePostDto,
} from 'src/app/post/interfaces/post';
import { PostsService } from 'src/app/post/services/posts.service';

import { RouterModule } from '@angular/router';

interface PostFormData {
  id?: string;
  title: string;
  content: string;
  type: PostType;
  image: string;
  tags: string;
  status: PostStatus;
  user_id: string | null;
}

interface TryckerWithParsedInterests extends Omit<Trycker, 'interests'> {
  interests: string[];
}

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    RouterModule,
    RouterLink,
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  standalone: true,
})
export default class ProfilePage implements OnInit {
  tryckersService = inject(TryckersService);
  postsService = inject(PostsService);

  username: string = '';
  user: TryckerWithParsedInterests | null = null;
  userPosts: Post[] = [];

  // Modal properties
  showPostModal: boolean = false;
  newPost: PostFormData = {
    id: undefined,
    title: '',
    content: '',
    type: 'article' as PostType,
    image: '',
    tags: '',
    status: 'draft' as PostStatus,
    user_id: null,
  };

  postTypes = [
    { label: 'Artículo', value: 'article' },
    { label: 'Video', value: 'video' },
    { label: 'Proyecto', value: 'project' },
  ];

  info = {
    header: 'Crear Nueva Publicación',
    buttonLabel: 'Crear Publicación',
  };

  isEditing = false;

  constructor(private route: ActivatedRoute) {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  async getProfileData() {
    const userData = await this.tryckersService.getTryckerByUsername(
      this.username,
    );
    if (userData) {
      this.user = {
        ...userData,
        interests: userData.interests ? userData.interests.split(',') : [],
      };
      this.getUserPosts(this.user.id);
    }
  }

  async getUserPosts(userId: string) {
    const posts = await this.postsService.getPostsByUserId(userId);
    this.userPosts = posts;
  }

  async getPostByID(postId: string) {
    alert(postId);
    // const post = await this.postsService.getPostById(postId);
    // return post;
  }

  async deletePost(postId: string) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar esta publicación? ',
    );
    if (confirmed) {
      const result = await this.postsService.deletePost(postId);
      if (result) {
        alert('Publicación eliminada exitosamente.');
        if (this.user) {
          this.getUserPosts(this.user.id);
        }
      } else {
        alert('Error al eliminar la publicación. Inténtalo de nuevo.');
      }
    }
  }

  ngOnInit() {
    this.getProfileData();
    if (this.isEditing && this.newPost.id) {
      this.getPostByID(this.newPost.id);
    }
  }

  // Modal methods
  openPostModal(isEditing: boolean = false, post: Post | null = null) {
    console.log(post);
    this.showPostModal = true;
    this.isEditing = isEditing;
    this.info.header =
      '' + (isEditing ? 'Editar' : 'Crear Nueva') + ' Publicación';
    this.info.buttonLabel = isEditing ? 'Guardar Cambios' : 'Crear Publicación';

    if (isEditing && post) {
      this.newPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        type: post.type,
        image: post.image ?? '',
        tags: post.tags,
        status: post.status,
        user_id: post.user_id,
      };
    }
  }

  closePostModal() {
    this.showPostModal = false;
    this.resetPostForm();
  }

  resetPostForm() {
    this.newPost = {
      id: undefined,
      title: '',
      content: '',
      type: 'article' as PostType,
      image: '',
      tags: '',
      status: 'draft' as PostStatus,
      user_id: null,
    };
  }

  async savePost() {
    if (this.isEditing) {
      await this.editPost();
    } else {
      await this.createPost();
    }
  }

  async createPost() {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    if (!this.user) {
      alert('Error: No se encontró el usuario.');
      return;
    }

    try {
      const postData: CreatePostDto = {
        title: this.newPost.title,
        content: this.newPost.content,
        type: this.newPost.type,
        image: this.newPost.image,
        tags: this.newPost.tags,
        status: this.newPost.status,
        user_id: this.user.id,
      };
      await this.postsService.createPost(postData);

      alert('¡Publicación creada exitosamente!');
      this.closePostModal();

      // Refresh profile data to show new post
      await this.getProfileData();
    } catch (error) {
      alert('Error al crear la publicación. Inténtalo de nuevo.');
    }
  }

  async editPost() {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    if (!this.newPost.id) {
      alert('Error: No se encontró el ID de la publicación.');
      return;
    }

    try {
      const updateData: UpdatePostDto = {
        id: this.newPost.id,
        title: this.newPost.title,
        content: this.newPost.content,
        type: this.newPost.type,
        image: this.newPost.image,
        tags: this.newPost.tags,
        status: this.newPost.status,
        user_id: this.newPost.user_id,
      };
      await this.postsService.updatePost(updateData);
      alert('¡Publicación actualizada exitosamente!');
      this.closePostModal();
      // Refresh profile data to show updated post
      await this.getProfileData();
    } catch (error) {
      alert('Error al actualizar la publicación. Inténtalo de nuevo.');
    }
  }

  async votePost(postId: string, voteType: 0 | 1) {
    try {
      const post = this.userPosts.find((p) => p.id === postId);
      const currentVote = post?.user_vote;
      const finalVoteType = currentVote === 1 ? 0 : 1;
      const result = await this.postsService.votePost(postId, finalVoteType);
      if (result && this.user) {
        // Refrescar todos los posts del usuario
        await this.getUserPosts(this.user.id);
        // Notificación eliminada
      }
    } catch (error) {
      console.error('Error al votar la publicación:', error);
      alert('Error al votar la publicación. Inténtalo de nuevo.');
    }
  }

  // TODO: Pendiente de mover a un utilitario común
  toArray(string: string): string[] {
    return string.split(',').map((s: string) => s.trim());
  }

  textPreview(content: string): string {
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  }
}
