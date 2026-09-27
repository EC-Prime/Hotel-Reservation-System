package config;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Loads DB connection details from config/db.properties (gitignored, holds
 * real credentials) rather than hardcoding them in this file. This file
 * itself is safe to commit — it contains no secrets, only the loading logic.
 */
public class DatabaseConnection {

    private static Properties dbProps;

    static {
        dbProps = new Properties();
        try (FileInputStream input = new FileInputStream("config/db.properties")) {
            dbProps.load(input);
        } catch (IOException e) {
            System.out.println("❌ Could not find config/db.properties — " +
                "copy config/db.properties.example and fill in real values.");
        }
    }

    public static Connection getConnection() throws SQLException {
        String host = dbProps.getProperty("db.host");
        String port = dbProps.getProperty("db.port");
        String database = dbProps.getProperty("db.name");
        String user = dbProps.getProperty("db.user");
        String password = dbProps.getProperty("db.password");
        String truststorePath = dbProps.getProperty("db.truststore.path");
        String truststorePassword = dbProps.getProperty("db.truststore.password");

        String url = "jdbc:mysql://" + host + ":" + port + "/" + database
                + "?useSSL=true"
                + "&requireSSL=true"
                + "&trustCertificateKeyStoreUrl=file:" + truststorePath
                + "&trustCertificateKeyStorePassword=" + truststorePassword;

        Properties connProps = new Properties();
        connProps.setProperty("user", user);
        connProps.setProperty("password", password);

        return DriverManager.getConnection(url, connProps);
    }

    public static void main(String[] args) {
        try (Connection conn = getConnection()) {
            System.out.println("✅ Connected to Aiven MySQL successfully");
        } catch (SQLException e) {
            System.out.println("❌ Could not connect to the database: " + e.getMessage());
        }
    }
}