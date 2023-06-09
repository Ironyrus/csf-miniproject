import { location } from '../itineraryModels/locationModel';

export interface MapModel {
    isDetailHidden: boolean[][],
    countryImg: string,
    countryName: string,
    dateTo: string,
    dateFrom: string,
    markerPositions: google.maps.LatLngLiteral[][],
    markerOptions: google.maps.MarkerOptions[][],
    distanceFromOrigin: any[][],
    timeTakenFromOrigin: any[][],
    locationData: location[][]
}