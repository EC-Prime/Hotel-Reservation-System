# Database certificates

Place the downloaded Aiven CA certificate here as `ca.pem`.

Do not commit the certificate or database credentials. The Java app reads
`config/db.properties` at runtime and verifies the server certificate when
`db.ssl.ca.path` is configured.
