package angular.miniproject.repositories;

import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.mongodb.client.result.UpdateResult;

import angular.miniproject.models.MapModel;

@Repository
public class mongodbRepo {
    @Autowired
    MongoTemplate mongoTemplate;

    public UpdateResult addTravelItinerary(MapModel mapModel, String id) {
        
        Query q = Query.query(Criteria.where("_id").is(id));

        Document insert = new Document();
        Document insertResult = new Document();
        insert.put("countryName", mapModel.getCountryName());
        insert.put("dateTo", mapModel.getDateTo());
        insert.put("dateFrom", mapModel.getDateFrom());
        insert.put("markerPositions", mapModel.getMarkerPositions());
        insert.put("markerOptions", mapModel.getMarkerOptions());
        insert.put("distanceFromOrigin", mapModel.getDistanceFromOrigin());
        insert.put("timeTakenFromOrigin", mapModel.getTimeTakenFromOrigin());
        insert.put("locationData", mapModel.getLocationData());

        Update updateOps = new Update()
                .set("countryName", mapModel.getCountryName())
                .set("dateTo", mapModel.getDateTo())
                .set("dateFrom", mapModel.getDateFrom())
                .set("markerPositions", mapModel.getMarkerPositions())
                .set("markerOptions", mapModel.getMarkerOptions())
                .set("distanceFromOrigin", mapModel.getDistanceFromOrigin())
                .set("timeTakenFromOrigin", mapModel.getTimeTakenFromOrigin())
                .set("locationData", mapModel.getLocationData());
        UpdateResult updateResult = mongoTemplate.updateFirst(q, updateOps, Document.class, "mapsCollection");
        System.out.println(updateResult);

        return updateResult;
    }

    public MapModel getTravelItinerary(String id) {
        Criteria c = Criteria.where("_id").is(id);
        Query q = new Query(c);
        List<MapModel> results = mongoTemplate.find(q, MapModel.class, "mapsCollection");
        MapModel mapModel = results.get(0);
        return mapModel;
    }
}
