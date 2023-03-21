package angular.miniproject.models;

import java.util.Date;
import java.util.Map;

public class MapModel {
    private String countryName;
    private String dateTo;
    private String dateFrom;
    private Map[][] markerPositions;
    private Map[][] markerOptions;
    private String[][] distanceFromOrigin;
    private String[][] timeTakenFromOrigin;
    private Map[][] locationData;

    public String getDateTo() {
        return dateTo;
    }
    public void setDateTo(String dateTo) {
        this.dateTo = dateTo;
    }
    public String getDateFrom() {
        return dateFrom;
    }
    public void setDateFrom(String dateFrom) {
        this.dateFrom = dateFrom;
    }
    public Map[][] getMarkerPositions() {
        return markerPositions;
    }
    public void setMarkerPositions(Map[][] markerPositions) {
        this.markerPositions = markerPositions;
    }
    public Map[][] getMarkerOptions() {
        return markerOptions;
    }
    public void setMarkerOptions(Map[][] markerOptions) {
        this.markerOptions = markerOptions;
    }
    public String[][] getDistanceFromOrigin() {
        return distanceFromOrigin;
    }
    public void setDistanceFromOrigin(String[][] distanceFromOrigin) {
        this.distanceFromOrigin = distanceFromOrigin;
    }
    public String[][] getTimeTakenFromOrigin() {
        return timeTakenFromOrigin;
    }
    public void setTimeTakenFromOrigin(String[][] timeTakenFromOrigin) {
        this.timeTakenFromOrigin = timeTakenFromOrigin;
    }
    public Map[][] getLocationData() {
        return locationData;
    }
    public void setLocationData(Map[][] locationData) {
        this.locationData = locationData;
    }
    public String getCountryName() {
        return countryName;
    }
    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }
}