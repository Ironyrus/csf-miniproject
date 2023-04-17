package angular.miniproject.controllers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
import angular.miniproject.services.redisService;
import angular.miniproject.services.sqlService;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;

@RestController
public class backendController {
    
    @Autowired
    sqlService sqlService;

    @Autowired
    mongoService mongoService;

    @Autowired
    redisService redisService;

    @PostMapping(path="/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins="*")
    public ResponseEntity<String> login(@RequestBody Credentials credentials) {
        
        String result = sqlService.checkUserLogin(credentials);
        String token = UUID.randomUUID().toString();
        Date expiry = new Date();
        JsonObjectBuilder jBuilder = Json.createObjectBuilder()
            .add("mode", "login")
            .add("result", result)
            .add("username_returned", credentials.getEmail())
            .add("password_returned", credentials.getPassword())
            .add("token", token)
            .add("expiresIn", expiry.getTime() +  3600000 + "");
        JsonObject jOut = jBuilder.build();
        int redisResult = redisService.saveToken(token, credentials.getEmail(), new Date(expiry.getTime() +  3600000));
        System.out.println("(Log in) Saving to redis... (1 for success, 0 for failed): " + redisResult);
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
        String token = UUID.randomUUID().toString();
        Date expiry = new Date();
        JsonObjectBuilder jBuilder = Json.createObjectBuilder()
            .add("mode", "signup")
            .add("result", result) //Success or Duplicate Email Entered
            .add("username_returned", credentials.getEmail())
            .add("password_returned", credentials.getPassword())
            .add("token", token)
            .add("expiresIn", expiry.getTime() + 3600000 + "");
        JsonObject jOut = jBuilder.build();
        int redisResult = redisService.saveToken(token, credentials.getEmail(), new Date(expiry.getTime() +  3600000));
        System.out.println("(Sign up) Saving token to redis... (1 for success, 0 for failed): " + redisResult);
        if(result.equals("Success"))
            return ResponseEntity.status(HttpStatus.OK).body(jOut.toString());
        else
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(jOut.toString());
    }

    @PostMapping(path = "/addMapModel", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins="*")
    public ResponseEntity<String> addMapModel(@RequestBody MapModel mapModel, @RequestParam String email, @RequestParam String country) {
        List<String> countries = countries = mongoService.getCountries(email);
        boolean check = false;
        for(String s : countries){
            if(s.equals(mapModel.getCountryName()))
                check = true;
        }


        MapModel mapModelCheck = mongoService.getTravelItinerary(email, countries);
        if(mapModelCheck.getCountryName().equals("error")){
            Document d = mongoService.addTravelItinerary(mapModel, email);
            System.out.println("New map inserted!");
        } else if(!check) {
            Document d = mongoService.addTravelItinerary(mapModel, email);
            System.out.println("New map inserted for same email!");
        } else {
            UpdateResult result = mongoService.updateTravelItinerary(mapModel, email);
            System.out.println("Map was updated!");
        }
        // TO DO - return success or failure
        return null;
    }

    @GetMapping(path="/getMapModel/{email}", produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins="*")
    public ResponseEntity<String> getMapModel(@RequestParam String auth, @PathVariable String email)  {
        MapModel mapModel;
        String token = redisService.getToken(email);
        if(token.trim().equals(auth.trim())){
            List<String> countries = countries = mongoService.getCountries(email);
            mapModel = mongoService.getTravelItinerary(email, countries);
            System.out.println("Authentication passed. Fetching data...");
        } else{
            System.out.println("Authentication FAILED.");
            JsonObject errorJson = Json.createObjectBuilder().add("ERROR", "INVALID TOKEN").build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorJson.toString());
        }

        String isDetailHidden = "";
        String countryImg = "";
        String countryName = "";
        String dateTo = "";
        String dateFrom = "";
        String getMarkerPositions = "";
        String getMarkerOptions = "";
        String getDistanceFromOrigin = "";
        String getTimeTakenFromOrigin = "";
        String locationData = "";

        try {
            isDetailHidden = locationData = (new ObjectMapper().writeValueAsString(mapModel.getIsDetailHidden())).replaceAll("", "");
            countryImg = (new ObjectMapper().writeValueAsString(mapModel.getCountryImg())).replaceAll("", "");
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

        JsonObject jOut = Json.createObjectBuilder()
                    .add("isDetailHidden", isDetailHidden)
                    .add("countryImg", countryImg)
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

    @GetMapping(path="/getMapModel2/{email}/{country}", produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins="*")
    public ResponseEntity<String> getMapModelByCountryName(@RequestParam String auth, @PathVariable String email, @PathVariable String country)  {
        MapModel mapModel;
        String token = redisService.getToken(email);
        if(token.trim().equals(auth.trim())){
            List<String> countries = countries = mongoService.getCountries(email);
            mapModel = mongoService.getTravelItinerary(email, countries, country);
            System.out.println("Authentication passed. Fetching data with country name...");
        } else{
            System.out.println("Authentication FAILED.");
            JsonObject errorJson = Json.createObjectBuilder().add("ERROR", "INVALID TOKEN").build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorJson.toString());
        }

        String isDetailHidden = "";
        String countryImg = "";
        String countryName = "";
        String dateTo = "";
        String dateFrom = "";
        String getMarkerPositions = "";
        String getMarkerOptions = "";
        String getDistanceFromOrigin = "";
        String getTimeTakenFromOrigin = "";
        String locationData = "";

        try {
            isDetailHidden = locationData = (new ObjectMapper().writeValueAsString(mapModel.getIsDetailHidden())).replaceAll("", "");
            countryImg = (new ObjectMapper().writeValueAsString(mapModel.getCountryImg())).replaceAll("", "");
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

        JsonObject jOut = Json.createObjectBuilder()
                    .add("isDetailHidden", isDetailHidden)
                    .add("countryImg", countryImg)
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

    @GetMapping(path="/getCountries/{email}", produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins="*")
    public ResponseEntity<String> getCountries(@RequestParam String auth, @PathVariable String email)  {
        String token = redisService.getToken(email);
        List<String> countries = new ArrayList<>();
        if(token.trim().equals(auth.trim())){
            countries = mongoService.getCountries(email);
            System.out.println("Authentication passed. Fetching data...");
        }
        else{
            System.out.println("Authentication FAILED.");
            JsonObject errorJson = Json.createObjectBuilder().add("ERROR", "INVALID TOKEN").build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorJson.toString());
        }
        JsonArrayBuilder jArrBuilder = Json.createArrayBuilder();
        for(String s: countries){
            jArrBuilder.add(s);
        }
        JsonArray jArr = jArrBuilder.build();
        JsonObject jOut = Json.createObjectBuilder()
        .add("result", jArr)
        .build();
        return ResponseEntity.status(HttpStatus.OK).body(jOut.toString());

    }
}