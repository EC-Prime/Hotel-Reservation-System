/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;

public class PaymentsFrame extends JFrame {

    // ================= COLOURS & FONTS =================
    static final Color NAVY       = new Color(0x070D1F);
    static final Color PANEL      = new Color(0x0D1630);
    static final Color GOLD       = PIcons.GOLD;
    static final Color GOLD_LIGHT = new Color(0xF3D27A);
    static final Color ORANGE     = new Color(0xE8A23A);
    static final Font  SERIF      = new Font("Serif", Font.PLAIN, 13);
    static final Font  SERIF_BOLD = new Font("Serif", Font.BOLD, 13);

    // ================= SIDEBAR =================
    private JPanel pnlSidebar;
    private JLabel lblLogo, lblTagline;
    private NavButton btnDashboard, btnReservations, btnRoomManagement, btnCheckInOut,
                      btnUserManagement, btnPayments, btnReports, btnSettings, btnLogout;

    // ================= TITLE ROW =================
    private JLabel lblTitleIcon, lblPageTitle, lblPageSubtitle;
    private GoldButton btnExportReport;

    // ================= STAT CARDS =================
    private CardPanel pnlTotalRevenue, pnlThisMonth, pnlPendingPayments, pnlCompletedPayments;

    private JLabel lblTotalIcon, lblTotalTitle, lblTotalValue, lblTotalNote;
    private JLabel lblThisMonthIcon, lblThisMonthTitle, lblThisMonthValue, lblThisMonthNote;
    private JLabel lblPendingIcon, lblPendingTitle, lblPendingValue, lblPendingNote;
    private JLabel lblCompletedIcon, lblCompletedTitle, lblCompletedValue, lblCompletedNote;

    // ================= CONSTRUCTOR =================
    public PaymentsFrame() {
        setTitle("The Grand Reserve Hotel - Payments");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        getContentPane().setBackground(NAVY);

        buildSidebar();
        add(pnlSidebar, BorderLayout.WEST);
        add(buildBody(), BorderLayout.CENTER);

        setSize(1100, 420);
        setLocationRelativeTo(null);
    }

