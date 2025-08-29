import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TryckersService {
  private http = inject(HttpClient);

  getAuthToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return token;
  }

  async getTryckers(): Promise<any[]> {
    const result = await this.http
      .get<any[]>('http://localhost:8080/api/v1/users', {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })
      .toPromise();
    return result ?? [];
  }
}
