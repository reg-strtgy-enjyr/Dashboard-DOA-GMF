import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    this.initializeInterceptor();
  }

  // Store authentication token
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('token', token);
    }
  }

  // Get authentication token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  // Remove authentication token
  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('token');
    }
  }

  initializeInterceptor() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}
