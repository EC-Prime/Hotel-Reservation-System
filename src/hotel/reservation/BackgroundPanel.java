/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;
import javax.swing.*;
import java.awt.*;
import javax.imageio.ImageIO;

public class BackgroundPanel extends JPanel {

    private Image bg;

    public BackgroundPanel() {
        
        try {
            java.net.URL url = BackgroundPanel.class.getResource("/images/login-bg.jpg");
              System.out.println("URL = " + url);
            if (url != null) bg = ImageIO.read(url);
        } catch (Exception ex) {
            bg = null;
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        int w = getWidth(), h = getHeight();

        if (bg != null) {
            double s = Math.max((double) w / bg.getWidth(null), (double) h / bg.getHeight(null));
            int iw = (int) (bg.getWidth(null) * s), ih = (int) (bg.getHeight(null) * s);
            g2.drawImage(bg, (w - iw) / 2, (h - ih) / 2, iw, ih, null);
        } else {
            g2.setPaint(new GradientPaint(0, 0, new Color(0x0D1830), w, h, new Color(0x1B2B4D)));
            g2.fillRect(0, 0, w, h);
        }

        g2.setColor(new Color(13, 24, 48, 60));
        g2.fillRect(0, 0, w / 2, h);
        g2.setColor(new Color(13, 24, 48, 175));
        g2.fillRect(w / 2, 0, w - w / 2, h);
        g2.setColor(new Color(255, 255, 255, 230));
        g2.fillRoundRect(w / 2 - 2, (int) (h * 0.12), 4, (int) (h * 0.76), 4, 4);
        g2.dispose();
    }
}