package hotel.reservation;

import hotel.database.HotelRepository;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.Insets;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.math.BigDecimal;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JSpinner;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.JOptionPane;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.SwingWorker;
import javax.swing.SpinnerNumberModel;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;

/** Shared hand-coded UI family for the alternate application build. */
public final class HardcodedUi {
    private static final Color NAVY = new Color(18, 32, 54);
    private static final Color DEEP = new Color(11, 22, 40);
    private static final Color PANEL = new Color(24, 42, 68);
    private static final Color GOLD = new Color(233, 196, 91);
    private static final Color WHITE = new Color(245, 247, 250);
    private static final Color MUTED = new Color(169, 181, 199);
    private static final Color LINE = new Color(50, 70, 98);

    private HardcodedUi() { }

    private static abstract class Shell extends JFrame {
        protected final JPanel body = new JPanel(new BorderLayout(0, 18));
        protected Shell(String title, String subtitle, String active) {
            setTitle("Royal Haven | " + title);
            setDefaultCloseOperation(DISPOSE_ON_CLOSE);
            setMinimumSize(new Dimension(1120, 720));
            setSize(1400, 860);
            setLocationRelativeTo(null);
            getContentPane().setBackground(NAVY);
            setLayout(new BorderLayout());
            add(sidebar(active), BorderLayout.WEST);
            body.setOpaque(false); body.setBorder(BorderFactory.createEmptyBorder(28, 32, 28, 32));
            body.add(header(title, subtitle), BorderLayout.NORTH);
            add(body, BorderLayout.CENTER);
        }

        private JPanel header(String title, String subtitle) {
            JPanel p = new JPanel(new BorderLayout(0, 4)); p.setOpaque(false);
            JLabel h = new JLabel(title); h.setForeground(WHITE); h.setFont(new Font("Georgia", Font.BOLD, 31));
            JLabel s = new JLabel(subtitle); s.setForeground(MUTED); s.setFont(new Font("SansSerif", Font.PLAIN, 14));
            p.add(h, BorderLayout.NORTH); p.add(s, BorderLayout.SOUTH); return p;
        }

