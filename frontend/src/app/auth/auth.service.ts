import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subject, tap, throwError, BehaviorSubject } from 'rxjs';
import { SearchService } from '../search/search.service';
import { authModel } from './auth.model';
import { User } from './user.model';

@Injectable({providedIn: 'root'})

export class AuthService{

    user = new BehaviorSubject<User>(null!);
    private tokenExpirationTimer: any;
    constructor(private http: HttpClient, private router: Router, private searchService: SearchService) {}

    signup(email: string, password: string) {
        const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Access-Control-Allow-Origin', '*'); // Very important
        return this.http.post<authModel>('/signup', {email: email, password: password}, {headers: headers})
            .pipe(catchError((errorRes) => {
                return throwError(() => {
                    return new Error(errorRes.error.result);
                  });
           }), tap(resData => {
            this.handleAuthentication(resData.username_returned, resData.token, resData.expiresIn);
           }));
    }

    login(email: string, password: string) {
        const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Access-Control-Allow-Origin', '*'); // Very important
        
        return this.http.post<authModel>('/login', {email: email, password: password}, {headers: headers})
        .pipe(catchError((errorRes) => {
            return throwError(() => {
              return new Error(errorRes.error.expiresIn);
            });
          }), tap(resData => {
            this.handleAuthentication(resData.username_returned, resData.token, resData.expiresIn);
          }));
    }

    logout() {
        this.user.next(null!);
        localStorage.removeItem('userData');
        localStorage.removeItem('searchModel');
        this.searchService.deleteModel();
        this.router.navigate(['/auth'])
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogin() {
        const userData: {
            username_returned: string,
            _token: string,
            _tokenExpiry: Date
        } = JSON.parse(localStorage.getItem('userData')!);
        if(!userData) {
            // No stored user data in local storage. User needs to sign in on his own.
            return;
        }

        const loadedUser = new User(userData.username_returned, userData._token, userData._tokenExpiry);
        
        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpiry).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number){
        console.log(expirationDuration / 60000 + " minutes to auto-logout");
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, token: string, expiresIn: Date) {
            const date = new Date(+expiresIn);
            const expiringIn = date.getTime() - (new Date().getTime());
            console.log(date);
            console.log("Check: " + (date.getTime() - (new Date().getTime())) );
            const user = new User(email, token, date);
            this.user.next(user);
            this.autoLogout(expiringIn);
            localStorage.setItem('userData', JSON.stringify(user));
    }
}