/// <reference types='@types/google.maps' />
import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { searchModel } from './search.model';
import { SearchService } from './search.service';

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

  private autocomplete: any;
  private country: any;
  searchForm!: FormGroup;
  campaignOne = new FormGroup({
    start: new FormControl(new Date(today)),
    end: new FormControl(new Date(today)),
  });
  

  constructor(private fb: FormBuilder,
              private searchService: SearchService,
              private router: Router) {
      
              }

  ngOnInit() {
    this.searchForm = this.fb.group({
      country: this.fb.control<string>(''),
      dateFrom: this.fb.control<string>(''),
      dateTo: this.fb.control<string>('')
    });
  }

  onSubmit() {
    let search: searchModel = {
      // country: this.country.formatted_address,
      country: 'Sin ja po',
      dateFrom: <Date> this.campaignOne.get('start')?.value,
      dateTo: <Date> this.campaignOne.get('end')?.value,
      imgUrl: "www.google.com"
      // imgUrl: this.country.photos[2].getUrl()
    }

    console.log(this.campaignOne.get('start')?.value);
    console.log(this.campaignOne.get('end')?.value);
    this.searchService.setModel(search);
    this.router.navigate(['/itinerary']);
  }

  activate() {
    console.log(this.country[0].photos[0].getUrl());
  }
  
  handleAddressChange(event: Object) {
    this.country = event;
    console.log(this.country)
    console.log(this.country.photos[0].getUrl());
    console.log(this.country.photos[1].getUrl());
    console.log(this.country.photos[2].getUrl());

  }

  // JavaScript in Angular test
  // callFunction1() {
  //   callTestJs();
  // }

}