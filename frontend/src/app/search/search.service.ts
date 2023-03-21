import { Injectable } from "@angular/core";
import { searchModel } from "./search.model";

@Injectable({providedIn: 'root'})
export class SearchService {

    searchModel!: searchModel;

    public getModel() {
        return this.searchModel;
    }

    public setModel(searchModel: searchModel) {
        this.searchModel = searchModel;
    }
}