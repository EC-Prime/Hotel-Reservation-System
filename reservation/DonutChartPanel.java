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

    private final int[] values = {9, 5,6 };

    private final java.awt.Color[] colors = {
        new java.awt.Color(193, 123, 55),   
        new java.awt.Color(52, 91, 135),   
        new java.awt.Color(255, 107, 197),  
      
    };

    public DonutChartPanel() {
        setBackground(new java.awt.Color(18, 32, 54));
        setPreferredSize(new java.awt.Dimension(280, 250));
        setOpaque(true);
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

        int size = Math.min(getWidth() - 40, getHeight() - 50);
        size = Math.max(size, 80);

        int x = (getWidth() - size) / 2;
        int y = (getHeight() - size) / 2;

        int startAngle = 90;

        for (int i = 0; i < values.length; i++) {
            int angle = (int) Math.round(
                    values[i] * 360.0 / total
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

        g2.dispose();
    }
}

