import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Trycker, TryckerProfileResponse } from '@tryckers/interfaces';
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
}
