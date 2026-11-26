import javax.swing.*;
import java.awt.*;
import java.io.InputStream;

public class sidebarTagline extends JPanel {
    private static final Color GOLD = new Color(232, 184, 79);

    /**
     *
     */
    public sidebarTagline() {
        setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
        setOpaque(false);

        Font script = loadScript(15f);

        JLabel l1 = new JLabel("Luxury Stays", SwingConstants.CENTER);
        JLabel l2 = new JLabel("Exceptional Experiences", SwingConstants.CENTER);
        for (JLabel l : new JLabel[]{l1, l2}) {
            l.setFont(script);
            l.setForeground(GOLD);
            l.setAlignmentX(Component.CENTER_ALIGNMENT);
        }

        add(wrapWithLines(l1));
        add(l2);
        setBorder(BorderFactory.createEmptyBorder(0, 8, 16, 8));
    }

    // Label with a thin gold line on each side
    private JPanel wrapWithLines(JLabel label) {
        JPanel row = new JPanel(new GridBagLayout());
        row.setOpaque(false);
        GridBagConstraints c = new GridBagConstraints();
        c.gridy = 0;
        c.fill = GridBagConstraints.HORIZONTAL;
        c.weightx = 1;
        row.add(line(), c);

        c.weightx = 0;
        c.insets = new Insets(0, 6, 0, 6);
        row.add(label, c);

        c.weightx = 1;
        c.insets = new Insets(0, 0, 0, 0);
        row.add(line(), c);
        return row;
    }

    private JComponent line() {
        JSeparator s = new JSeparator(SwingConstants.HORIZONTAL);
        s.setForeground(GOLD);
        s.setBackground(GOLD);
        return s;
    }

    private Font loadScript(float size) {
        try (InputStream in = getClass().getResourceAsStream("/fonts/EdwardianScript.ttf")) {
            Font f = Font.createFont(Font.TRUETYPE_FONT, in).deriveFont(Font.ITALIC, size);
            GraphicsEnvironment.getLocalGraphicsEnvironment().registerFont(f);
            return f;
        } catch (Exception e) {
            return new Font("Serif", Font.ITALIC, (int) size); // fallback
        }
    }
}