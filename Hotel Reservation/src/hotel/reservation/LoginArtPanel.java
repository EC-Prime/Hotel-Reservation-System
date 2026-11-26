package hotel.reservation;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.GradientPaint;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.util.Random;
import javax.swing.ImageIcon;
import javax.swing.JPanel;
import javax.swing.Timer;

/** Animated hotel artwork panel for the login screen. */
public final class LoginArtPanel extends JPanel {
    private final Image background;
    private final Random random = new Random(7);
    private final float[] particles = new float[36];
    private int phase;

    public LoginArtPanel() {
        background = new ImageIcon(getClass().getResource("/icons/wallp.jpg")).getImage();
        for (int i = 0; i < particles.length; i++) particles[i] = random.nextFloat();
        new Timer(45, e -> { phase = (phase + 1) % 360; repaint(); }).start();
    }

    @Override protected void paintComponent(Graphics graphics) {
        super.paintComponent(graphics);
        Graphics2D g = (Graphics2D) graphics.create();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        int w = getWidth(), h = getHeight();
        double scale = Math.max((double) w / background.getWidth(null), (double) h / background.getHeight(null));
        int iw = (int) (background.getWidth(null) * scale), ih = (int) (background.getHeight(null) * scale);
        g.drawImage(background, (w - iw) / 2, (h - ih) / 2, iw, ih, this);
        g.setPaint(new GradientPaint(0, 0, new Color(7, 13, 31, 100), w, h, new Color(7, 13, 31, 235)));
        g.fillRect(0, 0, w, h);
        g.setColor(new Color(233, 196, 91, 130));
        g.setStroke(new BasicStroke(1.2f));
        for (int i = 0; i < particles.length; i++) {
            int x = (int) ((i * 71L) % Math.max(1, w));
            int y = (int) (((particles[i] * h) + phase * (0.5 + particles[i])) % Math.max(1, h));
            int size = 2 + (i % 3);
            g.fillOval(x, y, size, size);
        }
        g.setColor(new Color(233, 196, 91, 190));
        g.fillRect(42, h - 116, 54, 2);
        g.setColor(Color.WHITE);
        g.setFont(new java.awt.Font("Georgia", java.awt.Font.BOLD, 34));
        g.drawString("ROYAL HAVEN", 42, h - 72);
        g.setFont(new java.awt.Font("SansSerif", java.awt.Font.PLAIN, 13));
        g.setColor(new Color(230, 235, 245));
        g.drawString("Boutique comfort, thoughtfully managed.", 44, h - 45);
        g.dispose();
    }
}
