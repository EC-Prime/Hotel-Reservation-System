/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;

import javax.swing.*;
import java.awt.*;

public class TabButton extends JButton {
    private boolean active = false;

    public TabButton(String text) {
        super(text);
        setContentAreaFilled(false);
        setBorderPainted(false);
        setFocusPainted(false);
        setFont(new Font("Segoe UI", Font.BOLD, 15));
        setCursor(new Cursor(Cursor.HAND_CURSOR));
    }

    public void setActive(boolean a) {
        active = a;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                            RenderingHints.VALUE_ANTIALIAS_ON);
        int w = getWidth(), h = getHeight();

        if (active) {
            g2.setPaint(new GradientPaint(0, 0, new Color(245, 205, 80),
                                          0, h, new Color(200, 150, 30)));
            setForeground(new Color(20, 30, 60));
        } else {
            g2.setColor(getModel().isRollover()
                    ? new Color(30, 55, 110) : new Color(15, 35, 80));
            setForeground(Color.WHITE);
        }
        g2.fillRoundRect(0, 0, w, h, 14, 14);

        g2.setColor(new Color(212, 175, 55, active ? 255 : 120));
        g2.drawRoundRect(0, 0, w - 1, h - 1, 14, 14);
        g2.dispose();
        super.paintComponent(g);
    }
}
