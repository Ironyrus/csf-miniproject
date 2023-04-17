package angular.miniproject.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import angular.miniproject.repositories.redisRepo;

@Service
public class redisService {
    @Autowired
    redisRepo redisRepo;

    public int saveToken(String token, String email, Date expiry){
        return redisRepo.saveToken(token, email, expiry);
    }

    public String getToken(String email){
        return redisRepo.getToken(email);
    }
}
