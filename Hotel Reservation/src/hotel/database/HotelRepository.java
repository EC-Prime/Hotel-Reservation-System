package hotel.database;

import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.math.BigDecimal;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** Read-only queries shared by the Swing screens. Every call uses a short-lived
 * connection so changes made by another page are visible immediately. */
public final class HotelRepository {
    private HotelRepository() { }

    public static DashboardMetrics dashboardMetrics() throws SQLException {
        String sql = "SELECT "
                + "(SELECT COUNT(*) FROM rooms) total_rooms, "
                + "(SELECT COUNT(*) FROM rooms WHERE status = 'AVAILABLE') available_rooms, "
                + "(SELECT COUNT(*) FROM reservations WHERE check_in_date = CURRENT_DATE) today_reservations, "
                + "(SELECT COUNT(*) FROM reservations WHERE status = 'CHECKED_IN') checked_in, "
                + "(SELECT COUNT(*) FROM rooms WHERE status = 'OCCUPIED') occupied_rooms, "
                + "(SELECT COUNT(*) FROM rooms WHERE status = 'MAINTENANCE') maintenance_rooms";
        try (Connection c = DatabaseConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            rs.next();
            return new DashboardMetrics(rs.getInt(1), rs.getInt(2), rs.getInt(3), rs.getInt(4), rs.getInt(5), rs.getInt(6));
        }
    }

