/// <reference types='@types/google.maps' />
import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { searchModel } from './search.model';
import { SearchService } from './search.service';
import { MapService } from '../itinerary/itinerary.map.service';
import {Title} from "@angular/platform-browser";

// Using js in Angular
//@ts-ignore
// import { callTestJs } from "../../assets/testjs.js";

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['search.component.css']
})

export class SearchComponent implements OnInit {

  title = "Search";

  private autocomplete: any;
  private country: any;
  countries!: string[];
  searchForm!: FormGroup;
  campaignOne = new FormGroup({
    start: new FormControl(new Date(today)),
    end: new FormControl(new Date(today)),
  });
  
  constructor(private fb: FormBuilder,
              private searchService: SearchService,
              private router: Router,
              private mapService: MapService,
              private titleService:Title) {
      this.titleService.setTitle("Destination Search!");
              }

  ngOnInit() {
    this.searchForm = this.fb.group({
      country: this.fb.control<string>('', [Validators.required]),
      dateFrom: this.fb.control<string>(''),
      dateTo: this.fb.control<string>('')
    });

    this.searchService.getMapModel().subscribe(data => {
      this.countries = data.result;
    });
  }

  onSubmit() {
    let search: searchModel = {
      country: this.searchForm.value.country,
      dateFrom: <Date> this.campaignOne.get('start')?.value,
      dateTo: <Date> this.campaignOne.get('end')?.value,
      imgUrl: this.country.photos[2].getUrl()
    }

    this.searchService.setModel(search);
    this.searchService.fromPrevious = true;
    this.router.navigate(['/itinerary']);
  }

  activate() {
    console.log(this.country[0].photos[0].getUrl());
  }
  
  handleAddressChange(event: Object) {
    this.country = event;
    this.searchForm.get("country")?.patchValue(this.country.formatted_address);
    console.log(this.country)
    console.log(this.country.photos[0].getUrl());
    console.log(this.country.photos[1].getUrl());
    console.log(this.country.photos[2].getUrl());

  }

  getCountries(){
    return this.countries;
  }

  goToItinerary(country: string) {
    this.router.navigate(['/itinerary/', country]);
  }

  deleteItinerary(country: string) {
    this.mapService.deleteCountryMap(country).subscribe(response => {
      console.log(response);
      alert('Itinerary for ' + country + ' deleted successfully!');
      this.router.navigate(['/passport']);
    })
  }
}