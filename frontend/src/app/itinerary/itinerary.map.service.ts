import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, exhaustMap, take, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { location } from './itineraryModels/locationModel';
import { MapModel } from './itineraryModels/MapModel';
import { result } from "./itineraryModels/result";

@Injectable({providedIn: 'root'})

export class MapService {

    mapModel = new BehaviorSubject<MapModel>(null!);

    constructor(private http: HttpClient, private authService: AuthService) {}

    saveMapModel(mapModel: MapModel) {
      var user!: User;
      this.authService.user.subscribe((data) => {
          user = data;
          console.log(user);
      });
      console.log(mapModel.isDetailHidden)
      const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Access-Control-Allow-Origin', '*'); // Very important
        return this.http.post<result>('/addMapModel', mapModel, {headers: headers, params: new HttpParams().set('email', user.username_returned).set('country', mapModel.countryName)});
      
    }

    getMapModel() {
      const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Access-Control-Allow-Origin', '*'); // Very important

      return this.authService.user.pipe(take(1), exhaustMap(user => {
        const token = user ? user.token : "token is empty";
        const username = user ? user.username_returned : "username is empty";
        const url = "/getMapModel/" + username;
        const userData: {
          username_returned: string,
          _token: string,
          _tokenExpiry: Date
      } = JSON.parse(localStorage.getItem('userData')!);
        return this.http.get<MapModel>(url, {headers: headers, 
            params: new HttpParams().set('auth', token!)
            }).pipe(tap(data => {
                this.mapModel.next(data)
            }));
        }));
      
    }

    getMapModelWithCountryName(country: string) {
      const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Access-Control-Allow-Origin', '*'); // Very important

      return this.authService.user.pipe(take(1), exhaustMap(user => {
        const token = user ? user.token : "token is empty";
        const username = user ? user.username_returned : "username is empty";
        const url = "/getMapModel2/" + username + "/" + country;
        const userData: {
          username_returned: string,
          _token: string,
          _tokenExpiry: Date
      } = JSON.parse(localStorage.getItem('userData')!);
        return this.http.get<MapModel>(url, {headers: headers, 
            params: new HttpParams().set('auth', token!)
            }).pipe(tap(data => {
                this.mapModel.next(data)
            }));
        }));
      
    }

    initialize2dArray(isDetailHidden: boolean[][], countryImg: string, countryName: string, dateTo: Date, dateFrom: Date, travelDays: number, activityDays: number[], locationData: location[][], markerOptions: google.maps.MarkerOptions[][], markerPositions: google.maps.LatLngLiteral[][], timeTakenFromOrigin: any[][], distanceFromOrigin: any[][]) {
        // Need to initialize 2d array so that we can properly add new days and activities
        for (let i = 0; i < travelDays; i++) {
          if(locationData[i] == null){
            locationData[i] = [];
            markerOptions[i] = [];
            markerPositions[i] = [];
            timeTakenFromOrigin[i] = [];
            distanceFromOrigin[i] = [];

            isDetailHidden[i] = [];
        }
          
        for (let j = 0; j < activityDays[i]; j++) {
          if(locationData[i][j] == null){
            locationData[i][j] = new location;
            markerOptions[i][j] = { 
              draggable: false,
              label: {
                color: 'pink',
                text: '' + (markerPositions.length + 1)
              },
              title: '' + (markerPositions.length + 1),
              animation: google.maps.Animation.DROP,
              visible: false
            };
            markerPositions[i][j] = {lat: 0, lng: 0};
            timeTakenFromOrigin[i][j] = 'No data yet';
            distanceFromOrigin[i][j] = 'No data yet';

            isDetailHidden[i][j] = false;
          }
        }
      }

      let mapModel: MapModel = {
        isDetailHidden: isDetailHidden,
        countryImg: countryImg,
        countryName: countryName,
        dateTo: dateTo + "",
        dateFrom: dateFrom + "",
        markerPositions: markerPositions,
        markerOptions: markerOptions,
        distanceFromOrigin: distanceFromOrigin,
        timeTakenFromOrigin: timeTakenFromOrigin,
        locationData: locationData
      }
      return mapModel;
    }

    removeDay(dayIndex: number, mapModel: MapModel){
        mapModel.isDetailHidden.splice(dayIndex, 1);
        mapModel.locationData.splice(dayIndex, 1);
        mapModel.markerOptions.splice(dayIndex, 1);
        mapModel.markerPositions.splice(dayIndex, 1);
        mapModel.timeTakenFromOrigin.splice(dayIndex, 1);
        mapModel.distanceFromOrigin.splice(dayIndex, 1);
    }

    removeActivity(dayIndex: number, activityIndex: number, mapModel: MapModel) {
        mapModel.isDetailHidden[dayIndex].splice(activityIndex, 1);
        mapModel.locationData[dayIndex].splice(activityIndex, 1);
        mapModel.markerOptions[dayIndex].splice(activityIndex, 1);
        mapModel.markerPositions[dayIndex].splice(activityIndex, 1);
        mapModel.timeTakenFromOrigin[dayIndex].splice(activityIndex, 1);
        mapModel.distanceFromOrigin[dayIndex].splice(activityIndex, 1);

        // var newMapModel: MapModel = newMapModel = {
        //   countryName: mapModel.countryName,
        //   dateTo: mapModel.dateTo,
        //   dateFrom: mapModel.dateFrom,
        //   markerPositions: mapModel.markerPositions,
        //   markerOptions: mapModel.markerOptions,
        //   distanceFromOrigin: mapModel.distanceFromOrigin,
        //   timeTakenFromOrigin: mapModel.timeTakenFromOrigin,
        //   locationData: mapModel.timeTakenFromOrigin
        // }
    }

    handleGetMaps() {
      this.getMapModel().subscribe(data => {
        this.mapModel.next(data);
      });
    }

    deleteCountryMap(country: string) {
      const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Access-Control-Allow-Origin', '*'); // Very important

      return this.authService.user.pipe(take(1), exhaustMap(user => {
        const token = user ? user.token : "token is empty";
        const username = user ? user.username_returned : "username is empty";
        const url = "/deleteItinerary/" + username + "/" + country;
        return this.http.delete<any>(url, {headers: headers, 
            params: new HttpParams().set('auth', token!)
            })
        }));
    }
}