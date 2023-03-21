import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./auth/auth.component";
import { ItineraryComponent } from "./itinerary/itinerary.component";
import { SearchComponent } from "./search/search.component";

const appRoutes: Routes = [
    // { path: '', component: AppComponent, children: [
    //     { path: 'auth', component: AuthComponent },
    //     { path: 'itinerary', component: ItineraryComponent}
    // ] },
    { path: 'search', component: SearchComponent},
    { path: 'auth', component: AuthComponent },
    { path: 'itinerary', component: ItineraryComponent },
    { path: '**', redirectTo: '/search'}
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {useHash: true})
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {

}