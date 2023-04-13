package angular.miniproject.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import angular.miniproject.models.Credentials;
import angular.miniproject.repositories.sqlRepo;

@Service
public class sqlService {
    
    @Autowired
    sqlRepo sqlRepo;

    public String signupUser(Credentials credentials) {
        String result = "";
        try {
            result = sqlRepo.signupUser(credentials);
        } catch (Exception e) {
            System.out.println("Error with signing up!");
            if(e.getMessage().contains("Duplicate entry"))
                System.out.println("Duplicate Email entered");
            result = "Duplicate Email Entered";
        }
        return result;
    }

    public String checkUserLogin(Credentials credentials) {
        Credentials loginData = sqlRepo.checkUserLogin(credentials);
        if(!credentials.getPassword().equals(loginData.getPassword())) {
            return "error";
        } else {
            return "success";
        }
    }
}