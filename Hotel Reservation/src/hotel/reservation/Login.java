package hotel.reservation;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;
import javax.swing.SwingConstants;

/** Polished staff sign-in screen. */
public final class Login extends JFrame {
    private final JTextField username = new JTextField();
    private final JPasswordField password = new JPasswordField();
    private final JLabel error = new JLabel(" ");

    public Login() {
        setTitle("Royal Haven | Staff Login");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setMinimumSize(new Dimension(980, 620));
        setSize(1100, 680);
        setLocationRelativeTo(null);
        setExtendedState(MAXIMIZED_BOTH);
        setLayout(new BorderLayout());
        add(new LoginArtPanel(), BorderLayout.WEST);
        add(formPanel(), BorderLayout.CENTER);
    }

    private JPanel formPanel() {
        JPanel panel = new JPanel(new GridBagLayout()); panel.setBackground(UiTheme.NAVY_DEEP); panel.setBorder(BorderFactory.createEmptyBorder(50, 64, 50, 64));
        JPanel content = new JPanel(new GridBagLayout()); content.setOpaque(false); GridBagConstraints c = new GridBagConstraints(); c.gridx = 0; c.fill = GridBagConstraints.HORIZONTAL; c.weightx = 1; c.insets = new Insets(7, 0, 7, 0);
        JLabel eyebrow = new JLabel("STAFF PORTAL"); eyebrow.setForeground(UiTheme.GOLD); eyebrow.setFont(new Font("SansSerif", Font.BOLD, 12)); c.gridy = 0; content.add(eyebrow, c);
        JLabel title = new JLabel("Welcome back"); title.setForeground(Color.WHITE); title.setFont(new Font("Georgia", Font.BOLD, 34)); c.gridy = 1; c.insets = new Insets(3, 0, 4, 0); content.add(title, c);
        JLabel subtitle = new JLabel("Sign in to manage today’s stays and guests."); subtitle.setForeground(UiTheme.MUTED); subtitle.setFont(new Font("SansSerif", Font.PLAIN, 14)); c.gridy = 2; c.insets = new Insets(0, 0, 28, 0); content.add(subtitle, c);
        c.insets = new Insets(7, 0, 5, 0); c.gridy = 3; content.add(label("Username"), c); styleField(username); c.gridy = 4; content.add(username, c);
        c.gridy = 5; content.add(label("Password"), c); c.gridy = 6; styleField(password); content.add(password, c);
        error.setForeground(new Color(245, 130, 130)); error.setFont(new Font("SansSerif", Font.PLAIN, 12)); c.gridy = 7; c.insets = new Insets(8, 0, 8, 0); content.add(error, c);
        JButton login = new JButton("Sign in"); login.setBackground(UiTheme.GOLD); login.setForeground(UiTheme.NAVY_DEEP); login.setFont(new Font("SansSerif", Font.BOLD, 14)); login.setFocusPainted(false); login.setBorder(BorderFactory.createEmptyBorder(13, 18, 13, 18)); login.addActionListener(e -> signIn()); c.gridy = 8; content.add(login, c);
        JLabel note = new JLabel("Royal Haven · Boutique & Spa", SwingConstants.CENTER); note.setForeground(new Color(130, 145, 165)); note.setFont(new Font("SansSerif", Font.PLAIN, 12)); c.gridy = 9; c.insets = new Insets(26, 0, 0, 0); content.add(note, c);
        GridBagConstraints outer = new GridBagConstraints(); outer.anchor = GridBagConstraints.CENTER; outer.fill = GridBagConstraints.HORIZONTAL; outer.weightx = 1; panel.add(content, outer); return panel;
    }

    private JLabel label(String text) { JLabel l = new JLabel(text); l.setForeground(new Color(220, 226, 238)); l.setFont(new Font("SansSerif", Font.BOLD, 12)); return l; }
    private void styleField(javax.swing.JComponent field) { field.setPreferredSize(new Dimension(0, 44)); field.setBackground(new Color(28, 48, 76)); field.setForeground(Color.WHITE); if (field instanceof javax.swing.text.JTextComponent text) text.setCaretColor(UiTheme.GOLD); field.setFont(new Font("SansSerif", Font.PLAIN, 14)); field.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(new Color(70, 91, 122)), BorderFactory.createEmptyBorder(0, 12, 0, 12))); }
    private void signIn() {
        if (username.getText().trim().isEmpty() || password.getPassword().length == 0) { error.setText("Enter your username and password to continue."); return; }
        try {
            if (hotel.database.HotelRepository.authenticate(username.getText().trim(), new String(password.getPassword())) != null) Navigation.open(this, new Dashboard());
            else { error.setText("Incorrect username or password."); password.setText(""); }
        } catch (java.sql.SQLException ex) { error.setText("Database login unavailable."); }
    }
    public static void main(String[] args) { javax.swing.SwingUtilities.invokeLater(() -> new Login().setVisible(true)); }
}
