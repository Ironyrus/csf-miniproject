import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { ItineraryComponent } from "./itinerary/itinerary.component";
import { ItineraryGuard } from "./itinerary/itinerary.guard";
import { SearchComponent } from "./search/search.component";
import { PassportComponent } from "./passport/passport.component";

const appRoutes: Routes = [
    // { path: '', component: AppComponent, children: [
    //     { path: 'auth', component: AuthComponent },
    //     { path: 'itinerary', component: ItineraryComponent}
    // ] },
    { path: 'search', component: SearchComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'itinerary/:country', component: ItineraryComponent},
    { path: 'itinerary', component: ItineraryComponent, 
        canActivate: [AuthGuard, ItineraryGuard] 
    },
    { path: 'passport', component: PassportComponent},
    { path: '**', redirectTo: '/search'}
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {useHash: true, onSameUrlNavigation: 'reload'})
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {

}