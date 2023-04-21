import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { MapModel } from "../itinerary/itineraryModels/MapModel";

export interface PassportData {
    Country: string;
    number: number;
    Dates: String;
    Budget: string;
  }

@Injectable({providedIn: 'root'})
export class PassportService {

    constructor(private http: HttpClient, private router: Router) {}
    ELEMENT_DATA: PassportData[] = [];
    mapArr!: MapModel[];
    getPassport() {
        const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Access-Control-Allow-Origin', '*'); // Very important
        
        const userData: {
            username_returned: string,
            _token: string,
            _tokenExpiry: Date
        } = JSON.parse(localStorage.getItem('userData')!);

        const url = "/getPassport/" + userData.username_returned;

        const result$ =  this.http.get<MapModel[]>(url, {headers: headers, 
            params: new HttpParams().set('auth', userData._token)
        })

        result$.subscribe(data => {
            this.mapArr = data;
            for (let i = 0; i < this.mapArr.length; i++) {
                var p: PassportData = {
                  Country: JSON.parse(this.mapArr[i].countryName),
                  number: i + 1,
                  Dates: JSON.parse(this.mapArr[i].dateFrom) + " - " + JSON.parse(this.mapArr[i].dateTo),
                  Budget: "$",
                }
                this.ELEMENT_DATA.push(p);
            } 
          });

        return result$;
    }
}