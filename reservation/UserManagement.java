/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
package hotel.reservation;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import javax.swing.*;
import java.awt.*;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.SwingConstants;
import java.awt.Color;
import java.awt.Font;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
/**
 *
 * @author DCS Admin
 */
public class UserManagement extends javax.swing.JFrame {
    
    private static final java.util.logging.Logger logger = java.util.logging.Logger.getLogger(UserManagement.class.getName());
   private String searchHint = "";

private javax.swing.table.TableRowSorter<javax.swing.table.TableModel> sorter;

private JButton[] navText;
private JLabel[] navIcon;

private final int[] navY = {175,227,279,331,383,435,487,539,591};

private int currentPage = 6;
    

    /**
     * Creates new form dash
     */
    public UserManagement() {
        initComponents();
        
        
        
        setupNavAnimation();
        addGoldAnimation();
    
       
       

slideInCard(cardTotal, 0);
slideInCard(cardAdmin, 120);
slideInCard(cardStaff, 240);
slideInCard(cardActive, 360);

countUp(lblTotalValue, 5);
countUp(lblStaffValue, 1);
countUp(lblStaffValue, 4);
countUp(lblActiveValue, 5);


addCardHover(cardTotal);
addCardHover(cardAdmin);
addCardHover(cardStaff);
addCardHover(cardActive);

    // ... your icons, table setup, search code ...

    setupNavAnimation();
    slideInCard(cardTotal, 0);
    // ... the other cards and countUp lines ...

    btnAddUser.addMouseListener(new java.awt.event.MouseAdapter() {
        public void mouseEntered(java.awt.event.MouseEvent e) {
            btnAddUser.setBackground(new Color(255, 225, 140));
        }
        public void mouseExited(java.awt.event.MouseEvent e) {
            btnAddUser.setBackground(new Color(245, 196, 83));
        }
    });


     
        Color gold = new Color(245, 196, 83);
lblDashIcon.setIcon(new NavIcon(0, 30, gold));
lblResIcon.setIcon(new NavIcon(1, 30, gold));
lblRoomIcon.setIcon(new NavIcon(2, 30, gold));
lblCheckIcon.setIcon(new NavIcon(3, 30, gold));
lblGuestIcon.setIcon(new NavIcon(4, 30, gold));
lblPayIcon.setIcon(new NavIcon(5, 30, gold));
lblUserIcon.setIcon(new NavIcon(6, 30, gold));
lblsettingIcon.setIcon(new NavIcon(7, 30, gold));
lblLogoutIcon.setIcon(new NavIcon(8, 30, gold));
        
        
        System.out.println(tblusers.getRowCount());
        
       tblusers.getColumnModel().getColumn(6).setPreferredWidth(200);
tblusers.getColumnModel().getColumn(6).setMinWidth(200);
tblusers.setCursor(new Cursor(Cursor.HAND_CURSOR));

searchHint = txtsearch.getText();
final String hint = searchHint;
final java.awt.Color hintColor = new java.awt.Color(170, 160, 130);
txtsearch.setForeground(hintColor);

txtsearch.addFocusListener(new java.awt.event.FocusAdapter() {
    @Override
    public void focusGained(java.awt.event.FocusEvent e) {
        if (txtsearch.getText().equals(hint)) {
            txtsearch.setText("");
            txtsearch.setForeground(java.awt.Color.WHITE);
        }
    }
    @Override
    public void focusLost(java.awt.event.FocusEvent e) {
        if (txtsearch.getText().trim().isEmpty()) {
            txtsearch.setText(hint);
            txtsearch.setForeground(hintColor);
        }
    }
});


txtsearch.getDocument().addDocumentListener(
    new javax.swing.event.DocumentListener() {

        public void insertUpdate(
            javax.swing.event.DocumentEvent e) {
            applyFilter();
        }

        public void removeUpdate(
            javax.swing.event.DocumentEvent e) {
            applyFilter();
        }

        public void changedUpdate(
            javax.swing.event.DocumentEvent e) {
            applyFilter();
        }
    });

tblusers.addMouseListener(new java.awt.event.MouseAdapter() {

    @Override
    public void mouseClicked(java.awt.event.MouseEvent evt) {

        int row = tblusers.rowAtPoint(evt.getPoint());
        int column = tblusers.columnAtPoint(evt.getPoint());

        int actionsColumn = tblusers.getColumnCount() - 1;

        if (row >= 0 && column == actionsColumn) {

            int x = evt.getX() -
                    tblusers.getCellRect(row, column, true).x;

            if (x < tblusers.getCellRect(row, column, true).width / 2) {

                // EDIT
                JOptionPane.showMessageDialog(
                    null, "Edit User"
                );

            } else {

                // DELETE
                int confirm = JOptionPane.showConfirmDialog(
                    null,
                    "Are you sure you want to delete this user?",
                    "Confirm Deletion",
                    JOptionPane.YES_NO_OPTION
                );

                if (confirm == JOptionPane.YES_OPTION) {
                    ((javax.swing.table.DefaultTableModel)
                        tblusers.getModel()).removeRow(
                            tblusers.convertRowIndexToModel(row)
                        );
                }
            }
        }
    }
});



        tblusers.getColumnModel().getColumn(6).setCellRenderer(
    new javax.swing.table.DefaultTableCellRenderer() {

        @Override
        public java.awt.Component getTableCellRendererComponent(
                javax.swing.JTable table, Object value,
                boolean isSelected, boolean hasFocus,
                int row, int column) {

            javax.swing.JLabel label = (javax.swing.JLabel)
                super.getTableCellRendererComponent(
                    table, value, isSelected, hasFocus, row, column);

            label.setText("<html><center>" +
                value.toString().replace(" ", "<br>") +
                "</center></html>");

            label.setHorizontalAlignment(SwingConstants.CENTER);

            return label;
        }
    }
);

tblusers.setRowHeight(55);
        
        
     tblusers.getColumnModel()
        .getColumn(6)
        .setCellRenderer(new ActionRenderer());
     
     
    
        lblTotalIcon.setIcon(new UsersIcon(60, gold));
         lblStaffIcon.setIcon(new CardIcon(1, 60, gold));
          lblAdminIcon.setIcon(new CardIcon(2, 60, gold));
           lblActiveIcon.setIcon(new CardIcon(3, 60, gold));
           
          // header
tblusers.getTableHeader().setOpaque(true);
tblusers.getTableHeader().setBackground(new Color(10, 22, 48));
tblusers.getTableHeader().setForeground(new Color(245, 196, 83));
tblusers.getTableHeader().setFont(new Font("Georgia", Font.BOLD, 17));
tblusers.getTableHeader().setPreferredSize(new Dimension(0, 45));
tblusers.getTableHeader().setReorderingAllowed(false);

tblusers.getTableHeader().setUI(
new javax.swing.plaf.basic.BasicTableHeaderUI());
tblusers.getTableHeader().repaint();

DefaultTableCellRenderer idRenderer = new DefaultTableCellRenderer();
idRenderer.setHorizontalAlignment(SwingConstants.CENTER);
idRenderer.setForeground(new Color(28, 53, 85));
idRenderer.setBackground(new Color(245, 247, 250));
idRenderer.setFont(new Font("Segoe UI", Font.BOLD, 12));

tblusers.getColumnModel().getColumn(0).setCellRenderer(idRenderer);


// centre the text in every column except Actions
javax.swing.table.DefaultTableCellRenderer center =
        new javax.swing.table.DefaultTableCellRenderer();
center.setHorizontalAlignment(SwingConstants.CENTER);
center.setBackground(new Color(10, 22, 48));
center.setForeground(Color.WHITE);
for (int i = 0; i < 6; i++) {
    tblusers.getColumnModel().getColumn(i).setCellRenderer(center);
} 
           
           
           
           lblSearchIcon.setText("");
           lblSearchIcon.setIcon(new SearchIcon(22, new Color(245,196,83)));
        
        jScrollPane1.setVerticalScrollBarPolicy(
    javax.swing.JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED
);
        lblHeaderIcon.setText("");
        lblHeaderIcon.setIcon(new UsersIcon(70, new Color(245,196,85)));
        
         DateTimeFormatter formatter =
        DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy");

String date = LocalDate.now().format(formatter);
String[] parts = date.split(", ");


lblday3.setText(date);
       
       
}
   

    
   private void addCardHover(JPanel card) {

    card.addMouseListener(new MouseAdapter() {

        @Override
        public void mouseEntered(MouseEvent e) {

            card.setBorder(
                BorderFactory.createLineBorder(
                    new Color(245, 196, 83), 3
                )
            );

            card.repaint();
        }

        @Override
        public void mouseExited(MouseEvent e) {

            card.setBorder(null);

            card.repaint();
        }
    });
}

public class UsersIcon implements Icon {
    private final int size;
    private final Color color;

