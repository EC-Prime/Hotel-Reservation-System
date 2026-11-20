/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;

import java.awt.*;
import java.util.ArrayList;
import java.util.Random;
import javax.swing.*;

public class GoldParticlePanel extends JPanel {

    private final ArrayList<Particle> particles = new ArrayList<>();
    private final Random random = new Random();

    private Timer animationTimer;

    public GoldParticlePanel() {

        setOpaque(false);

        for (int i = 0; i < 35; i++) {
            particles.add(new Particle(
                random.nextInt(250),
                random.nextInt(800),
                2 + random.nextInt(3),
                1 + random.nextInt(2)
            ));
        }

        animationTimer = new Timer(35, e -> {
            for (Particle p : particles) {

                p.y -= p.speed;

                if (p.y < -5) {
                    p.y = getHeight() + random.nextInt(100);
                    p.x = random.nextInt(
                        Math.max(1, getWidth())
                    );
                }

                p.alpha += p.fadeDirection * 4;

                if (p.alpha >= 220) {
                    p.alpha = 220;
                    p.fadeDirection = -1;
                }

                if (p.alpha <= 40) {
                    p.alpha = 40;
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

        g2.setRenderingHint(
            RenderingHints.KEY_ANTIALIASING,
            RenderingHints.VALUE_ANTIALIAS_ON
        );

        for (Particle p : particles) {

            g2.setColor(new Color(
                255, 215, 0, p.alpha
            ));

            g2.fillOval(
                p.x, p.y, p.size, p.size
            );
        }

        g2.dispose();
    }

    private static class Particle {

        int x, y, size, speed;
        int alpha = 100;
        int fadeDirection = 1;

        Particle(int x, int y, int size, int speed) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;
        }
    }

    public void stopAnimation() {
        if (animationTimer != null) {
            animationTimer.stop();
        }
    }

    public void startAnimation() {
        if (animationTimer != null) {
            animationTimer.start();
        }
    }
}
