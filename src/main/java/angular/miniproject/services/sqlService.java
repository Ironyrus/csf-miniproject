package angular.miniproject.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
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
        } catch (DataAccessException e) {
            System.out.println("Error with signing up!");
            System.out.println(">>>>>>>");

            System.out.println(e.getLocalizedMessage());            
            System.out.println(">>>>>>>");

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