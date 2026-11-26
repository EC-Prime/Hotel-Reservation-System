package hotel.reservation;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import javax.swing.BorderFactory;
import javax.swing.DefaultCellEditor;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.table.AbstractTableModel;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.TableRowSorter;
<<<<<<< HEAD
import java.awt.*;
import javax.swing.*;
import javax.swing.plaf.basic.BasicScrollBarUI;
=======
>>>>>>> 963993141256b94c74f1f8ec88b331a504105113

/**
 * Room inventory screen prototype. Data is intentionally local sample data;
 * database loading and persistence will be connected in a later step.
 */
public final class RoomManagement extends JFrame {
    // Kept in sync with Dashboard's mainpanel, sidebar, and navigation colors.
    private static final Color NAVY = new Color(18, 32, 54);
    private static final Color NAVY2 = new Color(11, 22, 40);
    private static final Color PANEL = new Color(11, 22, 40);
    private static final Color GOLD = new Color(232, 184, 55);
    private static final Color GOLD_LIGHT = new Color(255, 211, 92);
    private static final Color WHITE = new Color(244, 245, 248);
    private static final Color MUTED = new Color(164, 176, 195);
    private static final Color LINE = new Color(47, 68, 96);

    private final JFrame parent;
    private final RoomTableModel model = new RoomTableModel();
    private final JTable table = new JTable(model);
    private final TableRowSorter<RoomTableModel> sorter = new TableRowSorter<>(model);
    private final JTextField search = new JTextField(24);
    private final JComboBox<String> statusFilter = new JComboBox<>(new String[]{"All Rooms", "Available", "Reserved", "Occupied", "Maintenance"});
    private final JLabel totalValue = new JLabel("20");
    private final JLabel availableValue = new JLabel("08");
    private final JLabel occupiedValue = new JLabel("07");
    private final JLabel maintenanceValue = new JLabel("02");

    public RoomManagement() { this(null); }

    public RoomManagement(JFrame parent) {
        this.parent = parent;
        setTitle("Royal Haven | Room Management");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setMinimumSize(new Dimension(1120, 720));
        setSize(1460, 900);
        setLocationRelativeTo(parent);
        getContentPane().setBackground(NAVY);
        setLayout(new BorderLayout());
        add(buildSidebar(), BorderLayout.WEST);
        add(buildMain(), BorderLayout.CENTER);
        configureTable();
        bindFilters();
        addWindowListener(new java.awt.event.WindowAdapter() {
            @Override public void windowClosed(java.awt.event.WindowEvent e) {
                if (RoomManagement.this.parent != null) RoomManagement.this.parent.setVisible(true);
            }
        });
    }

<<<<<<< HEAD
    public class ModernScrollBarUI extends BasicScrollBarUI {

    private  Color thumbColor = new Color(120, 120, 120);
    private Color trackColor = new Color(240, 240, 240);

    @Override
    protected void configureScrollBarColors() {
        this.thumbColor = thumbColor;
        this.trackColor = trackColor;
    }

    // Hide the top/bottom arrow buttons
    @Override
    protected JButton createDecreaseButton(int orientation) {
        return createZeroButton();
    }

    @Override
    protected JButton createIncreaseButton(int orientation) {
        return createZeroButton();
    }

    private JButton createZeroButton() {
        JButton button = new JButton();
        button.setPreferredSize(new Dimension(0, 0));
        button.setMinimumSize(new Dimension(0, 0));
        button.setMaximumSize(new Dimension(0, 0));
        return button;
    }

    // Draw a rounded thumb
    @Override
    protected void paintThumb(Graphics g, JComponent c, Rectangle thumbBounds) {
        if (thumbBounds.isEmpty() || !scrollbar.isEnabled()) {
            return;
        }
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setColor(thumbColor);
        g2.fillRoundRect(thumbBounds.x + 2, thumbBounds.y + 2, thumbBounds.width - 4, thumbBounds.height - 4, 8, 8);
        g2.dispose();
    }

