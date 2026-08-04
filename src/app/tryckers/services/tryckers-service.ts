import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Trycker,
  TryckerMediaResponse,
  TryckerProfileResponse,
} from '@tryckers/interfaces';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class TryckersService {
  private http = inject(HttpClient);

  async getTryckers(): Promise<Trycker[]> {
    const result = await this.http
      .get<Trycker[]>(`${baseUrl}/users`)
      .toPromise();
    return result ?? [];
  }

  async getTryckerByUsername(username: string): Promise<Trycker | null> {
    const result = await this.http
      .get<TryckerProfileResponse>(`${baseUrl}/perfil/${username}`)
      .toPromise();
    return result?.user ?? null;
  }

  async uploadAvatar(file: File): Promise<Trycker | null> {
    const formData = new FormData();
    formData.append('file', file);

    const result = await this.http
      .post<TryckerMediaResponse>(`${baseUrl}/users/me/avatar`, formData)
      .toPromise();
    return result?.user ?? null;
  }

  async uploadBanner(file: File): Promise<Trycker | null> {
    const formData = new FormData();
    formData.append('file', file);

    const result = await this.http
      .post<TryckerMediaResponse>(`${baseUrl}/users/me/banner`, formData)
      .toPromise();
    return result?.user ?? null;
  }

  async removeAvatar(): Promise<Trycker | null> {
    const result = await this.http
      .delete<TryckerMediaResponse>(`${baseUrl}/users/me/avatar`)
      .toPromise();
    return result?.user ?? null;
  }

  async removeBanner(): Promise<Trycker | null> {
    const result = await this.http
      .delete<TryckerMediaResponse>(`${baseUrl}/users/me/banner`)
      .toPromise();
    return result?.user ?? null;
  }

  async updateProfile(data: Partial<Trycker>): Promise<Trycker | null> {
    const result = await this.http
      .put<TryckerProfileResponse>(`${baseUrl}/users/me`, data)
      .toPromise();
    return result?.user ?? null;
  }


  mediaUrl(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    if (value.startsWith('/')) {
      return new URL(value, baseUrl).origin + value;
    }

    return value;
  }
}
