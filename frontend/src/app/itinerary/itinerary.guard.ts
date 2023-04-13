import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { searchModel } from "../search/search.model";
import { SearchService } from "../search/search.service";
import { MapService } from "./itinerary.map.service";
import { MapModel } from "./itineraryModels/MapModel";

@Injectable({providedIn: 'root'})
export class ItineraryGuard implements CanActivate {

    mapModel!: MapModel;
    constructor(private MapService: MapService, private searchService: SearchService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {


            return this.MapService.getMapModel().pipe(take(1),
                map((mapModel) => {
                    const hasMaps = !!mapModel;
                    if(hasMaps) {
                        return true;
                    }
                    alert('Please create Maps first!');
                    return this.router.createUrlTree(['/search']);
                }));

            this.MapService.getMapModel().subscribe((data) => {
                this.mapModel = data;
                console.log(data);
            });
            // var search: searchModel;
            // search = this.searchService.getModel()!;
            // console.log(search);
            // if(this.mapModel === undefined || this.mapModel.countryName === 'null'){
            //     if(search === undefined){
            //         alert('Please create a new itinerary!');
            //         return this.router.createUrlTree(['/search']);
            //     }
            //     else return true;
            // } 
            return true;
        }
}