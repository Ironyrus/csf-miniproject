import { Injectable } from "@angular/core";
import { searchModel } from "./search.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class SearchService {
    fromPrevious: boolean = false;
    searchModel!: searchModel | null;

    constructor(private http: HttpClient, private router: Router) {}

    public getModel() {
        return this.searchModel;
    }

    public setModel(searchModel: searchModel) {
        this.searchModel = searchModel;
    }

    public deleteModel() {
        this.searchModel = null;
    }

    getMapModel() {
        const headers = new HttpHeaders()
              .set('content-type', 'application/json')
              .set('Access-Control-Allow-Origin', '*'); // Very important
        
        const userData: {
            username_returned: string,
            _token: string,
            _tokenExpiry: Date
        } = JSON.parse(localStorage.getItem('userData')!);

        const url = "/getCountries/" + userData.username_returned;

        return this.http.get<any>(url, {headers: headers, 
            params: new HttpParams().set('auth', userData._token)
        });
      }

}