    // ================= BUILD: SIDEBAR =================
    private void buildSidebar() {
        pnlSidebar = new JPanel();
        pnlSidebar.setLayout(new BoxLayout(pnlSidebar, BoxLayout.Y_AXIS));
        pnlSidebar.setBackground(NAVY);
        pnlSidebar.setPreferredSize(new Dimension(220, 0));
        pnlSidebar.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 0, 1, GOLD),
                BorderFactory.createEmptyBorder(16, 8, 16, 8)));

        lblLogo = new JLabel("<html><div style='text-align:center'>The Grand Reserve<br>"
                + "<span style='font-size:9px'>&mdash; HOTEL &mdash;</span></div></html>", SwingConstants.CENTER);
        lblLogo.setFont(new Font("Serif", Font.BOLD, 16));
        lblLogo.setForeground(GOLD);
        lblLogo.setAlignmentX(LEFT_ALIGNMENT);
        lblLogo.setMaximumSize(new Dimension(Integer.MAX_VALUE, 60));

        btnDashboard      = new NavButton("Dashboard",            PIcons.Type.HOME,     false);
        btnReservations   = new NavButton("Reservations",         PIcons.Type.CALENDAR, false);
        btnRoomManagement = new NavButton("Room Management",      PIcons.Type.BED,      false);
        btnCheckInOut     = new NavButton("Check-in / Check-out", PIcons.Type.SWAP,     false);
        btnUserManagement = new NavButton("User Management",      PIcons.Type.USERS,    false);
        btnPayments       = new NavButton("Payments",             PIcons.Type.CARD,     true);
        btnReports        = new NavButton("Reports",              PIcons.Type.CHART,    false);
        btnSettings       = new NavButton("Settings",             PIcons.Type.GEAR,     false);
        btnLogout         = new NavButton("Logout",               PIcons.Type.LOGOUT,   false);

        lblTagline = new JLabel("Luxury. Comfort. Excellence.", SwingConstants.CENTER);
        lblTagline.setFont(new Font("Serif", Font.ITALIC, 11));
        lblTagline.setForeground(GOLD);
        lblTagline.setAlignmentX(LEFT_ALIGNMENT);
        lblTagline.setMaximumSize(new Dimension(Integer.MAX_VALUE, 24));

        pnlSidebar.add(lblLogo);
        pnlSidebar.add(Box.createVerticalStrut(24));
        for (NavButton b : new NavButton[]{btnDashboard, btnReservations, btnRoomManagement, btnCheckInOut,
                btnUserManagement, btnPayments, btnReports, btnSettings, btnLogout}) {
            pnlSidebar.add(b);
            pnlSidebar.add(Box.createVerticalStrut(4));
        }
        pnlSidebar.add(Box.createVerticalGlue());
        pnlSidebar.add(lblTagline);
    }

    // ================= BUILD: TITLE + CARDS =================
    private JPanel buildBody() {
        JPanel pnlBody = new JPanel(new BorderLayout());
        pnlBody.setBackground(NAVY);
        pnlBody.setBorder(BorderFactory.createEmptyBorder(24, 16, 16, 16));

        // --- title row ---
        lblPageTitle = new JLabel("Payments");
        lblPageTitle.setFont(new Font("Serif", Font.BOLD, 26));
        lblPageTitle.setForeground(Color.WHITE);
        lblPageSubtitle = new JLabel("Track and manage all payments.");
        lblPageSubtitle.setFont(SERIF);
        lblPageSubtitle.setForeground(new Color(0xD0D4DC));

        JPanel pnlTitleText = new JPanel();
        pnlTitleText.setLayout(new BoxLayout(pnlTitleText, BoxLayout.Y_AXIS));
        pnlTitleText.setOpaque(false);
        pnlTitleText.add(lblPageTitle);
        pnlTitleText.add(lblPageSubtitle);

        JPanel pnlTitleLeft = new JPanel(new BorderLayout(14, 0));
        pnlTitleLeft.setOpaque(false);
        lblTitleIcon = new JLabel(PIcons.of(PIcons.Type.CARD, 52));
        pnlTitleLeft.add(lblTitleIcon, BorderLayout.WEST);
        pnlTitleLeft.add(pnlTitleText, BorderLayout.CENTER);

        btnExportReport = new GoldButton("Export Report", PIcons.Type.DOWNLOAD);
        btnExportReport.setPreferredSize(new Dimension(150, 38));
        JPanel pnlExportWrap = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 6));
        pnlExportWrap.setOpaque(false);
        pnlExportWrap.add(btnExportReport);

        JPanel pnlTitleRow = new JPanel(new BorderLayout());
        pnlTitleRow.setOpaque(false);
        pnlTitleRow.add(pnlTitleLeft, BorderLayout.WEST);
        pnlTitleRow.add(pnlExportWrap, BorderLayout.EAST);

        // --- stat cards ---
        Color up = new Color(0x4CD08A);

        lblTotalIcon  = new JLabel(PIcons.of(PIcons.Type.WALLET, 44));
        lblTotalTitle = cardTitle("Total Revenue");
        lblTotalValue = cardValue("R 48,750.00");
        lblTotalNote  = cardNote("\u2191 12% vs last month", up);
        pnlTotalRevenue = new CardPanel(lblTotalIcon, lblTotalTitle,
                                        lblTotalValue, lblTotalNote);

        lblThisMonthIcon  = new JLabel(PIcons.of(PIcons.Type.DOC, 44));
        lblThisMonthTitle = cardTitle("This Month");
        lblThisMonthValue = cardValue("R 28,500.00");
        lblThisMonthNote  = cardNote("\u2191 8% vs last month", up);
        pnlThisMonth = new CardPanel(lblThisMonthIcon, lblThisMonthTitle,
                                     lblThisMonthValue, lblThisMonthNote);

        lblPendingIcon  = new JLabel(PIcons.of(PIcons.Type.CARD, 44));
        lblPendingTitle = cardTitle("Pending Payments");
        lblPendingValue = cardValue("R 2,000.00");
        lblPendingNote  = cardNote("\u25CF 2 transactions", ORANGE);
        pnlPendingPayments = new CardPanel(lblPendingIcon, lblPendingTitle,
                                           lblPendingValue, lblPendingNote);

        lblCompletedIcon  = new JLabel(PIcons.of(PIcons.Type.CHECK, 44));
        lblCompletedTitle = cardTitle("Completed Payments");
        lblCompletedValue = cardValue("R 46,750.00");
        lblCompletedNote  = cardNote("\u2191 15% vs last month", up);
        pnlCompletedPayments = new CardPanel(lblCompletedIcon, lblCompletedTitle,
                                             lblCompletedValue, lblCompletedNote);

        JPanel pnlCards = new JPanel(new GridLayout(1, 4, 12, 0));
        pnlCards.setOpaque(false);
        pnlCards.setPreferredSize(new Dimension(0, 92));
        pnlCards.add(pnlTotalRevenue);
        pnlCards.add(pnlThisMonth);
        pnlCards.add(pnlPendingPayments);
        pnlCards.add(pnlCompletedPayments);

        JPanel pnlTop = new JPanel();
        pnlTop.setLayout(new BoxLayout(pnlTop, BoxLayout.Y_AXIS));
        pnlTop.setOpaque(false);
        pnlTop.add(pnlTitleRow);
        pnlTop.add(Box.createVerticalStrut(14));
        pnlTop.add(pnlCards);

        pnlBody.add(pnlTop, BorderLayout.NORTH);
        return pnlBody;
    }

    // ================= LABEL HELPERS =================
    private static JLabel cardTitle(String text) {
        JLabel l = new JLabel(text);
        l.setFont(SERIF.deriveFont(12f));
        l.setForeground(Color.WHITE);
        return l;
    }

    private static JLabel cardValue(String text) {
        JLabel l = new JLabel(text);
        l.setFont(new Font("Serif", Font.BOLD, 20));
        l.setForeground(GOLD);
        return l;
    }

    private static JLabel cardNote(String text, Color color) {
        JLabel l = new JLabel(text);
        l.setFont(SERIF.deriveFont(10f));
        l.setForeground(color);
        return l;
    }

    static void fillGold(Graphics2D g2, int w, int h, int arc) {
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setPaint(new GradientPaint(0, 0, GOLD_LIGHT, w, h, new Color(0xB8862B)));
        g2.fillRoundRect(0, 0, w - 1, h - 1, arc, arc);
    }

    // ================= CUSTOM COMPONENTS =================
    static class NavButton extends JButton {
        private final boolean selected;

        NavButton(String text, PIcons.Type type, boolean selected) {
            super(text);
            this.selected = selected;
            setIcon(PIcons.of(type, 22, selected ? NAVY : GOLD));
            setIconTextGap(16);
            setHorizontalAlignment(SwingConstants.LEFT);
            setFont(SERIF_BOLD);
            setForeground(selected ? NAVY : Color.WHITE);
            setContentAreaFilled(false);
            setBorderPainted(false);
            setFocusPainted(false);
            setBorder(BorderFactory.createEmptyBorder(0, 14, 0, 0));
            setAlignmentX(LEFT_ALIGNMENT);
            setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));
            setPreferredSize(new Dimension(200, 40));
            setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        }

        @Override protected void paintComponent(Graphics g) {
            if (selected) {
                Graphics2D g2 = (Graphics2D) g.create();
                fillGold(g2, getWidth(), getHeight(), 14);
                g2.dispose();
            }
            super.paintComponent(g);
        }
    }

    static class GoldButton extends JButton {
        GoldButton(String text, PIcons.Type icon) {
            super(text, PIcons.of(icon, 16, NAVY));
            setFont(SERIF_BOLD);
            setForeground(NAVY);
            setIconTextGap(8);
            setContentAreaFilled(false);
            setBorderPainted(false);
            setFocusPainted(false);
            setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        }

        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            fillGold(g2, getWidth(), getHeight(), 12);
            g2.dispose();
            super.paintComponent(g);
        }
    }

    static class CardPanel extends JPanel {
        CardPanel(JLabel icon, JLabel title, JLabel value, JLabel note) {
            setOpaque(false);
            setLayout(new BorderLayout(12, 0));
            setBorder(BorderFactory.createEmptyBorder(10, 14, 10, 14));

            JPanel text = new JPanel();
            text.setLayout(new BoxLayout(text, BoxLayout.Y_AXIS));
            text.setOpaque(false);
            text.add(title);
            text.add(value);
            text.add(note);

            add(icon, BorderLayout.WEST);
            add(text, BorderLayout.CENTER);
        }

        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(PANEL);
            g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 18, 18);
            g2.setColor(GOLD);
            g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 18, 18);
            g2.dispose();
        }
    }

    // ================= ICONS =================
    static class PIcons {

        public static final Color GOLD = new Color(0xE0B04A);

        public enum Type {
            HOME, CALENDAR, BED, SWAP, USERS, CARD, CHART, GEAR, LOGOUT,
            WALLET, DOC, CHECK, SEARCH, EYE, DOWNLOAD
        }

        public static Icon of(Type type, int size) {
            return of(type, size, GOLD);
        }

        public static Icon of(final Type type, final int size, final Color color) {
            return new Icon() {
                @Override
                public void paintIcon(Component c, Graphics g, int x, int y) {
                    Graphics2D g2 = (Graphics2D) g.create();
                    g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);
                    g2.translate(x, y);
                    g2.scale(size / 24.0, size / 24.0);
                    g2.setColor(color);
                    g2.setStroke(new BasicStroke(2f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
                    draw(g2, type);
                    g2.dispose();
                }

                @Override public int getIconWidth()  { return size; }
                @Override public int getIconHeight() { return size; }
            };
        }

        private static void line(Graphics2D g, double x1, double y1, double x2, double y2) {
            g.draw(new Line2D.Double(x1, y1, x2, y2));
        }

        private static void poly(Graphics2D g, boolean close, double... p) {
            Path2D.Double path = new Path2D.Double();
            path.moveTo(p[0], p[1]);
            for (int i = 2; i < p.length; i += 2) path.lineTo(p[i], p[i + 1]);
            if (close) path.closePath();
            g.draw(path);
        }

        private static void oval(Graphics2D g, double x, double y, double w, double h, boolean fill) {
            Ellipse2D.Double e = new Ellipse2D.Double(x, y, w, h);
            if (fill) g.fill(e); else g.draw(e);
        }

        private static void rrect(Graphics2D g, double x, double y, double w, double h, double r) {
            g.draw(new RoundRectangle2D.Double(x, y, w, h, r, r));
        }

        private static void box(Graphics2D g, double x, double y, double w, double h) {
            g.fill(new RoundRectangle2D.Double(x, y, w, h, 1.5, 1.5));
        }

        private static void draw(Graphics2D g, Type t) {
            switch (t) {
                case HOME:
                    poly(g, false, 3, 11, 12, 3, 21, 11);
                    poly(g, false, 5, 10, 5, 20, 19, 20, 19, 10);
                    box(g, 10, 14, 4, 6);
                    break;

                case CALENDAR:
                    rrect(g, 3, 5, 18, 16, 3);
                    line(g, 3, 10, 21, 10);
                    line(g, 8, 3, 8, 7);
                    line(g, 16, 3, 16, 7);
                    box(g, 7, 13, 2, 2); box(g, 11, 13, 2, 2); box(g, 15, 13, 2, 2);
                    box(g, 7, 17, 2, 2); box(g, 11, 17, 2, 2);
                    break;

                case BED:
                    line(g, 3, 6, 3, 19);
                    line(g, 3, 15, 21, 15);
                    line(g, 21, 15, 21, 19);
                    rrect(g, 5.5, 9, 5, 4, 2);
                    poly(g, false, 12, 13, 12, 10, 19, 10, 21, 12, 21, 15);
                    break;

                case SWAP:
                    line(g, 4, 8, 20, 8);
                    poly(g, false, 16, 4, 20, 8, 16, 12);
                    line(g, 20, 16, 4, 16);
                    poly(g, false, 8, 12, 4, 16, 8, 20);
                    break;

                case USERS:
                    oval(g, 6, 4, 6, 6, false);
                    g.draw(new Arc2D.Double(2.5, 14, 13, 12, 0, 180, Arc2D.OPEN));
                    oval(g, 14.5, 6, 4.5, 4.5, false);
                    g.draw(new Arc2D.Double(14.5, 15, 8, 8, 0, 180, Arc2D.OPEN));
                    break;

                case CARD:
                    rrect(g, 2, 5, 20, 14, 3);
                    g.fill(new Rectangle2D.Double(2, 9, 20, 3));
                    line(g, 5.5, 15.5, 9.5, 15.5);
                    break;

                case CHART:
                    box(g, 4, 12, 4, 8);
                    box(g, 10, 5, 4, 15);
                    box(g, 16, 9, 4, 11);
                    break;

                case GEAR:
                    oval(g, 5.5, 5.5, 13, 13, false);
                    oval(g, 9.5, 9.5, 5, 5, false);
                    for (int i = 0; i < 8; i++) {
                        double a = i * Math.PI / 4;
                        line(g, 12 + 6.5 * Math.cos(a), 12 + 6.5 * Math.sin(a),
                                12 + 9.5 * Math.cos(a), 12 + 9.5 * Math.sin(a));
                    }
                    break;

                case LOGOUT:
                    poly(g, false, 10, 4, 4, 4, 4, 20, 10, 20);
                    line(g, 9, 12, 20, 12);
                    poly(g, false, 16, 8, 20, 12, 16, 16);
                    break;

                case WALLET:
                    rrect(g, 3, 6, 18, 14, 3);
                    poly(g, false, 5, 6, 16, 3, 17, 6);
                    oval(g, 14.5, 11.5, 3.5, 3.5, true);
                    break;

                case DOC:
                    poly(g, true, 6, 3, 15, 3, 19, 7, 19, 21, 6, 21);
                    line(g, 9, 12, 16, 12);
                    line(g, 9, 16, 16, 16);
                    break;

                case CHECK:
                    oval(g, 3, 3, 18, 18, false);
                    poly(g, false, 8, 12, 11, 15, 16, 9);
                    break;

                case SEARCH:
                    oval(g, 4, 4, 12, 12, false);
                    line(g, 14, 14, 20, 20);
                    break;

                case EYE:
                    Path2D.Double eye = new Path2D.Double();
                    eye.moveTo(2, 12);
                    eye.quadTo(12, 2, 22, 12);
                    eye.quadTo(12, 22, 2, 12);
                    g.draw(eye);
                    oval(g, 9.5, 9.5, 5, 5, true);
                    break;

                case DOWNLOAD:
                    line(g, 12, 4, 12, 15);
                    poly(g, false, 7, 10, 12, 15, 17, 10);
                    line(g, 4, 20, 20, 20);
                    break;
            }
        }
    }

    // ================= RUN =================
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new PaymentsFrame().setVisible(true));
    }
}
