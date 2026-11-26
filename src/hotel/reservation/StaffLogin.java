/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;
import javax.imageio.ImageIO;

public class StaffLogin extends JFrame {

    static final Color GOLD = new Color(0xD4AF5F);
    static final Color NAVY = new Color(0x0D1830);
    static final String BACKGROUND_IMAGE = "/images/login-bg.jpg";
    

    private BackgroundPanel pnlBackground;
    private JLabel lblCrown, lblHotelName, lblTitle, lblUsername, lblPassword,
                   lblForgot, lblError, lblNoAccount, lblRegister;
    private RoundField fldUsername, fldPassword;
    private GoldButton btnLogin;

    public StaffLogin() {
        setTitle("Royal Haven - Login");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(1000, 700);
        setLocationRelativeTo(null);

        pnlBackground = new BackgroundPanel();
        setContentPane(pnlBackground);

        // ---------- labels ----------
        lblCrown = new JLabel(new CrownIcon(90), SwingConstants.CENTER);

        lblHotelName = new JLabel("ROYAL HAVEN", SwingConstants.CENTER);
        lblHotelName.setFont(new Font("SansSerif", Font.BOLD, 15));
        lblHotelName.setForeground(GOLD);

        lblTitle = new JLabel("Login", SwingConstants.CENTER);
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 38));
        lblTitle.setForeground(Color.WHITE);

        lblUsername = new JLabel("Username");
        lblUsername.setFont(new Font("SansSerif", Font.BOLD, 13));
        lblUsername.setForeground(Color.WHITE);

        lblPassword = new JLabel("Password");
        lblPassword.setFont(new Font("SansSerif", Font.BOLD, 13));
        lblPassword.setForeground(Color.WHITE);

        lblForgot = new JLabel("<html><u>Forgot password?</u></html>");
        lblForgot.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lblForgot.setForeground(new Color(0xE6E9F2));
        lblForgot.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        lblError = new JLabel(" ");
        lblError.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lblError.setForeground(new Color(0xFF9A9A));

        lblNoAccount = new JLabel("Don't have an account?", SwingConstants.CENTER);
        lblNoAccount.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lblNoAccount.setForeground(new Color(0xE6E9F2));

        lblRegister = new JLabel("<html><u>Register here</u></html>", SwingConstants.CENTER);
        lblRegister.setFont(new Font("SansSerif", Font.BOLD, 12));
        lblRegister.setForeground(GOLD);
        lblRegister.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        // ---------- fields and button ----------
        fldUsername = new RoundField(new JTextField(), 0, false, "Enter your username");
        fldPassword = new RoundField(new JPasswordField(), 1, true, "Enter your password");

        btnLogin = new GoldButton("Login  \u2192");
        btnLogin.setPreferredSize(new Dimension(380, 46));
        btnLogin.setMaximumSize(new Dimension(380, 46));
        btnLogin.setAlignmentX(Component.CENTER_ALIGNMENT);

        // ---------- form column ----------
        JPanel pnlForm = new JPanel();
        pnlForm.setOpaque(false);
        pnlForm.setLayout(new BoxLayout(pnlForm, BoxLayout.Y_AXIS));
        pnlForm.add(rowCenter(lblCrown));
        pnlForm.add(Box.createVerticalStrut(6));
        pnlForm.add(rowCenter(lblHotelName));
        pnlForm.add(rowCenter(lblTitle));
        pnlForm.add(Box.createVerticalStrut(22));
        pnlForm.add(rowLeft(lblUsername));
        pnlForm.add(Box.createVerticalStrut(6));
        pnlForm.add(fldUsername);
        pnlForm.add(Box.createVerticalStrut(16));
        pnlForm.add(rowLeft(lblPassword));
        pnlForm.add(Box.createVerticalStrut(6));
        pnlForm.add(fldPassword);
        pnlForm.add(Box.createVerticalStrut(8));
        pnlForm.add(rowLeft(lblForgot));
        pnlForm.add(Box.createVerticalStrut(4));
        pnlForm.add(rowLeft(lblError));
        pnlForm.add(Box.createVerticalStrut(14));
        pnlForm.add(btnLogin);
        pnlForm.add(Box.createVerticalStrut(18));
        pnlForm.add(rowCenter(lblNoAccount));
        pnlForm.add(rowCenter(lblRegister));

        JPanel pnlLeft = new JPanel();       // empty: the photo shows through
        pnlLeft.setOpaque(false);
        JPanel pnlRight = new JPanel(new GridBagLayout());
        pnlRight.setOpaque(false);
        pnlRight.add(pnlForm);

        pnlBackground.add(pnlLeft);
        pnlBackground.add(pnlRight);

        // ---------- actions ----------
        btnLogin.addActionListener(e -> doLogin());
        getRootPane().setDefaultButton(btnLogin);     // Enter key = Login

        lblForgot.addMouseListener(new MouseAdapter() {
            @Override public void mouseClicked(MouseEvent e) {
                JOptionPane.showMessageDialog(StaffLogin.this,
                        "Please contact your system administrator to reset your password.",
                        "Forgot password", JOptionPane.INFORMATION_MESSAGE);
            }
        });
        lblRegister.addMouseListener(new MouseAdapter() {
            @Override public void mouseClicked(MouseEvent e) {
                JOptionPane.showMessageDialog(StaffLogin.this,
                        "New accounts are created by an administrator in User Management.",
                        "Register", JOptionPane.INFORMATION_MESSAGE);
            }
        });
    }

    // ================= LOGIN LOGIC =================
    private void doLogin() {
        String user = fldUsername.field.getText().trim();
        String pass = new String(((JPasswordField) fldPassword.field).getPassword());

        if (user.isEmpty() || pass.isEmpty()) {
            lblError.setText("Please enter your username and password.");
            return;
        }
        if (authenticate(user, pass)) {
            new Dashboard().setVisible(true);     // your dashboard class name
            dispose();
        } else {
            lblError.setText("Incorrect username or password.");
            ((JPasswordField) fldPassword.field).setText("");
        }
    }

    /** TEMPORARY - replace with a database check against your users table. */
    private boolean authenticate(String user, String pass) {
        return user.equals("admin") && pass.equals("admin123");
    }

    // ================= LAYOUT HELPERS =================
    private static JPanel rowLeft(JComponent c) {
        JPanel p = new JPanel(new BorderLayout());
        p.setOpaque(false);
        p.add(c, BorderLayout.WEST);
        p.setMaximumSize(new Dimension(380, c.getPreferredSize().height + 4));
        p.setAlignmentX(Component.CENTER_ALIGNMENT);
        return p;
    }

    private static JPanel rowCenter(JComponent c) {
        JPanel p = new JPanel(new BorderLayout());
        p.setOpaque(false);
        p.add(c, BorderLayout.CENTER);
        p.setMaximumSize(new Dimension(380, c.getPreferredSize().height + 4));
        p.setAlignmentX(Component.CENTER_ALIGNMENT);
        return p;
    }

    // ================= BACKGROUND (photo + dark right half) =================
 
