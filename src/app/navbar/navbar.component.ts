import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import axios from 'axios';
import { ToastService } from '../toast.service';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string,
  userId: string,
  role: string,
  iat: number,
  exp: number
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router, 
    private toastService: ToastService, 
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  accountId: string | null = null;
  role: string | null = null;

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { userId, role } = jwtDecode<JwtPayload>(token);
      this.accountId = userId;
      this.role = role;
      console.log('Retrieved accountid:', this.accountId);
      console.log('Retrieved role:', this.role);
      this.checkRoute();
    } else {
      this.toastService.failedToast('Please login again');
      window.location.href = '/login';
    }
  }

  logout() {
    axios.post(`http://34.132.47.129:4040/account/logout`)
      .then(response => {
        this.authService.removeToken();
        this.role = null;
        this.router.navigate(['/login']);
        this.toastService.successToast('Logout successful');
        console.log(response.data);
      })
      .catch(error => {
        console.error('Logout failed:', error);
        this.toastService.failedToast('Logout failed');
      });
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  checkRoute() {
    if (window.location.href != 'http://localhost:4200/editIOR' && 
        window.location.href != 'http://localhost:4200/detailIOR' &&
        window.location.href != 'http://localhost:4200/addFollowonIOR' &&
        window.location.href != 'http://localhost:4200/editFollowonIOR'
      ) {
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.removeItem('id_ior');
      }
    }
    if (window.location.href != 'http://localhost:4200/editFollowonIOR') {
      sessionStorage.removeItem('id_follup_ior');
    }
    if (window.location.href != 'http://localhost:4200/editNCR' &&
        window.location.href != 'http://localhost:4200/detailNCR' &&
        window.location.href != 'http://localhost:4200/addReplyNCR' &&
        window.location.href != 'http://localhost:4200/editReplyNCR' &&
        window.location.href != 'http://localhost:4200/addResultNCR' &&
        window.location.href != 'http://localhost:4200/editResultNCR'
      ) {
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.removeItem('ncr_init_id');
      }
    }
    if (window.location.href != 'http://localhost:4200/editReplyNCR') {
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.removeItem('id_ncr_reply');
      }
    }
    if (window.location.href != 'http://localhost:4200/editResultNCR') {
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.removeItem('id_ncr_result');
      }
    }
    if (window.location.href != 'http://localhost:4200/detailPersonnel' && 
        window.location.href != 'http://localhost:4200/editPersonnel'
      ) {
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.removeItem('person_id');
      }
    }
  }
}
