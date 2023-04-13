import { Injectable } from "@angular/core";
import { searchModel } from "./search.model";

@Injectable({providedIn: 'root'})
export class SearchService {
    fromPrevious: boolean = false;
    searchModel!: searchModel | null;

    public getModel() {
        return this.searchModel;
    }

    public setModel(searchModel: searchModel) {
        this.searchModel = searchModel;
    }

    public deleteModel() {
        this.searchModel = null;
    }
}