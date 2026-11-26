package hotel.database;

import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.math.BigDecimal;
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

    public static final class UserRow {
        public final int id; public final String fullName, username, role; public final boolean active;
        public final java.sql.Timestamp createdAt;
        public UserRow(int id, String fullName, String username, String role, boolean active, java.sql.Timestamp createdAt) {
            this.id = id; this.fullName = fullName; this.username = username; this.role = role;
            this.active = active; this.createdAt = createdAt;
        }
    }
}
