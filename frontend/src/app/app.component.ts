import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { MapService } from './itinerary/itinerary.map.service';

// $ ng serve --proxy-config proxy.config.js

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  name="ridhwan"; 

  isAuthenticated = false;
  private userSub!: Subscription;

  constructor(private authService: AuthService, 
              private mapService: MapService,
              private router: Router) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      // this.isAuthenticated = !!user;
      if(user == null){
        var user2 = localStorage.getItem('userData');
        this.isAuthenticated = !!user2;
      }
      this.isAuthenticated = !user ? false: true;
    });
    this.authService.autoLogin();
  }
  
  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  
  toItinerary() {
    this.mapService.getMapModel().subscribe(() => {
      this.router.navigate(['/itinerary']);
    });
  }

}