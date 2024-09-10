import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  constructor(private router: Router, private toastService: ToastService, private authService: AuthService) { }

  accountId: string | null = null;
  role: string | null = null;

  origin = 'http://localhost:4200';

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
    axios.post(`http://34.87.6.132:4040/account/logout`)
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
    if (window.location.href != `${this.origin}/editIOR` && 
        window.location.href != `${this.origin}/detailIOR` &&
        window.location.href != `${this.origin}/addFollowonIOR` &&
        window.location.href != `${this.origin}/editFollowonIOR`
      ) {
      sessionStorage.removeItem('id_ior');
    }
    if (window.location.href != `${this.origin}/editFollowonIOR`) {
      sessionStorage.removeItem('id_follup_ior');
    }
    if (window.location.href != `${this.origin}/editNCR` &&
        window.location.href != `${this.origin}/detailNCR` &&
        window.location.href != `${this.origin}/addReplyNCR` &&
        window.location.href != `${this.origin}/editReplyNCR` &&
        window.location.href != `${this.origin}/addResultNCR` &&
        window.location.href != `${this.origin}/editResultNCR`
      ) {
      sessionStorage.removeItem('ncr_init_id');
    }
    if (window.location.href != `${this.origin}/editReplyNCR`) {
      sessionStorage.removeItem('id_ncr_reply');
    }
    if (window.location.href != `${this.origin}/editResultNCR`) {
      sessionStorage.removeItem('id_ncr_result');
    }
    if (window.location.href != `${this.origin}/detailPersonnel` && 
        window.location.href != `${this.origin}/editPersonnel`
      ) {
      sessionStorage.removeItem('person_id');
    }
  }
}