        private JPanel sidebar(String active) {
            JPanel side = new JPanel(new BorderLayout()); side.setPreferredSize(new Dimension(270, 0)); side.setBackground(DEEP); side.setBorder(BorderFactory.createMatteBorder(0, 0, 0, 1, new Color(118, 94, 35)));
            JPanel brand = new JPanel(new BorderLayout(8, 4)); brand.setOpaque(false); brand.setBorder(BorderFactory.createEmptyBorder(26, 18, 24, 14));
            JLabel mark = new JLabel("✦", SwingConstants.CENTER); mark.setForeground(GOLD); mark.setFont(new Font("Georgia", Font.BOLD, 34)); mark.setPreferredSize(new Dimension(48, 48));
            JPanel words = new JPanel(new BorderLayout(0, 3)); words.setOpaque(false); JLabel name = new JLabel("ROYAL HAVEN"); name.setForeground(WHITE); name.setFont(new Font("Georgia", Font.BOLD, 20)); JLabel sub = new JLabel("BOUTIQUE & SPA"); sub.setForeground(GOLD); sub.setFont(new Font("SansSerif", Font.PLAIN, 10)); words.add(name, BorderLayout.CENTER); words.add(sub, BorderLayout.SOUTH); brand.add(mark, BorderLayout.WEST); brand.add(words, BorderLayout.CENTER); side.add(brand, BorderLayout.NORTH);
            JPanel nav = new JPanel(new GridLayout(0, 1, 0, 7)); nav.setOpaque(false); nav.setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));
            navButton(nav, "Dashboard", "Dashboard", active); navButton(nav, "Reservations", "Reservations", active); navButton(nav, "Room Management", "Rooms", active); navButton(nav, "Guests", "Guests", active); navButton(nav, "Check-in / Check-out", "CheckIn", active); navButton(nav, "Payments", "Payments", active); navButton(nav, "Reports", "Reports", active); navButton(nav, "Settings", "Settings", active);
            side.add(nav, BorderLayout.CENTER); JLabel foot = new JLabel("Luxury. Comfort. Excellence.", SwingConstants.CENTER); foot.setForeground(MUTED); foot.setBorder(BorderFactory.createEmptyBorder(10, 4, 20, 4)); side.add(foot, BorderLayout.SOUTH); return side;
        }

        private void navButton(JPanel nav, String label, String target, String active) {
            JButton b = new JButton(label); b.setHorizontalAlignment(SwingConstants.LEFT); b.setForeground(WHITE); b.setFont(new Font("SansSerif", Font.BOLD, 13)); b.setFocusPainted(false); b.setBorder(BorderFactory.createEmptyBorder(11, 14, 11, 10)); b.setOpaque(true); b.setBackground(label.equals(active) ? new Color(40, 67, 103) : DEEP); b.addActionListener(e -> navigate(target)); nav.add(b);
        }

        private void navigate(String target) {
            JFrame next = switch (target) { case "Dashboard" -> new Dashboard(); case "Reservations" -> new Reservations(); case "Rooms" -> new Rooms(); case "Guests" -> new Guests(); case "CheckIn" -> new CheckInOut(); case "Payments" -> new Payments(); case "Settings" -> new Settings(); default -> new Reports(); };
            setVisible(false); next.setLocationRelativeTo(this); next.addWindowListener(new java.awt.event.WindowAdapter() { @Override public void windowClosed(java.awt.event.WindowEvent e) { setVisible(true); toFront(); } }); next.setVisible(true);
        }
    }

    public static final class Dashboard extends Shell {
        private final JLabel total = valueLabel(), available = valueLabel(), today = valueLabel(), checked = valueLabel();
        private final DefaultTableModel model = model("Guest", "Room", "Check-in", "Check-out", "Status");
        public Dashboard() { super("Dashboard", "A calm view of what is happening at Royal Haven today.", "Dashboard"); JPanel content = new JPanel(new BorderLayout(0, 18)); content.setOpaque(false); JPanel cards = new JPanel(new GridLayout(1, 4, 14, 0)); cards.setOpaque(false); cards.add(card("Total rooms", total, "Inventory across the property")); cards.add(card("Available", available, "Ready for guests")); cards.add(card("Today’s reservations", today, "Arrivals scheduled today")); cards.add(card("Checked in", checked, "Guests currently staying")); content.add(cards, BorderLayout.NORTH); JTable table = table(model); JPanel recent = panel("Recent reservations", new JScrollPane(table)); content.add(recent, BorderLayout.CENTER); body.add(content, BorderLayout.CENTER); load(table); }
        private void load(JTable table) { new SwingWorker<HotelRepository.DashboardMetrics, Void>() { @Override protected HotelRepository.DashboardMetrics doInBackground() throws Exception { return HotelRepository.dashboardMetrics(); } @Override protected void done() { try { HotelRepository.DashboardMetrics m = get(); total.setText(String.valueOf(m.totalRooms)); available.setText(String.valueOf(m.availableRooms)); today.setText(String.valueOf(m.todayReservations)); checked.setText(String.valueOf(m.checkedIn)); } catch (Exception ignored) { } } }.execute(); new SwingWorker<List<HotelRepository.ReservationRow>, Void>() { @Override protected List<HotelRepository.ReservationRow> doInBackground() throws Exception { return HotelRepository.recentReservations(8); } @Override protected void done() { try { for (HotelRepository.ReservationRow r : get()) model.addRow(new Object[]{r.guestName, r.roomNumber, r.checkIn, r.checkOut, r.status}); compact(table); } catch (Exception ignored) { } } }.execute(); }
    }

    public static final class Reservations extends Shell {
        private final DefaultTableModel model = model("ID", "Guest", "Room", "Check-in", "Check-out", "Guests", "Total", "Status"); private final TableRowSorter<DefaultTableModel> sorter = new TableRowSorter<>(model); private final JTextField search = new JTextField(); private final JComboBox<String> status = new JComboBox<>(new String[]{"All statuses", "PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"});
        public Reservations() { super("Reservations", "Manage guest stays, availability, and booking status.", "Reservations"); JPanel content = new JPanel(new BorderLayout(0, 14)); content.setOpaque(false); JPanel filters = new JPanel(new BorderLayout(12, 0)); filters.setBackground(PANEL); filters.setBorder(BorderFactory.createEmptyBorder(14, 16, 14, 16)); search.setPreferredSize(new Dimension(310, 36)); filters.add(search, BorderLayout.WEST); filters.add(status, BorderLayout.CENTER); JButton refresh = HardcodedUi.actionButton("Refresh"); refresh.addActionListener(e -> load()); filters.add(refresh, BorderLayout.EAST); content.add(filters, BorderLayout.NORTH); JTable table = table(model); table.setRowSorter(sorter); content.add(panel("Reservation register", new JScrollPane(table)), BorderLayout.CENTER); body.add(content, BorderLayout.CENTER); search.addKeyListener(new KeyAdapter() { @Override public void keyReleased(KeyEvent e) { filter(); } }); status.addActionListener(e -> filter()); load(); }
        private void load() { new SwingWorker<List<HotelRepository.ReservationRow>, Void>() { @Override protected List<HotelRepository.ReservationRow> doInBackground() throws Exception { return HotelRepository.reservations(); } @Override protected void done() { try { model.setRowCount(0); for (HotelRepository.ReservationRow r : get()) model.addRow(new Object[]{r.id, r.guestName, r.roomNumber, r.checkIn, r.checkOut, r.guests, "R" + r.total, r.status}); filter(); } catch (Exception ignored) { } } }.execute(); }
        private void filter() { String q = search.getText().trim().toLowerCase(); String s = String.valueOf(status.getSelectedItem()); sorter.setRowFilter(RowFilter.regexFilter(q.isEmpty() ? ".*" : "(?i)" + java.util.regex.Pattern.quote(q))); if (!"All statuses".equals(s)) sorter.setRowFilter(RowFilter.andFilter(List.of(RowFilter.regexFilter("(?i)" + java.util.regex.Pattern.quote(q)), RowFilter.regexFilter("(?i)" + java.util.regex.Pattern.quote(s))))); }
    }

    public static final class Rooms extends Shell {
        public Rooms() { super("Room Management", "A clear view of inventory, availability, and room health.", "Room Management"); DefaultTableModel m = model("Room", "Type", "Floor", "Rate", "Status"); String[][] rows = {{"101", "Deluxe", "1", "R1,850", "Available"}, {"205", "Suite", "2", "R2,650", "Occupied"}, {"304", "Double", "3", "R1,450", "Available"}, {"402", "Suite", "4", "R3,100", "Maintenance"}}; for (String[] row : rows) m.addRow(row); JPanel content = new JPanel(new BorderLayout(0, 18)); content.setOpaque(false); JPanel cards = new JPanel(new GridLayout(1, 4, 14, 0)); cards.setOpaque(false); cards.add(card("Total rooms", valueLabel("20"), "Across all floors")); cards.add(card("Available", valueLabel("09"), "Ready for guests")); cards.add(card("Occupied", valueLabel("07"), "Currently staying")); cards.add(card("Maintenance", valueLabel("02"), "Needs attention")); content.add(cards, BorderLayout.NORTH); content.add(panel("Room inventory", new JScrollPane(table(m))), BorderLayout.CENTER); body.add(content, BorderLayout.CENTER); }
    }

    public static final class Payments extends Shell { public Payments() { super("Payments", "A focused view of revenue, pending balances, and recent activity.", "Payments"); JPanel content = new JPanel(new BorderLayout(0, 18)); content.setOpaque(false); JPanel cards = new JPanel(new GridLayout(1, 4, 14, 0)); cards.setOpaque(false); cards.add(card("This month", valueLabel("R184,500"), "+12.8% from last month")); cards.add(card("Pending", valueLabel("R23,400"), "Awaiting settlement")); cards.add(card("Completed", valueLabel("R161,100"), "87 successful payments")); cards.add(card("Refunds", valueLabel("R4,250"), "3 processed this month")); DefaultTableModel m = model("Reference", "Guest", "Method", "Amount", "Status"); m.addRow(new Object[]{"PAY-1048", "Sarah Johnson", "Card", "R4,200", "Completed"}); m.addRow(new Object[]{"PAY-1047", "Daniel Smith", "Transfer", "R2,900", "Pending"}); m.addRow(new Object[]{"PAY-1046", "Olivia Wilson", "Card", "R5,650", "Completed"}); content.add(cards, BorderLayout.NORTH); content.add(panel("Recent payments", new JScrollPane(table(m))), BorderLayout.CENTER); body.add(content, BorderLayout.CENTER); } }

    public static final class CheckInOut extends Shell { public CheckInOut() { super("Check-in / Check-out", "Keep arrivals, departures, and guest movement visible.", "Check-in / Check-out"); DefaultTableModel m = model("Reference", "Guest", "Room", "Check-in", "Check-out", "Status"); JPanel content = new JPanel(new BorderLayout(0, 14)); content.setOpaque(false); content.add(panel("Today’s movement", new JScrollPane(table(m))), BorderLayout.CENTER); body.add(content, BorderLayout.CENTER); new SwingWorker<List<HotelRepository.ReservationRow>, Void>() { @Override protected List<HotelRepository.ReservationRow> doInBackground() throws Exception { return HotelRepository.recentReservations(50); } @Override protected void done() { try { for (HotelRepository.ReservationRow r : get()) m.addRow(new Object[]{"RH-" + String.format("%04d", r.id), r.guestName, r.roomNumber, r.checkIn, r.checkOut, r.status}); } catch (Exception ignored) { } } }.execute(); } }

    public static final class Guests extends Shell { public Guests() { super("Guest Management", "Keep guest and staff information organized in one place.", "Guests"); DefaultTableModel m = model("ID", "Name", "Username", "Role", "Status", "Created"); JPanel content = new JPanel(new BorderLayout(0, 14)); content.setOpaque(false); content.add(panel("Guest and staff register", new JScrollPane(table(m))), BorderLayout.CENTER); body.add(content, BorderLayout.CENTER); new SwingWorker<List<HotelRepository.UserRow>, Void>() { @Override protected List<HotelRepository.UserRow> doInBackground() throws Exception { return HotelRepository.users(); } @Override protected void done() { try { for (HotelRepository.UserRow u : get()) m.addRow(new Object[]{u.id, u.fullName, u.username, u.role, u.active ? "Active" : "Inactive", u.createdAt}); } catch (Exception ignored) { } } }.execute(); } }

    public static final class Settings extends Shell { public Settings() { super("Settings", "Keep the hotel profile and operating preferences aligned.", "Settings"); JPanel content = new JPanel(new GridLayout(2, 2, 18, 18)); content.setOpaque(false); content.add(setting("Hotel identity", "Royal Haven Boutique & Spa", "The name shown across the front desk.")); content.add(setting("Location", "Cape Town, South Africa", "Used for local operating context.")); content.add(setting("Contact", "+27 21 555 0148", "Primary front-desk contact number.")); content.add(setting("Display", "Dark navy / gold", "The shared visual system for the hardcoded app.")); body.add(content, BorderLayout.CENTER); } private JPanel setting(String title, String value, String detail) { JPanel p = panel(title, new JLabel()); p.setLayout(new BorderLayout(0, 8)); JLabel v = new JLabel(value); v.setForeground(WHITE); v.setFont(new Font("SansSerif", Font.BOLD, 17)); JLabel d = new JLabel(detail); d.setForeground(MUTED); d.setFont(new Font("SansSerif", Font.PLAIN, 12)); p.add(v, BorderLayout.CENTER); p.add(d, BorderLayout.SOUTH); return p; } }

    public static final class Reports extends Shell { public Reports() { super("Reports", "A calm placeholder for future operational reporting.", "Reports"); JPanel p = new JPanel(new BorderLayout()); p.setOpaque(false); JLabel l = new JLabel("Reports are ready for the next design pass.", SwingConstants.CENTER); l.setForeground(MUTED); l.setFont(new Font("Georgia", Font.ITALIC, 22)); p.add(l, BorderLayout.CENTER); body.add(p, BorderLayout.CENTER); } }

    private static DefaultTableModel model(String... columns) { return new DefaultTableModel(columns, 0) { @Override public boolean isCellEditable(int r, int c) { return false; } }; }
    private static JTable table(DefaultTableModel model) { JTable t = new JTable(model); t.setRowHeight(36); t.setFillsViewportHeight(false); t.setBackground(NAVY); t.setForeground(WHITE); t.setGridColor(LINE); t.setSelectionBackground(new Color(46, 76, 115)); t.getTableHeader().setBackground(DEEP); t.getTableHeader().setForeground(GOLD); t.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 12)); t.getTableHeader().setPreferredSize(new Dimension(0, 36)); return t; }
    private static JPanel panel(String title, Component content) { JPanel p = new JPanel(new BorderLayout(0, 10)); p.setBackground(PANEL); p.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(LINE), BorderFactory.createEmptyBorder(16, 16, 16, 16))); JLabel h = new JLabel(title); h.setForeground(GOLD); h.setFont(new Font("Georgia", Font.BOLD, 18)); p.add(h, BorderLayout.NORTH); if (content instanceof JScrollPane scroll) { scroll.setBorder(BorderFactory.createEmptyBorder()); scroll.getViewport().setBackground(NAVY); } p.add(content, BorderLayout.CENTER); return p; }
    private static JPanel card(String title, JLabel value, String detail) { JPanel p = new JPanel(new BorderLayout(0, 6)); p.setBackground(DEEP); p.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(LINE), BorderFactory.createEmptyBorder(16, 16, 16, 16))); JLabel t = new JLabel(title); t.setForeground(MUTED); t.setFont(new Font("SansSerif", Font.BOLD, 12)); JLabel d = new JLabel(detail); d.setForeground(MUTED); d.setFont(new Font("SansSerif", Font.PLAIN, 11)); p.add(t, BorderLayout.NORTH); p.add(value, BorderLayout.CENTER); p.add(d, BorderLayout.SOUTH); return p; }
    private static JLabel valueLabel() { return valueLabel("0"); }
    private static JLabel valueLabel(String value) { JLabel l = new JLabel(value); l.setForeground(WHITE); l.setFont(new Font("Georgia", Font.BOLD, 28)); return l; }
    private static JButton actionButton(String text) { JButton b = new JButton(text); b.setBackground(GOLD); b.setForeground(DEEP); b.setFont(new Font("SansSerif", Font.BOLD, 12)); b.setFocusPainted(false); return b; }
    private static void compact(JTable table) { table.setPreferredScrollableViewportSize(new Dimension(800, Math.min(500, 36 + Math.max(1, table.getRowCount()) * table.getRowHeight()))); table.revalidate(); }
}
