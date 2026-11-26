<<<<<<< HEAD
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.database;

/**
 *
 * @author DCS Admin
 */
public class HotelRepository {
    
=======
package hotel.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
        public ReservationRow(int id, String guestName, String roomNumber, LocalDate checkIn, LocalDate checkOut, String status) {
            this.id = id; this.guestName = guestName; this.roomNumber = roomNumber;
            this.checkIn = checkIn; this.checkOut = checkOut; this.status = status;
        }
    }

    public static final class UserRow {
        public final int id; public final String fullName, username, role; public final boolean active;
        public final java.sql.Timestamp createdAt;
        public UserRow(int id, String fullName, String username, String role, boolean active, java.sql.Timestamp createdAt) {
            this.id = id; this.fullName = fullName; this.username = username; this.role = role;
            this.active = active; this.createdAt = createdAt;
        }
    }
>>>>>>> 963993141256b94c74f1f8ec88b331a504105113
}
