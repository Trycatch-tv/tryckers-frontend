import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  CreatePostDto,
  Post,
  UpdatePostDto,
  VotePostResponse,
} from '../interfaces/post';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private http = inject(HttpClient);

  async createPost(postData: CreatePostDto): Promise<Post | null> {
    const result = await this.http
      .post<Post>(`${baseUrl}/posts`, postData)
      .toPromise();
    return result ?? null;
  }

  async updatePost(postData: UpdatePostDto): Promise<Post | null> {
    const result = await this.http
      .put<Post>(`${baseUrl}/posts`, postData)
      .toPromise();
    return result ?? null;
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    const result = await this.http
      .get<Post[]>(`${baseUrl}/users/${userId}/posts`)
      .toPromise();
    return result ?? [];
  }

  async getPostById(postId: string): Promise<Post | null> {
    const result = await this.http
      .get<Post>(`${baseUrl}/posts/${postId}`)
      .toPromise();
    return result ?? null;
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      await this.http
        .delete(`${baseUrl}/posts/${postId}`)
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
        `${baseUrl}/posts/${postId}/vote`,
        { vote: voteType },
      )
      .toPromise();
    return result ?? null;
  }
}
