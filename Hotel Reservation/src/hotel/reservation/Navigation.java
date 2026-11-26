package hotel.reservation;

import java.awt.Window;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import javax.swing.JFrame;
import javax.swing.JOptionPane;

/** Centralized screen navigation with consistent parent-window restoration. */
public final class Navigation {
    private Navigation() { }

    public static void open(JFrame current, JFrame next) {
        next.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        next.setLocationRelativeTo(current);
        if (current != null) {
            current.setVisible(false);
            next.addWindowListener(new WindowAdapter() {
                @Override public void windowClosed(WindowEvent event) {
                    current.setVisible(true);
                    current.toFront();
                }
            });
        }
        next.setVisible(true);
    }

    public static void dashboard(JFrame current) { open(current, new Dashboard()); }
    public static void rooms(JFrame current) { open(current, new RoomManagement()); }
    public static void reservations(JFrame current) { open(current, new ReservationsFrame()); }
    public static void payments(JFrame current) { open(current, new PaymentsDashboard()); }
    public static void checkin(JFrame current) { open(current, new CheckInOutFrame()); }
    public static void users(JFrame current) { open(current, new UserManagement()); }
    public static void settings(JFrame current) { open(current, new SettingsFrame()); }
    public static void reports(Window parent) {
        JOptionPane.showMessageDialog(parent, "Reports will be available in a future release.",
                "Reports", JOptionPane.INFORMATION_MESSAGE);
    }
}
