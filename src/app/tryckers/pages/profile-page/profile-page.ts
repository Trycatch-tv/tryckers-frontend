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
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UxMetricsService } from 'src/app/shared/services/ux-metrics.service';

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
  private notificationService = inject(NotificationService);
  private uxMetrics = inject(UxMetricsService);

  username: string = '';
  user: TryckerWithParsedInterests | null = null;
  userPosts: Post[] = [];
  loadingProfile = true;
  loadingPosts = false;
  errorMessage: string | null = null;

  // Modal properties
  showPostModal: boolean = false;
  newPost: PostFormData = {
    id: undefined,
    title: '',
    content: '',
    type: 'regular' as PostType,
    image: '',
    tags: '',
    status: 'draft' as PostStatus,
    user_id: null,
  };

  postTypes = [
    { label: 'Regular', value: 'regular' },
    { label: 'Historia', value: 'story' },
    { label: 'Video', value: 'video' },
  ];

  info = {
    header: 'Crear Nueva Publicación',
    buttonLabel: 'Crear Publicación',
  };

  isEditing = false;
  isSavingPost = false;
  postSubmitAttempted = false;

  constructor(private route: ActivatedRoute) {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  async getProfileData() {
    try {
      this.uxMetrics.startTiming('profile-load');
      this.loadingProfile = true;
      this.errorMessage = null;

      const userData = await this.tryckersService.getTryckerByUsername(
        this.username,
      );

      if (!userData) {
        this.user = null;
        this.userPosts = [];
        this.errorMessage = 'No se encontró el perfil solicitado.';
        return;
      }

      this.user = {
        ...userData,
        interests: userData.interests ? userData.interests.split(',') : [],
      };
      await this.getUserPosts(this.user.id);
      this.uxMetrics.endTiming('profile-load', 'perceived_profile_load', {
        success: true,
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
      this.user = null;
      this.userPosts = [];
      this.errorMessage = 'No se pudo cargar el perfil. Inténtalo nuevamente.';
      this.uxMetrics.endTiming('profile-load', 'perceived_profile_load', {
        success: false,
      });
    } finally {
      this.loadingProfile = false;
    }
  }

  async getUserPosts(userId: string) {
    try {
      this.loadingPosts = true;
      const posts = await this.postsService.getPostsByUserId(userId);
      this.userPosts = posts;
    } catch (error) {
      console.error('Error loading user posts:', error);
      this.userPosts = [];
      this.notificationService.error(
        'No se pudieron cargar las publicaciones del perfil.',
      );
    } finally {
      this.loadingPosts = false;
    }
  }

  async getPostByID(postId: string) {
    this.notificationService.info(`Cargando post: ${postId}`);
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
        this.notificationService.success('Publicación eliminada exitosamente.');
        if (this.user) {
          await this.getUserPosts(this.user.id);
        }
      } else {
        this.notificationService.error(
          'Error al eliminar la publicación. Inténtalo de nuevo.',
        );
      }
    }
  }

  ngOnInit() {
    void this.getProfileData();
    if (this.isEditing && this.newPost.id) {
      void this.getPostByID(this.newPost.id);
    }
  }

  // Modal methods
  openPostModal(isEditing: boolean = false, post: Post | null = null) {
    this.showPostModal = true;
    this.isEditing = isEditing;
    this.postSubmitAttempted = false;
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
        tags: Array.isArray(post.tags)
          ? post.tags.join(', ')
          : (post.tags ?? ''),
        status: post.status,
        user_id: post.user_id,
      };
    }
  }

  closePostModal() {
    this.showPostModal = false;
    this.postSubmitAttempted = false;
    this.isSavingPost = false;
    this.resetPostForm();
  }

  resetPostForm() {
    this.newPost = {
      id: undefined,
      title: '',
      content: '',
      type: 'regular' as PostType,
      image: '',
      tags: '',
      status: 'draft' as PostStatus,
      user_id: null,
    };
  }

  async savePost() {
    this.postSubmitAttempted = true;

    if (!this.isPostFormValid()) {
      this.notificationService.warning(this.getPostFormErrorMessage());
      return;
    }

    this.isSavingPost = true;

    if (this.isEditing) {
      await this.editPost();
    } else {
      await this.createPost();
    }

    this.isSavingPost = false;
  }

  isPostFieldInvalid(fieldName: 'title' | 'content'): boolean {
    if (!this.postSubmitAttempted && fieldName === 'title') {
      return (
        this.newPost.title.trim().length > 0 &&
        this.newPost.title.trim().length < 5
      );
    }

    if (!this.postSubmitAttempted && fieldName === 'content') {
      return (
        this.newPost.content.trim().length > 0 &&
        this.newPost.content.trim().length < 20
      );
    }

    return this.postSubmitAttempted && !!this.getPostFieldError(fieldName);
  }

  getPostFieldError(fieldName: 'title' | 'content'): string | null {
    if (fieldName === 'title') {
      const title = this.newPost.title.trim();
      if (!title) {
        return 'El titulo es obligatorio.';
      }
      if (title.length < 5) {
        return 'El titulo debe tener al menos 5 caracteres.';
      }
      return null;
    }

    const content = this.newPost.content.trim();
    if (!content) {
      return 'El contenido es obligatorio.';
    }
    if (content.length < 20) {
      return 'El contenido debe tener al menos 20 caracteres para ser claro.';
    }
    return null;
  }

  private isPostFormValid(): boolean {
    return (
      !this.getPostFieldError('title') && !this.getPostFieldError('content')
    );
  }

  private getPostFormErrorMessage(): string {
    return (
      this.getPostFieldError('title') ||
      this.getPostFieldError('content') ||
      'Revisa los campos del formulario.'
    );
  }

  async createPost() {
    if (!this.user) {
      this.notificationService.error('Error: No se encontró el usuario.');
      return;
    }

    try {
      this.uxMetrics.track('post_create_attempt');
      this.uxMetrics.startTiming('post-create-submit');
      const postData: CreatePostDto = {
        title: this.newPost.title,
        content: this.newPost.content,
        type: this.newPost.type,
        image: this.newPost.image,
        tags: this.newPost.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: this.newPost.status,
        user_id: this.user.id,
      };
      await this.postsService.createPost(postData);
      this.uxMetrics.track('post_create_success');
      this.uxMetrics.endTiming(
        'post-create-submit',
        'perceived_post_create_submit',
        {
          success: true,
        },
      );

      this.notificationService.success('¡Publicación creada exitosamente!');
      this.closePostModal();

      // Refresh profile data to show new post
      await this.getProfileData();
    } catch (error) {
      this.uxMetrics.track('post_create_failure');
      this.uxMetrics.endTiming(
        'post-create-submit',
        'perceived_post_create_submit',
        {
          success: false,
        },
      );
      this.notificationService.error(
        'No se pudo crear la publicación. Inténtalo nuevamente.',
      );
    }
  }

  async editPost() {
    if (!this.newPost.id) {
      this.notificationService.error(
        'Error: No se encontró el ID de la publicación.',
      );
      return;
    }

    try {
      const updateData: UpdatePostDto = {
        id: this.newPost.id,
        title: this.newPost.title,
        content: this.newPost.content,
        type: this.newPost.type,
        image: this.newPost.image,
        tags: this.newPost.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: this.newPost.status,
        user_id: this.newPost.user_id ?? undefined,
      };
      await this.postsService.updatePost(updateData);
      this.notificationService.success(
        '¡Publicación actualizada exitosamente!',
      );
      this.closePostModal();
      // Refresh profile data to show updated post
      await this.getProfileData();
    } catch (error) {
      this.notificationService.error(
        'No se pudo actualizar la publicación. Inténtalo nuevamente.',
      );
    }
  }

  async votePost(postId: string) {
    try {
      const post = this.userPosts.find((p) => p.id === postId);
      const currentVote = post?.user_vote;
      const finalVoteType = currentVote === 1 ? 0 : 1;
      const result = await this.postsService.votePost(postId, finalVoteType);
      if (result && this.user) {
        // Refrescar todos los posts del usuario
        await this.getUserPosts(this.user.id);
        this.notificationService.success(
          finalVoteType === 1 ? 'Voto registrado.' : 'Voto removido.',
        );
      }
    } catch (error) {
      console.error('Error al votar la publicación:', error);
      this.notificationService.error(
        'Error al votar la publicación. Inténtalo de nuevo.',
      );
    }
  }

  // TODO: Pendiente de mover a un utilitario común
  toArray(value: string | string[] | null | undefined): string[] {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value.map((s) => s.trim()).filter(Boolean);
    }
    return value
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  textPreview(content: string): string {
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  }
}