static class BackgroundPanel extends JPanel {

    private Image bg;

    BackgroundPanel() {

        setLayout(new GridLayout(1, 2));

        try {
            java.net.URL url = getClass().getResource("/images/login-bg.jpg");

            System.out.println("Image URL: " + url);

            if (url != null) {
                bg = ImageIO.read(url);
                System.out.println("IMAGE LOADED SUCCESSFULLY");
            } else {
                System.out.println("IMAGE NOT FOUND!");
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        Graphics2D g2 = (Graphics2D) g.create();

        int w = getWidth();
        int h = getHeight();

        if (bg != null) {

            double scale = Math.max(
                (double) w / bg.getWidth(null),
                (double) h / bg.getHeight(null)
            );

            int iw = (int) (bg.getWidth(null) * scale);
            int ih = (int) (bg.getHeight(null) * scale);

            g2.drawImage(
                bg,
                (w - iw) / 2,
                (h - ih) / 2,
                iw,
                ih,
                null
            );

        } else {
            g2.setColor(NAVY);
            g2.fillRect(0, 0, w, h);
        }

        // Left side overlay
        g2.setColor(new Color(13, 24, 48, 60));
        g2.fillRect(0, 0, w / 2, h);

        // Right side dark overlay
        g2.setColor(new Color(13, 24, 48, 175));
        g2.fillRect(w / 2, 0, w - w / 2, h);

        // Divider
        g2.setColor(new Color(255, 255, 255, 230));
        g2.fillRoundRect(
            w / 2 - 2,
            (int) (h * 0.12),
            4,
            (int) (h * 0.76),
            4,
            4
        );

        g2.dispose();
    }
}

    // ================= ROUNDED INPUT FIELD =================
    static class RoundField extends JPanel {
        final JTextField field;
        private final String hint;

        RoundField(JTextField field, int leftIcon, boolean eye, String hint) {
            this.field = field;
            this.hint = hint;
            setOpaque(false);
            setLayout(new BorderLayout(10, 0));
            setBorder(BorderFactory.createEmptyBorder(0, 14, 0, 14));
            setPreferredSize(new Dimension(380, 44));
            setMaximumSize(new Dimension(380, 44));
            setAlignmentX(Component.CENTER_ALIGNMENT);

            field.setOpaque(false);
            field.setBorder(null);
            field.setFont(new Font("SansSerif", Font.PLAIN, 14));
            field.setForeground(NAVY);
            field.setCaretColor(NAVY);

            add(new JLabel(new FieldIcon(leftIcon)), BorderLayout.WEST);
            add(field, BorderLayout.CENTER);

            field.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
                @Override
                public void insertUpdate(javax.swing.event.DocumentEvent e)  { repaint(); }
                @Override
                public void removeUpdate(javax.swing.event.DocumentEvent e)  { repaint(); }
                @Override
                public void changedUpdate(javax.swing.event.DocumentEvent e) { repaint(); }
            });

            if (eye && field instanceof JPasswordField) {
                final JPasswordField pf = (JPasswordField) field;
                pf.setEchoChar('\u2022');
                final JLabel lblEye = new JLabel(new FieldIcon(3));
                lblEye.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
                lblEye.addMouseListener(new MouseAdapter() {
                    boolean shown = false;
                    @Override public void mouseClicked(MouseEvent e) {
                        shown = !shown;
                        pf.setEchoChar(shown ? (char) 0 : '\u2022');
                        lblEye.setIcon(new FieldIcon(shown ? 2 : 3));
                    }
                });
                add(lblEye, BorderLayout.EAST);
            }
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(new Color(255, 255, 255, 238));
            g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 14, 14);
            g2.dispose();
        }

        @Override
        protected void paintChildren(Graphics g) {
            super.paintChildren(g);
            if (field.getDocument().getLength() == 0) {          // grey hint text
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
                g2.setColor(new Color(0x9CA3AF));
                g2.setFont(field.getFont());
                FontMetrics fm = g2.getFontMetrics();
                int y = field.getY() + (field.getHeight() + fm.getAscent() - fm.getDescent()) / 2;
                g2.drawString(hint, field.getX(), y);
                g2.dispose();
            }
        }
    }

    // ================= SMALL ICONS: 0 mail, 1 lock, 2 eye, 3 eye-off =================
    static class FieldIcon implements Icon {
        private final int kind;
        FieldIcon(int kind) { this.kind = kind; }

        @Override public int getIconWidth()  { return 20; }
        @Override public int getIconHeight() { return 20; }

        @Override
        public void paintIcon(Component c, Graphics g, int x, int y) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.translate(x, y);
            g2.scale(20 / 24.0, 20 / 24.0);
            g2.setColor(new Color(0x6B7280));
            g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));

            if (kind == 0) {                                   // mail
                g2.draw(new RoundRectangle2D.Double(3, 6, 18, 12, 3, 3));
                Path2D.Double flap = new Path2D.Double();
                flap.moveTo(3.5, 7.5); flap.lineTo(12, 13.5); flap.lineTo(20.5, 7.5);
                g2.draw(flap);
            } else if (kind == 1) {                            // lock
                g2.draw(new RoundRectangle2D.Double(5, 11, 14, 9, 3, 3));
                g2.draw(new Arc2D.Double(8, 3, 8, 10, 0, 180, Arc2D.OPEN));
                g2.draw(new Line2D.Double(8, 8, 8, 11));
                g2.draw(new Line2D.Double(16, 8, 16, 11));
            } else {                                           // eye / eye-off
                Path2D.Double eye = new Path2D.Double();
                eye.moveTo(2, 12);
                eye.quadTo(12, 2, 22, 12);
                eye.quadTo(12, 22, 2, 12);
                g2.draw(eye);
                g2.fill(new Ellipse2D.Double(9.5, 9.5, 5, 5));
                if (kind == 3) g2.draw(new Line2D.Double(4, 20, 20, 4));
            }
            g2.dispose();
        }
    }

    // ================= CROWN LOGO =================
    static class CrownIcon implements Icon {
        private final int size;

        CrownIcon(int size) { this.size = size; }

        @Override public int getIconWidth()  { return size; }
        @Override public int getIconHeight() { return size; }

        @Override
        public void paintIcon(Component c, Graphics g, int x, int y) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.translate(x, y);
            g2.scale(size / 100.0, size / 100.0);

            Color ringGold = new Color(0xD9B63F);
            Color lightGold = new Color(0xF5E39A);

            g2.setColor(ringGold);
            g2.setStroke(new BasicStroke(2.4f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
            g2.draw(new Arc2D.Double(6, 8, 88, 88, 25, 310, Arc2D.OPEN));

            Path2D.Double crown = new Path2D.Double();
            crown.moveTo(22, 63);
            crown.quadTo(10, 50, 17, 34);
            crown.quadTo(26, 30, 32, 42);
            crown.curveTo(33, 22, 40, 16, 50, 13);
            crown.curveTo(60, 16, 67, 22, 68, 42);
            crown.quadTo(74, 30, 83, 34);
            crown.quadTo(90, 50, 78, 63);
            crown.quadTo(50, 73, 22, 63);
            crown.closePath();
            g2.setPaint(new GradientPaint(0, 12, new Color(0xF3D970), 0, 70, new Color(0xC9A02E)));
            g2.fill(crown);

            g2.setColor(new Color(0xE8CC62));
            g2.fill(new Ellipse2D.Double(46.8, 9, 6.4, 6.4));
            g2.fill(new Ellipse2D.Double(13.8, 30, 6.4, 6.4));
            g2.fill(new Ellipse2D.Double(79.8, 30, 6.4, 6.4));

            g2.setColor(lightGold);
            g2.setStroke(new BasicStroke(2.2f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
            g2.draw(new QuadCurve2D.Double(25, 60, 50, 69, 75, 60));

            Path2D.Double d1 = new Path2D.Double();
            d1.moveTo(50, 34.5); d1.lineTo(55.5, 40); d1.lineTo(50, 45.5); d1.lineTo(44.5, 40); d1.closePath();
            g2.setColor(lightGold);
            g2.fill(d1);

            Path2D.Double d2 = new Path2D.Double();
            d2.moveTo(50, 84.5); d2.lineTo(55.5, 90); d2.lineTo(50, 95.5); d2.lineTo(44.5, 90); d2.closePath();
            g2.setColor(new Color(0xE8CC62));
            g2.fill(d2);

            g2.dispose();
        }
    }

    // ================= GOLD LOGIN BUTTON =================
    static class GoldButton extends JButton {
        GoldButton(String text) {
            super(text);
            setFont(new Font("SansSerif", Font.BOLD, 15));
            setForeground(NAVY);
            setContentAreaFilled(false);
            setBorderPainted(false);
            setFocusPainted(false);
            setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setPaint(new GradientPaint(0, 0, new Color(0xF3D27A), getWidth(), getHeight(), new Color(0xC9A24E)));
            g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 12, 12);
            g2.dispose();
            super.paintComponent(g);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new StaffLogin().setVisible(true));
    }
}
