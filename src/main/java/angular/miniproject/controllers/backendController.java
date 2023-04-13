package angular.miniproject.controllers;

import java.util.Date;
import java.util.UUID;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import angular.miniproject.models.Credentials;
import angular.miniproject.models.MapModel;
import angular.miniproject.services.mongoService;
import angular.miniproject.services.sqlService;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;

@RestController
public class backendController {
    
    String token;

    @Autowired
    sqlService sqlService;

    @Autowired
    mongoService mongoService;

    @PostMapping(path="/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins="*")
    public ResponseEntity<String> login(@RequestBody Credentials credentials) {
        
        String result = sqlService.checkUserLogin(credentials);
        String token = UUID.randomUUID().toString();
        this.token = token;
        JsonObjectBuilder jBuilder = Json.createObjectBuilder()
            .add("mode", "login")
            .add("result", result)
            .add("username_returned", credentials.getEmail())
            .add("password_returned", credentials.getPassword())
            .add("token", token)
            .add("expiresIn", new Date().getTime() + 3600000 + "");
        JsonObject jOut = jBuilder.build();

        if(result.equals("success")){
            return ResponseEntity.status(HttpStatus.OK).body(jOut.toString());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(jOut.toString());
        }

    }

    @PostMapping(path="/signup", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins="*")
    public ResponseEntity<String> signup(@RequestBody Credentials credentials) {

        String result = sqlService.signupUser(credentials);
        
        JsonObjectBuilder jBuilder = Json.createObjectBuilder()
            .add("mode", "signup")
            .add("result", result) //Success or Duplicate Email Entered
            .add("username_returned", credentials.getEmail())
            .add("password_returned", credentials.getPassword());
        JsonObject jOut = jBuilder.build();
        if(result.equals("Success"))
            return ResponseEntity.status(HttpStatus.OK).body(jOut.toString());
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(jOut.toString());
    }

    @PostMapping(path = "/addMapModel", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins="*")
    public ResponseEntity<String> addMapModel(@RequestBody MapModel mapModel, @RequestParam String email) {

        MapModel mapModelCheck = mongoService.getTravelItinerary(email);
        if(mapModelCheck.getCountryName() != null){
            UpdateResult result = mongoService.updateTravelItinerary(mapModel, email);
            System.out.println("Map was updated!");
        } else {
            Document d = mongoService.addTravelItinerary(mapModel, email);
            System.out.println("New map inserted!");
        }
        
        return null;
    }

    @GetMapping(path="/getMapModel/{email}", produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins="*")
    public ResponseEntity<String> getMapModel(@RequestParam String auth, @PathVariable String email) {
        
        MapModel mapModel;
        if(this.token.trim().equals(auth.trim())){
            mapModel = mongoService.getTravelItinerary(email);
            System.out.println("Authentication passed. Fetching data...");
        }
        else{
            JsonObject errorJson = Json.createObjectBuilder().add("ERROR", "INVALID TOKEN").build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorJson.toString());
        }

        String countryName = "";
        String dateTo = "";
        String dateFrom = "";
        String getMarkerPositions = "";
        String getMarkerOptions = "";
        String getDistanceFromOrigin = "";
        String getTimeTakenFromOrigin = "";
        String locationData = "";

        try {
            countryName = (new ObjectMapper().writeValueAsString(mapModel.getCountryName())).replaceAll("", "");
            dateTo = (new ObjectMapper().writeValueAsString(mapModel.getDateTo())).replaceAll("", "");
            dateFrom = (new ObjectMapper().writeValueAsString(mapModel.getDateFrom())).replaceAll("", "");
            getMarkerPositions = (new ObjectMapper().writeValueAsString(mapModel.getMarkerPositions())).replaceAll("", "");
            getMarkerOptions = (new ObjectMapper().writeValueAsString(mapModel.getMarkerOptions())).replaceAll("", "");
            getDistanceFromOrigin = (new ObjectMapper().writeValueAsString(mapModel.getDistanceFromOrigin())).replaceAll("", "");
            getTimeTakenFromOrigin = (new ObjectMapper().writeValueAsString(mapModel.getTimeTakenFromOrigin())).replaceAll("", "");
            locationData = (new ObjectMapper().writeValueAsString(mapModel.getLocationData())).replaceAll("", "");
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        System.out.println(countryName);

        JsonObject jOut = Json.createObjectBuilder()
                    .add("countryName", countryName)
                    .add("dateTo", dateTo)
                    .add("dateFrom", dateFrom)
                    .add("markerPositions", getMarkerPositions)
                    .add("markerOptions", getMarkerOptions)
                    .add("distanceFromOrigin", getDistanceFromOrigin)
                    .add("timeTakenFromOrigin", getTimeTakenFromOrigin)
                    .add("locationData", locationData)
                    .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(jOut.toString());
    }
}