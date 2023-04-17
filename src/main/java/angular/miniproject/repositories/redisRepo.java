package angular.miniproject.repositories;

import java.util.Date;
import java.util.concurrent.TimeUnit;

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
            redisTemplate.opsForValue().set(email, token);
            String fetchToken = (String)redisTemplate.opsForValue().get(email);
            
            Boolean expirySet = redisTemplate.expireAt(email, expiry);
            if(fetchToken != null)
                return 1;
            else
                return 0;
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        
        return 0;
    }

    public String getToken(String email){
        return (String)redisTemplate.opsForValue().get(email);
    }
}
