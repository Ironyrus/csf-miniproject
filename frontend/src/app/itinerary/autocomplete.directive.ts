// https://github.com/skynet2/ngx-google-places-autocomplete/blob/master/src/ngx-google-places-autocomplete.directive.ts
import { Directive, ElementRef, AfterViewInit, Output, NgZone } from '@angular/core';
import {} from 'google.maps';
import { Subject } from 'rxjs';

@Directive({
  selector: '[iwanAutocomplete]'
})
export class autocompleteDirective implements AfterViewInit{

  @Output() onAddressChange = new Subject<Object>();
  private autocomplete: any; 
  private place!: any;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

 ngAfterViewInit(): void {
     this.initialize();
 }

 initialize(){ 
    console.log("initializing...");
    const center = { lat: 50.064192, lng: -130.605469 };

    const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
      };
    const options = {
        bounds: defaultBounds,
        componentRestrictions: { country: "us" },
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: false,
        types: ["establishment"],
      };
    this.autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement);
    this.autocomplete.addListener("place_changed", () => {
      this.selected();
  });
  //   if (!this.autocomplete.addListener != null) { // Check to bypass https://github.com/angular-ui/angular-google-maps/issues/270
  //     console.log("test2");
  //     google.maps.event.addListener(this.autocomplete, "place_changed", () => {
  //       var place = this.autocomplete.getPlaces();
  //       console.log(place);
  //       this.selected();
  //     });
  // }
    
 }

 private selected() {
    this.ngZone.run(() => {
        this.place = this.autocomplete.getPlace();
        this.onAddressChange.next(this.place);
    })
 }
}