/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;
import javax.swing.*;
import java.awt.*;


public class GradientBackgroundPanel extends JPanel {
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_RENDERING,
                            RenderingHints.VALUE_RENDER_QUALITY);

        int w = getWidth(), h = getHeight();

        // Base diagonal gradient: dark navy to lighter navy to dark navy
        g2.setPaint(new LinearGradientPaint(
                0, 0, w, h,
                new float[]{0f, 0.5f, 1f},
                new Color[]{
                    new Color(5, 15, 45),
                    new Color(15, 40, 90),
                    new Color(4, 12, 38)
                }));
        g2.fillRect(0, 0, w, h);

        // Soft glow in the upper middle
        g2.setPaint(new RadialGradientPaint(
                w * 0.5f, h * 0.3f, Math.max(w, h) * 0.5f,
                new float[]{0f, 1f},
                new Color[]{
                    new Color(40, 80, 150, 70),
                    new Color(40, 80, 150, 0)
                }));
        g2.fillRect(0, 0, w, h);

        g2.dispose();
    }
}