    // Draw the background track
    @Override
    protected void paintTrack(Graphics g, JComponent c, Rectangle trackBounds) {
        g.setColor(trackColor);
        g.fillRect(trackBounds.x, trackBounds.y, trackBounds.width, trackBounds.height);
    }
}
    
    
=======
>>>>>>> 963993141256b94c74f1f8ec88b331a504105113
    private JPanel buildSidebar() {
        JPanel side = new JPanel(new BorderLayout());
        side.setPreferredSize(new Dimension(280, 0));
        side.setBackground(NAVY2);
        side.setBorder(BorderFactory.createMatteBorder(0, 0, 0, 1, new Color(163, 125, 35)));

        JPanel brand = new JPanel(new BorderLayout(8, 4));
        brand.setOpaque(false);
        brand.setBorder(BorderFactory.createEmptyBorder(24, 14, 24, 10));
        JLabel logo = imageLabel("/icons/stars.jpg", 52, 52);
        JPanel wordmark = new JPanel(new BorderLayout(0, 3));
        wordmark.setOpaque(false);
        JLabel title = new JLabel("ROYAL HAVEN");
        title.setForeground(WHITE);
        title.setFont(new Font("Georgia", Font.BOLD, 21));
        JLabel subtitle = new JLabel("BOUTIQUE & SPA");
        subtitle.setForeground(new Color(233, 196, 91));
        subtitle.setFont(new Font("SansSerif", Font.PLAIN, 10));
        wordmark.add(title, BorderLayout.CENTER);
        wordmark.add(subtitle, BorderLayout.SOUTH);
        brand.add(logo, BorderLayout.WEST);
        brand.add(wordmark, BorderLayout.CENTER);
        side.add(brand, BorderLayout.NORTH);

        JPanel nav = new JPanel(new GridLayout(0, 1, 0, 7));
        nav.setOpaque(false);
        nav.setBorder(BorderFactory.createEmptyBorder(12, 10, 10, 10));
        addNav(nav, "Dashboard", "/icons/dashboard.png", false);
        addNav(nav, "Reservations", "/icons/reservations.png", false);
        addNav(nav, "Room Management", "/icons/room M.png", true);
        addNav(nav, "Guests", "/icons/guest M.png", false);
        addNav(nav, "Check-in / Check-out", "/icons/checkin.png", false);
        addNav(nav, "Payments", "/icons/payment.png", false);
        addNav(nav, "Reports", "/icons/reports.png", false);
        addNav(nav, "Settings", "/icons/settings.png", false);
        side.add(nav, BorderLayout.CENTER);

        JLabel footer = new JLabel("Luxury. Comfort. Excellence.", SwingConstants.CENTER);
        footer.setForeground(new Color(143, 160, 188));
        footer.setFont(new Font("SansSerif", Font.PLAIN, 12));
        footer.setBorder(BorderFactory.createEmptyBorder(12, 8, 18, 8));
        side.add(footer, BorderLayout.SOUTH);
        return side;
    }

    private void addNav(JPanel nav, String text, String icon, boolean active) {
        TabButton b = new TabButton(text);
        b.setIcon(loadIcon(icon, 23, 23));
        b.setHorizontalAlignment(SwingConstants.LEFT);
        b.setIconTextGap(12);
        b.setFont(new Font("Segoe UI", Font.BOLD, 13));
        b.setBorder(BorderFactory.createEmptyBorder(7, 11, 7, 9));
        b.setPreferredSize(new Dimension(258, 37));
        b.setActive(active);
        b.setToolTipText(text);
        if (text.equals("Dashboard") && parent != null) b.addActionListener(e -> dispose());
        nav.add(b);
    }

    private JPanel buildMain() {
        JPanel main = new JPanel(new BorderLayout(0, 18));
        main.setBackground(NAVY);
        main.setBorder(BorderFactory.createEmptyBorder(22, 28, 24, 28));
        main.add(buildTopBar(), BorderLayout.NORTH);

        JPanel content = new JPanel(new BorderLayout(0, 22));
        content.setOpaque(false);
        content.add(buildHeading(), BorderLayout.NORTH);
        JPanel center = new JPanel(new BorderLayout(0, 18));
        center.setOpaque(false);
        center.add(buildSummary(), BorderLayout.NORTH);
        center.add(buildInventory(), BorderLayout.CENTER);
        content.add(center, BorderLayout.CENTER);
        main.add(content, BorderLayout.CENTER);
        return main;
    }

