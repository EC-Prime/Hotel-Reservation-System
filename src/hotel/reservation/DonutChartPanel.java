/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;

/**
 *
 * @author DCS Admin
 */

    class DonutChartPanel extends javax.swing.JPanel {

    private int[] values = {0, 0, 0};
    private final String[] labels = {"Available", "Occupied", "Maintenance"};
    private int rotation;

    private final java.awt.Color[] colors = {
        new java.awt.Color(193, 123, 55),   
        new java.awt.Color(52, 91, 135),   
        new java.awt.Color(255, 107, 197),  
      
    };

    public DonutChartPanel() {
        setBackground(new java.awt.Color(18, 32, 54));
        setPreferredSize(new java.awt.Dimension(320, 260));
        setOpaque(true);
        new javax.swing.Timer(35, e -> { rotation = (rotation + 2) % 360; repaint(); }).start();
    }

    public void setValues(int available, int occupied, int maintenance) {
        values = new int[]{Math.max(0, available), Math.max(0, occupied), Math.max(0, maintenance)};
        repaint();
    }

    @Override
    protected void paintComponent(java.awt.Graphics g) {
        super.paintComponent(g);

        java.awt.Graphics2D g2 =
                (java.awt.Graphics2D) g.create();

        g2.setRenderingHint(
                java.awt.RenderingHints.KEY_ANTIALIASING,
                java.awt.RenderingHints.VALUE_ANTIALIAS_ON
        );

        int total = 0;
        for (int value : values) {
            total += value;
        }
        int chartTotal = Math.max(total, 1);

        int size = Math.min(getWidth() - 40, getHeight() - 105);
        size = Math.max(size, 80);

        int x = (getWidth() - size) / 2;
        int y = (getHeight() - size) / 2;

        int startAngle = 90 + rotation;

        for (int i = 0; i < values.length; i++) {
            int angle = (int) Math.round(
                    values[i] * 360.0 / chartTotal
            );

            g2.setColor(colors[i]);

            g2.fillArc(
                    x, y, size, size,
                    startAngle, -angle
            );

            startAngle -= angle;
        }

        // Create the hole in the middle
        int holeSize = (int) (size * 0.58);
        int holeX = x + (size - holeSize) / 2;
        int holeY = y + (size - holeSize) / 2;

        g2.setColor(getBackground());
        g2.fillOval(holeX, holeY, holeSize, holeSize);

        // Centre text
        g2.setColor(java.awt.Color.WHITE);
        g2.setFont(new java.awt.Font(
                "SansSerif", java.awt.Font.BOLD, 25
        ));

        String totalText = String.valueOf(total);
        java.awt.FontMetrics fm = g2.getFontMetrics();

        g2.drawString(
                totalText,
                getWidth() / 2 - fm.stringWidth(totalText) / 2,
                getHeight() / 2
        );

        g2.setFont(new java.awt.Font(
                "SansSerif", java.awt.Font.PLAIN, 11
        ));

        String caption = "Total Rooms";
        fm = g2.getFontMetrics();

        g2.setColor(new java.awt.Color(180, 190, 205));

        g2.drawString(
                caption,
                getWidth() / 2 - fm.stringWidth(caption) / 2,
                getHeight() / 2 + 20
        );

        int legendY = getHeight() - 55;
        g2.setFont(new java.awt.Font("SansSerif", java.awt.Font.PLAIN, 9));
        java.awt.FontMetrics legendMetrics = g2.getFontMetrics();
        int[] legendWidths = new int[labels.length];
        int legendTotal = 0;
        for (int i = 0; i < labels.length; i++) {
            legendWidths[i] = 14 + legendMetrics.stringWidth(labels[i] + " " + values[i]);
            legendTotal += legendWidths[i];
        }
        int legendGap = Math.max(12, (getWidth() - legendTotal - 28) / (labels.length - 1));
        int legendX = Math.max(14, (getWidth() - (legendTotal + legendGap * (labels.length - 1))) / 2);
        for (int i = 0; i < labels.length; i++) {
            int xLegend = legendX;
            g2.setColor(colors[i]);
            g2.fillRoundRect(xLegend, legendY, 10, 10, 4, 4);
            g2.setColor(new java.awt.Color(205, 214, 226));
            g2.drawString(labels[i] + " " + values[i], xLegend + 14, legendY + 10);
            legendX += legendWidths[i] + legendGap;
        }

        g2.dispose();
    }
}

