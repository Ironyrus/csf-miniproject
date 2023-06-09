package vttp.csfproject.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import vttp.csfproject.Queries;
import vttp.csfproject.dto.Credentials;

@Repository
public class sqlRepo {

    @Autowired
    JdbcTemplate template;

    public String signupUser(Credentials credentials) {
        template.update(Queries.SQL_SIGNUP, credentials.getEmail(), credentials.getPassword());
        return "Success";
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
