package vttp.csfproject.repository;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;

import vttp.csfproject.dto.MapModel;

@Repository
public class mongodbRepo {
    @Autowired
    MongoTemplate mongoTemplate;

    public Document addTravelItinerary(MapModel mapModel, String email) {
        System.out.println("Adding... " + mapModel.toString());
        Document insert = new Document();
        insert.put("isDetailHidden", mapModel.getIsDetailHidden());
        insert.put("countryImg", mapModel.getCountryImg());
        insert.put("email", email);
        insert.put("countryName", mapModel.getCountryName());
        insert.put("dateTo", mapModel.getDateTo());
        insert.put("dateFrom", mapModel.getDateFrom());
        insert.put("markerPositions", mapModel.getMarkerPositions());
        insert.put("markerOptions", mapModel.getMarkerOptions());
        insert.put("distanceFromOrigin", mapModel.getDistanceFromOrigin());
        insert.put("timeTakenFromOrigin", mapModel.getTimeTakenFromOrigin());
        insert.put("locationData", mapModel.getLocationData());
        Document d = new Document();
        try{
            d= mongoTemplate.insert(insert, "mapsCollection");
        }catch (Exception e){
            System.out.println("error 1");
        }
        return d;
    }

    public UpdateResult updateTravelItinerary(MapModel mapModel, String email) {
        System.out.println("Updating...");
        Query q = Query.query(Criteria.where("email").is(email));
        System.out.println(q);
        Document insert = new Document();
        Document insertResult = new Document();
        insert.put("email", email);
        insert.put("countryName", mapModel.getCountryName());
        insert.put("dateTo", mapModel.getDateTo());
        insert.put("dateFrom", mapModel.getDateFrom());
        insert.put("markerPositions", mapModel.getMarkerPositions());
        insert.put("markerOptions", mapModel.getMarkerOptions());
        insert.put("distanceFromOrigin", mapModel.getDistanceFromOrigin());
        insert.put("timeTakenFromOrigin", mapModel.getTimeTakenFromOrigin());
        insert.put("locationData", mapModel.getLocationData());

        Update updateOps = new Update()
                .set("isDetailHidden", mapModel.getIsDetailHidden())
                .set("countryImg", mapModel.getCountryImg())
                .set("email", email)
                .set("countryName", mapModel.getCountryName())
                .set("dateTo", mapModel.getDateTo())
                .set("dateFrom", mapModel.getDateFrom())
                .set("markerPositions", mapModel.getMarkerPositions())
                .set("markerOptions", mapModel.getMarkerOptions())
                .set("distanceFromOrigin", mapModel.getDistanceFromOrigin())
                .set("timeTakenFromOrigin", mapModel.getTimeTakenFromOrigin())
                .set("locationData", mapModel.getLocationData());
        try{
            UpdateResult updateResult = mongoTemplate.updateFirst(q, updateOps, Document.class, "mapsCollection");
            return updateResult;
        }catch (Exception e){
            System.out.println("error 2");
        }
        return null;
    }

    public MapModel getTravelItinerary(String email, List<String> countries) {
        Criteria c = Criteria.where("email").is(email);
        Query q = new Query(c);
        List<MapModel> results = mongoTemplate.find(q, MapModel.class, "mapsCollection");
        MapModel mapModel = new MapModel();
        try {
            mapModel = results.get(0);
        } catch (Exception e) {
            System.out.println("User may not have saved before! MapModel is NULL!");
            mapModel.setCountryName("error");
        }
        return mapModel;
    }

    public MapModel getTravelItinerary(String email, List<String> countries, String country) {
        Criteria c = Criteria.where("email").is(email);
        Query q = new Query(c);
        Criteria c2 = Criteria.where("countryName").is(country);
        q.addCriteria(c2);
        List<MapModel> results = mongoTemplate.find(q, MapModel.class, "mapsCollection");
        MapModel mapModel = new MapModel();
        try {
            mapModel = results.get(0);
        } catch (Exception e) {
            System.out.println("User may not have saved before! MapModel is NULL!");
            mapModel.setCountryName("error");
        }
        return mapModel;
    }

    public List<String> getCountries(String email){
        Criteria c = Criteria.where("email").is(email);
        Query q = new Query(c);
        
        List<String> results = mongoTemplate.findDistinct(q, "countryName", "mapsCollection", String.class);
        for(String s : results){
            System.out.println(s);
        }
        return results;
    }

    public void deleteItinerary(String email, String country){
        Criteria c = Criteria.where("email").is(email);
        Query q = new Query(c);
        Criteria c2 = Criteria.where("countryName").is(country);
        q.addCriteria(c2);
        DeleteResult deleteResult = mongoTemplate.remove(q, String.class, "mapsCollection");
        System.out.println(deleteResult.getDeletedCount() + " records deleted");
    }

    public List<MapModel> getPassport(String email) {
        Criteria c = Criteria.where("email").is(email);
        Query q = new Query(c);
        return mongoTemplate.find(q, MapModel.class, "mapsCollection");
    }
}