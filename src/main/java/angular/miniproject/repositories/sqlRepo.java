package angular.miniproject.repositories;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import angular.miniproject.models.Credentials;
import angular.miniproject.queries.Queries;

@Repository
public class sqlRepo {

    @Autowired
    JdbcTemplate template;

    public int signupUser(Credentials credentials) {
        return template.update(Queries.SQL_SIGNUP, credentials.getEmail(), credentials.getPassword());
    }

    public Credentials checkUserLogin(Credentials credentials) {

        Credentials loginData = new Credentials("email", "password");
        final SqlRowSet query = template.queryForRowSet(Queries.SQL_CHECK_USERLOGIN, credentials.getEmail());
        while(query.next()) {
            loginData.setEmail(query.getString("email"));
            loginData.setPassword(query.getString("password"));
        }
        return loginData;
    }
    
}
