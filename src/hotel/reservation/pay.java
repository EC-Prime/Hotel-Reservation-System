/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
package hotel.reservation;

import hotel.reservation.pay.PIcons.BarChartPanel;
import hotel.reservation.pay.PIcons.DonutPanel;
import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.BasicStroke;
import java.awt.Insets;
import java.awt.RenderingHints;
import javax.swing.border.AbstractBorder;
import javax.swing.JTable;
import javax.swing.table.*;
import javax.swing.table.JTableHeader;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.BorderFactory;
import javax.swing.table.TableCellRenderer;
import java.awt.event.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.awt.geom.*;

/**
 *
 * @author DCS Admin
 */
public class pay extends javax.swing.JFrame {

    private static final java.util.logging.Logger logger = java.util.logging.Logger.getLogger(pay.class.getName());

    /**
     * Creates new form pay
     */
    public pay() {
        initComponents();

      lblSearchMessage.setText(" ");
lblSearchMessage.setFont(new Font("Serif", Font.ITALIC, 12));
lblSearchMessage.setForeground(new Color(0xF0A0A0));   // soft red
        
        Color cardGold = new Color(0xE3CF6E);
        Color cardInner = new Color(0x8A7A2E);

        javax.swing.border.Border cardBorder = BorderFactory.createCompoundBorder(
                new javax.swing.border.LineBorder(cardGold, 3, true),
                new javax.swing.border.LineBorder(cardInner, 1, true));

        pnlTotalRevenue.setBorder(cardBorder);
        pnlThisMonth.setBorder(cardBorder);
        pnlPendingPayments.setBorder(cardBorder);//
        pnlCompletedPayments.setBorder(cardBorder);

        JPanel crownLogo = new JPanel() {

            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);

                Graphics2D g2 = (Graphics2D) g.create();

                g2.setRenderingHint(
                        RenderingHints.KEY_ANTIALIASING,
                        RenderingHints.VALUE_ANTIALIAS_ON
                );

                // Gold gradient
                GradientPaint gold = new GradientPaint(
                        0, 20, new Color(255, 225, 145),
                        120, 120, new Color(176, 116, 30)
                );

                g2.setPaint(gold);
                g2.setStroke(new BasicStroke(3f,
                        BasicStroke.CAP_ROUND,
                        BasicStroke.JOIN_ROUND));

                // Outer circular frame
                g2.draw(new Arc2D.Double(
                        8, 5, 134, 134, 25, 310, Arc2D.OPEN
                ));

                // Crown shape
                Path2D crown = new Path2D.Double();

                crown.moveTo(25, 48);
                crown.curveTo(18, 28, 35, 25, 45, 43);
                crown.curveTo(48, 30, 55, 23, 75, 12);
                crown.curveTo(95, 23, 102, 30, 105, 43);
                crown.curveTo(115, 25, 132, 28, 125, 48);
                crown.lineTo(112, 95);
                crown.curveTo(90, 103, 60, 103, 38, 95);
                crown.closePath();

                g2.fill(crown);

                // Crown outline
                g2.setColor(new Color(255, 220, 135));
                g2.draw(crown);

                // Crown base
                g2.setStroke(new BasicStroke(5f));
                g2.draw(new QuadCurve2D.Double(
                        38, 94, 75, 110, 112, 94
                ));

                // Jewels
                g2.fillOval(20, 40, 11, 11);
                g2.fillOval(70, 5, 11, 11);
                g2.fillOval(119, 40, 11, 11);

                // Centre diamond
                Path2D diamond = new Path2D.Double();
                diamond.moveTo(75, 43);
                diamond.lineTo(86, 55);
                diamond.lineTo(75, 67);
                diamond.lineTo(64, 55);
                diamond.closePath();

                g2.fill(diamond);

                // Decorative bottom diamond
                Path2D jewel = new Path2D.Double();
                jewel.moveTo(75, 117);
                jewel.lineTo(84, 127);
                jewel.lineTo(75, 137);
                jewel.lineTo(66, 127);
                jewel.closePath();

                g2.fill(jewel);

                g2.dispose();
            }
        };

        crownLogo.setOpaque(false);
        crownLogo.setBounds(20, 10, 150, 150);

        pnlPayments.add(crownLogo);
        crownLogo.repaint();

        stylePaymentsTable();
        addGoldAnimation();

        LocalDate today = LocalDate.now();

        DateTimeFormatter formatter
                = DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy");

        lblDate.setText(today.format(formatter));

        // Revenue
        lblRevenueChange.setText("↑ 12%");
        lblRevenueChange.setForeground(new Color(46, 204, 113));

// This Month
        lblThisMonthChange.setText("↑ 8%");
        lblThisMonthChange.setForeground(new Color(46, 204, 113));

// Pending Payments
        lblPendingChange.setText("◷");
        lblPendingChange.setForeground(new Color(255, 193, 7));
// Completed Payments
        lblCompletedChange.setText("↑ 10% ");
        lblCompletedChange.setForeground(new Color(46, 204, 113));

