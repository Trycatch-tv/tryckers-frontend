import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CreatePostDto,
  Post,
  UpdatePostDto,
  VotePostResponse,
} from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private http = inject(HttpClient);

  getAuthToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return token;
  }

  async createPost(postData: CreatePostDto): Promise<Post | null> {
    const result = await this.http
      .post<Post>('http://localhost:8080/api/v1/posts', postData, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })
      .toPromise();
    return result ?? null;
  }

  async updatePost(postData: UpdatePostDto): Promise<Post | null> {
    const result = await this.http
      .put<Post>(`http://localhost:8080/api/v1/posts`, postData, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })
      .toPromise();
    return result ?? null;
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    const result = await this.http
      .get<Post[]>(`http://localhost:8080/api/v1/users/${userId}/posts`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })
      .toPromise();
    return result ?? [];
  }

  async getPostById(postId: string): Promise<Post | null> {
    const result = await this.http
      .get<Post>(`http://localhost:8080/api/v1/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })
      .toPromise();
    return result ?? null;
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      await this.http
        .delete(`http://localhost:8080/api/v1/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        })
        .toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  async votePost(
    postId: string,
    voteType: 0 | 1,
  ): Promise<VotePostResponse | null> {
    const result = await this.http
      .post<VotePostResponse>(
        `http://localhost:8080/api/v1/posts/${postId}/vote`,
        { vote: voteType },
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        },
      )
      .toPromise();
    return result ?? null;
  }
}