    public static List<ReservationRow> recentReservations(int limit) throws SQLException {
        String sql = "SELECT r.reservation_id, r.guest_name, rm.room_number, "
                + "r.check_in_date, r.check_out_date, r.status "
                + "FROM reservations r JOIN rooms rm ON rm.room_id = r.room_id "
                + "ORDER BY r.created_at DESC LIMIT ?";
        List<ReservationRow> rows = new ArrayList<>();
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, Math.max(1, Math.min(limit, 100)));
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    rows.add(new ReservationRow(rs.getInt("reservation_id"), rs.getString("guest_name"),
                            rs.getString("room_number"), rs.getDate("check_in_date").toLocalDate(),
                            rs.getDate("check_out_date").toLocalDate(), rs.getString("status")));
                }
            }
        }
        return rows;
    }

    public static List<ReservationRow> reservations() throws SQLException {
        String sql = "SELECT r.reservation_id, r.guest_name, rm.room_number, r.check_in_date, r.check_out_date, r.num_guests, r.total_price, r.status FROM reservations r JOIN rooms rm ON rm.room_id = r.room_id ORDER BY r.created_at DESC";
        List<ReservationRow> rows = new ArrayList<>();
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(new ReservationRow(rs.getInt("reservation_id"), rs.getString("guest_name"), rs.getString("room_number"), rs.getDate("check_in_date").toLocalDate(), rs.getDate("check_out_date").toLocalDate(), rs.getInt("num_guests"), rs.getBigDecimal("total_price"), rs.getString("status")));
        }
        return rows;
    }

    public static List<RoomOption> availableRooms() throws SQLException {
        List<RoomOption> rooms = new ArrayList<>();
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement("SELECT room_id, room_number, capacity, price_per_night FROM rooms WHERE status = 'AVAILABLE' ORDER BY room_number"); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rooms.add(new RoomOption(rs.getInt("room_id"), rs.getString("room_number"), rs.getInt("capacity"), rs.getBigDecimal("price_per_night")));
        }
        return rooms;
    }

    public static List<RoomRow> rooms() throws SQLException {
        List<RoomRow> rooms = new ArrayList<>();
        String sql = "SELECT room_id, room_number, floor_number, room_type, price_per_night, capacity, status, description FROM rooms ORDER BY room_number";
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rooms.add(new RoomRow(rs.getInt("room_id"), rs.getString("room_number"), rs.getInt("floor_number"), rs.getString("room_type"), rs.getBigDecimal("price_per_night"), rs.getInt("capacity"), rs.getString("status"), rs.getString("description")));
        }
        return rooms;
    }

    public static int createRoom(String number, int floor, String type, BigDecimal price, int capacity, String status, String description) throws SQLException {
        String sql = "INSERT INTO rooms (room_number, floor_number, room_type, price_per_night, capacity, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, number); ps.setInt(2, floor); ps.setString(3, type.toUpperCase()); ps.setBigDecimal(4, price); ps.setInt(5, capacity); ps.setString(6, status.toUpperCase()); ps.setString(7, description); ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) { if (keys.next()) return keys.getInt(1); }
        }
        throw new SQLException("Room was not created.");
    }

    public static void updateRoom(int id, String number, int floor, String type, BigDecimal price, int capacity, String status, String description) throws SQLException {
        String sql = "UPDATE rooms SET room_number=?, floor_number=?, room_type=?, price_per_night=?, capacity=?, status=?, description=? WHERE room_id=?";
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, number); ps.setInt(2, floor); ps.setString(3, type.toUpperCase()); ps.setBigDecimal(4, price); ps.setInt(5, capacity); ps.setString(6, status.toUpperCase()); ps.setString(7, description); ps.setInt(8, id); ps.executeUpdate();
        }
    }

    public static void updateReservationStatus(int reservationId, String status) throws SQLException {
        String sql = "UPDATE reservations SET status=? WHERE reservation_id=?";
        try (Connection c = DatabaseConnection.getConnection()) {
            c.setAutoCommit(false);
            try (PreparedStatement ps = c.prepareStatement(sql)) {
                ps.setString(1, status.toUpperCase()); ps.setInt(2, reservationId); ps.executeUpdate();
            }
            String roomSql = "UPDATE rooms rm JOIN reservations r ON r.room_id=rm.room_id SET rm.status=? WHERE r.reservation_id=?";
            try (PreparedStatement ps = c.prepareStatement(roomSql)) {
                ps.setString(1, "CHECKED_IN".equalsIgnoreCase(status) ? "OCCUPIED" : "AVAILABLE"); ps.setInt(2, reservationId); ps.executeUpdate();
            }
            c.commit();
        }
    }

    public static void recordPayment(int reservationId, String paymentReference) throws SQLException {
        String sql = "UPDATE reservations SET payment_reference=?, status=CASE WHEN status='PENDING' THEN 'CONFIRMED' ELSE status END WHERE reservation_id=?";
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, paymentReference); ps.setInt(2, reservationId); ps.executeUpdate();
        }
    }

    public static List<PaymentRow> payments() throws SQLException {
        List<PaymentRow> rows = new ArrayList<>();
        String sql = "SELECT reservation_id, guest_name, total_price, payment_reference, created_at, status FROM reservations WHERE payment_reference IS NOT NULL ORDER BY created_at DESC";
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(new PaymentRow(rs.getInt("reservation_id"), rs.getString("guest_name"), rs.getBigDecimal("total_price"), rs.getString("payment_reference"), rs.getTimestamp("created_at"), rs.getString("status")));
        }
        return rows;
    }

    public static int createReservation(int roomId, String guestName, String email, String phone, LocalDate checkIn, LocalDate checkOut, int guests, BigDecimal total) throws SQLException {
        try (Connection c = DatabaseConnection.getConnection(); CallableStatement cs = c.prepareCall("{call book_room(?,?,?,?,?,?,?,?,?,?,?,?)}")) {
            cs.setInt(1, roomId); cs.setString(2, guestName); cs.setString(3, email); cs.setString(4, phone); cs.setDate(5, java.sql.Date.valueOf(checkIn)); cs.setDate(6, java.sql.Date.valueOf(checkOut)); cs.setInt(7, guests); cs.setBigDecimal(8, total); cs.setNull(9, Types.VARCHAR); cs.setNull(10, Types.INTEGER); cs.registerOutParameter(11, Types.INTEGER); cs.registerOutParameter(12, Types.VARCHAR); cs.execute();
            int id = cs.getInt(11); String result = cs.getString(12); if (!"CONFIRMED".equalsIgnoreCase(result) || id <= 0) throw new SQLException("Booking failed: " + result); return id;
        }
    }

    public static List<UserRow> users() throws SQLException {
        String sql = "SELECT user_id, full_name, username, role, is_active, created_at FROM users ORDER BY full_name";
        List<UserRow> rows = new ArrayList<>();
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                rows.add(new UserRow(rs.getInt("user_id"), rs.getString("full_name"), rs.getString("username"),
                        rs.getString("role"), rs.getBoolean("is_active"), rs.getTimestamp("created_at")));
            }
        }
        return rows;
    }

    public static UserRow authenticate(String username, String password) throws SQLException {
        String sql = "SELECT user_id, full_name, username, role, is_active, created_at, password_hash FROM users WHERE username=? AND is_active=TRUE";
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, username);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return null;
                String hash = rs.getString("password_hash");
                if (hash == null || !org.mindrot.jbcrypt.BCrypt.checkpw(password, hash)) return null;
                return new UserRow(rs.getInt("user_id"), rs.getString("full_name"), rs.getString("username"), rs.getString("role"), rs.getBoolean("is_active"), rs.getTimestamp("created_at"));
            }
        }
    }

    public static final class DashboardMetrics {
        public final int totalRooms, availableRooms, todayReservations, checkedIn, occupiedRooms, maintenanceRooms;
        public DashboardMetrics(int totalRooms, int availableRooms, int todayReservations, int checkedIn, int occupiedRooms, int maintenanceRooms) {
            this.totalRooms = totalRooms; this.availableRooms = availableRooms;
            this.todayReservations = todayReservations; this.checkedIn = checkedIn;
            this.occupiedRooms = occupiedRooms; this.maintenanceRooms = maintenanceRooms;
        }
    }

    public static final class ReservationRow {
        public final int id; public final String guestName, roomNumber, status;
        public final LocalDate checkIn, checkOut;
        public final int guests;
        public final BigDecimal total;
        public ReservationRow(int id, String guestName, String roomNumber, LocalDate checkIn, LocalDate checkOut, String status) {
            this(id, guestName, roomNumber, checkIn, checkOut, 0, BigDecimal.ZERO, status);
        }
        public ReservationRow(int id, String guestName, String roomNumber, LocalDate checkIn, LocalDate checkOut, int guests, BigDecimal total, String status) {
            this.id = id; this.guestName = guestName; this.roomNumber = roomNumber;
            this.checkIn = checkIn; this.checkOut = checkOut; this.status = status;
            this.guests = guests; this.total = total == null ? BigDecimal.ZERO : total;
        }
    }

    public static final class RoomOption {
        public final int id, capacity; public final String number; public final BigDecimal price;
        public RoomOption(int id, String number, int capacity, BigDecimal price) { this.id = id; this.number = number; this.capacity = capacity; this.price = price; }
        @Override public String toString() { return number + " (capacity " + capacity + ", R" + price + ")"; }
    }

    public static final class RoomRow {
        public final int id, floor, capacity; public final String number, type, status, description; public final BigDecimal price;
        public RoomRow(int id, String number, int floor, String type, BigDecimal price, int capacity, String status, String description) { this.id = id; this.number = number; this.floor = floor; this.type = type; this.price = price; this.capacity = capacity; this.status = status; this.description = description; }
    }

    public static final class PaymentRow {
        public final int reservationId; public final String guestName, reference, status; public final BigDecimal amount; public final java.sql.Timestamp createdAt;
        public PaymentRow(int reservationId, String guestName, BigDecimal amount, String reference, java.sql.Timestamp createdAt, String status) { this.reservationId = reservationId; this.guestName = guestName; this.amount = amount; this.reference = reference; this.createdAt = createdAt; this.status = status; }
    }

    public static final class UserRow {
        public final int id; public final String fullName, username, role; public final boolean active;
        public final java.sql.Timestamp createdAt;
        public UserRow(int id, String fullName, String username, String role, boolean active, java.sql.Timestamp createdAt) {
            this.id = id; this.fullName = fullName; this.username = username; this.role = role;
            this.active = active; this.createdAt = createdAt;
        }
    }
}
