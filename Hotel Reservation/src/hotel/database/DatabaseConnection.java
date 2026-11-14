package hotel.database;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Loads DB connection details from config/db.properties (gitignored, holds
 * real credentials) rather than hardcoding them in this file. This file
 * itself is safe to commit — it contains no secrets, only the loading logic.
 */
public final class DatabaseConnection {

    private static final String CONFIG_FILE = "config/db.properties";
    private DatabaseConnection() {
    }

    public static Connection getConnection() throws SQLException {
        Properties dbProps = loadProperties();
        String url = "jdbc:mysql://" + required(dbProps, "db.host") + ":"
                + required(dbProps, "db.port") + "/" + required(dbProps, "db.name")
                + "?serverTimezone=Africa/Johannesburg"
                + "&useUnicode=true&characterEncoding=UTF-8";

        Properties connectionProperties = new Properties();
        connectionProperties.setProperty("user", required(dbProps, "db.user"));
        connectionProperties.setProperty("password", required(dbProps, "db.password"));

        String trustStore = dbProps.getProperty("db.truststore.path", "").trim();
            if (!trustStore.isEmpty()) {
             connectionProperties.setProperty("sslMode", "VERIFY_CA");
              connectionProperties.setProperty("trustCertificateKeyStoreUrl",
               resolvePath(trustStore).toUri().toString());
               connectionProperties.setProperty("trustCertificateKeyStorePassword",
            required(dbProps, "db.truststore.password"));
} else {
    connectionProperties.setProperty("sslMode", "REQUIRED");
}

        return DriverManager.getConnection(url, connectionProperties);
    }

    private static Properties loadProperties() {
        Path path = Paths.get(CONFIG_FILE);
        Properties properties = new Properties();
        if (!Files.isRegularFile(path)) {
            throw new IllegalStateException("Missing " + path.toAbsolutePath()
                    + ". Copy config/db.properties.example to config/db.properties and fill it in.");
        }
        try (InputStream input = Files.newInputStream(path)) {
            properties.load(input);
            return properties;
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to read " + path.toAbsolutePath(), ex);
        }
    }

    private static String required(Properties properties, String key) {
        String value = properties.getProperty(key, "").trim();
        if (value.isEmpty()) {
            throw new IllegalStateException("Missing required database setting: " + key);
        }
        return value;
    }

    private static Path resolvePath(String configuredPath) {
        Path path = Paths.get(configuredPath);
        return path.isAbsolute() ? path : Paths.get("config").resolve(path).normalize().toAbsolutePath();
    }

    public static void main(String[] args) {
        try (Connection conn = getConnection()) {
            System.out.println("Connected to MySQL successfully.");
        } catch (SQLException e) {
            System.err.println("Database connection failed: " + e.getMessage());
        }
    }
}
