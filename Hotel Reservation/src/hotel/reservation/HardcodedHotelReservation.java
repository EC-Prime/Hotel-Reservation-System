package hotel.reservation;

/** Alternate launcher for the fully hand-coded visual design. */
public final class HardcodedHotelReservation {
    private HardcodedHotelReservation() { }

    public static void main(String[] args) {
        javax.swing.SwingUtilities.invokeLater(() -> {
            HardcodedUi.Dashboard dashboard = new HardcodedUi.Dashboard();
            dashboard.setExtendedState(javax.swing.JFrame.MAXIMIZED_BOTH);
            dashboard.setVisible(true);
        });
    }
}
