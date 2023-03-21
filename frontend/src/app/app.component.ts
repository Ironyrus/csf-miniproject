import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

// $ ng serve --proxy-config proxy.config.js

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  private userSub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      // this.isAuthenticated = !!user;
      this.isAuthenticated = !user ? false: true;
      console.log(user);
    });
    this.authService.autoLogin();
  }
  
  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  title = 'frontend';
}