package angular.miniproject.services;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mongodb.client.result.UpdateResult;

import angular.miniproject.models.MapModel;
import angular.miniproject.repositories.mongodbRepo;

@Service
public class mongoService {
    @Autowired
    mongodbRepo mongoRepo;

    public Document addTravelItinerary(MapModel mapModel, String email) {
        return mongoRepo.addTravelItinerary(mapModel, email);
    }

    public UpdateResult updateTravelItinerary(MapModel mapModel, String email) {
        return mongoRepo.updateTravelItinerary(mapModel, email);
    }

    public MapModel getTravelItinerary(String email, List<String> countries) {
        return mongoRepo.getTravelItinerary(email, countries);
    }

    public MapModel getTravelItinerary(String email, List<String> countries, String country) {
        return mongoRepo.getTravelItinerary(email, countries, country);
    }

    public List<String> getCountries(String email) {
        return mongoRepo.getCountries(email);
    }

    public List<String> getCountries(String email, String country) {
        return mongoRepo.getCountries(email);
    }
}