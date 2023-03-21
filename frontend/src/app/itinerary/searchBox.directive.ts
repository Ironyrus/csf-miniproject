// https://github.com/skynet2/ngx-google-places-autocomplete/blob/master/src/ngx-google-places-autocomplete.directive.ts
import { Directive, ElementRef, AfterViewInit, Output, EventEmitter, NgZone } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Subject } from 'rxjs';
import { location } from './itineraryModels/locationModel';

@Directive({
  selector: '[iwanSearchBox]'
})
export class searchBoxDirective implements AfterViewInit{

  @Output() onAddressChange = new Subject<location>();
  private searchBox: any; 
  private eventListener: any;
  private place!: any;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

 ngAfterViewInit(): void {
     this.initialize();
 }

 initialize(){ 
    console.log("initializing...");

    this.searchBox = new google.maps.places.SearchBox(this.el.nativeElement);
  //   if (!this.searchBox.addListener != null) { // Check to bypass https://github.com/angular-ui/angular-google-maps/issues/270
  //     google.maps.event.addListener(this.searchBox, 'places_changed', () => {
  //       var place = this.searchBox.getPlace();
  //       console.log(place);
  //       this.selected();
  //     });
  // }
    this.searchBox.addListener("places_changed", () => {
        this.selected();
    });
 }

 private selected() {
    this.ngZone.run(() => {
        this.place = this.searchBox.getPlaces();
        this.onAddressChange.next(this.place[0]);
    })
 }
}