    private JPanel buildTopBar() {
        JPanel bar = new JPanel(new BorderLayout());
        bar.setOpaque(false);
        bar.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(151, 116, 36)));
        JLabel date = new JLabel("▦   " + java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("EEE, MMM d, yyyy", Locale.ENGLISH)) + "     │     ◉");
        date.setForeground(WHITE);
        date.setFont(new Font("Serif", Font.PLAIN, 16));
        date.setBorder(BorderFactory.createEmptyBorder(0, 0, 13, 8));
        bar.add(date, BorderLayout.EAST);
        return bar;
    }

    private JPanel buildHeading() {
        JPanel head = new JPanel(new BorderLayout(18, 0));
        head.setOpaque(false);
        JLabel icon = imageLabel("/icons/room M.png", 56, 56);
        JPanel words = new JPanel(new BorderLayout(0, 2));
        words.setOpaque(false);
        JLabel title = new JLabel("Room Management");
        title.setForeground(WHITE);
        title.setFont(new Font("Georgia", Font.BOLD, 34));
        JLabel sub = new JLabel("Manage hotel rooms and availability.");
        sub.setForeground(new Color(218, 224, 234));
        sub.setFont(new Font("Serif", Font.PLAIN, 17));
        words.add(title, BorderLayout.NORTH);
        words.add(sub, BorderLayout.CENTER);
        JPanel left = new JPanel(new BorderLayout(14, 0));
        left.setOpaque(false);
        left.add(icon, BorderLayout.WEST);
        left.add(words, BorderLayout.CENTER);
        JButton add = goldButton("＋  Add Room", true);
        add.addActionListener(e -> showRoomDialog(null));
        head.add(left, BorderLayout.WEST);
        head.add(add, BorderLayout.EAST);
        return head;
    }

    private JPanel buildSummary() {
        JPanel cards = new JPanel(new GridLayout(1, 4, 18, 0));
        cards.setOpaque(false);
        cards.add(summaryCard("Total Rooms", totalValue, "/icons/room M.png", GOLD));
        cards.add(summaryCard("Available", availableValue, "/icons/checkin.png", new Color(48, 190, 145)));
        cards.add(summaryCard("Occupied", occupiedValue, "/icons/guest M.png", new Color(220, 84, 80)));
        cards.add(summaryCard("Maintenance", maintenanceValue, "/icons/settings.png", new Color(234, 164, 55)));
        return cards;
    }

    private JPanel summaryCard(String label, JLabel value, String icon, Color accent) {
        JPanel card = new JPanel(new BorderLayout(14, 0));
        card.setBackground(PANEL);
        card.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(GOLD, 1, true), BorderFactory.createEmptyBorder(15, 17, 15, 17)));
        JLabel badge = imageLabel(icon, 48, 48);
        JPanel text = new JPanel(new BorderLayout(0, 3));
        text.setOpaque(false);
        JLabel name = new JLabel(label);
        name.setForeground(WHITE);
        name.setFont(new Font("Serif", Font.PLAIN, 16));
        value.setForeground(accent);
        value.setFont(new Font("Serif", Font.BOLD, 31));
        text.add(name, BorderLayout.NORTH);
        text.add(value, BorderLayout.CENTER);
        card.add(badge, BorderLayout.WEST);
        card.add(text, BorderLayout.CENTER);
        return card;
    }

    private JPanel buildInventory() {
        JPanel panel = new JPanel(new BorderLayout(0, 0));
        panel.setBackground(PANEL);
        panel.setBorder(BorderFactory.createLineBorder(GOLD, 1, true));
        JPanel toolbar = new JPanel(new BorderLayout(14, 0));
        toolbar.setOpaque(false);
        toolbar.setBorder(BorderFactory.createEmptyBorder(13, 16, 13, 16));
        JPanel searchBox = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        searchBox.setBackground(NAVY2);
        searchBox.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(new Color(182, 145, 47), 1, true), BorderFactory.createEmptyBorder(3, 9, 3, 9)));
        JLabel magnify = new JLabel("⌕");
        magnify.setForeground(WHITE);
        magnify.setFont(new Font("SansSerif", Font.BOLD, 22));
        search.setBackground(NAVY2);
        search.setForeground(WHITE);
        search.setCaretColor(GOLD_LIGHT);
        search.setBorder(BorderFactory.createEmptyBorder(7, 4, 7, 4));
        search.setToolTipText("Search room number or room type");
        searchBox.add(magnify);
        searchBox.add(search);
        styleCombo(statusFilter);
        toolbar.add(searchBox, BorderLayout.WEST);
        toolbar.add(statusFilter, BorderLayout.EAST);

        table.setRowSorter(sorter);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.setRowHeight(38);
        table.setFont(new Font("SansSerif", Font.PLAIN, 13));
        table.setForeground(WHITE);
        table.setBackground(new Color(8, 22, 42));
        table.setSelectionBackground(new Color(35, 58, 88));
        table.setSelectionForeground(WHITE);
        table.setGridColor(LINE);
        table.setShowGrid(true);
        table.setFillsViewportHeight(true);
        table.getTableHeader().setPreferredSize(new Dimension(10, 35));
        table.getTableHeader().setBackground(NAVY2);
        table.getTableHeader().setForeground(GOLD_LIGHT);
        table.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 12));
        table.getTableHeader().setReorderingAllowed(false);
        table.getColumnModel().getColumn(5).setCellRenderer(new ActionRenderer());
        table.getColumnModel().getColumn(5).setMinWidth(176);
        table.getColumnModel().getColumn(5).setPreferredWidth(190);
        table.getColumnModel().getColumn(4).setCellRenderer(new StatusRenderer());
        table.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override public void mouseClicked(java.awt.event.MouseEvent e) {
                int viewRow = table.rowAtPoint(e.getPoint());
                int viewColumn = table.columnAtPoint(e.getPoint());
                if (viewRow < 0 || viewColumn != 5) return;
                java.awt.Rectangle cell = table.getCellRect(viewRow, viewColumn, true);
                int row = table.convertRowIndexToModel(viewRow);
                if (e.getX() - cell.x < cell.width / 2) {
                    showRoomDialog(model.getRoom(row));
                } else {
                    viewRoom(viewRow);
                }
            }
        });
        JScrollPane scroll = new JScrollPane(table);
        scroll.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, LINE));
        scroll.getViewport().setBackground(new Color(8, 22, 42));
        panel.add(toolbar, BorderLayout.NORTH);
        panel.add(scroll, BorderLayout.CENTER);
        return panel;
    }

    private void configureTable() { table.setRowSorter(sorter); }

    private void bindFilters() {
        search.addKeyListener(new KeyAdapter() {
            @Override public void keyReleased(KeyEvent e) { applyFilters(); }
        });
        statusFilter.addActionListener(e -> applyFilters());
    }

    private void applyFilters() {
        String q = search.getText().trim().toLowerCase(Locale.ROOT);
        String status = String.valueOf(statusFilter.getSelectedItem());
        sorter.setRowFilter(new javax.swing.RowFilter<RoomTableModel, Integer>() {
            @Override public boolean include(Entry<? extends RoomTableModel, ? extends Integer> entry) {
                String room = String.valueOf(entry.getValue(0)).toLowerCase(Locale.ROOT);
                String type = String.valueOf(entry.getValue(1)).toLowerCase(Locale.ROOT);
                String rowStatus = String.valueOf(entry.getValue(4));
                return (q.isEmpty() || room.contains(q) || type.contains(q))
                        && (status.equals("All Rooms") || rowStatus.equalsIgnoreCase(status));
            }
        });
    }

    private void showRoomDialog(RoomRecord record) {
        boolean editing = record != null;
        JTextField number = new JTextField(editing ? record.number : "");
        JComboBox<String> type = new JComboBox<>(new String[]{"Standard", "Deluxe", "Suite", "Single", "Double"});
        if (editing) type.setSelectedItem(record.type);
        JTextField price = new JTextField(editing ? String.valueOf(record.price) : "850");
        JTextField floor = new JTextField(editing ? String.valueOf(record.floor) : "1");
        JComboBox<String> status = new JComboBox<>(new String[]{"Available", "Reserved", "Occupied", "Maintenance"});
        if (editing) status.setSelectedItem(record.status);
        JPanel form = new JPanel(new GridLayout(0, 2, 9, 9));
        form.add(new JLabel("Room number")); form.add(number);
        form.add(new JLabel("Room type")); form.add(type);
        form.add(new JLabel("Price per night (R)")); form.add(price);
        form.add(new JLabel("Floor")); form.add(floor);
        form.add(new JLabel("Status")); form.add(status);
        int result = JOptionPane.showConfirmDialog(this, form, editing ? "Edit Room" : "Add Room", JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);
        if (result != JOptionPane.OK_OPTION) return;
        try {
            String n = number.getText().trim();
            double p = Double.parseDouble(price.getText().trim());
            int f = Integer.parseInt(floor.getText().trim());
            if (n.isEmpty() || p < 0 || f < 1) throw new IllegalArgumentException();
            if (editing) model.update(record, String.valueOf(type.getSelectedItem()), p, f, String.valueOf(status.getSelectedItem()));
            else model.add(new RoomRecord(n, String.valueOf(type.getSelectedItem()), p, f, String.valueOf(status.getSelectedItem())));
            updateSummary();
        } catch (RuntimeException ex) {
            JOptionPane.showMessageDialog(this, "Enter a room number, a non-negative price, and a floor number greater than zero.", "Check room details", JOptionPane.WARNING_MESSAGE);
        }
    }

    private void updateSummary() {
        totalValue.setText(String.format("%02d", model.getRowCount()));
        availableValue.setText(String.format("%02d", model.count("Available")));
        occupiedValue.setText(String.format("%02d", model.count("Occupied")));
        maintenanceValue.setText(String.format("%02d", model.count("Maintenance")));
    }

    private void viewRoom(int row) {
        RoomRecord r = model.getRoom(table.convertRowIndexToModel(row));
        JOptionPane.showMessageDialog(this, "Room " + r.number + "\n" + r.type + " · Floor " + r.floor + "\n" + currency(r.price) + " per night\nStatus: " + r.status,
                "Room details", JOptionPane.INFORMATION_MESSAGE, loadIcon("/icons/room M.png", 36, 36));
    }

    private static String currency(double amount) { return "R" + NumberFormat.getNumberInstance(Locale.US).format(amount); }
    private static void styleCombo(JComboBox<?> combo) {
        combo.setBackground(NAVY2); combo.setForeground(WHITE); combo.setFont(new Font("Serif", Font.PLAIN, 15));
        combo.setBorder(BorderFactory.createLineBorder(LINE));
    }
    private static JButton goldButton(String text, boolean filled) {
        JButton b = new JButton(text) {
            @Override protected void paintComponent(java.awt.Graphics graphics) {
                java.awt.Graphics2D g = (java.awt.Graphics2D) graphics.create();
                g.setRenderingHint(java.awt.RenderingHints.KEY_ANTIALIASING, java.awt.RenderingHints.VALUE_ANTIALIAS_ON);
                int arc = 20;
                g.setColor(getModel().isRollover() ? (filled ? GOLD_LIGHT : new Color(28, 53, 85)) : getBackground());
                g.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, arc, arc);
                g.setColor(GOLD);
                g.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, arc, arc);
                g.dispose();
                super.paintComponent(graphics);
            }
        };
        b.setFont(new Font("Serif", Font.BOLD, 17));
        b.setFocusPainted(false);
        b.setForeground(filled ? NAVY : GOLD_LIGHT);
        b.setBackground(filled ? GOLD : NAVY2);
        b.setContentAreaFilled(false);
        b.setOpaque(false);
        b.setBorder(BorderFactory.createEmptyBorder(12, 20, 12, 20));
        return b;
    }
    private static JButton actionButton(String text) {
        JButton b = new JButton(text);
        b.setFont(new Font("SansSerif", Font.BOLD, 11));
        b.setForeground(GOLD_LIGHT);
        b.setBackground(NAVY2);
        b.setFocusPainted(false);
        b.setMargin(new java.awt.Insets(3, 7, 3, 7));
        b.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(GOLD, 1, true),
                BorderFactory.createEmptyBorder(2, 5, 2, 5)));
        b.setOpaque(true);
        return b;
    }
    private static ImageIcon loadIcon(String path, int w, int h) {
        java.net.URL url = RoomManagement.class.getResource(path);
        if (url == null) return new ImageIcon();
        java.awt.Image img = new ImageIcon(url).getImage().getScaledInstance(w, h, java.awt.Image.SCALE_SMOOTH);
        return new ImageIcon(img);
    }
    private static JLabel imageLabel(String path, int w, int h) {
        JLabel label = new JLabel(loadIcon(path, w, h));
        label.setPreferredSize(new Dimension(w, h));
        label.setHorizontalAlignment(SwingConstants.CENTER);
        return label;
    }

    private final class ActionRenderer extends JPanel implements javax.swing.table.TableCellRenderer {
        ActionRenderer() { setOpaque(true); setBackground(new Color(8, 22, 42)); setLayout(new FlowLayout(FlowLayout.CENTER, 5, 9)); }
        @Override public Component getTableCellRendererComponent(JTable t, Object value, boolean selected, boolean focus, int row, int col) {
            removeAll(); setBackground(selected ? t.getSelectionBackground() : new Color(8, 22, 42));
            add(actionButton("✎ Edit")); add(actionButton("◉ View")); return this;
        }
    }
    private final class ActionEditor extends DefaultCellEditor {
        private final JPanel panel = new JPanel(new FlowLayout(FlowLayout.CENTER, 5, 8));
        private final JButton edit = actionButton("✎ Edit");
        private final JButton view = actionButton("◉ View");
        private int row;
        ActionEditor() {
            super(new JTextField()); panel.setBackground(new Color(8, 22, 42));
            edit.addActionListener(e -> { fireEditingStopped(); showRoomDialog(model.getRoom(table.convertRowIndexToModel(row))); });
            view.addActionListener(e -> { fireEditingStopped(); viewRoom(row); });
            panel.add(edit); panel.add(view);
        }
        @Override public Component getTableCellEditorComponent(JTable t, Object value, boolean selected, int row, int col) { this.row = row; return panel; }
    }
    private static final class StatusRenderer extends DefaultTableCellRenderer {
        @Override public Component getTableCellRendererComponent(JTable t, Object value, boolean selected, boolean focus, int row, int col) {
            JLabel label = (JLabel) super.getTableCellRendererComponent(t, "●  " + value, selected, focus, row, col);
            label.setHorizontalAlignment(SwingConstants.CENTER); label.setOpaque(true); label.setFont(new Font("SansSerif", Font.BOLD, 11));
            String s = String.valueOf(value);
            Color bg = s.equals("Available") ? new Color(19, 106, 82) : s.equals("Occupied") ? new Color(133, 45, 50) : s.equals("Maintenance") ? new Color(151, 100, 25) : new Color(157, 116, 18);
            label.setBackground(selected ? t.getSelectionBackground() : bg); label.setForeground(WHITE); return label;
        }
    }

    private static final class RoomRecord {
        final String number; String type; double price; int floor; String status;
        RoomRecord(String number, String type, double price, int floor, String status) { this.number=number; this.type=type; this.price=price; this.floor=floor; this.status=status; }
    }
    private static final class RoomTableModel extends AbstractTableModel {
        private final String[] columns = {"Room Number", "Room Type", "Price / Night", "Floor", "Status", "Actions"};
        private final List<RoomRecord> rooms = new ArrayList<>();
        RoomTableModel() {
            rooms.add(new RoomRecord("101","Standard",850,1,"Available")); rooms.add(new RoomRecord("102","Deluxe",1200,1,"Reserved"));
            rooms.add(new RoomRecord("103","Suite",2000,1,"Occupied")); rooms.add(new RoomRecord("104","Standard",850,1,"Maintenance"));
            rooms.add(new RoomRecord("105","Deluxe",1200,2,"Available")); rooms.add(new RoomRecord("106","Double",1100,2,"Occupied"));
            rooms.add(new RoomRecord("107","Suite",2000,2,"Available")); rooms.add(new RoomRecord("108","Single",750,2,"Available"));
            rooms.add(new RoomRecord("109","Deluxe",1200,2,"Occupied"));
            rooms.add(new RoomRecord("110","Standard",850,2,"Occupied"));
            rooms.add(new RoomRecord("111","Suite",2000,2,"Occupied"));
            rooms.add(new RoomRecord("112","Standard",850,2,"Occupied"));
            rooms.add(new RoomRecord("113","Deluxe",1200,2,"Occupied"));
            rooms.add(new RoomRecord("114","Standard",850,2,"Maintenance"));
            rooms.add(new RoomRecord("115","Suite",2000,3,"Reserved"));
            rooms.add(new RoomRecord("116","Deluxe",1200,3,"Reserved"));
            rooms.add(new RoomRecord("117","Standard",850,3,"Available"));
            rooms.add(new RoomRecord("118","Double",1100,3,"Available"));
            rooms.add(new RoomRecord("119","Single",750,3,"Available"));
            rooms.add(new RoomRecord("120","Suite",2000,3,"Available"));
        }
        @Override public int getRowCount(){return rooms.size();}
        @Override public int getColumnCount(){return columns.length;}
        @Override public String getColumnName(int c){return columns[c];}
        @Override public Object getValueAt(int r,int c){RoomRecord x=rooms.get(r);return switch(c){case 0->x.number;case 1->x.type;case 2->currency(x.price);case 3->x.floor;case 4->x.status;default->"";};}
        @Override public boolean isCellEditable(int r,int c){return false;}
        RoomRecord getRoom(int r){return rooms.get(r);}
        void add(RoomRecord r){rooms.add(r);fireTableRowsInserted(rooms.size()-1,rooms.size()-1);}
        void update(RoomRecord r,String type,double price,int floor,String status){r.type=type;r.price=price;r.floor=floor;r.status=status;fireTableDataChanged();}
        int count(String status){return (int)rooms.stream().filter(r->r.status.equals(status)).count();}
    }

    public static void main(String[] args) { SwingUtilities.invokeLater(() -> new RoomManagement().setVisible(true)); }
}
