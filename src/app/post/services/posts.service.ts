import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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

  async createPost(postData: any): Promise<any> {
    const result = await this.http
      .post<any>('http://localhost:8080/api/v1/posts', postData, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })
      .toPromise();
    return result ?? null;
  }
}
