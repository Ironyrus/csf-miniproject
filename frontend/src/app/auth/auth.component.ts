import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, Subscription, throwError } from 'rxjs';
import { authModel } from './auth.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    
    loginForm!: FormGroup;
    loggedIn!: boolean;
    loginMode!: boolean;
    authModel!: authModel;
    isLoading: boolean = false;
    authObs!: Observable<authModel>;

    constructor(private fb: FormBuilder, 
                private authService: AuthService,
                private router: Router) {}
    private userSub!: Subscription;

    ngOnInit() {
      var userData = localStorage.getItem('userData');
      if(userData !== null){
        alert('Already logged in! Redirecting to search page.');
        this.router.navigate(['/search']);
      }

      this.loginForm = this.fb.group({
          email: this.fb.control<string>('', [Validators.required, Validators.email]),
          password: this.fb.control<string>('', [Validators.required])
      });
      this.loginMode = true;
    }

    submitForm() {
      this.isLoading = true;
      if(this.loginMode){
        this.authService
          .login(this.loginForm.get('email')?.value, 
              this.loginForm.get('password')?.value)
          .subscribe({next: (data) => {
              this.authModel = data;
              console.log(this.authModel);
              this.loggedIn = true;
              setInterval(() => {this.isLoading = false}, 500);
              this.router.navigate(['/search']);
              alert('Successfully logged in!');
           }, error: (error) => {
              this.isLoading = false;
              console.log(error);
              alert("Username or Password incorrect!");
           }
          });
      } else {
          this.authService
          .signup(this.loginForm.get('email')?.value, 
                  this.loginForm.get('password')?.value)
          .subscribe({next: (data) => {
                this.authModel = data;
                console.log(">>>> " + this.authModel);
                setInterval(() => {this.isLoading = false}, 500);
                this.router.navigate(['/search']);
                if(this.authModel.result == '0') {
                  alert('Email already exists!');
                } else
                  alert('Successfully signed up!');
                }, error: (error) => {
                  this.isLoading = false;
                  alert(error);
                }
            });
      }
      
      // alert('form resetting now');
      
      this.loginForm.reset();
    }

    switchModes() {
      this.loginMode = !this.loginMode;
    }
}