    public UsersIcon(int size, Color color) {
        this.size = size;
        this.color = color;
    }

    public int getIconWidth()  { return size; }
    public int getIconHeight() { return (int) (size * 0.75); }

    private void person(Graphics2D g2, int cx, int top, int head, int body) {
        g2.fillOval(cx - head / 2, top, head, head);
        g2.fillArc(cx - body / 2, top + head + 3, body, body, 0, 180);
    }

    public void paintIcon(Component c, Graphics g, int x, int y) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setColor(color);
        // side people first, centre person on top
        person(g2, x + (int) (size * 0.18), y + (int) (size * 0.18),
                (int) (size * 0.22), (int) (size * 0.36));
        person(g2, x + (int) (size * 0.82), y + (int) (size * 0.18),
                (int) (size * 0.22), (int) (size * 0.36));
        person(g2, x + size / 2, y,
                (int) (size * 0.28), (int) (size * 0.5));
        g2.dispose();
    }
}

private GoldParticlePanel goldParticles;

private void addGoldAnimation() {

    goldParticles = new GoldParticlePanel();

    pnlSideBar.add(goldParticles);

    goldParticles.setBounds(
        0, 0,
        pnlSideBar.getWidth(),
        pnlSideBar.getHeight()
    );

    pnlSideBar.setComponentZOrder(goldParticles,
            pnlSideBar.getComponentCount() - 1);

    pnlSideBar.repaint();
}


private static class RoundedPanel extends JPanel {
    private final int radius;
    private final Color fill;

    RoundedPanel(int radius, Color fill) {
        this.radius = radius;
        this.fill = fill;
        setOpaque(false);
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);
        int w = getWidth(), h = getHeight();

        g2.setColor(fill);
        g2.fillRoundRect(0, 0, w - 1, h - 1, radius, radius);

        g2.setPaint(new GradientPaint(0, 0, new Color(255, 226, 140),
                w, h, new Color(150, 105, 30)));
        g2.setStroke(new BasicStroke(3f));
        g2.drawRoundRect(1, 1, w - 3, h - 3, radius, radius);

        g2.setPaint(new GradientPaint(0, 0, new Color(190, 140, 40),
                w, h, new Color(255, 215, 100)));
        g2.setStroke(new BasicStroke(1.5f));
        g2.drawRoundRect(4, 4, w - 9, h - 9, radius - 6, radius - 6);

        g2.dispose();
        super.paintComponent(g);
    }
}


private static class CardIcon implements Icon {
    private final int type, size;
    private final Color color;

    CardIcon(int type, int size, Color color) {
        this.type = type; this.size = size; this.color = color;
    }

    @Override
    public int getIconWidth()  { return size; }
    @Override
    public int getIconHeight() { return size; }

    @Override
    public void paintIcon(Component c, Graphics g, int x, int y) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setColor(color);
        g2.setStroke(new BasicStroke(4f, BasicStroke.CAP_ROUND,
                BasicStroke.JOIN_ROUND));
        int s = size;
        switch (type) {
            case 1:
                // shield with tick
                g2.drawPolygon(new Polygon(
                        new int[]{x + s/2, x + s - 6, x + s - 6, x + s/2, x + 6, x + 6},
                        new int[]{y + 2, y + 10, y + s/2, y + s - 2, y + s/2, y + 10}, 6));
                g2.drawLine(x + s/3, y + s/2, x + s/2 - 2, y + s/2 + 8);
                g2.drawLine(x + s/2 - 2, y + s/2 + 8, x + 2*s/3, y + s/3);
                break;
            case 2:
                // person
                g2.fillOval(x + s/2 - 12, y + 4, 24, 24);
                g2.fillArc(x + s/2 - 22, y + 32, 44, 44, 0, 180);
                break;
            case 3:
                // circle with tick
                g2.drawOval(x + 4, y + 4, s - 8, s - 8);
                g2.drawLine(x + s/3, y + s/2, x + s/2 - 2, y + 2*s/3);
                g2.drawLine(x + s/2 - 2, y + 2*s/3, x + 2*s/3 + 2, y + s/3);
                break;
            default:
                break;
        }
        g2.dispose();
    }
}

private static class SearchIcon implements Icon {
    private final int size;
    private final Color color;

    SearchIcon(int size, Color color) {
        this.size = size;
        this.color = color;
    }

    @Override
    public int getIconWidth()  { return size; }
    @Override
    public int getIconHeight() { return size; }

    @Override
    public void paintIcon(Component c, Graphics g, int x, int y) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setColor(color);
        g2.setStroke(new BasicStroke(2.5f, BasicStroke.CAP_ROUND,
                BasicStroke.JOIN_ROUND));
        int d = size * 2 / 3;
        g2.drawOval(x + 1, y + 1, d, d);
        g2.drawLine(x + d, y + d, x + size - 2, y + size - 2);
        g2.dispose();
    }
}

private void applyFilter() {
    // create the sorter on the table's current model, if needed
    if (sorter == null || tblusers.getRowSorter() == null) {
        sorter = new javax.swing.table.TableRowSorter<>(tblusers.getModel());
        tblusers.setRowSorter(sorter);
    }

    String text = txtsearch.getText().trim();
    if (text.equals(searchHint)) text = "";

    if (text.isEmpty()) {
        sorter.setRowFilter(null);
    } else {
        sorter.setRowFilter(javax.swing.RowFilter.regexFilter(
                "(?i)" + java.util.regex.Pattern.quote(text), 1, 2, 3));
    }

    int shown = tblusers.getRowCount();
    int total = tblusers.getModel().getRowCount();
    if (shown == 0) {
        lblresult.setText("No users found");
        lblresult.setForeground(new Color(230, 110, 110));
    } else {
        lblresult.setText(shown == 1 ? "1 user found"
                : "Showing " + shown + " of " + total + " users");
        lblresult.setForeground(new Color(170, 160, 130));
    }
}
private static class NavIcon implements Icon {
    private final int type, size;
    private final Color color;

