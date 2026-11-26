package hotel.reservation;

/** Alternate launcher for the fully hand-coded visual design. */
public final class HardcodedHotelReservation {
    private HardcodedHotelReservation() { }

    public static void main(String[] args) {
        javax.swing.SwingUtilities.invokeLater(() -> new HardcodedUi.Dashboard().setVisible(true));
    }
}
