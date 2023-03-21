package angular.miniproject.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mongodb.client.result.UpdateResult;

import angular.miniproject.models.MapModel;
import angular.miniproject.repositories.mongodbRepo;

@Service
public class mongoService {
    @Autowired
    mongodbRepo mongoRepo;

    public UpdateResult addTravelItinerary(MapModel mapModel, String id) {
        return mongoRepo.addTravelItinerary(mapModel, id);
    }

    public MapModel getTravelItinerary(String id) {
        return mongoRepo.getTravelItinerary(id);
    }
}
