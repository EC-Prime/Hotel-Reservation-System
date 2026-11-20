/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;

public class GoldIcon implements Icon {
    public enum Type { BUILDING, PIN, MAIL, PHONE }

    private final Type type;
    private final int size;

    public GoldIcon(Type type, int size) {
        this.type = type;
        this.size = size;
    }

    @Override
    public void paintIcon(Component c, Graphics g, int x, int y) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.translate(x, y);
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                            RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL,
                            RenderingHints.VALUE_STROKE_PURE);
        double s = size;

        g2.setColor(new Color(212, 175, 55));
        g2.setStroke(new BasicStroke(1.5f));
        g2.draw(new Ellipse2D.Double(0.75, 0.75, s - 1.5, s - 1.5));

        g2.setColor(new Color(245, 205, 80));
        g2.setStroke(new BasicStroke((float) (s * 0.045),
                BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));

        switch (type) {
            case BUILDING:
                g2.draw(new RoundRectangle2D.Double(s * .32, s * .24, s * .36, s * .52, 2, 2));
                for (int r = 0; r < 3; r++) {
                    for (int col = 0; col < 2; col++) {
                        g2.fill(new Rectangle2D.Double(
                                s * .39 + col * s * .14, s * .31 + r * s * .11,
                                s * .07, s * .06));
                    }
                }
                g2.fill(new Rectangle2D.Double(s * .46, s * .66, s * .08, s * .1));
                break;

            case PIN:
                Area pin = new Area(new Ellipse2D.Double(s * .33, s * .25, s * .34, s * .34));
                Path2D tip = new Path2D.Double();
                tip.moveTo(s * .36, s * .52);
                tip.lineTo(s * .64, s * .52);
                tip.lineTo(s * .5, s * .76);
                tip.closePath();
                pin.add(new Area(tip));
                g2.draw(pin);
                g2.fill(new Ellipse2D.Double(s * .44, s * .36, s * .12, s * .12));
                break;

            case MAIL:
                g2.draw(new RoundRectangle2D.Double(s * .27, s * .33, s * .46, s * .34, 3, 3));
                Path2D flap = new Path2D.Double();
                flap.moveTo(s * .27, s * .35);
                flap.lineTo(s * .5, s * .53);
                flap.lineTo(s * .73, s * .35);
                g2.draw(flap);
                break;

            case PHONE:
                g2.draw(new RoundRectangle2D.Double(s * .38, s * .25, s * .24, s * .5, 5, 5));
                g2.draw(new Line2D.Double(s * .45, s * .66, s * .55, s * .66));
                break;
        }
        g2.dispose();
    }

    @Override
    public int getIconWidth() { return size; }

    @Override
    public int getIconHeight() { return size; }
}