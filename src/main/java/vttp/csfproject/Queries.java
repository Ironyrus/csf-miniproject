package vttp.csfproject;

public class Queries {
    public static String SQL_SIGNUP = "insert into loginData (email, password) values (?, ?)";

    public static String SQL_CHECK_USERLOGIN = "select * from loginData where email = ?";
}
