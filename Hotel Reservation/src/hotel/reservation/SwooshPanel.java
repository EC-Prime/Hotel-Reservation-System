/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.Path2D;
    
  

public class SwooshPanel extends JPanel {

    public SwooshPanel() {
        setOpaque(false);
    }

    @Override
protected void paintComponent(Graphics g) {
    super.paintComponent(g);
    Graphics2D g2 = (Graphics2D) g.create();
    g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                        RenderingHints.VALUE_ANTIALIAS_ON);

    int w = getWidth(), h = getHeight();

    g2.setPaint(new GradientPaint(0, h, new Color(140, 100, 20),
                                  w, 0, new Color(255, 215, 90)));

    drawRibbon(g2, w, h, 0, h * 0.25);        // thick ribbon
    drawRibbon(g2, w, h, h * 0.35, h * 0.08); // thin ribbon below it

    g2.dispose();
}

private void drawRibbon(Graphics2D g2, int w, int h, double dy, double thick) {
    Path2D p = new Path2D.Double();
    p.moveTo(0, h);
    p.curveTo(w * 0.4, h * 0.9, w * 0.7, h * 0.5 + dy, w, dy);
    p.lineTo(w, dy + thick);
    p.curveTo(w * 0.7, h * 0.5 + dy + thick * 0.6, w * 0.4, h, 0, h);
    p.closePath();
    g2.fill(p);
}
}

