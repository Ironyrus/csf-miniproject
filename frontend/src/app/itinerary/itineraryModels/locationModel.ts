// Main model for each location to visit in itinerary

import { PhotoRequest } from "ngx-google-places-autocomplete/objects/photo";
import { AddressComponent } from "./addressComponent";
import { Geometry } from "./geometry";
import { image } from "./imgModel";
import { OpeningHours } from "./openingHours";
import { PlaceReview } from "./placeReview";

export class location {
    address_components!: AddressComponent[];
    adr_address!: string;
    formatted_address!: string;
    formatted_phone_number!: string;
    geometry!: Geometry;
    html_attributions!: string[];
    icon!: string;
    id!: string;
    international_phone_number!: string;
    name!: string;
    opening_hours!: OpeningHours;
    permanently_closed!: boolean;
    photos!: image[];
    place_id!: string;
    price_level!: number;
    rating!: number;
    user_ratings_total!: number;
    reviews!: PlaceReview[];
    types!: string[];
    url!: string;
    utc_offset_minutes!: number;
    vicinity!: string;
    website!: string;
}