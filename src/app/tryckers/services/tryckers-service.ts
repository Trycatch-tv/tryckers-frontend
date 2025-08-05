import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TryckersService {
  private _tryckers = signal([]);
  private http = inject(HttpClient);

  getAuthToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return token;
  }

  tryckers = computed(() => this._tryckers());

  getTryckers() {
    return this.http
      .get<any[]>('http://localhost:8080/api/v1/users', {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })
      .pipe(
        tap((data) => {
          console.log(data);
          // this._tryckers.set(data);
        })
      );
  }
}
