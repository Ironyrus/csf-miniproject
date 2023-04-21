import { Component, OnInit, ViewChild } from '@angular/core';
import { PassportService } from './passport.service';
import { MapModel } from '../itinerary/itineraryModels/MapModel';
import { MatTable } from '@angular/material/table';

export interface PassportData {
  Country: string;
  number: number;
  Dates: String;
  Budget: string;
}

const ELEMENT_DATA: PassportData[] = [
  {number: 1, Country: 'Hydrogen', Dates: '1.0079', Budget: 'H'},
  {number: 2, Country: 'Helium', Dates: '4.0026', Budget: 'He'},
  {number: 3, Country: 'Lithium', Dates: '6.941', Budget: 'Li'},
  {number: 4, Country: 'Beryllium', Dates: '9.0122', Budget: 'Be'},
  {number: 5, Country: 'Boron', Dates: '10.811', Budget: 'B'},
  {number: 6, Country: 'Carbon', Dates: '12.0107', Budget: 'C'},
  {number: 7, Country: 'Nitrogen', Dates: '14.0067', Budget: 'N'},
  {number: 8, Country: 'Oxygen', Dates: '15.9994', Budget: 'O'},
  {number: 9, Country: 'Fluorine', Dates: '', Budget: 'F'},
  {number: 10, Country: 'Neon', Dates: '20.1797', Budget: 'Ne'},
];

@Component({
  selector: 'app-passport',
  templateUrl: 'passport.component.html',
  styleUrls: ['passport.component.css']
})
export class PassportComponent implements OnInit {

  
  ELEMENT_DATA: PassportData[] = [];
  dataSource: any;
  displayedColumns: string[] = ['number', 'Country', 'Dates', 'Budget'];
  mapArr!: MapModel[];
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(private passportService: PassportService) {}

  ngOnInit(): void {

    this.fetchData().subscribe(data => {
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
        this.dataSource = this.ELEMENT_DATA;
    });
    this.table.renderRows();
    }
  
    fetchData() {
      return this.passportService.getPassport();
    }

  }