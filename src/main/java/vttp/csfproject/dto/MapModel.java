package vttp.csfproject.dto;

import java.util.Arrays;
import java.util.Date;
import java.util.Map;

public class MapModel {
    private boolean[][] isDetailHidden;
    private String countryImg;
    private String countryName;
    private String dateTo;
    private String dateFrom;
    private Map[][] markerPositions;
    private Map[][] markerOptions;
    private String[][] distanceFromOrigin;
    private String[][] timeTakenFromOrigin;
    private Map[][] locationData;

    public boolean[][] getIsDetailHidden() {
        return isDetailHidden;
    }
    public void setIsDetailHidden(boolean[][] isDetailHidden) {
        this.isDetailHidden = isDetailHidden;
    }

    public String getCountryImg() {
        return countryImg;
    }
    public void setCountryImg(String countryImg) {
        this.countryImg = countryImg;
    }

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

    @Override
    public String toString() {
        return "MapModel [isDetailHidden=" + Arrays.toString(isDetailHidden) + ", countryImg=" + countryImg
                + ", countryName=" + countryName + ", dateTo=" + dateTo + ", dateFrom=" + dateFrom
                + ", markerPositions=" + Arrays.toString(markerPositions) + ", markerOptions="
                + Arrays.toString(markerOptions) + ", distanceFromOrigin=" + Arrays.toString(distanceFromOrigin)
                + ", timeTakenFromOrigin=" + Arrays.toString(timeTakenFromOrigin) + ", locationData="
                + Arrays.toString(locationData) + "]";
    }
    
}