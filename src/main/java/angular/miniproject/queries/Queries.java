package angular.miniproject.queries;

public class Queries {
    public static String SQL_SIGNUP = "insert into logindata (email, password) values (?, ?)";

    public static String SQL_CHECK_USERLOGIN = "select * from logindata where email = ?";
}