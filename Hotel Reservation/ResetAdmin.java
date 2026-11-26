import hotel.database.DatabaseConnection;
import org.mindrot.jbcrypt.BCrypt;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ResetAdmin {
    public static void main(String[] args) throws Exception {
        String username = "admin";
        String password = "admin123";
        try (Connection connection = DatabaseConnection.getConnection()) {
            String hash = BCrypt.hashpw(password, BCrypt.gensalt(12));
            int updated;
            try (PreparedStatement statement = connection.prepareStatement("UPDATE users SET password_hash=?, is_active=TRUE WHERE username=?")) {
                statement.setString(1, hash);
                statement.setString(2, username);
                updated = statement.executeUpdate();
            }
            if (updated == 0) {
                try (PreparedStatement statement = connection.prepareStatement("INSERT INTO users (username, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, TRUE)")) {
                    statement.setString(1, username);
                    statement.setString(2, hash);
                    statement.setString(3, "System Administrator");
                    statement.setString(4, "ADMIN");
                    statement.executeUpdate();
                }
            }
            try (PreparedStatement statement = connection.prepareStatement("SELECT password_hash, is_active FROM users WHERE username=?")) {
                statement.setString(1, username);
                try (ResultSet result = statement.executeQuery()) {
                    if (!result.next() || !result.getBoolean("is_active") || !BCrypt.checkpw(password, result.getString("password_hash"))) {
                        throw new IllegalStateException("admin verification failed");
                    }
                }
            }
        }
        System.out.println("admin account updated and BCrypt verification passed");
    }
}