    NavIcon(int type, int size, Color color) {
        this.type = type; this.size = size; this.color = color;
    }

    @Override
    public int getIconWidth()  { return size; }
    @Override
    public int getIconHeight() { return size; }
    private int p(double f) { return (int) Math.round(f * size); }

    private void gear(Graphics2D g2, int cx, int cy, int r) {
        int ring = (int) (r * 1.2);
        g2.drawOval(cx - ring / 2, cy - ring / 2, ring, ring);
        for (int i = 0; i < 8; i++) {
            double a = Math.PI * i / 4;
            g2.drawLine(cx + (int) (Math.cos(a) * r * 0.6),
                        cy + (int) (Math.sin(a) * r * 0.6),
                        cx + (int) (Math.cos(a) * r),
                        cy + (int) (Math.sin(a) * r));
        }
    }

    private void person(Graphics2D g2, int cx, int top, int head) {
        g2.drawOval(cx - head / 2, top, head, head);
        g2.drawArc(cx - head, top + head + 3, head * 2, head * 2, 0, 180);
    }

    @Override
    public void paintIcon(Component c, Graphics g, int x, int y) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setColor(color);
        g2.setStroke(new BasicStroke(2.2f, BasicStroke.CAP_ROUND,
                BasicStroke.JOIN_ROUND));
        switch (type) {
            case 0 -> {
                // Dashboard
                g2.drawRoundRect(x + p(.15), y + p(.15), p(.28), p(.28), 5, 5);
                g2.drawRoundRect(x + p(.57), y + p(.15), p(.28), p(.28), 5, 5);
                g2.drawRoundRect(x + p(.15), y + p(.57), p(.28), p(.28), 5, 5);
                g2.drawRoundRect(x + p(.57), y + p(.57), p(.28), p(.28), 5, 5);
            }
            case 1 -> {
                // Reservations (calendar)
                g2.drawRoundRect(x + p(.15), y + p(.22), p(.7), p(.63), 6, 6);
                g2.drawLine(x + p(.15), y + p(.42), x + p(.85), y + p(.42));
                g2.drawLine(x + p(.33), y + p(.12), x + p(.33), y + p(.28));
                g2.drawLine(x + p(.67), y + p(.12), x + p(.67), y + p(.28));
            }
            case 2 -> {
                // Room Management (bed)
                g2.drawLine(x + p(.12), y + p(.25), x + p(.12), y + p(.8));
                g2.drawLine(x + p(.12), y + p(.65), x + p(.88), y + p(.65));
                g2.drawLine(x + p(.88), y + p(.65), x + p(.88), y + p(.8));
                g2.drawRoundRect(x + p(.2), y + p(.4), p(.22), p(.15), 4, 4);
                g2.drawLine(x + p(.5), y + p(.5), x + p(.88), y + p(.5));
                g2.drawLine(x + p(.88), y + p(.5), x + p(.88), y + p(.65));
            }
            case 3 -> {
                // Check-in / Check-out
                g2.drawLine(x + p(.55), y + p(.15), x + p(.85), y + p(.15));
                g2.drawLine(x + p(.85), y + p(.15), x + p(.85), y + p(.85));
                g2.drawLine(x + p(.85), y + p(.85), x + p(.55), y + p(.85));
                g2.drawLine(x + p(.1), y + p(.5), x + p(.6), y + p(.5));
                g2.drawLine(x + p(.6), y + p(.5), x + p(.45), y + p(.35));
                g2.drawLine(x + p(.6), y + p(.5), x + p(.45), y + p(.65));
            }
            case 4 -> {
                // Guests (two people)
                person(g2, x + p(.32), y + p(.15), p(.2));
                person(g2, x + p(.72), y + p(.25), p(.16));
            }
            case 5 -> {
                // Payments (card)
                g2.drawRoundRect(x + p(.1), y + p(.25), p(.8), p(.5), 8, 8);
                g2.drawLine(x + p(.1), y + p(.42), x + p(.9), y + p(.42));
                g2.drawLine(x + p(.22), y + p(.62), x + p(.4), y + p(.62));
            }
            case 6 -> {
                // User Management (person + gear)
                person(g2, x + p(.4), y + p(.12), p(.22));
                gear(g2, x + p(.76), y + p(.74), p(.14));
            }
            case 7 -> // Settings (gear)
                gear(g2, x + size / 2, y + size / 2, p(.38));
            case 8 -> {
                // Logout
                g2.drawLine(x + p(.45), y + p(.15), x + p(.15), y + p(.15));
                g2.drawLine(x + p(.15), y + p(.15), x + p(.15), y + p(.85));
                g2.drawLine(x + p(.15), y + p(.85), x + p(.45), y + p(.85));
                g2.drawLine(x + p(.4), y + p(.5), x + p(.9), y + p(.5));
                g2.drawLine(x + p(.9), y + p(.5), x + p(.75), y + p(.35));
                g2.drawLine(x + p(.9), y + p(.5), x + p(.75), y + p(.65));
            }
        }
        g2.dispose();
    }
}



private void slideTo(final JComponent c, final int targetY) {
    Object old = c.getClientProperty("slide");
    if (old instanceof javax.swing.Timer) ((javax.swing.Timer) old).stop();
    final javax.swing.Timer t = new javax.swing.Timer(10, null);
    t.addActionListener(e -> {
        int diff = targetY - c.getY();
        if (Math.abs(diff) <= 1) {
            c.setLocation(c.getX(), targetY);
            t.stop();
        } else {
            int step = diff / 4;
            if (step == 0) step = Integer.signum(diff);
            c.setLocation(c.getX(), c.getY() + step);
        }
    });
    c.putClientProperty("slide", t);
    t.start();
}

private void highlight(int idx) {
    Color navy = new Color(10, 22, 48), gold = new Color(245, 196, 83);
    for (int i = 0; i < navText.length; i++) {
        boolean on = (i == idx);
        navText[i].setForeground(on ? navy : Color.WHITE);
        navIcon[i].setIcon(new NavIcon(i, 30, on ? navy : gold));
    }
    slideTo(navActive, navY[idx] - 5);
}

private void setupNavAnimation() {
    navText = new JButton[]{lblDashText, lblResText, lblRoomText,
        lblCheckText, lblGuestText, lblPayText, lblUserText,
        lblSettingsText, lblLogoutText};
    navIcon = new JLabel[]{lblDashIcon, lblResIcon, lblRoomIcon,
        lblCheckIcon, lblGuestIcon, lblPayIcon, lblUserIcon,
        lblSettingsIcon, lblLogoutIcon};
    for (int i = 0; i < navText.length; i++) {
        final int idx = i;
        java.awt.event.MouseAdapter ma = new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent e) { highlight(idx); }
            public void mouseExited(java.awt.event.MouseEvent e) { highlight(currentPage); }
        };
        navText[i].addMouseListener(ma);
        navIcon[i].addMouseListener(ma);
        navText[i].setCursor(new Cursor(Cursor.HAND_CURSOR));
        navIcon[i].setCursor(new Cursor(Cursor.HAND_CURSOR));
    }
    highlight(currentPage);
}

private void countUp(final JLabel lbl, final int target) {
    final int[] v = {0};
    final javax.swing.Timer t = new javax.swing.Timer(80, null);
    t.addActionListener(e -> {
        v[0]++;
        lbl.setText(String.valueOf(v[0]));
        if (v[0] >= target) t.stop();
    });
    lbl.setText("0");
    t.start();
}

