import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        router: RouterStateSnapshot)
        :boolean | Promise<boolean> | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(take(1),
                                          map(user => {
            const isAuth =  !user ? false: true;
            if(isAuth)
                return true;
            else{
                // Auth Guard only works if website accessed through url. Does not work when navigating programmatically
                alert('Please log in first!');
                return this.router.createUrlTree(['/auth']);
            }
            
        }));
    }
}