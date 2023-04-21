package vttp.csfproject.repository;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class redisRepo {
    
    @Autowired
    RedisTemplate redisTemplate;

    public int saveToken(String token, String email, Date expiry){
        System.out.println("key: " + email);
        System.out.println("value: " + token);
        try {
            String fetchToken = (String)redisTemplate.opsForValue().get(email);

            if(fetchToken != null)
                return 1;
            else {
                redisTemplate.opsForValue().set(email, token);            
                Boolean expirySet = redisTemplate.expireAt(email, expiry);
                return 2;
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        
        return 0;
    }

    public String getToken(String email){
        return (String)redisTemplate.opsForValue().get(email);
    }
}
