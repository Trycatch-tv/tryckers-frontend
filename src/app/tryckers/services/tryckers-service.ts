import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Trycker, TryckerProfileResponse } from '@tryckers/interfaces';

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

  async getTryckers(): Promise<Trycker[]> {
    const result = await this.http
      .get<Trycker[]>('http://localhost:8080/api/v1/users', {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })
      .toPromise();
    return result ?? [];
  }

  async getTryckerByUsername(username: string): Promise<Trycker | null> {
    const result = await this.http
      .get<TryckerProfileResponse>(
        `http://localhost:8080/api/v1/perfil/${username}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        },
      )
      .toPromise();
    return result?.user ?? null;
  }
}