private void slideInCard(final JComponent card, int delay) {
    final int ty = card.getY();
    card.setLocation(card.getX(), ty + 40);
    javax.swing.Timer start = new javax.swing.Timer(delay, e -> slideTo(card, ty));
    start.setRepeats(false);
    start.start();
}


    
  

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    
    
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jScrollPane3 = new javax.swing.JScrollPane();
        jScrollPane2 = new javax.swing.JScrollPane();
        userspanel = new LuxuryBackgroundPanel();
        jLabel22 = new javax.swing.JLabel();
        jLabel23 = new javax.swing.JLabel();
        jLabel24 = new javax.swing.JLabel();
        jSeparator3 = new javax.swing.JSeparator();
        lblday3 = new javax.swing.JLabel();
        jPanel4 = new SwooshPanel();
        pnlSideBar = new javax.swing.JPanel();
        lblDashText = new javax.swing.JButton();
        lblRoomText = new javax.swing.JButton();
        lblPayText = new javax.swing.JButton();
        lblCheckText = new javax.swing.JButton();
        lblGuestText = new javax.swing.JButton();
        lblLogoutText = new javax.swing.JButton();
        lblUserText = new javax.swing.JButton();
        lblGuestIcon = new javax.swing.JLabel();
        lblRoomIcon = new javax.swing.JLabel();
        lblUserIcon = new javax.swing.JLabel();
        lblPayIcon = new javax.swing.JLabel();
        lblCheckIcon = new javax.swing.JLabel();
        lblDashIcon = new javax.swing.JLabel();
        lblSettingsIcon = new javax.swing.JLabel();
        lblResIcon = new javax.swing.JLabel();
        jSeparator4 = new javax.swing.JSeparator();
        jLabel38 = new javax.swing.JLabel();
        jLabel39 = new javax.swing.JLabel();
        jLabel40 = new javax.swing.JLabel();
        lblLogoutIcon = new javax.swing.JLabel();
        lblSettingsText = new javax.swing.JButton();
        lblResText = new javax.swing.JButton();
        lblsettingIcon = new javax.swing.JLabel();
        navActive = new javax.swing.JLabel();
        jLabel41 = new javax.swing.JLabel();
        jLabel42 = new javax.swing.JLabel();
        btnAddUser = new javax.swing.JButton();
        lblHeaderIcon = new javax.swing.JLabel();
        cardTotal = new RoundedPanel(25, new Color(10,22,48));
        jLabel43 = new javax.swing.JLabel();
        lblTotalValue = new javax.swing.JLabel();
        lblTotalIcon = new javax.swing.JLabel();
        SearchPanel1 = new RoundedPanel(45, new Color(10,22,48));
        txtsearch = new JTextField() {     @Override     protected void paintComponent(Graphics g) {         super.paintComponent(g);         if (getText().isEmpty()) {             Graphics2D g2 = (Graphics2D) g.create();             g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,                     RenderingHints.VALUE_TEXT_ANTIALIAS_ON);             g2.setColor(new Color(170, 160, 130));             g2.setFont(getFont());             Insets in = getInsets();             g2.drawString("Search by name, username or role...", in.left,                     (getHeight() + g2.getFontMetrics().getAscent()                     - g2.getFontMetrics().getDescent()) / 2);             g2.dispose();         }     } };
        lblSearchIcon = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();
        lblday2 = new javax.swing.JLabel();
        jScrollPane5 = new javax.swing.JScrollPane();
        tblusers = new javax.swing.JTable();
        lblresult = new javax.swing.JLabel();
        cardActive = new RoundedPanel(25, new Color(10,22,48));
        jLabel47 = new javax.swing.JLabel();
        lblActiveValue = new javax.swing.JLabel();
        lblActiveIcon = new javax.swing.JLabel();
        cardAdmin = new RoundedPanel(25, new Color(10,22,48));
        jLabel21 = new javax.swing.JLabel();
        lblAdminsValue1 = new javax.swing.JLabel();
        lblAdminIcon = new javax.swing.JLabel();
        cardstaff2 = new RoundedPanel(25, new Color(10,22,48));
        jLabel46 = new javax.swing.JLabel();
        lblStaffValue1 = new javax.swing.JLabel();
        lblStaffsIcon1 = new javax.swing.JLabel();
        cardStaff = new RoundedPanel(25, new Color(10,22,48));
        cardstaff1 = new RoundedPanel(25, new Color(10,22,48));
        lblStaffIcon = new javax.swing.JLabel();
        jLabel45 = new javax.swing.JLabel();
        lblStaffValue = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        userspanel.setBackground(new java.awt.Color(18, 32, 54));

        jLabel22.setFont(new java.awt.Font("Georgia", 1, 36)); // NOI18N
        jLabel22.setForeground(new java.awt.Color(245, 247, 250));
        jLabel22.setText("ROYAL HAVEN");

        jLabel23.setIcon(new javax.swing.ImageIcon(getClass().getResource("/icons/stars.jpg"))); // NOI18N

        jLabel24.setFont(new java.awt.Font("SansSerif", 0, 10)); // NOI18N
        jLabel24.setForeground(new java.awt.Color(233, 196, 91));
        jLabel24.setText("BOUTIQUE & SPA");

        jSeparator3.setForeground(new java.awt.Color(233, 196, 91));

        lblday3.setFont(new java.awt.Font("Segoe UI", 0, 14)); // NOI18N
        lblday3.setForeground(new java.awt.Color(233, 196, 91));
        lblday3.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        lblday3.setText("08 November 2026");

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 500, Short.MAX_VALUE)
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 26, Short.MAX_VALUE)
        );

        pnlSideBar.setBackground(new java.awt.Color(11, 22, 40));

        lblDashText.setBackground(new java.awt.Color(28, 53, 85));
        lblDashText.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        lblDashText.setForeground(new java.awt.Color(245, 247, 250));
        lblDashText.setText("Dashboard");
        lblDashText.setBorderPainted(false);
        lblDashText.setFocusPainted(false);
        lblDashText.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        lblDashText.addActionListener(this::lblDashTextActionPerformed);

        lblRoomText.setBackground(new java.awt.Color(11, 22, 40));
        lblRoomText.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        lblRoomText.setForeground(new java.awt.Color(245, 247, 250));
        lblRoomText.setText("Room Management");
        lblRoomText.setBorderPainted(false);
        lblRoomText.setFocusPainted(false);
        lblRoomText.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        lblRoomText.setOpaque(true);
        lblRoomText.addActionListener(this::lblRoomTextActionPerformed);

        lblPayText.setBackground(new java.awt.Color(11, 22, 40));
        lblPayText.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        lblPayText.setForeground(new java.awt.Color(245, 247, 250));
        lblPayText.setText("Payments");
        lblPayText.setBorderPainted(false);
        lblPayText.setFocusPainted(false);
        lblPayText.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        lblPayText.setOpaque(true);
        lblPayText.addActionListener(this::lblPayTextActionPerformed);

        lblCheckText.setBackground(new java.awt.Color(11, 22, 40));
        lblCheckText.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        lblCheckText.setForeground(new java.awt.Color(245, 247, 250));
        lblCheckText.setText("Check-in / Check-out");
        lblCheckText.setBorderPainted(false);
        lblCheckText.setFocusPainted(false);
        lblCheckText.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        lblCheckText.setOpaque(true);
        lblCheckText.addActionListener(this::lblCheckTextActionPerformed);

        lblGuestText.setBackground(new java.awt.Color(11, 22, 40));
        lblGuestText.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        lblGuestText.setForeground(new java.awt.Color(245, 247, 250));
        lblGuestText.setText("Guest Management");
        lblGuestText.setBorderPainted(false);
        lblGuestText.setFocusPainted(false);
        lblGuestText.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        lblGuestText.setOpaque(true);
        lblGuestText.addActionListener(this::lblGuestTextActionPerformed);

        lblLogoutText.setBackground(new java.awt.Color(11, 22, 40));
        lblLogoutText.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        lblLogoutText.setForeground(new java.awt.Color(245, 247, 250));
        lblLogoutText.setText("Logout");
        lblLogoutText.setBorderPainted(false);
        lblLogoutText.setFocusPainted(false);
        lblLogoutText.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        lblLogoutText.setOpaque(true);
        lblLogoutText.addActionListener(this::lblLogoutTextActionPerformed);

        lblUserText.setBackground(new java.awt.Color(11, 22, 40));
        lblUserText.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        lblUserText.setForeground(new java.awt.Color(245, 247, 250));
        lblUserText.setText("User Management");
        lblUserText.setBorderPainted(false);
        lblUserText.setFocusPainted(false);
        lblUserText.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        lblUserText.setOpaque(true);
        lblUserText.addActionListener(this::lblUserTextActionPerformed);

        lblGuestIcon.setText("g");

        lblRoomIcon.setText("r");

        lblUserIcon.setText("u");

        lblPayIcon.setText("p");

        lblCheckIcon.setText("c");

        lblDashIcon.setBackground(new java.awt.Color(28, 53, 85));
        lblDashIcon.setText("d");

        lblResIcon.setText("r");

        jSeparator4.setForeground(new java.awt.Color(48, 65, 88));

        jLabel38.setBackground(new java.awt.Color(28, 53, 85));
        jLabel38.setIcon(new javax.swing.ImageIcon(getClass().getResource("/icons/admin.png"))); // NOI18N

        jLabel39.setFont(new java.awt.Font("SansSerif", 1, 14)); // NOI18N
        jLabel39.setForeground(new java.awt.Color(143, 160, 188));
        jLabel39.setText("Administrator");

        jLabel40.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        jLabel40.setForeground(new java.awt.Color(143, 160, 188));
        jLabel40.setText("Hotel Staff");

        lblLogoutIcon.setText("l");

        lblSettingsText.setBackground(new java.awt.Color(11, 22, 40));
        lblSettingsText.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        lblSettingsText.setForeground(new java.awt.Color(245, 247, 250));
        lblSettingsText.setText("Settings");
        lblSettingsText.setBorderPainted(false);
        lblSettingsText.setFocusPainted(false);
        lblSettingsText.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        lblSettingsText.setOpaque(true);
        lblSettingsText.addActionListener(this::lblSettingsTextActionPerformed);

        lblResText.setBackground(new java.awt.Color(11, 22, 40));
        lblResText.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        lblResText.setForeground(new java.awt.Color(245, 247, 250));
        lblResText.setText("Reservations");
        lblResText.setBorderPainted(false);
        lblResText.setFocusPainted(false);
        lblResText.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        lblResText.setOpaque(true);
        lblResText.addActionListener(this::lblResTextActionPerformed);

        lblsettingIcon.setText("s");

        navActive.setFont(new java.awt.Font("Segoe UI", 0, 28)); // NOI18N
        navActive.setForeground(new java.awt.Color(245, 196, 83));
        navActive.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        navActive.setText("🏨");

        javax.swing.GroupLayout pnlSideBarLayout = new javax.swing.GroupLayout(pnlSideBar);
        pnlSideBar.setLayout(pnlSideBarLayout);
        pnlSideBarLayout.setHorizontalGroup(
            pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlSideBarLayout.createSequentialGroup()
                .addGap(31, 31, 31)
                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jSeparator4)
                    .addGroup(pnlSideBarLayout.createSequentialGroup()
                        .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlSideBarLayout.createSequentialGroup()
                                .addComponent(jLabel38, javax.swing.GroupLayout.PREFERRED_SIZE, 45, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel39, javax.swing.GroupLayout.PREFERRED_SIZE, 122, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel40, javax.swing.GroupLayout.PREFERRED_SIZE, 81, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addComponent(lblDashIcon)
                            .addComponent(lblCheckIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(lblUserIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(lblsettingIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(pnlSideBarLayout.createSequentialGroup()
                                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(lblRoomIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblResIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 15, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblGuestIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblPayIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 41, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblLogoutIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGap(22, 22, 22)
                                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(lblLogoutText, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblResText, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblDashText, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblRoomText, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblGuestText, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblCheckText, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblUserText, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblSettingsText, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblPayText, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(pnlSideBarLayout.createSequentialGroup()
                                .addGap(112, 112, 112)
                                .addComponent(lblSettingsIcon)))
                        .addGap(0, 22, Short.MAX_VALUE)))
                .addContainerGap())
            .addGroup(pnlSideBarLayout.createSequentialGroup()
                .addGap(117, 117, 117)
                .addComponent(navActive, javax.swing.GroupLayout.PREFERRED_SIZE, 69, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        pnlSideBarLayout.setVerticalGroup(
            pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlSideBarLayout.createSequentialGroup()
                .addGap(51, 51, 51)
                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(lblDashIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblDashText, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(lblResText, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblResIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(16, 16, 16)
                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(lblRoomIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblRoomText, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(pnlSideBarLayout.createSequentialGroup()
                        .addGap(25, 25, 25)
                        .addComponent(lblGuestIcon)
                        .addGap(18, 18, 18)
                        .addComponent(lblCheckIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlSideBarLayout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(lblGuestText, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(lblCheckText, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlSideBarLayout.createSequentialGroup()
                        .addGap(65, 65, 65)
                        .addComponent(lblUserIcon))
                    .addGroup(pnlSideBarLayout.createSequentialGroup()
                        .addGap(17, 17, 17)
                        .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(lblPayIcon)
                            .addComponent(lblPayText, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlSideBarLayout.createSequentialGroup()
                                .addGap(50, 50, 50)
                                .addComponent(lblSettingsIcon))
                            .addGroup(pnlSideBarLayout.createSequentialGroup()
                                .addGap(18, 18, 18)
                                .addComponent(lblUserText, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)))))
                .addGap(18, 18, 18)
                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(lblsettingIcon)
                    .addComponent(lblSettingsText, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(lblLogoutIcon)
                    .addComponent(lblLogoutText, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(navActive, javax.swing.GroupLayout.PREFERRED_SIZE, 57, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jSeparator4, javax.swing.GroupLayout.PREFERRED_SIZE, 13, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(pnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel38)
                    .addGroup(pnlSideBarLayout.createSequentialGroup()
                        .addComponent(jLabel39, javax.swing.GroupLayout.PREFERRED_SIZE, 21, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel40, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(129, Short.MAX_VALUE))
        );

        jLabel41.setFont(new java.awt.Font("Georgia", 1, 36)); // NOI18N
        jLabel41.setForeground(new java.awt.Color(255, 255, 255));
        jLabel41.setText("User Mangement");

        jLabel42.setFont(new java.awt.Font("Georgia", 0, 16)); // NOI18N
        jLabel42.setForeground(new java.awt.Color(255, 255, 255));
        jLabel42.setText("Manange system users and their access levels.");

        btnAddUser.setBackground(new java.awt.Color(245, 196, 83));
        btnAddUser.setFont(new java.awt.Font("Georgia", 1, 14)); // NOI18N
        btnAddUser.setForeground(new java.awt.Color(10, 22, 48));
        btnAddUser.setText("<html><span style='font size:34px'>+</span>&nbsp;&nbsp;&nbsp;Add User</html>");
        btnAddUser.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnAddUser.addActionListener(this::btnAddUserActionPerformed);

        lblHeaderIcon.setText("jLabel18");

        cardTotal.setBackground(new java.awt.Color(10, 22, 48));
        cardTotal.setOpaque(false);

        jLabel43.setFont(new java.awt.Font("SansSerif", 1, 13)); // NOI18N
        jLabel43.setForeground(new java.awt.Color(245, 247, 250));
        jLabel43.setText("Total Users");

        lblTotalValue.setFont(new java.awt.Font("SansSerif", 1, 28)); // NOI18N
        lblTotalValue.setForeground(new java.awt.Color(255, 255, 255));
        lblTotalValue.setText("5");

        lblTotalIcon.setText("jLabel20");

        javax.swing.GroupLayout cardTotalLayout = new javax.swing.GroupLayout(cardTotal);
        cardTotal.setLayout(cardTotalLayout);
        cardTotalLayout.setHorizontalGroup(
            cardTotalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, cardTotalLayout.createSequentialGroup()
                .addContainerGap(14, Short.MAX_VALUE)
                .addComponent(lblTotalIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(cardTotalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(cardTotalLayout.createSequentialGroup()
                        .addGap(6, 6, 6)
                        .addComponent(lblTotalValue, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel43, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(16, 16, 16))
        );
        cardTotalLayout.setVerticalGroup(
            cardTotalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, cardTotalLayout.createSequentialGroup()
                .addContainerGap(15, Short.MAX_VALUE)
                .addGroup(cardTotalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(lblTotalIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, cardTotalLayout.createSequentialGroup()
                        .addComponent(jLabel43)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(lblTotalValue, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(22, 22, 22))
        );

        txtsearch.setBackground(new java.awt.Color(10, 22, 48));
        txtsearch.setFont(new java.awt.Font("Georgia", 0, 16)); // NOI18N
        txtsearch.setForeground(new java.awt.Color(170, 160, 130));
        txtsearch.setText("Search by name, username, or role...");
        txtsearch.setBorder(null);
        txtsearch.setCaretColor(new java.awt.Color(245, 196, 83));

        lblSearchIcon.setText("se");

        jButton1.setBackground(new java.awt.Color(245, 196, 83));
        jButton1.setFont(new java.awt.Font("Georgia", 1, 14)); // NOI18N
        jButton1.setForeground(new java.awt.Color(10, 22, 48));
        jButton1.setText("Find");
        jButton1.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        jButton1.addActionListener(this::jButton1ActionPerformed);

        javax.swing.GroupLayout SearchPanel1Layout = new javax.swing.GroupLayout(SearchPanel1);
        SearchPanel1.setLayout(SearchPanel1Layout);
        SearchPanel1Layout.setHorizontalGroup(
            SearchPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(SearchPanel1Layout.createSequentialGroup()
                .addGap(24, 24, 24)
                .addComponent(lblSearchIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(txtsearch, javax.swing.GroupLayout.DEFAULT_SIZE, 589, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 92, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(19, 19, 19))
        );
        SearchPanel1Layout.setVerticalGroup(
            SearchPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(SearchPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(SearchPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(txtsearch)
                    .addGroup(SearchPanel1Layout.createSequentialGroup()
                        .addGap(9, 9, 9)
                        .addComponent(lblSearchIcon, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                    .addComponent(jButton1, javax.swing.GroupLayout.DEFAULT_SIZE, 32, Short.MAX_VALUE))
                .addContainerGap())
        );

        lblday2.setFont(new java.awt.Font("Georgia", 1, 24)); // NOI18N
        lblday2.setForeground(new java.awt.Color(233, 196, 91));
        lblday2.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblday2.setText("Monday");

        tblusers.setBackground(new java.awt.Color(10, 22, 48));
        tblusers.setFont(new java.awt.Font("Georgia", 0, 15)); // NOI18N
        tblusers.setForeground(new java.awt.Color(255, 255, 255));
        tblusers.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {"AD", "Admin User", "admin", "Administrator", "Active", "Nov 14, 2026 09:12 AM", null},
                {"JS", "Jogn Smith", "johns", "Staff", "Active", "Nov 13, 2026 04:145PM", null},
                {"SM", "Sarah Miller", "saraham", "Staff", "Active", "Nov 12, 2026 11:20 AM", null},
                {"DL", "David Lee", "david", "Staff", "Active", "Nov 11, 2026 01:30 PM", null},
                {"MK", "Mary Kim", "mark", "Staff", "Active", "Nov 10, 2026 03:15 PM", null}
            },
            new String [] {
                "User ID", "Fulll Name", "Username", "Role", "Status", "Last Login", "Actions"
            }
        ));
        tblusers.setFillsViewportHeight(true);
        tblusers.setGridColor(new java.awt.Color(40, 55, 90));
        tblusers.setIntercellSpacing(new java.awt.Dimension(0, 1));
        tblusers.setRowHeight(55);
        tblusers.setSelectionBackground(new java.awt.Color(30, 50, 95));
        tblusers.setSelectionForeground(new java.awt.Color(245, 196, 83));
        jScrollPane5.setViewportView(tblusers);

        lblresult.setFont(new java.awt.Font("Georgia", 0, 13)); // NOI18N
        lblresult.setForeground(new java.awt.Color(170, 160, 130));
        lblresult.setText("error");

        cardActive.setBackground(new java.awt.Color(10, 22, 48));
        cardActive.setOpaque(false);

        jLabel47.setFont(new java.awt.Font("SansSerif", 1, 13)); // NOI18N
        jLabel47.setForeground(new java.awt.Color(245, 247, 250));
        jLabel47.setText("Active Users");

        lblActiveValue.setFont(new java.awt.Font("SansSerif", 1, 28)); // NOI18N
        lblActiveValue.setForeground(new java.awt.Color(255, 255, 255));
        lblActiveValue.setText("5");

        lblActiveIcon.setText("jLabel20");

        javax.swing.GroupLayout cardActiveLayout = new javax.swing.GroupLayout(cardActive);
        cardActive.setLayout(cardActiveLayout);
        cardActiveLayout.setHorizontalGroup(
            cardActiveLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(cardActiveLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(lblActiveIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(cardActiveLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel47, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblActiveValue, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(15, Short.MAX_VALUE))
        );
        cardActiveLayout.setVerticalGroup(
            cardActiveLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, cardActiveLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(cardActiveLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(cardActiveLayout.createSequentialGroup()
                        .addGap(0, 16, Short.MAX_VALUE)
                        .addComponent(lblActiveIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(cardActiveLayout.createSequentialGroup()
                        .addComponent(jLabel47)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(lblActiveValue, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addGap(15, 15, 15))
        );

        cardAdmin.setBackground(new java.awt.Color(10, 22, 48));
        cardAdmin.setOpaque(false);

        jLabel21.setFont(new java.awt.Font("SansSerif", 1, 13)); // NOI18N
        jLabel21.setForeground(new java.awt.Color(245, 247, 250));
        jLabel21.setText("Admins");

        lblAdminsValue1.setFont(new java.awt.Font("SansSerif", 1, 28)); // NOI18N
        lblAdminsValue1.setForeground(new java.awt.Color(255, 255, 255));
        lblAdminsValue1.setText("1");

        lblAdminIcon.setText("jLabel20");

        cardstaff2.setBackground(new java.awt.Color(10, 22, 48));
        cardstaff2.setOpaque(false);

        jLabel46.setFont(new java.awt.Font("SansSerif", 1, 13)); // NOI18N
        jLabel46.setForeground(new java.awt.Color(245, 247, 250));
        jLabel46.setText("Staff");

        lblStaffValue1.setFont(new java.awt.Font("SansSerif", 1, 28)); // NOI18N
        lblStaffValue1.setForeground(new java.awt.Color(255, 255, 255));
        lblStaffValue1.setText("4");

        lblStaffsIcon1.setText("jLabel20");

        javax.swing.GroupLayout cardstaff2Layout = new javax.swing.GroupLayout(cardstaff2);
        cardstaff2.setLayout(cardstaff2Layout);
        cardstaff2Layout.setHorizontalGroup(
            cardstaff2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, cardstaff2Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(lblStaffsIcon1, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(cardstaff2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(cardstaff2Layout.createSequentialGroup()
                        .addGap(6, 6, 6)
                        .addComponent(lblStaffValue1, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel46, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(214, 214, 214))
        );
        cardstaff2Layout.setVerticalGroup(
            cardstaff2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, cardstaff2Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(cardstaff2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(lblStaffsIcon1, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(cardstaff2Layout.createSequentialGroup()
                        .addComponent(jLabel46)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(lblStaffValue1, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(43, 43, 43))
        );

        javax.swing.GroupLayout cardAdminLayout = new javax.swing.GroupLayout(cardAdmin);
        cardAdmin.setLayout(cardAdminLayout);
        cardAdminLayout.setHorizontalGroup(
            cardAdminLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, cardAdminLayout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(lblAdminIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(cardAdminLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel21, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblAdminsValue1, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(cardstaff2, javax.swing.GroupLayout.PREFERRED_SIZE, 187, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        cardAdminLayout.setVerticalGroup(
            cardAdminLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, cardAdminLayout.createSequentialGroup()
                .addGroup(cardAdminLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(cardAdminLayout.createSequentialGroup()
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(lblAdminIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(cardAdminLayout.createSequentialGroup()
                        .addGap(15, 15, 15)
                        .addComponent(jLabel21)
                        .addGap(18, 18, 18)
                        .addComponent(lblAdminsValue1, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                .addContainerGap())
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, cardAdminLayout.createSequentialGroup()
                .addGap(0, 0, Short.MAX_VALUE)
                .addComponent(cardstaff2, javax.swing.GroupLayout.PREFERRED_SIZE, 102, javax.swing.GroupLayout.PREFERRED_SIZE))
        );

        cardStaff.setBackground(new java.awt.Color(10, 22, 48));
        cardStaff.setOpaque(false);

        cardstaff1.setBackground(new java.awt.Color(10, 22, 48));
        cardstaff1.setOpaque(false);

        javax.swing.GroupLayout cardstaff1Layout = new javax.swing.GroupLayout(cardstaff1);
        cardstaff1.setLayout(cardstaff1Layout);
        cardstaff1Layout.setHorizontalGroup(
            cardstaff1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 187, Short.MAX_VALUE)
        );
        cardstaff1Layout.setVerticalGroup(
            cardstaff1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 102, Short.MAX_VALUE)
        );

        lblStaffIcon.setText("jLabel20");

        jLabel45.setFont(new java.awt.Font("SansSerif", 1, 13)); // NOI18N
        jLabel45.setForeground(new java.awt.Color(245, 247, 250));
        jLabel45.setText("Staff");

        lblStaffValue.setFont(new java.awt.Font("SansSerif", 1, 28)); // NOI18N
        lblStaffValue.setForeground(new java.awt.Color(255, 255, 255));
        lblStaffValue.setText("4");

        javax.swing.GroupLayout cardStaffLayout = new javax.swing.GroupLayout(cardStaff);
        cardStaff.setLayout(cardStaffLayout);
        cardStaffLayout.setHorizontalGroup(
            cardStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, cardStaffLayout.createSequentialGroup()
                .addGap(17, 17, 17)
                .addComponent(lblStaffIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(cardStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel45, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(cardStaffLayout.createSequentialGroup()
                        .addGap(6, 6, 6)
                        .addComponent(lblStaffValue, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(cardstaff1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        cardStaffLayout.setVerticalGroup(
            cardStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(cardStaffLayout.createSequentialGroup()
                .addGap(0, 0, Short.MAX_VALUE)
                .addGroup(cardStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(lblStaffIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(cardStaffLayout.createSequentialGroup()
                        .addComponent(jLabel45)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(lblStaffValue, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(cardstaff1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(10, 10, 10))
        );

        javax.swing.GroupLayout userspanelLayout = new javax.swing.GroupLayout(userspanel);
        userspanel.setLayout(userspanelLayout);
        userspanelLayout.setHorizontalGroup(
            userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(userspanelLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                        .addGroup(userspanelLayout.createSequentialGroup()
                            .addComponent(jLabel23, javax.swing.GroupLayout.PREFERRED_SIZE, 50, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                            .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addComponent(jLabel24, javax.swing.GroupLayout.PREFERRED_SIZE, 288, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(jLabel22, javax.swing.GroupLayout.PREFERRED_SIZE, 317, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGap(682, 682, 682)
                            .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addComponent(lblday2, javax.swing.GroupLayout.PREFERRED_SIZE, 119, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(lblday3, javax.swing.GroupLayout.PREFERRED_SIZE, 119, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGap(35, 35, 35))
                        .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, userspanelLayout.createSequentialGroup()
                        .addComponent(pnlSideBar, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(lblresult, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                .addComponent(jScrollPane5, javax.swing.GroupLayout.PREFERRED_SIZE, 797, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(SearchPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(userspanelLayout.createSequentialGroup()
                                .addComponent(lblHeaderIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 87, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(userspanelLayout.createSequentialGroup()
                                        .addGap(7, 7, 7)
                                        .addComponent(jLabel41, javax.swing.GroupLayout.PREFERRED_SIZE, 349, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(208, 208, 208)
                                        .addComponent(btnAddUser, javax.swing.GroupLayout.PREFERRED_SIZE, 126, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(userspanelLayout.createSequentialGroup()
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addComponent(jLabel42, javax.swing.GroupLayout.PREFERRED_SIZE, 328, javax.swing.GroupLayout.PREFERRED_SIZE))))
                            .addGroup(userspanelLayout.createSequentialGroup()
                                .addComponent(cardTotal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addComponent(cardStaff, javax.swing.GroupLayout.PREFERRED_SIZE, 186, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(cardActive, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(17, 17, 17)))))
                .addContainerGap(4028, Short.MAX_VALUE))
            .addComponent(jSeparator3)
            .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(userspanelLayout.createSequentialGroup()
                    .addGap(598, 598, 598)
                    .addComponent(cardAdmin, javax.swing.GroupLayout.PREFERRED_SIZE, 185, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(4460, Short.MAX_VALUE)))
        );
        userspanelLayout.setVerticalGroup(
            userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(userspanelLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(userspanelLayout.createSequentialGroup()
                        .addComponent(jLabel22, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel24, javax.swing.GroupLayout.PREFERRED_SIZE, 19, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel23, javax.swing.GroupLayout.PREFERRED_SIZE, 46, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(userspanelLayout.createSequentialGroup()
                        .addComponent(lblday2, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(lblday3, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 18, Short.MAX_VALUE)
                .addComponent(jSeparator3, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(userspanelLayout.createSequentialGroup()
                        .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(lblHeaderIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 78, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(userspanelLayout.createSequentialGroup()
                                .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel41)
                                    .addComponent(btnAddUser, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jLabel42)))
                        .addGap(18, 18, 18)
                        .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                .addComponent(cardTotal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(cardStaff, javax.swing.GroupLayout.PREFERRED_SIZE, 96, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(userspanelLayout.createSequentialGroup()
                                .addGap(6, 6, 6)
                                .addComponent(cardActive, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(20, 20, 20)
                        .addComponent(SearchPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(lblresult)
                        .addGap(18, 18, 18)
                        .addComponent(jScrollPane5, javax.swing.GroupLayout.PREFERRED_SIZE, 362, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(pnlSideBar, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(1506, Short.MAX_VALUE))
            .addGroup(userspanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(userspanelLayout.createSequentialGroup()
                    .addGap(226, 226, 226)
                    .addComponent(cardAdmin, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(2109, Short.MAX_VALUE)))
        );

        jScrollPane2.setViewportView(userspanel);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(3268, 3268, 3268)
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 1100, javax.swing.GroupLayout.PREFERRED_SIZE))
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 1427, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(2382, 2382, 2382)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 1227, Short.MAX_VALUE)
                    .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 0, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnAddUserActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnAddUserActionPerformed
        // TODO add your handling code here:
        JTextField name = new JTextField();
JTextField username = new JTextField();
JPasswordField password = new JPasswordField();
JComboBox<String> role = new JComboBox<>(new String[]{"Staff", "Administrator"});

Object[] form = {
    "Full Name:", name,
    "Username:", username,
    "Password:", password,
    "Role:", role
};




int result = JOptionPane.showConfirmDialog(this, form, "Add User",
        JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);

if (result == JOptionPane.OK_OPTION) {
    String n = name.getText().trim();
    String u = username.getText().trim();

    if (n.isEmpty() || u.isEmpty() || password.getPassword().length == 0) {
        JOptionPane.showMessageDialog(this, "Please fill in all fields.");
        return;
    }

    // initials for the User ID, e.g. "Sarah Miller" -> "SM"
    String[] parts = n.split("\\s+");
    String id = parts.length > 1
            ? ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
            : n.substring(0, Math.min(2, n.length())).toUpperCase();

    javax.swing.table.DefaultTableModel model =
            (javax.swing.table.DefaultTableModel) tblusers.getModel();
    model.addRow(new Object[]{id, n, u, role.getSelectedItem(),
            "Active", "Never", ""});

}
    }//GEN-LAST:event_btnAddUserActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        // TODO add your handling code here:
        applyFilter();
    }//GEN-LAST:event_jButton1ActionPerformed

    private void lblResTextActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_lblResTextActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_lblResTextActionPerformed

    private void lblSettingsTextActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_lblSettingsTextActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_lblSettingsTextActionPerformed

    private void lblUserTextActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_lblUserTextActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_lblUserTextActionPerformed

    private void lblLogoutTextActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_lblLogoutTextActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_lblLogoutTextActionPerformed

    private void lblGuestTextActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_lblGuestTextActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_lblGuestTextActionPerformed

    private void lblCheckTextActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_lblCheckTextActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_lblCheckTextActionPerformed

    private void lblPayTextActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_lblPayTextActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_lblPayTextActionPerformed

    private void lblRoomTextActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_lblRoomTextActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_lblRoomTextActionPerformed

    private void lblDashTextActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_lblDashTextActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_lblDashTextActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ReflectiveOperationException | javax.swing.UnsupportedLookAndFeelException ex) {
            logger.log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(() -> new UserManagement().setVisible(true));
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel SearchPanel1;
    private javax.swing.JButton btnAddUser;
    private javax.swing.JPanel cardActive;
    private javax.swing.JPanel cardAdmin;
    private javax.swing.JPanel cardStaff;
    private javax.swing.JPanel cardTotal;
    private javax.swing.JPanel cardstaff1;
    private javax.swing.JPanel cardstaff2;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel23;
    private javax.swing.JLabel jLabel24;
    private javax.swing.JLabel jLabel38;
    private javax.swing.JLabel jLabel39;
    private javax.swing.JLabel jLabel40;
    private javax.swing.JLabel jLabel41;
    private javax.swing.JLabel jLabel42;
    private javax.swing.JLabel jLabel43;
    private javax.swing.JLabel jLabel45;
    private javax.swing.JLabel jLabel46;
    private javax.swing.JLabel jLabel47;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JScrollPane jScrollPane5;
    private javax.swing.JSeparator jSeparator3;
    private javax.swing.JSeparator jSeparator4;
    private javax.swing.JLabel lblActiveIcon;
    private javax.swing.JLabel lblActiveValue;
    private javax.swing.JLabel lblAdminIcon;
    private javax.swing.JLabel lblAdminsValue1;
    private javax.swing.JLabel lblCheckIcon;
    private javax.swing.JButton lblCheckText;
    private javax.swing.JLabel lblDashIcon;
    private javax.swing.JButton lblDashText;
    private javax.swing.JLabel lblGuestIcon;
    private javax.swing.JButton lblGuestText;
    private javax.swing.JLabel lblHeaderIcon;
    private javax.swing.JLabel lblLogoutIcon;
    private javax.swing.JButton lblLogoutText;
    private javax.swing.JLabel lblPayIcon;
    private javax.swing.JButton lblPayText;
    private javax.swing.JLabel lblResIcon;
    private javax.swing.JButton lblResText;
    private javax.swing.JLabel lblRoomIcon;
    private javax.swing.JButton lblRoomText;
    private javax.swing.JLabel lblSearchIcon;
    private javax.swing.JLabel lblSettingsIcon;
    private javax.swing.JButton lblSettingsText;
    private javax.swing.JLabel lblStaffIcon;
    private javax.swing.JLabel lblStaffValue;
    private javax.swing.JLabel lblStaffValue1;
    private javax.swing.JLabel lblStaffsIcon1;
    private javax.swing.JLabel lblTotalIcon;
    private javax.swing.JLabel lblTotalValue;
    private javax.swing.JLabel lblUserIcon;
    private javax.swing.JButton lblUserText;
    private javax.swing.JLabel lblday2;
    private javax.swing.JLabel lblday3;
    private javax.swing.JLabel lblresult;
    private javax.swing.JLabel lblsettingIcon;
    private javax.swing.JLabel navActive;
    private javax.swing.JPanel pnlSideBar;
    private javax.swing.JTable tblusers;
    private javax.swing.JTextField txtsearch;
    private javax.swing.JPanel userspanel;
    // End of variables declaration//GEN-END:variables
}
