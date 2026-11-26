package hotel.reservation;
import java.awt.*;
import java.util.ArrayList;
import java.util.Random;
import javax.swing.*;

public class LuxuryBackgroundPanel extends JPanel {

    private final Random random = new Random();
    private final ArrayList<Particle> particles = new ArrayList<>();

    private Timer animationTimer;
    private float lightPosition = 0;
    private int direction = 1;

    public LuxuryBackgroundPanel() {

        setOpaque(true);

        // Create floating gold particles
        for (int i = 0; i < 45; i++) {
            particles.add(new Particle(
                random.nextInt(1200),
                random.nextInt(900),
                2 + random.nextInt(4),
                1 + random.nextInt(2)
            ));
        }

        // Start animation
        animationTimer = new Timer(35, e -> {

            lightPosition += direction * 0.004f;

            if (lightPosition >= 1) {
                direction = -1;
            }

            if (lightPosition <= 0) {
                direction = 1;
            }

            for (Particle p : particles) {

                p.y -= p.speed;

                if (p.y < -10) {
                    p.y = getHeight() + random.nextInt(100);
                    p.x = random.nextInt(Math.max(1, getWidth()));
                }

                p.alpha += p.fadeDirection * 3;

                if (p.alpha >= 180) {
                    p.alpha = 180;
                    p.fadeDirection = -1;
                }

                if (p.alpha <= 35) {
                    p.alpha = 35;
                    p.fadeDirection = 1;
                }
            }

            repaint();
        });

        animationTimer.start();
    }

    @Override
    protected void paintComponent(Graphics g) {

        super.paintComponent(g);

        Graphics2D g2 = (Graphics2D) g.create();

        int w = getWidth();
        int h = getHeight();

        if (w <= 0 || h <= 0) {
            g2.dispose();
            return;
        }

        g2.setRenderingHint(
            RenderingHints.KEY_ANTIALIASING,
            RenderingHints.VALUE_ANTIALIAS_ON
        );

        // 1. Deep navy gradient
        GradientPaint navy = new GradientPaint(
            0, 0, new Color(8, 17, 32),
            w, h, new Color(25, 43, 68)
        );

        g2.setPaint(navy);
        g2.fillRect(0, 0, w, h);

        // 2. Golden corner illumination
        g2.setColor(new Color(255, 215, 0, 65));
        g2.fillOval(w - 300, -150, 450, 450);

        g2.setColor(new Color(212, 175, 55, 45));
        g2.fillOval(-180, h - 300, 450, 450);

        // 3. Additional soft gold glow
        g2.setColor(new Color(255, 215, 0, 25));
        g2.fillOval(w - 230, -80, 300, 300);

        // 4. Moving golden light streak
        int x = (int) (lightPosition * (w + 300)) - 150;

        GradientPaint light = new GradientPaint(
            x - 100, 0, new Color(255, 215, 0, 0),
            x + 100, h, new Color(255, 215, 0, 110)
        );

        g2.setPaint(light);
        g2.fillRect(0, 0, w, h);

        // 5. Floating golden particles
        for (Particle p : particles) {

            g2.setColor(new Color(255, 215, 0, p.alpha));

            g2.fillOval(p.x, p.y, p.size, p.size);
        }

        g2.dispose();
    }

    public void stopAnimation() {
        if (animationTimer != null) {
            animationTimer.stop();
        }
    }

    public void startAnimation() {
        if (animationTimer != null && !animationTimer.isRunning()) {
            animationTimer.start();
        }
    }

    private static class Particle {

        int x, y, size, speed;
        int alpha = 80;
        int fadeDirection = 1;

        Particle(int x, int y, int size, int speed) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;
        }
    }
}