package hotel.reservation;

import hotel.database.HotelRepository;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;

/** Database-backed reservation list and booking page. */
public class reservation extends JFrame {
    private final DefaultTableModel model = new DefaultTableModel(new String[]{"ID", "Guest", "Room", "Check-in", "Check-out", "Guests", "Total", "Status"}, 0) { @Override public boolean isCellEditable(int r, int c) { return false; } };
    private final JTable table = new JTable(model); private final TableRowSorter<DefaultTableModel> sorter = new TableRowSorter<>(model);
    private final JTextField search = new JTextField(); private final JComboBox<String> status = new JComboBox<>(new String[]{"All statuses", "PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"}); private final JLabel count = new JLabel("Loading...");

    public reservation() {
        setTitle("Royal Haven | Reservations"); setDefaultCloseOperation(DISPOSE_ON_CLOSE); setMinimumSize(new Dimension(1050, 650)); setSize(1250, 760); setLocationRelativeTo(null); getContentPane().setBackground(new Color(18, 32, 54)); setLayout(new BorderLayout(0, 14)); add(header(), BorderLayout.NORTH); add(tablePanel(), BorderLayout.CENTER); loadReservations();
    }
    private JPanel header() {
        JPanel p = new JPanel(new BorderLayout(12, 10)); p.setOpaque(false); p.setBorder(BorderFactory.createEmptyBorder(20, 24, 0, 24)); JLabel title = new JLabel("Reservations"); title.setForeground(Color.WHITE); title.setFont(new Font("Georgia", Font.BOLD, 30)); p.add(title, BorderLayout.WEST);
        JPanel controls = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0)); controls.setOpaque(false); search.setPreferredSize(new Dimension(240, 34)); controls.add(search); controls.add(status); JButton refresh = new JButton("Refresh"); refresh.addActionListener(e -> loadReservations()); controls.add(refresh); JButton add = new JButton("+ New reservation"); add.addActionListener(e -> showCreateDialog()); controls.add(add); p.add(controls, BorderLayout.EAST);
        KeyAdapter filter = new KeyAdapter() { @Override public void keyReleased(KeyEvent e) { applyFilters(); } }; search.addKeyListener(filter); status.addActionListener(e -> applyFilters()); return p;
    }
    private JPanel tablePanel() { JPanel p = new JPanel(new BorderLayout(0, 8)); p.setBackground(new Color(24, 42, 68)); p.setBorder(BorderFactory.createEmptyBorder(12, 24, 20, 24)); table.setRowSorter(sorter); UiTheme.compactTable(table); table.setRowHeight(34); p.add(new JScrollPane(table), BorderLayout.CENTER); count.setForeground(new Color(180, 190, 205)); p.add(count, BorderLayout.SOUTH); return p; }
    private void loadReservations() { new SwingWorker<List<HotelRepository.ReservationRow>, Void>() { @Override protected List<HotelRepository.ReservationRow> doInBackground() throws Exception { return HotelRepository.reservations(); } @Override protected void done() { try { model.setRowCount(0); for (HotelRepository.ReservationRow r : get()) model.addRow(new Object[]{r.id, r.guestName, r.roomNumber, r.checkIn, r.checkOut, r.guests, "R" + r.total, r.status}); count.setText(model.getRowCount() + " reservations"); applyFilters(); } catch (Exception ex) { count.setText("Unable to load reservations: " + ex.getMessage()); } } }.execute(); }
    private void applyFilters() { String q = search.getText().trim().toLowerCase(); String s = String.valueOf(status.getSelectedItem()); sorter.setRowFilter(new RowFilter<DefaultTableModel, Integer>() { @Override public boolean include(Entry<? extends DefaultTableModel, ? extends Integer> e) { boolean text = q.isEmpty() || e.getStringValue(0).contains(q) || e.getStringValue(1).toLowerCase().contains(q) || e.getStringValue(2).toLowerCase().contains(q); return text && ("All statuses".equals(s) || e.getStringValue(7).equals(s)); } }); }
    private void showCreateDialog() {
        JTextField name = new JTextField(), email = new JTextField(), phone = new JTextField(); JComboBox<HotelRepository.RoomOption> room = new JComboBox<>(); JTextField in = new JTextField(LocalDate.now().toString()), out = new JTextField(LocalDate.now().plusDays(1).toString()); JSpinner guests = new JSpinner(new SpinnerNumberModel(1, 1, 20, 1));
        try { for (HotelRepository.RoomOption r : HotelRepository.availableRooms()) room.addItem(r); } catch (Exception ex) { JOptionPane.showMessageDialog(this, ex.getMessage(), "Database error", JOptionPane.ERROR_MESSAGE); return; }
        JPanel form = new JPanel(new GridLayout(0, 2, 8, 8)); form.add(new JLabel("Guest name *")); form.add(name); form.add(new JLabel("Email *")); form.add(email); form.add(new JLabel("Phone")); form.add(phone); form.add(new JLabel("Room *")); form.add(room); form.add(new JLabel("Check-in (YYYY-MM-DD) *")); form.add(in); form.add(new JLabel("Check-out (YYYY-MM-DD) *")); form.add(out); form.add(new JLabel("Guests *")); form.add(guests);
        if (JOptionPane.showConfirmDialog(this, form, "Create reservation", JOptionPane.OK_CANCEL_OPTION) != JOptionPane.OK_OPTION) return;
        try { if (name.getText().trim().isEmpty() || email.getText().trim().isEmpty() || room.getSelectedItem() == null) throw new IllegalArgumentException("Complete all required fields."); LocalDate ci = LocalDate.parse(in.getText().trim()), co = LocalDate.parse(out.getText().trim()); if (!co.isAfter(ci)) throw new IllegalArgumentException("Check-out must be after check-in."); HotelRepository.RoomOption selected = (HotelRepository.RoomOption) room.getSelectedItem(); int n = (Integer) guests.getValue(); if (n > selected.capacity) throw new IllegalArgumentException("This room accommodates up to " + selected.capacity + " guests."); BigDecimal total = selected.price.multiply(BigDecimal.valueOf(ChronoUnit.DAYS.between(ci, co))); int id = HotelRepository.createReservation(selected.id, name.getText().trim(), email.getText().trim(), phone.getText().trim(), ci, co, n, total); JOptionPane.showMessageDialog(this, "Reservation #" + id + " confirmed."); loadReservations(); } catch (Exception ex) { JOptionPane.showMessageDialog(this, ex.getMessage(), "Could not create reservation", JOptionPane.ERROR_MESSAGE); }
    }
}
