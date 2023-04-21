/// <reference types='@types/google.maps' />
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerComponent } from './animations/loading-spinner.component';
import { SearchComponent } from './search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatList, MatListModule} from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';

// https://github.com/skynet2/ngx-google-places-autocomplete
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
// https://timdeschryver.dev/blog/google-maps-as-an-angular-component#googlemap
import { GoogleMapsModule } from '@angular/google-maps'
import { searchBoxDirective } from './itinerary/searchBox.directive';
import { autocompleteDirective } from './itinerary/autocomplete.directive';
import { PassportComponent } from './passport/passport.component';

@NgModule({
  declarations: [
    AppComponent,
    ItineraryComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    SearchComponent,
    searchBoxDirective,
    autocompleteDirective,
    PassportComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatCardModule,
    MatTooltipModule,
    GooglePlaceModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