// Font styling
        Font indicatorFont = new Font("Segoe UI", Font.BOLD, 11);

        lblRevenueChange.setFont(indicatorFont);
        lblThisMonthChange.setFont(indicatorFont);
        lblPendingChange.setFont(indicatorFont);
        lblCompletedChange.setFont(indicatorFont);

        pnlSearchBar.setBorder(
                javax.swing.BorderFactory.createCompoundBorder(
                        new RoundedBorder(15, new java.awt.Color(170, 160, 130)),
                        javax.swing.BorderFactory.createEmptyBorder(3, 8, 3, 8)
                )
        );

        String placeholder = "Search by reservation ID, guest name or payment reference...";

        txtSearch.setText(placeholder);
        txtSearch.setForeground(Color.GRAY);

        txtSearch.addFocusListener(new java.awt.event.FocusAdapter() {

            @Override
            public void focusGained(java.awt.event.FocusEvent evt) {
                if (txtSearch.getText().equals(placeholder)) {
                    txtSearch.setText("");
                    txtSearch.setForeground(Color.WHITE);
                }
            }

            @Override
            public void focusLost(java.awt.event.FocusEvent evt) {
                if (txtSearch.getText().trim().isEmpty()) {
                    txtSearch.setText(placeholder);
                    txtSearch.setForeground(Color.GRAY);
                }
            }
        });

        lblDay.setText(today.format(java.time.format.DateTimeFormatter.ofPattern("EEEE")));        // Monday
        lblDate.setText(today.format(java.time.format.DateTimeFormatter.ofPattern("MMM d, yyyy"))); // Nov 23, 2026

        lblDay.setIcon(PIcons.of(PIcons.Type.CALENDAR, 22));   // optional calendar icon
        lblDay.setIconTextGap(10);

        lblTitleIcon.setIcon(PIcons.of(PIcons.Type.CARD, 52));
        lblTotalIcon.setIcon(PIcons.of(PIcons.Type.WALLET, 44));
        lblThisMonthIcon.setIcon(PIcons.of(PIcons.Type.DOC, 44));
        lblPendingIcon.setIcon(PIcons.of(PIcons.Type.CARD, 44));
        lblCompletedIcon.setIcon(PIcons.of(PIcons.Type.CHECK, 44));

        btnDashboard.setIcon(PIcons.of(PIcons.Type.HOME, 22));
        btnReservation.setIcon(PIcons.of(PIcons.Type.CALENDAR, 22));
        btnRoomManagement.setIcon(PIcons.of(PIcons.Type.BED, 22));
        btnCheckInOut.setIcon(PIcons.of(PIcons.Type.SWAP, 22));
        btnUserManagement.setIcon(PIcons.of(PIcons.Type.USERS, 22));
        btnPayments.setIcon(PIcons.of(PIcons.Type.CARD, 22, new Color(0x070D1F)));  // dark, because the button is goldns.of(PIcons.Type.CHART, 22));
        btnSettings.setIcon(PIcons.of(PIcons.Type.GEAR, 22));
        btnLogout.setIcon(PIcons.of(PIcons.Type.LOGOUT, 22));

    }

    private void stylePaymentsTable() {

        Color navy = new Color(11, 22, 40);
        Color darkNavy = new Color(18, 32, 54);
        Color alternateNavy = new Color(15, 29, 49);
        Color gold = new Color(255, 215, 0);

        // Table appearance
        tblPayments.setBackground(navy);
        tblPayments.setForeground(new Color(240, 244, 255));
        tblPayments.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        tblPayments.setRowHeight(62);

        tblPayments.setShowGrid(true);
        tblPayments.setGridColor(new Color(35, 51, 72));
        tblPayments.setIntercellSpacing(new Dimension(1, 1));

        tblPayments.setSelectionBackground(new Color(28, 53, 85));
        tblPayments.setSelectionForeground(Color.WHITE);

        tblPayments.setFillsViewportHeight(true);
        tblPayments.setBorder(null);

        // Table header
        JTableHeader header = tblPayments.getTableHeader();

        header.setPreferredSize(new Dimension(0, 43));
        header.setDefaultRenderer(new PaymentHeaderRenderer());
        header.setReorderingAllowed(false);
        header.setResizingAllowed(true);
        header.setBackground(darkNavy);
        header.setForeground(gold);
        header.setOpaque(true);

        // Guest details renderer
        tblPayments.getColumnModel().getColumn(1)
                .setCellRenderer(new GuestDetailsRenderer());

        // Status renderer
        tblPayments.getColumnModel().getColumn(5)
                .setCellRenderer(new PaymentStatusRenderer());

        // Column widths
        int[] widths = {95, 180, 100, 115, 115, 125};

        for (int i = 0; i < widths.length; i++) {
            tblPayments.getColumnModel()
                    .getColumn(i).setPreferredWidth(widths[i]);
        }

    }

    private class GoldParticlePanel extends JPanel {

        private final int COUNT = 35;

        private int[] x = new int[COUNT];
        private int[] y = new int[COUNT];
        private int[] size = new int[COUNT];
        private int[] speed = new int[COUNT];
        private int[] alpha = new int[COUNT];

        private final java.util.Random random = new java.util.Random();

        public GoldParticlePanel() {

            setOpaque(false);

            for (int i = 0; i < COUNT; i++) {
                x[i] = random.nextInt(250);
                y[i] = random.nextInt(650);
                size[i] = 2 + random.nextInt(4);
                speed[i] = 1 + random.nextInt(3);
                alpha[i] = 80 + random.nextInt(150);
            }

            new javax.swing.Timer(40, e -> {

                for (int i = 0; i < COUNT; i++) {

                    y[i] -= speed[i];
                    alpha[i] -= 1;

                    if (y[i] < 0 || alpha[i] <= 0) {
                        x[i] = random.nextInt(Math.max(1, getWidth()));
                        y[i] = getHeight();
                        alpha[i] = 100 + random.nextInt(155);
                    }
                }

                repaint();

            }).start();
        }

        @Override
        protected void paintComponent(java.awt.Graphics g) {

            super.paintComponent(g);

            java.awt.Graphics2D g2
                    = (java.awt.Graphics2D) g.create();

            g2.setRenderingHint(
                    java.awt.RenderingHints.KEY_ANTIALIASING,
                    java.awt.RenderingHints.VALUE_ANTIALIAS_ON
            );

            for (int i = 0; i < COUNT; i++) {

                g2.setColor(new java.awt.Color(
                        255, 215, 0, Math.max(0, alpha[i])
                ));

                g2.fillOval(x[i], y[i], size[i], size[i]);
            }

            g2.dispose();
        }
    }

    private void addGoldAnimation() {

        PnlSideBar.setLayout(null);

        GoldParticlePanel particles = new GoldParticlePanel();

        particles.setBounds(
                0, 0,
                PnlSideBar.getWidth(),
                PnlSideBar.getHeight()
        );

        PnlSideBar.add(particles, 0);

        // Keep the particles behind the navigation buttons
        PnlSideBar.setComponentZOrder(
                particles,
                PnlSideBar.getComponentCount() - 1
        );

        PnlSideBar.revalidate();
        PnlSideBar.repaint();
    }

    class PaymentHeaderRenderer extends DefaultTableCellRenderer {

        public PaymentHeaderRenderer() {
            setHorizontalAlignment(CENTER);
            setBackground(new Color(18, 32, 54));
            setForeground(new Color(255, 215, 0));
            setFont(new Font("Georgia", Font.BOLD, 11));
            setOpaque(true);
            setBorder(BorderFactory.createEmptyBorder(8, 5, 8, 5));
        }

        @Override
        public Component getTableCellRendererComponent(
                JTable table, Object value, boolean selected,
                boolean focused, int row, int column) {

            super.getTableCellRendererComponent(
                    table, value, selected, focused, row, column);

            setBackground(new Color(18, 32, 54));
            setForeground(new Color(255, 215, 0));

            return this;
        }
    }

    class GuestDetailsRenderer extends DefaultTableCellRenderer {

        public GuestDetailsRenderer() {
            setHorizontalAlignment(LEFT);
            setVerticalAlignment(CENTER);
            setFont(new Font("Segoe UI", Font.PLAIN, 12));
            setBorder(BorderFactory.createEmptyBorder(5, 10, 5, 5));
        }

        @Override
        public Component getTableCellRendererComponent(
                JTable table, Object value, boolean selected,
                boolean focused, int row, int column) {

            super.getTableCellRendererComponent(
                    table, value, selected, focused, row, column);

            String details = value == null ? "" : value.toString();

            details = details.replace(" · ", "<br>")
                    .replace("\n", "<br>");

            setText("<html>" + details + "</html>");

            if (selected) {
                setBackground(new Color(28, 53, 85));
                setForeground(Color.WHITE);
            } else {
                setBackground(row % 2 == 0
                        ? new Color(11, 22, 40)
                        : new Color(15, 29, 49));
                setForeground(new Color(240, 244, 255));
            }

            return this;
        }
    }

    static class PillBorder extends javax.swing.border.AbstractBorder {

        private final Color outer, inner;

        PillBorder(Color outer, Color inner) {
            this.outer = outer;
            this.inner = inner;
        }

        @Override
        public void paintBorder(Component c, Graphics g, int x, int y, int w, int h) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(outer);
            g2.setStroke(new BasicStroke(3f));
            g2.drawRoundRect(x + 1, y + 1, w - 3, h - 3, h - 3, h - 3);
            g2.setColor(inner);
            g2.setStroke(new BasicStroke(1f));
            g2.drawRoundRect(x + 5, y + 5, w - 11, h - 11, h - 11, h - 11);
            g2.dispose();
        }

        @Override
        public Insets getBorderInsets(Component c) {
            return new Insets(8, 18, 8, 12);
        }
    }

    class PaymentStatusRenderer extends JLabel
            implements TableCellRenderer {

        private Color badgeColor;

        public PaymentStatusRenderer() {
            setHorizontalAlignment(CENTER);
            setVerticalAlignment(CENTER);
            setFont(new Font("Segoe UI", Font.BOLD, 11));
            setOpaque(false);
        }

        public Component getTableCellRendererComponent(
                JTable table, Object value, boolean selected,
                boolean focused, int row, int column) {

            String status = value == null ? "" : value.toString();

            setText(status);

            if (status.equalsIgnoreCase("Completed")) {
                badgeColor = new Color(31, 130, 82);
                setForeground(new Color(180, 255, 210));

            } else if (status.equalsIgnoreCase("Pending")) {
                badgeColor = new Color(145, 48, 55);
                setForeground(new Color(255, 190, 190));

            } else if (status.equalsIgnoreCase("Failed")) {
                badgeColor = new Color(145, 48, 55);
                setForeground(Color.WHITE);

            } else {
                badgeColor = new Color(75, 85, 100);
                setForeground(Color.WHITE);
            }

            return this;
        }

        @Override
        protected void paintComponent(Graphics g) {

            Graphics2D g2 = (Graphics2D) g.create();

            g2.setRenderingHint(
                    RenderingHints.KEY_ANTIALIASING,
                    RenderingHints.VALUE_ANTIALIAS_ON);

            int width = getWidth() - 20;
            int height = 27;
            int x = (getWidth() - width) / 2;
            int y = (getHeight() - height) / 2;

            g2.setColor(badgeColor);
            g2.fillRoundRect(x, y, width, height, 18, 18);

            g2.setColor(badgeColor.brighter());
            g2.setStroke(new BasicStroke(1f));
            g2.drawRoundRect(x, y, width, height, 18, 18);

            g2.dispose();

            super.paintComponent(g);
        }
    }

    class RoundedBorder extends AbstractBorder {

        private final int radius;
        private final Color color;

        public RoundedBorder(int radius, Color color) {
            this.radius = radius;
            this.color = color;
        }

        @Override
        public void paintBorder(Component c, Graphics g,
                int x, int y, int width, int height) {

            Graphics2D g2 = (Graphics2D) g.create();

            g2.setRenderingHint(
                    RenderingHints.KEY_ANTIALIASING,
                    RenderingHints.VALUE_ANTIALIAS_ON
            );

            g2.setColor(color);
            g2.setStroke(new BasicStroke(1.5f));
            g2.drawRoundRect(x, y, width - 1, height - 1, radius, radius);

            g2.dispose();
        }

        @Override
        public Insets getBorderInsets(Component c) {
            return new Insets(5, 8, 5, 8);
        }
    }

    static class PIcons {

        public static final Color GOLD = new Color(0xE0B04A);

        public enum Type {
            HOME, CALENDAR, BED, SWAP, USERS, CARD, CHART, GEAR, LOGOUT,
            WALLET, DOC, CHECK
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
                    g2.translate(x, y);
                    g2.scale(size / 24.0, size / 24.0);
                    g2.setColor(color);
                    g2.setStroke(new BasicStroke(2f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
                    draw(g2, type);
                    g2.dispose();
                }

                @Override
                public int getIconWidth() {
                    return size;
                }

                @Override
                public int getIconHeight() {
                    return size;
                }
            };
        }

        private static void line(Graphics2D g, double x1, double y1, double x2, double y2) {
            g.draw(new Line2D.Double(x1, y1, x2, y2));
        }

        private static void poly(Graphics2D g, boolean close, double... p) {
            Path2D.Double path = new Path2D.Double();
            path.moveTo(p[0], p[1]);
            for (int i = 2; i < p.length; i += 2) {
                path.lineTo(p[i], p[i + 1]);
            }
            if (close) {
                path.closePath();
            }
            g.draw(path);
        }

        private static void oval(Graphics2D g, double x, double y, double w, double h, boolean fill) {
            Ellipse2D.Double e = new Ellipse2D.Double(x, y, w, h);
            if (fill) {
                g.fill(e);
            } else {
                g.draw(e);
            }
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
                    box(g, 7, 13, 2, 2);
                    box(g, 11, 13, 2, 2);
                    box(g, 15, 13, 2, 2);
                    box(g, 7, 17, 2, 2);
                    box(g, 11, 17, 2, 2);
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
            }
        }

        static class BarChartPanel extends JPanel {

            private String[] months = {"Jul", "Aug", "Sep", "Oct", "Nov"};
            private double[] revenue = {32000, 40000, 47000, 51000, 60000};

            BarChartPanel() {
                setOpaque(false);
            }

            public void setData(String[] months, double[] revenue) {
                this.months = months;
                this.revenue = revenue;
                repaint();
            }

            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                Color gold = new Color(0xE0B04A);

                g2.setColor(new Color(0x0D1630));
                g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 18, 18);
                g2.setColor(gold);
                g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 18, 18);

                PIcons.of(PIcons.Type.CHART, 18).paintIcon(this, g2, 14, 10);
                g2.setFont(new Font("Serif", Font.BOLD, 13));
                g2.drawString("Revenue Overview", 38, 25);

                double max = 20000;
                for (double v : revenue) {
                    max = Math.max(max, v);
                }
                int steps = (int) Math.ceil(max / 20000.0);
                double top = steps * 20000.0;

                int left = 56, right = 20, topPad = 44, bottom = 26;
                int w = getWidth() - left - right;
                int h = getHeight() - topPad - bottom;

                g2.setFont(new Font("Serif", Font.PLAIN, 10));
                for (int i = 0; i <= steps; i++) {
                    int y = topPad + h - (int) (i * h / (double) steps);
                    g2.setColor(new Color(0x2A2F45));
                    g2.drawLine(left, y, left + w, y);
                    g2.setColor(Color.WHITE);
                    g2.drawString(i == 0 ? "R0" : "R" + (i * 20) + "k", 14, y + 4);
                }

                int slot = w / months.length;
                int barW = (int) (slot * 0.45);
                for (int i = 0; i < months.length; i++) {
                    int barH = (int) (revenue[i] / top * h);
                    int x = left + i * slot + (slot - barW) / 2;
                    int y = topPad + h - barH;
                    g2.setPaint(new GradientPaint(0, y, new Color(0xF3D27A), 0, y + barH, new Color(0xB8862B)));
                    g2.fillRoundRect(x, y, barW, barH, 4, 4);
                    g2.setColor(Color.WHITE);
                    int tw = g2.getFontMetrics().stringWidth(months[i]);
                    g2.drawString(months[i], x + (barW - tw) / 2, topPad + h + 16);
                }
                g2.dispose();
            }
        }

        static class DonutPanel extends JPanel {

            private String[] labels = {"Card Payments", "Cash Payments", "Bank Transfer"};
            private int[] percent = {45, 35, 20};
            private final Color[] colors = {new Color(0xE0B04A), new Color(0x5B84C4), new Color(0x4FB3B3)};

            DonutPanel() {
                setOpaque(false);
            }

            public void setData(int[] percent) {
                this.percent = percent;
                repaint();
            }

            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                Color gold = new Color(0xE0B04A);

                g2.setColor(new Color(0x0D1630));
                g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 18, 18);
                g2.setColor(gold);
                g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 18, 18);

                // small pie icon + title
                g2.fillArc(14, 10, 16, 16, 0, 270);
                g2.fillArc(16, 8, 16, 16, 0, 85);
                g2.setFont(new Font("Serif", Font.BOLD, 13));
                g2.drawString("Payment Methods", 40, 25);

                int d = Math.min(getHeight() - 60, 140);
                int cx = 40, cy = 40;
                double start = 90;
                g2.setStroke(new BasicStroke(22f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_ROUND));
                for (int i = 0; i < percent.length; i++) {
                    double extent = -percent[i] * 3.6;
                    g2.setColor(colors[i]);
                    g2.draw(new Arc2D.Double(cx + 11, cy + 11, d - 22, d - 22, start, extent, Arc2D.OPEN));
                    start += extent;
                }

                g2.setColor(Color.WHITE);
                g2.setFont(new Font("Serif", Font.BOLD, 16));
                String big = "100%";
                g2.drawString(big, cx + (d - g2.getFontMetrics().stringWidth(big)) / 2, cy + d / 2);
                g2.setFont(new Font("Serif", Font.PLAIN, 10));
                String small = "Total";
                g2.drawString(small, cx + (d - g2.getFontMetrics().stringWidth(small)) / 2, cy + d / 2 + 14);

                int lx = cx + d + 40, ly = cy + d / 2 - 28;
                g2.setFont(new Font("Serif", Font.PLAIN, 11));
                for (int i = 0; i < labels.length; i++) {
                    int y = ly + i * 24;
                    g2.setColor(colors[i]);
                    g2.fillOval(lx, y - 8, 9, 9);
                    g2.setColor(Color.WHITE);
                    g2.drawString(labels[i], lx + 16, y);
                    String pct = percent[i] + "%";
                    g2.drawString(pct, getWidth() - 24 - g2.getFontMetrics().stringWidth(pct), y);
                }
                g2.dispose();
            }
        }
        
         

        static class PillBorder extends javax.swing.border.AbstractBorder {

            private final Color outer, inner;

            PillBorder(Color outer, Color inner) {
                this.outer = outer;
                this.inner = inner;
            }

            @Override
            public void paintBorder(Component c, Graphics g, int x, int y, int w, int h) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(outer);
                g2.setStroke(new BasicStroke(3f));
                g2.drawRoundRect(x + 1, y + 1, w - 3, h - 3, h - 3, h - 3);
                g2.setColor(inner);
                g2.setStroke(new BasicStroke(1f));
                g2.drawRoundRect(x + 5, y + 5, w - 11, h - 11, h - 11, h - 11);
                g2.dispose();
            }

            @Override
            public Insets getBorderInsets(Component c) {
                return new Insets(8, 18, 8, 12);
            }
        }
   

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
        pnlPayments = new javax.swing.JPanel();
        jLabel23 = new javax.swing.JLabel();
        jLabel26 = new javax.swing.JLabel();
        lblday = new javax.swing.JLabel();
        lbldate = new javax.swing.JLabel();
        jPanel4 = new SwooshPanel();
        jSeparator3 = new javax.swing.JSeparator();
        PnlSideBar = new javax.swing.JPanel();
        btnDashboard = new javax.swing.JButton();
        btnRoomManagement = new javax.swing.JButton();
        btnPayments = new javax.swing.JButton();
        btnCheckInOut = new javax.swing.JButton();
        btnLogout = new javax.swing.JButton();
        btnUserManagement = new javax.swing.JButton();
        lblSettingsIcon = new javax.swing.JLabel();
        jSeparator5 = new javax.swing.JSeparator();
        jLabel38 = new javax.swing.JLabel();
        jLabel39 = new javax.swing.JLabel();
        jLabel40 = new javax.swing.JLabel();
        btnSettings = new javax.swing.JButton();
        btnReservation = new javax.swing.JButton();
        navActive = new javax.swing.JLabel();
        jSeparator1 = new javax.swing.JSeparator();
        jLabel41 = new javax.swing.JLabel();
        jLabel42 = new javax.swing.JLabel();
        jLabel43 = new javax.swing.JLabel();
        jLabel27 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        lblTitleIcon = new javax.swing.JLabel();
        lblday1 = new javax.swing.JLabel();
        lbldate1 = new javax.swing.JLabel();
        lblday2 = new javax.swing.JLabel();
        lblDate = new javax.swing.JLabel();
        lblDay = new javax.swing.JLabel();
        jPanel6 = new javax.swing.JPanel();
        lblThisMonthIcon = new javax.swing.JLabel();
        jLabel11 = new javax.swing.JLabel();
        jLabel16 = new javax.swing.JLabel();
        jLabel18 = new javax.swing.JLabel();
        jPanel7 = new javax.swing.JPanel();
        lblTotalRevenueIcon = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        jLabel15 = new javax.swing.JLabel();
        jLabel17 = new javax.swing.JLabel();
        jPanel2 = new SwooshPanel();
        jPanel12 = new javax.swing.JPanel();
        lblTotalRevenueIcon2 = new javax.swing.JLabel();
        jLabel36 = new javax.swing.JLabel();
        jLabel37 = new javax.swing.JLabel();
        jLabel53 = new javax.swing.JLabel();
        pnlThisMonth = new javax.swing.JPanel();
        lblThisMonth = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        m = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        lblThisMonthChange = new javax.swing.JLabel();
        pnlPendingPayments = new javax.swing.JPanel();
        lblPendingIcon = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        p = new javax.swing.JLabel();
        jLabel13 = new javax.swing.JLabel();
        lblPendingChange = new javax.swing.JLabel();
        pnlTotalRevenue = new javax.swing.JPanel();
        lblTotalIcon = new javax.swing.JLabel();
        jLabel19 = new javax.swing.JLabel();
        r = new javax.swing.JLabel();
        jLabel21 = new javax.swing.JLabel();
        lblRevenueChange = new javax.swing.JLabel();
        pnlCompletedPayments = new javax.swing.JPanel();
        lblCompletedIcon = new javax.swing.JLabel();
        jLabel24 = new javax.swing.JLabel();
        c = new javax.swing.JLabel();
        jLabel28 = new javax.swing.JLabel();
        lblCompletedChange = new javax.swing.JLabel();
        pnlRevenueOverview = new BarChartPanel();
        pnlPaymentMethods = new DonutPanel();
        pnlSearchBar = new javax.swing.JPanel();
        txtSearch = new javax.swing.JTextField();
        lblSearchIcon = new javax.swing.JLabel();
        btnSearch = new javax.swing.JButton();
        lblSearchMessage = new javax.swing.JLabel();
        lblPaymentRecords = new javax.swing.JLabel();
        jLabel1 = new javax.swing.JLabel();
        pnlPaymentTable = new javax.swing.JPanel();
        jScrollPane2 = new javax.swing.JScrollPane();
        tblPayments = new javax.swing.JTable();
        btnAddUser = new javax.swing.JButton();
        pa = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        pnlPayments.setBackground(new java.awt.Color(18, 32, 54));

        jLabel23.setFont(new java.awt.Font("Georgia", 1, 36)); // NOI18N
        jLabel23.setForeground(new java.awt.Color(245, 247, 250));
        jLabel23.setText("ROYAL HAVEN");

        jLabel26.setFont(new java.awt.Font("SansSerif", 0, 10)); // NOI18N
        jLabel26.setForeground(new java.awt.Color(233, 196, 91));
        jLabel26.setText("BOUTIQUE & SPA");

        lblday.setFont(new java.awt.Font("Georgia", 0, 24)); // NOI18N
        lblday.setForeground(new java.awt.Color(233, 196, 91));
        lblday.setText("FRIDAY");

        lbldate.setFont(new java.awt.Font("Segoe UI", 0, 14)); // NOI18N
        lbldate.setForeground(new java.awt.Color(233, 196, 91));
        lbldate.setText("20 November 2026");

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 500, Short.MAX_VALUE)
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 35, Short.MAX_VALUE)
        );

        jSeparator3.setBackground(new java.awt.Color(233, 196, 91));
        jSeparator3.setForeground(new java.awt.Color(233, 196, 91));

        PnlSideBar.setBackground(new java.awt.Color(11, 22, 40));

        btnDashboard.setBackground(new java.awt.Color(28, 53, 85));
        btnDashboard.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        btnDashboard.setForeground(new java.awt.Color(245, 247, 250));
        btnDashboard.setText("Dashboard");
        btnDashboard.setBorderPainted(false);
        btnDashboard.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnDashboard.setFocusPainted(false);
        btnDashboard.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btnDashboard.addActionListener(this::btnDashboardActionPerformed);

        btnRoomManagement.setBackground(new java.awt.Color(11, 22, 40));
        btnRoomManagement.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        btnRoomManagement.setForeground(new java.awt.Color(245, 247, 250));
        btnRoomManagement.setText("Room Management");
        btnRoomManagement.setBorderPainted(false);
        btnRoomManagement.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnRoomManagement.setFocusPainted(false);
        btnRoomManagement.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btnRoomManagement.setOpaque(true);
        btnRoomManagement.addActionListener(this::btnRoomManagementActionPerformed);

        btnPayments.setBackground(new java.awt.Color(11, 22, 40));
        btnPayments.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        btnPayments.setForeground(new java.awt.Color(245, 247, 250));
        btnPayments.setText("Payments");
        btnPayments.setBorderPainted(false);
        btnPayments.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnPayments.setFocusPainted(false);
        btnPayments.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btnPayments.setOpaque(true);
        btnPayments.addActionListener(this::btnPaymentsActionPerformed);

        btnCheckInOut.setBackground(new java.awt.Color(11, 22, 40));
        btnCheckInOut.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        btnCheckInOut.setForeground(new java.awt.Color(245, 247, 250));
        btnCheckInOut.setText("Check-in / Check-out");
        btnCheckInOut.setBorderPainted(false);
        btnCheckInOut.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnCheckInOut.setFocusPainted(false);
        btnCheckInOut.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btnCheckInOut.setOpaque(true);
        btnCheckInOut.addActionListener(this::btnCheckInOutActionPerformed);

        btnLogout.setBackground(new java.awt.Color(11, 22, 40));
        btnLogout.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        btnLogout.setForeground(new java.awt.Color(245, 247, 250));
        btnLogout.setText("Logout");
        btnLogout.setBorderPainted(false);
        btnLogout.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnLogout.setFocusPainted(false);
        btnLogout.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btnLogout.setOpaque(true);
        btnLogout.addActionListener(this::btnLogoutActionPerformed);

        btnUserManagement.setBackground(new java.awt.Color(11, 22, 40));
        btnUserManagement.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        btnUserManagement.setForeground(new java.awt.Color(245, 247, 250));
        btnUserManagement.setText("User Management");
        btnUserManagement.setBorderPainted(false);
        btnUserManagement.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnUserManagement.setFocusPainted(false);
        btnUserManagement.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btnUserManagement.setOpaque(true);
        btnUserManagement.addActionListener(this::btnUserManagementActionPerformed);

        jSeparator5.setForeground(new java.awt.Color(48, 65, 88));

        jLabel38.setBackground(new java.awt.Color(28, 53, 85));
        jLabel38.setIcon(new javax.swing.ImageIcon(getClass().getResource("/icons/admin.png"))); // NOI18N

        jLabel39.setFont(new java.awt.Font("SansSerif", 1, 14)); // NOI18N
        jLabel39.setForeground(new java.awt.Color(143, 160, 188));
        jLabel39.setText("Administrator");

        jLabel40.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        jLabel40.setForeground(new java.awt.Color(143, 160, 188));
        jLabel40.setText("Hotel Staff");

        btnSettings.setBackground(new java.awt.Color(11, 22, 40));
        btnSettings.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        btnSettings.setForeground(new java.awt.Color(245, 247, 250));
        btnSettings.setText("Settings");
        btnSettings.setBorderPainted(false);
        btnSettings.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnSettings.setFocusPainted(false);
        btnSettings.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btnSettings.setOpaque(true);
        btnSettings.addActionListener(this::btnSettingsActionPerformed);

        btnReservation.setBackground(new java.awt.Color(11, 22, 40));
        btnReservation.setFont(new java.awt.Font("SansSerif", 0, 13)); // NOI18N
        btnReservation.setForeground(new java.awt.Color(245, 247, 250));
        btnReservation.setText("Reservations");
        btnReservation.setBorderPainted(false);
        btnReservation.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnReservation.setFocusPainted(false);
        btnReservation.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        btnReservation.setOpaque(true);
        btnReservation.addActionListener(this::btnReservationActionPerformed);

        navActive.setFont(new java.awt.Font("Segoe UI", 0, 28)); // NOI18N
        navActive.setForeground(new java.awt.Color(245, 196, 83));
        navActive.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        navActive.setText("🏨");

        jSeparator1.setBackground(new java.awt.Color(233, 196, 91));
        jSeparator1.setForeground(new java.awt.Color(233, 196, 91));

        jLabel41.setBackground(new java.awt.Color(28, 53, 85));
        jLabel41.setIcon(new javax.swing.ImageIcon(getClass().getResource("/icons/admin.png"))); // NOI18N

        jLabel42.setFont(new java.awt.Font("SansSerif", 1, 14)); // NOI18N
        jLabel42.setForeground(new java.awt.Color(143, 160, 188));
        jLabel42.setText("Administrator");

        jLabel43.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        jLabel43.setForeground(new java.awt.Color(143, 160, 188));
        jLabel43.setText("Hotel Staff");

        javax.swing.GroupLayout PnlSideBarLayout = new javax.swing.GroupLayout(PnlSideBar);
        PnlSideBar.setLayout(PnlSideBarLayout);
        PnlSideBarLayout.setHorizontalGroup(
            PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(PnlSideBarLayout.createSequentialGroup()
                .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(PnlSideBarLayout.createSequentialGroup()
                        .addGap(31, 31, 31)
                        .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jSeparator5)
                            .addGroup(PnlSideBarLayout.createSequentialGroup()
                                .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(PnlSideBarLayout.createSequentialGroup()
                                        .addComponent(jLabel38, javax.swing.GroupLayout.PREFERRED_SIZE, 45, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel39, javax.swing.GroupLayout.PREFERRED_SIZE, 122, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(jLabel40, javax.swing.GroupLayout.PREFERRED_SIZE, 81, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                    .addGroup(PnlSideBarLayout.createSequentialGroup()
                                        .addGap(314, 314, 314)
                                        .addComponent(lblSettingsIcon)))
                                .addGap(0, 0, Short.MAX_VALUE))))
                    .addGroup(PnlSideBarLayout.createSequentialGroup()
                        .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(PnlSideBarLayout.createSequentialGroup()
                                .addGap(22, 22, 22)
                                .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                    .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                        .addComponent(btnDashboard, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addComponent(btnReservation, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addComponent(btnRoomManagement, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addComponent(btnPayments, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(btnUserManagement, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(btnSettings, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(btnLogout, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(btnCheckInOut, javax.swing.GroupLayout.PREFERRED_SIZE, 245, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(PnlSideBarLayout.createSequentialGroup()
                                .addContainerGap()
                                .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 280, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(PnlSideBarLayout.createSequentialGroup()
                                .addContainerGap()
                                .addComponent(jLabel41, javax.swing.GroupLayout.PREFERRED_SIZE, 45, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel42, javax.swing.GroupLayout.PREFERRED_SIZE, 122, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel43, javax.swing.GroupLayout.PREFERRED_SIZE, 81, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(PnlSideBarLayout.createSequentialGroup()
                                .addGap(52, 52, 52)
                                .addComponent(navActive, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );
        PnlSideBarLayout.setVerticalGroup(
            PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(PnlSideBarLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(btnDashboard, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(30, 30, 30)
                .addComponent(btnReservation, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(22, 22, 22)
                .addComponent(btnRoomManagement, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(btnCheckInOut, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(btnPayments, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(btnUserManagement, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(26, 26, 26)
                .addComponent(btnSettings, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(btnLogout, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(25, 25, 25)
                .addComponent(navActive)
                .addGap(15, 15, 15)
                .addComponent(lblSettingsIcon)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(PnlSideBarLayout.createSequentialGroup()
                        .addComponent(jLabel41)
                        .addGap(388, 388, 388)
                        .addComponent(jSeparator5, javax.swing.GroupLayout.PREFERRED_SIZE, 13, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addGroup(PnlSideBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel38)
                            .addGroup(PnlSideBarLayout.createSequentialGroup()
                                .addComponent(jLabel39, javax.swing.GroupLayout.PREFERRED_SIZE, 21, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jLabel40, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE))))
                    .addGroup(PnlSideBarLayout.createSequentialGroup()
                        .addComponent(jLabel42, javax.swing.GroupLayout.PREFERRED_SIZE, 21, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel43, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jLabel27.setFont(new java.awt.Font("Georgia", 1, 36)); // NOI18N
        jLabel27.setForeground(new java.awt.Color(245, 247, 250));
        jLabel27.setText("Payments");

        jLabel3.setFont(new java.awt.Font("Georgia", 0, 16)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("Track and manage all payments");

        lblTitleIcon.setText("p");

        lblday1.setFont(new java.awt.Font("Georgia", 0, 24)); // NOI18N
        lblday1.setForeground(new java.awt.Color(233, 196, 91));
        lblday1.setText("FRIDAY");

        lbldate1.setFont(new java.awt.Font("Segoe UI", 0, 14)); // NOI18N
        lbldate1.setForeground(new java.awt.Color(233, 196, 91));
        lbldate1.setText("20 November 2026");

        lblday2.setFont(new java.awt.Font("Georgia", 1, 24)); // NOI18N
        lblday2.setForeground(new java.awt.Color(233, 196, 91));
        lblday2.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblday2.setText("Monday");

        lblDate.setFont(new java.awt.Font("Segoe UI", 0, 14)); // NOI18N
        lblDate.setForeground(new java.awt.Color(233, 196, 91));
        lblDate.setText("27 November 2026");

        lblDay.setFont(new java.awt.Font("Georgia", 1, 24)); // NOI18N
        lblDay.setForeground(new java.awt.Color(233, 196, 91));
        lblDay.setText("Monday");

        jPanel6.setBackground(new java.awt.Color(10, 22, 48));

        lblThisMonthIcon.setText("jLabel7");

        jLabel11.setFont(new java.awt.Font("Georgia", 0, 14)); // NOI18N
        jLabel11.setText("This Month");

        jLabel16.setFont(new java.awt.Font("Georgia", 0, 24)); // NOI18N
        jLabel16.setForeground(new java.awt.Color(233, 196, 91));
        jLabel16.setText("R 28,500.00");

        jLabel18.setText("8% vs last month");

        javax.swing.GroupLayout jPanel6Layout = new javax.swing.GroupLayout(jPanel6);
        jPanel6.setLayout(jPanel6Layout);
        jPanel6Layout.setHorizontalGroup(
            jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel6Layout.createSequentialGroup()
                .addGap(11, 11, 11)
                .addComponent(lblThisMonthIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 79, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel6Layout.createSequentialGroup()
                        .addComponent(jLabel18, javax.swing.GroupLayout.PREFERRED_SIZE, 144, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addGroup(jPanel6Layout.createSequentialGroup()
                        .addComponent(jLabel11, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(33, 33, 33))
                    .addGroup(jPanel6Layout.createSequentialGroup()
                        .addComponent(jLabel16, javax.swing.GroupLayout.PREFERRED_SIZE, 144, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap(24, Short.MAX_VALUE))))
        );
        jPanel6Layout.setVerticalGroup(
            jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel6Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel6Layout.createSequentialGroup()
                        .addComponent(jLabel11, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel16, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel18, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap())
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel6Layout.createSequentialGroup()
                        .addComponent(lblThisMonthIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 69, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(49, 49, 49))))
        );

        jPanel7.setBackground(new java.awt.Color(10, 22, 48));

        lblTotalRevenueIcon.setText("jLabel7");

        jLabel10.setFont(new java.awt.Font("Georgia", 0, 24)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(233, 196, 91));
        jLabel10.setText("R 48,750.00");

        jLabel15.setFont(new java.awt.Font("Georgia", 0, 14)); // NOI18N
        jLabel15.setText("Total Revenue");

        jLabel17.setText("12% vs last month");

        javax.swing.GroupLayout jPanel7Layout = new javax.swing.GroupLayout(jPanel7);
        jPanel7.setLayout(jPanel7Layout);
        jPanel7Layout.setHorizontalGroup(
            jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel7Layout.createSequentialGroup()
                .addGap(17, 17, 17)
                .addComponent(lblTotalRevenueIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 79, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel15, javax.swing.GroupLayout.PREFERRED_SIZE, 144, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel10, javax.swing.GroupLayout.PREFERRED_SIZE, 157, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel17, javax.swing.GroupLayout.PREFERRED_SIZE, 142, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel7Layout.setVerticalGroup(
            jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel7Layout.createSequentialGroup()
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel7Layout.createSequentialGroup()
                        .addGap(24, 24, 24)
                        .addComponent(lblTotalRevenueIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 69, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addGroup(jPanel7Layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel15, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabel10)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabel17, javax.swing.GroupLayout.DEFAULT_SIZE, 31, Short.MAX_VALUE)))
                .addContainerGap())
        );

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 558, Short.MAX_VALUE)
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 33, Short.MAX_VALUE)
        );

        jPanel12.setBackground(new java.awt.Color(10, 22, 48));

        lblTotalRevenueIcon2.setText("jLabel7");

        jLabel36.setFont(new java.awt.Font("Georgia", 0, 24)); // NOI18N
        jLabel36.setForeground(new java.awt.Color(233, 196, 91));
        jLabel36.setText("R 48,750.00");

        jLabel37.setFont(new java.awt.Font("Georgia", 0, 14)); // NOI18N
        jLabel37.setText("Total Revenue");

        jLabel53.setText("12% vs last month");

        javax.swing.GroupLayout jPanel12Layout = new javax.swing.GroupLayout(jPanel12);
        jPanel12.setLayout(jPanel12Layout);
        jPanel12Layout.setHorizontalGroup(
            jPanel12Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel12Layout.createSequentialGroup()
                .addGap(17, 17, 17)
                .addComponent(lblTotalRevenueIcon2, javax.swing.GroupLayout.PREFERRED_SIZE, 79, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel12Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel37, javax.swing.GroupLayout.PREFERRED_SIZE, 144, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel36, javax.swing.GroupLayout.PREFERRED_SIZE, 157, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel53, javax.swing.GroupLayout.PREFERRED_SIZE, 142, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel12Layout.setVerticalGroup(
            jPanel12Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel12Layout.createSequentialGroup()
                .addGroup(jPanel12Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel12Layout.createSequentialGroup()
                        .addGap(24, 24, 24)
                        .addComponent(lblTotalRevenueIcon2, javax.swing.GroupLayout.PREFERRED_SIZE, 69, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addGroup(jPanel12Layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel37, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabel36)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabel53, javax.swing.GroupLayout.DEFAULT_SIZE, 31, Short.MAX_VALUE)))
                .addContainerGap())
        );

        pnlThisMonth.setBackground(new java.awt.Color(10, 22, 48));

        lblThisMonth.setText("m");

        jLabel5.setFont(new java.awt.Font("Georgia", 1, 24)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(233, 196, 91));
        jLabel5.setText("R 8,500.00");

        m.setForeground(new java.awt.Color(255, 255, 255));
        m.setText("vs last month");

        jLabel7.setFont(new java.awt.Font("Georgia", 0, 14)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(255, 255, 255));
        jLabel7.setText("This Month");

        lblThisMonthChange.setText("jLabel4");

        javax.swing.GroupLayout pnlThisMonthLayout = new javax.swing.GroupLayout(pnlThisMonth);
        pnlThisMonth.setLayout(pnlThisMonthLayout);
        pnlThisMonthLayout.setHorizontalGroup(
            pnlThisMonthLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlThisMonthLayout.createSequentialGroup()
                .addGap(45, 45, 45)
                .addComponent(lblThisMonthChange)
                .addGap(8, 8, 8)
                .addComponent(m, javax.swing.GroupLayout.PREFERRED_SIZE, 90, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(pnlThisMonthLayout.createSequentialGroup()
                .addComponent(lblThisMonth, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(pnlThisMonthLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 161, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 102, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(0, 18, Short.MAX_VALUE))
        );
        pnlThisMonthLayout.setVerticalGroup(
            pnlThisMonthLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlThisMonthLayout.createSequentialGroup()
                .addGroup(pnlThisMonthLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlThisMonthLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlThisMonthLayout.createSequentialGroup()
                        .addGap(24, 24, 24)
                        .addComponent(lblThisMonth, javax.swing.GroupLayout.PREFERRED_SIZE, 49, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(pnlThisMonthLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(m, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblThisMonthChange))
                .addContainerGap(14, Short.MAX_VALUE))
        );

        pnlPendingPayments.setBackground(new java.awt.Color(10, 22, 48));

        lblPendingIcon.setText("p");

        jLabel9.setFont(new java.awt.Font("Georgia", 1, 24)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(233, 196, 91));
        jLabel9.setText("R 2,000.00");

        p.setForeground(new java.awt.Color(255, 255, 255));
        p.setText("2 transactions");

        jLabel13.setFont(new java.awt.Font("Georgia", 0, 14)); // NOI18N
        jLabel13.setForeground(new java.awt.Color(255, 255, 255));
        jLabel13.setText("Pending Payments");

        lblPendingChange.setText("jLabel6");

        javax.swing.GroupLayout pnlPendingPaymentsLayout = new javax.swing.GroupLayout(pnlPendingPayments);
        pnlPendingPayments.setLayout(pnlPendingPaymentsLayout);
        pnlPendingPaymentsLayout.setHorizontalGroup(
            pnlPendingPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlPendingPaymentsLayout.createSequentialGroup()
                .addGap(47, 47, 47)
                .addComponent(lblPendingChange)
                .addGap(6, 6, 6)
                .addComponent(p, javax.swing.GroupLayout.PREFERRED_SIZE, 88, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(pnlPendingPaymentsLayout.createSequentialGroup()
                .addComponent(lblPendingIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 51, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(pnlPendingPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel13, javax.swing.GroupLayout.PREFERRED_SIZE, 131, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, 152, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(0, 0, Short.MAX_VALUE))
        );
        pnlPendingPaymentsLayout.setVerticalGroup(
            pnlPendingPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlPendingPaymentsLayout.createSequentialGroup()
                .addGroup(pnlPendingPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlPendingPaymentsLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel13, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlPendingPaymentsLayout.createSequentialGroup()
                        .addGap(24, 24, 24)
                        .addComponent(lblPendingIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(pnlPendingPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(p, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblPendingChange))
                .addContainerGap(14, Short.MAX_VALUE))
        );

        pnlTotalRevenue.setBackground(new java.awt.Color(10, 22, 48));

        lblTotalIcon.setText("t");

        jLabel19.setFont(new java.awt.Font("Georgia", 1, 24)); // NOI18N
        jLabel19.setForeground(new java.awt.Color(233, 196, 91));
        jLabel19.setText("R 48,750.00");

        r.setForeground(new java.awt.Color(255, 255, 255));
        r.setText("vs last month");

        jLabel21.setFont(new java.awt.Font("Georgia", 0, 14)); // NOI18N
        jLabel21.setForeground(new java.awt.Color(255, 255, 255));
        jLabel21.setText("Total Revenue");

        lblRevenueChange.setText("jLabel2");

        javax.swing.GroupLayout pnlTotalRevenueLayout = new javax.swing.GroupLayout(pnlTotalRevenue);
        pnlTotalRevenue.setLayout(pnlTotalRevenueLayout);
        pnlTotalRevenueLayout.setHorizontalGroup(
            pnlTotalRevenueLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlTotalRevenueLayout.createSequentialGroup()
                .addGap(71, 71, 71)
                .addComponent(lblRevenueChange, javax.swing.GroupLayout.PREFERRED_SIZE, 43, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(r, javax.swing.GroupLayout.PREFERRED_SIZE, 98, javax.swing.GroupLayout.PREFERRED_SIZE))
            .addGroup(pnlTotalRevenueLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(lblTotalIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 56, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(pnlTotalRevenueLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlTotalRevenueLayout.createSequentialGroup()
                        .addGap(6, 6, 6)
                        .addComponent(jLabel19, javax.swing.GroupLayout.PREFERRED_SIZE, 161, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel21, javax.swing.GroupLayout.PREFERRED_SIZE, 161, javax.swing.GroupLayout.PREFERRED_SIZE)))
        );
        pnlTotalRevenueLayout.setVerticalGroup(
            pnlTotalRevenueLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlTotalRevenueLayout.createSequentialGroup()
                .addGroup(pnlTotalRevenueLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlTotalRevenueLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel21, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel19, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(pnlTotalRevenueLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(r, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(lblRevenueChange)))
                    .addGroup(pnlTotalRevenueLayout.createSequentialGroup()
                        .addGap(24, 24, 24)
                        .addComponent(lblTotalIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pnlCompletedPayments.setBackground(new java.awt.Color(10, 22, 48));

        lblCompletedIcon.setText("c");

        jLabel24.setFont(new java.awt.Font("Georgia", 1, 24)); // NOI18N
        jLabel24.setForeground(new java.awt.Color(233, 196, 91));
        jLabel24.setText("R 4,750.00");

        c.setForeground(new java.awt.Color(255, 255, 255));
        c.setText("vs last month");

        jLabel28.setFont(new java.awt.Font("Georgia", 0, 14)); // NOI18N
        jLabel28.setForeground(new java.awt.Color(255, 255, 255));
        jLabel28.setText("Completed Payments");

        lblCompletedChange.setText("jLabel8");

        javax.swing.GroupLayout pnlCompletedPaymentsLayout = new javax.swing.GroupLayout(pnlCompletedPayments);
        pnlCompletedPayments.setLayout(pnlCompletedPaymentsLayout);
        pnlCompletedPaymentsLayout.setHorizontalGroup(
            pnlCompletedPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlCompletedPaymentsLayout.createSequentialGroup()
                .addGap(51, 51, 51)
                .addComponent(lblCompletedChange)
                .addGap(2, 2, 2)
                .addComponent(c, javax.swing.GroupLayout.PREFERRED_SIZE, 89, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(pnlCompletedPaymentsLayout.createSequentialGroup()
                .addComponent(lblCompletedIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 46, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(pnlCompletedPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jLabel28, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel24, javax.swing.GroupLayout.DEFAULT_SIZE, 142, Short.MAX_VALUE))
                .addGap(0, 11, Short.MAX_VALUE))
        );
        pnlCompletedPaymentsLayout.setVerticalGroup(
            pnlCompletedPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlCompletedPaymentsLayout.createSequentialGroup()
                .addGroup(pnlCompletedPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                    .addGroup(pnlCompletedPaymentsLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel28, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel24, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlCompletedPaymentsLayout.createSequentialGroup()
                        .addGap(24, 24, 24)
                        .addComponent(lblCompletedIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 15, Short.MAX_VALUE)
                .addGroup(pnlCompletedPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(c, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblCompletedChange))
                .addContainerGap(15, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout pnlRevenueOverviewLayout = new javax.swing.GroupLayout(pnlRevenueOverview);
        pnlRevenueOverview.setLayout(pnlRevenueOverviewLayout);
        pnlRevenueOverviewLayout.setHorizontalGroup(
            pnlRevenueOverviewLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 519, Short.MAX_VALUE)
        );
        pnlRevenueOverviewLayout.setVerticalGroup(
            pnlRevenueOverviewLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 200, Short.MAX_VALUE)
        );

        javax.swing.GroupLayout pnlPaymentMethodsLayout = new javax.swing.GroupLayout(pnlPaymentMethods);
        pnlPaymentMethods.setLayout(pnlPaymentMethodsLayout);
        pnlPaymentMethodsLayout.setHorizontalGroup(
            pnlPaymentMethodsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 379, Short.MAX_VALUE)
        );
        pnlPaymentMethodsLayout.setVerticalGroup(
            pnlPaymentMethodsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 200, Short.MAX_VALUE)
        );

        pnlSearchBar.setBackground(new java.awt.Color(11, 27, 48));

        txtSearch.setBackground(new java.awt.Color(10, 22, 48));
        txtSearch.setForeground(new java.awt.Color(170, 160, 130));
        txtSearch.setText("jTextField1");
        txtSearch.addActionListener(this::txtSearchActionPerformed);

        lblSearchIcon.setFont(new java.awt.Font("Segoe UI", 0, 18)); // NOI18N
        lblSearchIcon.setText("jLabel1");

        btnSearch.setBackground(new java.awt.Color(233, 196, 91));
        btnSearch.setFont(new java.awt.Font("Georgia", 1, 12)); // NOI18N
        btnSearch.setForeground(new java.awt.Color(30, 35, 45));
        btnSearch.setText("Find");

        lblSearchMessage.setText("jLabel1");

        javax.swing.GroupLayout pnlSearchBarLayout = new javax.swing.GroupLayout(pnlSearchBar);
        pnlSearchBar.setLayout(pnlSearchBarLayout);
        pnlSearchBarLayout.setHorizontalGroup(
            pnlSearchBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlSearchBarLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(lblSearchIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 49, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(txtSearch, javax.swing.GroupLayout.DEFAULT_SIZE, 463, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(btnSearch, javax.swing.GroupLayout.PREFERRED_SIZE, 109, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
            .addGroup(pnlSearchBarLayout.createSequentialGroup()
                .addComponent(lblSearchMessage, javax.swing.GroupLayout.PREFERRED_SIZE, 203, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );
        pnlSearchBarLayout.setVerticalGroup(
            pnlSearchBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlSearchBarLayout.createSequentialGroup()
                .addGroup(pnlSearchBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtSearch, javax.swing.GroupLayout.PREFERRED_SIZE, 45, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblSearchIcon)
                    .addComponent(btnSearch, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(lblSearchMessage)
                .addGap(0, 0, Short.MAX_VALUE))
        );

        lblPaymentRecords.setFont(new java.awt.Font("Georgia", 1, 12)); // NOI18N
        lblPaymentRecords.setForeground(new java.awt.Color(204, 164, 69));
        lblPaymentRecords.setText("Payment Reords");

        jLabel1.setForeground(new java.awt.Color(143, 160, 188));
        jLabel1.setText("View and manage all hotel payment transactions");

        pnlPaymentTable.setBackground(new java.awt.Color(15, 31, 55));

        tblPayments.setBackground(new java.awt.Color(18, 32, 54));
        tblPayments.setFont(new java.awt.Font("Georgia", 1, 12)); // NOI18N
        tblPayments.setForeground(new java.awt.Color(255, 255, 255));
        tblPayments.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {"PAY-001", "John Smith R001", "R4500", "Card", "14/11/2026", "Completed"},
                {"PAY-002", "Vanessa Henshaw R002", "R3200", "Cash", "15/11/2026", "Pending"},
                {"PAY-003", "Mary Wilson R003", "R5,000", "EFT", "16/11/2026", "Completed"},
                {"PAY-004", "James Brown R004", "R2,000", "Card", "17/11/2026", "Failed"},
                {"PAY-005", "Stacy Wilson R005", "R3,800", "EFT", "18/11/2026", "Completed"}
            },
            new String [] {
                "Payment ID", "Guest Details", "Amount", "Payment Method", "Payment Date", "Status / Actions "
            }
        ));
        tblPayments.setRowHeight(38);
        tblPayments.setRowSelectionAllowed(false);
        jScrollPane2.setViewportView(tblPayments);

        javax.swing.GroupLayout pnlPaymentTableLayout = new javax.swing.GroupLayout(pnlPaymentTable);
        pnlPaymentTable.setLayout(pnlPaymentTableLayout);
        pnlPaymentTableLayout.setHorizontalGroup(
            pnlPaymentTableLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlPaymentTableLayout.createSequentialGroup()
                .addComponent(jScrollPane2, javax.swing.GroupLayout.DEFAULT_SIZE, 898, Short.MAX_VALUE)
                .addContainerGap())
        );
        pnlPaymentTableLayout.setVerticalGroup(
            pnlPaymentTableLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlPaymentTableLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 313, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(31, Short.MAX_VALUE))
        );

        btnAddUser.setBackground(new java.awt.Color(245, 196, 83));
        btnAddUser.setFont(new java.awt.Font("Georgia", 1, 14)); // NOI18N
        btnAddUser.setForeground(new java.awt.Color(10, 22, 48));
        btnAddUser.setText("<html><span style='font size:34px'>+</span>&nbsp;&nbsp;&nbsp;Add User</html>");
        btnAddUser.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        btnAddUser.addActionListener(this::btnAddUserActionPerformed);

        pa.setText("jLabel2");

        javax.swing.GroupLayout pnlPaymentsLayout = new javax.swing.GroupLayout(pnlPayments);
        pnlPayments.setLayout(pnlPaymentsLayout);
        pnlPaymentsLayout.setHorizontalGroup(
            pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlPaymentsLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(pa, javax.swing.GroupLayout.PREFERRED_SIZE, 196, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlPaymentsLayout.createSequentialGroup()
                        .addGap(833, 833, 833)
                        .addComponent(lblDate, javax.swing.GroupLayout.PREFERRED_SIZE, 186, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlPaymentsLayout.createSequentialGroup()
                        .addGap(470, 470, 470)
                        .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlPaymentsLayout.createSequentialGroup()
                        .addGap(54, 54, 54)
                        .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel26, javax.swing.GroupLayout.PREFERRED_SIZE, 288, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(pnlPaymentsLayout.createSequentialGroup()
                                .addComponent(jLabel23, javax.swing.GroupLayout.PREFERRED_SIZE, 317, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addComponent(lblDay, javax.swing.GroupLayout.PREFERRED_SIZE, 186, javax.swing.GroupLayout.PREFERRED_SIZE)))))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 6444, Short.MAX_VALUE)
                .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel4, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lblday, javax.swing.GroupLayout.PREFERRED_SIZE, 197, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(lbldate, javax.swing.GroupLayout.PREFERRED_SIZE, 151, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(16, 16, 16))
            .addGroup(pnlPaymentsLayout.createSequentialGroup()
                .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlPaymentsLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jSeparator3))
                    .addGroup(pnlPaymentsLayout.createSequentialGroup()
                        .addComponent(PnlSideBar, javax.swing.GroupLayout.PREFERRED_SIZE, 292, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlPaymentsLayout.createSequentialGroup()
                                .addComponent(lblTitleIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 97, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 237, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel27, javax.swing.GroupLayout.PREFERRED_SIZE, 253, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(pnlPaymentsLayout.createSequentialGroup()
                                .addComponent(pnlRevenueOverview, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(pnlPaymentMethods, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(pnlSearchBar, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(lblPaymentRecords, javax.swing.GroupLayout.PREFERRED_SIZE, 114, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel1)
                            .addComponent(pnlPaymentTable, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(pnlPaymentsLayout.createSequentialGroup()
                                .addComponent(pnlTotalRevenue, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(pnlThisMonth, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(pnlPendingPayments, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(33, 33, 33)
                                .addComponent(pnlCompletedPayments, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 6955, Short.MAX_VALUE)))
                .addContainerGap())
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(4783, 4783, 4783)
                    .addComponent(lblday1, javax.swing.GroupLayout.PREFERRED_SIZE, 197, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(3210, Short.MAX_VALUE)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(4806, 4806, 4806)
                    .addComponent(lbldate1, javax.swing.GroupLayout.PREFERRED_SIZE, 151, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(3233, Short.MAX_VALUE)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(4822, 4822, 4822)
                    .addComponent(lblday2, javax.swing.GroupLayout.PREFERRED_SIZE, 119, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(3249, Short.MAX_VALUE)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(4747, 4747, 4747)
                    .addComponent(jPanel6, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(4749, 4749, 4749)
                    .addComponent(jPanel7, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(3176, Short.MAX_VALUE)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(4749, 4749, 4749)
                    .addComponent(jPanel12, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(3176, Short.MAX_VALUE)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(2454, 2454, 2454)
                    .addComponent(btnAddUser, javax.swing.GroupLayout.PREFERRED_SIZE, 126, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(5610, Short.MAX_VALUE)))
        );
        pnlPaymentsLayout.setVerticalGroup(
            pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlPaymentsLayout.createSequentialGroup()
                .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlPaymentsLayout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(lblday, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(lblDay, javax.swing.GroupLayout.PREFERRED_SIZE, 41, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(2, 2, 2)
                        .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(lbldate, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(lblDate, javax.swing.GroupLayout.PREFERRED_SIZE, 19, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(24, 24, 24)
                        .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addGroup(pnlPaymentsLayout.createSequentialGroup()
                        .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlPaymentsLayout.createSequentialGroup()
                                .addGap(19, 19, 19)
                                .addComponent(jLabel23, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(jLabel26, javax.swing.GroupLayout.PREFERRED_SIZE, 19, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(pa, javax.swing.GroupLayout.PREFERRED_SIZE, 139, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(18, 18, 18)
                        .addComponent(jSeparator3, javax.swing.GroupLayout.PREFERRED_SIZE, 12, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(PnlSideBar, javax.swing.GroupLayout.PREFERRED_SIZE, 722, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(pnlPaymentsLayout.createSequentialGroup()
                                .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(lblTitleIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addGroup(pnlPaymentsLayout.createSequentialGroup()
                                        .addComponent(jLabel27, javax.swing.GroupLayout.PREFERRED_SIZE, 50, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 13, Short.MAX_VALUE)
                                        .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addGap(10, 10, 10)
                                .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(pnlCompletedPayments, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(pnlPendingPayments, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(pnlTotalRevenue, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(pnlThisMonth, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                                .addGap(18, 18, 18)
                                .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(pnlRevenueOverview, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(pnlPaymentMethods, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(pnlSearchBar, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(lblPaymentRecords, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jLabel1)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(pnlPaymentTable, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))))
                .addContainerGap(2661, Short.MAX_VALUE))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(1864, 1864, 1864)
                    .addComponent(lblday1, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(1873, Short.MAX_VALUE)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(1868, 1868, 1868)
                    .addComponent(lbldate1, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(1877, Short.MAX_VALUE)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(1872, 1872, 1872)
                    .addComponent(lblday2, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(1881, Short.MAX_VALUE)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(1825, 1825, 1825)
                    .addComponent(jPanel6, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGap(1826, 1826, 1826)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(1825, 1825, 1825)
                    .addComponent(jPanel7, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGap(1826, 1826, 1826)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(1825, 1825, 1825)
                    .addComponent(jPanel12, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGap(1826, 1826, 1826)))
            .addGroup(pnlPaymentsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(pnlPaymentsLayout.createSequentialGroup()
                    .addGap(1869, 1869, 1869)
                    .addComponent(btnAddUser, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap(1872, Short.MAX_VALUE)))
        );

        jScrollPane1.setViewportView(pnlPayments);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 1292, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(1876, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 1185, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 58, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnDashboardActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnDashboardActionPerformed
        // TODO add your handling code here:
        Dashboard dashboard = new Dashboard();
        dashboard.setVisible(true);
        this.dispose();
    }//GEN-LAST:event_btnDashboardActionPerformed

    private void btnRoomManagementActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnRoomManagementActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_btnRoomManagementActionPerformed

    private void btnPaymentsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnPaymentsActionPerformed
        // TODO add your handling code here:
        pay payments = new pay();
        payments.setVisible(true);
        this.dispose();
    }//GEN-LAST:event_btnPaymentsActionPerformed

    private void btnCheckInOutActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCheckInOutActionPerformed
        // TODO add your handling code here:
        checkinOut checkIn = new checkinOut();
        checkIn.setVisible(true);
        this.dispose();
    }//GEN-LAST:event_btnCheckInOutActionPerformed

    private void btnLogoutActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnLogoutActionPerformed
        // TODO add your handling code here:
        Logout lo = new Logout();
        lo.setVisible(true);
        this.dispose();
    }//GEN-LAST:event_btnLogoutActionPerformed

    private void btnUserManagementActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnUserManagementActionPerformed
        // TODO add your handling code here:
        UserManagement user = new UserManagement();
        user.setVisible(true);
        this.dispose();
    }//GEN-LAST:event_btnUserManagementActionPerformed

    private void btnSettingsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnSettingsActionPerformed
        // TODO add your handling code here:
        settings settings = new settings();
        settings.setVisible(true);
        this.dispose();
    }//GEN-LAST:event_btnSettingsActionPerformed

    private void btnReservationActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnReservationActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_btnReservationActionPerformed

    private void txtSearchActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtSearchActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtSearchActionPerformed

    private void btnAddUserActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnAddUserActionPerformed
        // TODO add your handling code here:

    }//GEN-LAST:event_btnAddUserActionPerformed

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
        java.awt.EventQueue.invokeLater(() -> new pay().setVisible(true));
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel PnlSideBar;
    private javax.swing.JButton btnAddUser;
    private javax.swing.JButton btnCheckInOut;
    private javax.swing.JButton btnDashboard;
    private javax.swing.JButton btnLogout;
    private javax.swing.JButton btnPayments;
    private javax.swing.JButton btnReservation;
    private javax.swing.JButton btnRoomManagement;
    private javax.swing.JButton btnSearch;
    private javax.swing.JButton btnSettings;
    private javax.swing.JButton btnUserManagement;
    private javax.swing.JLabel c;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel15;
    private javax.swing.JLabel jLabel16;
    private javax.swing.JLabel jLabel17;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel19;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel23;
    private javax.swing.JLabel jLabel24;
    private javax.swing.JLabel jLabel26;
    private javax.swing.JLabel jLabel27;
    private javax.swing.JLabel jLabel28;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel36;
    private javax.swing.JLabel jLabel37;
    private javax.swing.JLabel jLabel38;
    private javax.swing.JLabel jLabel39;
    private javax.swing.JLabel jLabel40;
    private javax.swing.JLabel jLabel41;
    private javax.swing.JLabel jLabel42;
    private javax.swing.JLabel jLabel43;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel53;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel12;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanel6;
    private javax.swing.JPanel jPanel7;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JSeparator jSeparator3;
    private javax.swing.JSeparator jSeparator5;
    private javax.swing.JLabel lblCompletedChange;
    private javax.swing.JLabel lblCompletedIcon;
    private javax.swing.JLabel lblDate;
    private javax.swing.JLabel lblDay;
    private javax.swing.JLabel lblPaymentRecords;
    private javax.swing.JLabel lblPendingChange;
    private javax.swing.JLabel lblPendingIcon;
    private javax.swing.JLabel lblRevenueChange;
    private javax.swing.JLabel lblSearchIcon;
    private javax.swing.JLabel lblSearchMessage;
    private javax.swing.JLabel lblSettingsIcon;
    private javax.swing.JLabel lblThisMonth;
    private javax.swing.JLabel lblThisMonthChange;
    private javax.swing.JLabel lblThisMonthIcon;
    private javax.swing.JLabel lblTitleIcon;
    private javax.swing.JLabel lblTotalIcon;
    private javax.swing.JLabel lblTotalRevenueIcon;
    private javax.swing.JLabel lblTotalRevenueIcon2;
    private javax.swing.JLabel lbldate;
    private javax.swing.JLabel lbldate1;
    private javax.swing.JLabel lblday;
    private javax.swing.JLabel lblday1;
    private javax.swing.JLabel lblday2;
    private javax.swing.JLabel m;
    private javax.swing.JLabel navActive;
    private javax.swing.JLabel p;
    private javax.swing.JLabel pa;
    private javax.swing.JPanel pnlCompletedPayments;
    private javax.swing.JPanel pnlPaymentMethods;
    private javax.swing.JPanel pnlPaymentTable;
    private javax.swing.JPanel pnlPayments;
    private javax.swing.JPanel pnlPendingPayments;
    private javax.swing.JPanel pnlRevenueOverview;
    private javax.swing.JPanel pnlSearchBar;
    private javax.swing.JPanel pnlThisMonth;
    private javax.swing.JPanel pnlTotalRevenue;
    private javax.swing.JLabel r;
    private javax.swing.JTable tblPayments;
    private javax.swing.JTextField txtSearch;
    // End of variables declaration//GEN-END:variables
}
