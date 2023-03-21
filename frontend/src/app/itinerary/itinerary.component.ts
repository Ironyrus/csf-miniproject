import { map, Observable } from 'rxjs';
import { searchModel } from '../search/search.model';
import { DateService } from './itinerary.date.service';
import { SearchService } from '../search/search.service';
import { PhotoRequest } from './itineraryModels/imgModel';
import { location } from './itineraryModels/locationModel';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MapInfoWindow, MapMarker, GoogleMap, MapDirectionsService } from '@angular/google-maps';
import { MapService } from './itinerary.map.service';
import { MapModel } from './itineraryModels/MapModel';
// Dragging and Dropping itinerary
// https://phamhuuhien.medium.com/how-to-create-drag-and-drop-accordion-list-in-angular-b75dd004bb4e

export interface MapDirectionsResponse {
  status: google.maps.DirectionsStatus;
  result?: google.maps.DirectionsResult;
}

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.css']
})

export class ItineraryComponent implements OnInit{

  // Google Maps (https://timdeschryver.dev/blog/google-maps-as-an-angular-component#putting-it-all-together)
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  zoom = 12;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapId: 'cb4462ae0d7b039a',
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };
  infoContent = '';
  markerPositions: google.maps.LatLngLiteral[][] = [[]];
  markerOptions: google.maps.MarkerOptions[][]  = [[]];
  selectedDayIndex!: number;
  selectedActivityIndex!: number;
  directionsResults$!: Observable<google.maps.DirectionsResult|undefined>;
  distanceFromOrigin: any[][] = [[]];
  timeTakenFromOrigin: any[][] = [[]];

  places!: location;
  country: string = "Country Text Here";
  countryImg: any;
  search!: searchModel;
  itinForm!: FormGroup;
  itinArray!: FormArray;
  locationData: location[][] = [[]];
  photoRequest!: PhotoRequest;
  todayDate: any = new Date();

  travelDates!: string[];

  // Object to be saved into and retrieved from Database;
  private mapModel!: MapModel;

  constructor(private fb: FormBuilder,
              private searchService: SearchService,
              private dateService: DateService,
              private mapDirectionsService: MapDirectionsService,
              private mapService: MapService) {}
              
  getTravelDays(): FormArray {
      return this.itinForm.get("travelDays") as FormArray;
  }

  NewTravelDay(): FormGroup {
    return this.fb.group({
        activities: this.fb.array([])
    })
  }

  addTravelDaytoFormArray() {
    this.getTravelDays().push(this.NewTravelDay());
  }

  removeTravelDay(index: number) {
    this.getTravelDays().removeAt(index);
  }

  getActivities(dayIndex: number): FormArray {
    return this.getTravelDays().at(dayIndex).get("activities") as FormArray;
  }

  NewActivity(): FormGroup {
    return this.fb.group({
        title: this.fb.control<string>(''),
        location: this.fb.control<string>('')
    })
  }

  addNewActivityToFA(dayIndex: number) {
    this.getActivities(dayIndex).push(this.NewActivity());
  }

  removeActivity(dayIndex: number, index: number) {
      this.getActivities(dayIndex).removeAt(index);
  }

  // Upon loading component
  ngOnInit() {
    // Google Maps 
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    // Getting data from previous page
    this.search = this.searchService.getModel();
    this.country = this.search.country;
    this.countryImg = this.search.imgUrl;
    var numOfDays = ((+this.search.dateTo - +this.search.dateFrom) / 86400000) + 1;
    this.travelDates = <string[]>this.dateService.getTravelDates(this.search.dateFrom + "", this.search.dateTo + "");

    this.itinForm = this.fb.group({
        travelDays: this.fb.array([])
      });

    // *** Get travelDates from database ***
    for (let index = 0; index < this.travelDates.length; index++) {
        this.addTravelDaytoFormArray();
      }
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom!) this.zoom++;
  }
 
  zoomOut() {
    if (this.zoom > this.options.minZoom!) this.zoom--;
  }
 
  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()));
  }
 
  // When adding new location in itinerary, new map marker added
  addMapMarker(lat: number, lon: number, dayIndex: number, activityIndex: number) {
    const temp = {
      draggable: false,
      label: {
        color: 'white',
        text: '' + (activityIndex + 1),
        fontSize: '14px',
        fontWeight: 'bold'
      },
      title: '' + (this.markerPositions[dayIndex].length),
      animation: google.maps.Animation.DROP,
      icon: {
        url: '../../assets/gMapsIcon.png',
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0)
      }
    };
    console.log("Adding new map marker... " + lat + ", " + lon);
    this.markerOptions[dayIndex][activityIndex] = (temp);
    this.markerPositions[dayIndex][activityIndex] = {lat: lat, lng: lon};
  }

  // Dynamic function, as and when user clicks, info window opens. Works.
  openInfoWindow(marker: MapMarker, content: any) {
    this.infoContent = content;
    this.info.open(marker);
  }

  // Adding a new activity
  onAddPlace(dayIndex: number) {
    this.addNewActivityToFA(dayIndex);

    var activityDays = [];
    for (let i = 0; i < this.getTravelDays.length; i++) {
      activityDays.push(this.getActivities(i).length);
    }
    this.mapModel = this.mapService.initialize2dArray(this.country, this.search.dateTo, this.search.dateFrom, this.getTravelDays().length, activityDays, this.locationData, this.markerOptions, this.markerPositions, this.timeTakenFromOrigin, this.distanceFromOrigin);
    // Updated as and when we choose a location to go to
    this.country = this.mapModel.countryName;
    this.markerOptions = this.mapModel.markerOptions;
    this.markerPositions = this.mapModel.markerPositions;
    // Later on, will get from directions service when we choose a location to go to
    this.timeTakenFromOrigin = this.mapModel.timeTakenFromOrigin;
    this.distanceFromOrigin = this.mapModel.distanceFromOrigin;
  }

  onDelete(dayIndex: number, activityIndex: number) {
    this.removeActivity(dayIndex, activityIndex);
    this.mapService.removeActivity(dayIndex, activityIndex, this.mapModel);
    
    }

  retrieveData() {
  const result2 = this.mapService.getMapModel();
      result2.subscribe((data) => {
        if(data != null)
          this.mapModel = data;
        this.mapModel = data;
        this.mapModel = {
          countryName: data.countryName,
          dateTo: JSON.parse(data.dateTo),
          dateFrom: JSON.parse(data.dateFrom),
          markerPositions: JSON.parse(<string><unknown>data.markerPositions),
          markerOptions: JSON.parse(<string><unknown>data.markerOptions),
          distanceFromOrigin: JSON.parse(<string><unknown>data.distanceFromOrigin),
          timeTakenFromOrigin: JSON.parse(<string><unknown>data.timeTakenFromOrigin),
          locationData: JSON.parse(<string><unknown>data.locationData)
        }
        this.handleLoadExistingUser(this.mapModel);

        this.search.dateFrom = new Date(this.mapModel.dateFrom);
        this.search.dateTo = new Date(this.mapModel.dateTo);
      }); 
      console.log(this.mapModel);
  }

  processForm() {
    // Can straightaway get activity from dayIndex
    // console.log(this.getActivities(1).at(0).get('title')?.patchValue('test'));
    
    // *** save mapModel to database here
    const result = this.mapService.saveMapModel(this.mapModel);
    result.subscribe((data) => {
      console.log(data);
    });
  }

  handleLoadExistingUser(mapModel: MapModel) {
    this.itinForm = this.fb.group({
      travelDays: this.fb.array([])
    });

    this.travelDates = <string[]>this.dateService.getTravelDates(mapModel.dateFrom.replaceAll("\"", ""), mapModel.dateTo.replaceAll("\"", ""));
    this.locationData = mapModel.locationData;
    this.markerOptions = mapModel.markerOptions;
    this.markerPositions = mapModel.markerPositions;
    this.timeTakenFromOrigin = mapModel.timeTakenFromOrigin;
    this.distanceFromOrigin = mapModel.distanceFromOrigin;
    for (let dayIndex = 0; dayIndex < this.travelDates.length; dayIndex++) {
      this.addTravelDaytoFormArray();
      for (let activityIndex = 0; activityIndex < mapModel.markerPositions[dayIndex].length; activityIndex++) {
        this.addNewActivityToFA(dayIndex);
        this.handleAddressChange(mapModel.locationData[dayIndex][activityIndex], dayIndex, activityIndex);
      }
    }

    this.mapModel = mapModel;
  }

  initializeMapLocations() {

  }

  handleAddressChange(event: location, dayIndex: number, activityIndex: number) {
    this.todayDate = (this.todayDate + "").substring(0, 3);
    this.places = event;
    this.getActivities(dayIndex).at(activityIndex).get('title')?.patchValue(this.places.name);
    
    // Populating each location with data
    this.locationData[dayIndex][activityIndex] = this.places;
    // When we click on the respective day inputs, the map will pan to the respective day
    this.selectedDayIndex = dayIndex;
    this.selectedActivityIndex = activityIndex;

    var latLng = new google.maps.LatLng(1.430071, 103.7868531);
    var lat = 0;
    var lng = 0;
    try {
      // When getting LatLng from database, since data from database does not have lat(), lng() methods
      latLng = new google.maps.LatLng(<number><unknown>this.mapModel.locationData[dayIndex][activityIndex].geometry.location.lat,
        <number><unknown>this.mapModel.locationData[dayIndex][activityIndex].geometry.location.lng);
      lat = <number><unknown>this.mapModel.locationData[dayIndex][activityIndex].geometry.location.lat;
      lng = <number><unknown>this.mapModel.locationData[dayIndex][activityIndex].geometry.location.lng;
    } catch (error) {
      console.log("Error due to retrieving LatLng from database and not inputting new location");
    }
    try {
      // For when getting photos from database, since data from database does not have url() method
      this.locationData[dayIndex][activityIndex].photos[0].url = this.locationData[dayIndex][activityIndex].photos[0].getUrl(this.photoRequest);
    } catch (error) {
      console.log("Error due to retrieving from database and not inputting new location");
    }
    // Adding normally. Will have error if loading from db 
    try {
      lat = this.places.geometry.location.lat();
      lng = this.places.geometry.location.lng();
    } catch {
      console.log("loading lat and lng not from db");
    }
    latLng = new google.maps.LatLng(lat, lng);
    console.log(lat + ", " + lng);
    // Add new map marker
    this.addMapMarker(lat, lng, dayIndex, activityIndex);
    // Map refocuses on newly added marker
    this.map.panTo(latLng);

    // Only invoke directions API if we have at least two locations
    if(activityIndex >= 1){
      const request: google.maps.DirectionsRequest = {
        origin: this.locationData[dayIndex][activityIndex - 1].formatted_address,
        destination: this.locationData[dayIndex][activityIndex].formatted_address,
        travelMode: google.maps.TravelMode.DRIVING
      };
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
      this.directionsResults$.subscribe((data) =>{
        if(data?.routes[0].legs[0] !== null) {
          this.timeTakenFromOrigin[dayIndex][activityIndex] = data?.routes[0]?.legs[0]?.duration?.text;
          this.distanceFromOrigin[dayIndex][activityIndex] = data?.routes[0]?.legs[0]?.distance?.text;
        }
      });
    }
    var activityDays = [];
    for (let i = 0; i < this.getTravelDays.length; i++) {
      activityDays.push(this.getActivities(i).length);
    }
    this.mapModel = this.mapService.initialize2dArray(this.country, this.search.dateTo, this.search.dateFrom, this.getTravelDays().length, activityDays, this.locationData, this.markerOptions, this.markerPositions, this.timeTakenFromOrigin, this.distanceFromOrigin);
    // this.mapModel = this.mapService.initialize2dArray(this.country, this.search.dateTo, this.search.dateFrom, this.getTravelDays().length, this.getActivities(0).length, this.locationData, this.markerOptions, this.markerPositions, this.timeTakenFromOrigin, this.distanceFromOrigin);
  }

  // When clicking on the input fields of different days, the map renders the respective activities on the maps
  changeDayOnMap(dayIndex: number, activityIndex: number){
    var latLng = new google.maps.LatLng(1.2961765,103.8259901);
    try {
      latLng = new google.maps.LatLng(<number><unknown>this.mapModel.locationData[dayIndex][activityIndex].geometry.location.lat,
        <number><unknown>this.mapModel.locationData[dayIndex][activityIndex].geometry.location.lng)
    } catch (error) {}
    console.log(latLng.lat());
    console.log(latLng.lng());
    
    this.map.panTo(latLng);
    this.selectedDayIndex = dayIndex;
    this.selectedActivityIndex = activityIndex;

    try {
      if(activityIndex >= 1){
        const request: google.maps.DirectionsRequest = {
          origin: this.locationData[dayIndex][activityIndex - 1].formatted_address,
          destination: this.locationData[dayIndex][activityIndex].formatted_address,
          travelMode: google.maps.TravelMode.DRIVING
        };
        this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
        this.directionsResults$.subscribe((data) =>{
          if(data?.routes[0].legs[0] !== null) {
            this.timeTakenFromOrigin[dayIndex][activityIndex] = data?.routes[0]?.legs[0]?.duration?.text;
            this.distanceFromOrigin[dayIndex][activityIndex] = data?.routes[0]?.legs[0]?.distance?.text;
          }
        });
      }
    } catch (error) {
      console.log("Changing address but destination on directions marker not created yet - error caught");
    }
  }
}