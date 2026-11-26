/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
package hotel.reservation;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Component;
import java.awt.GradientPaint;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.Arc2D;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Path2D;
import java.awt.geom.QuadCurve2D;
import javax.swing.Icon;
import java.awt.Cursor;
import javax.swing.SwingConstants;
import java.awt.geom.Line2D;


/**
 *
 * @author DCS Admin
 */
public class Logout extends javax.swing.JFrame {
    
    private static final java.util.logging.Logger logger = java.util.logging.Logger.getLogger(Logout.class.getName());

    /**
     * Creates new form Logout
     */
    public Logout() {
        initComponents();
        
       
     lblCrown.setText("");
     lblCrown.setIcon(new CrownIcon(120));
     
     
     getContentPane().setBackground(new Color(0x0D1830));
Color gold  = new Color(0xD4AF5F);
Color muted = new Color(0xA9B2C8);

lblHotelName.setText("ROYAL HAVEN");
lblHotelName.setFont(new Font("SansSerif", Font.BOLD, 26));
lblHotelName.setForeground(gold);
lblHotelName.setHorizontalAlignment(SwingConstants.CENTER);

lblTagLine.setText("BOUTIQUE & SPA");
lblTagLine.setFont(new Font("SansSerif", Font.PLAIN, 11));
lblTagLine.setForeground(muted);
lblTagLine.setHorizontalAlignment(SwingConstants.CENTER);

lblLogoutIcon.setText("");
lblLogoutIcon.setIcon(new LogoutIcon());
lblLogoutIcon.setHorizontalAlignment(SwingConstants.CENTER);

L.setText("Leaving so soon?");
L.setFont(new Font("SansSerif", Font.BOLD, 26));
L.setForeground(Color.WHITE);
L.setHorizontalAlignment(SwingConstants.CENTER);

lblQuestion.setText("<html><div style='text-align:center'>Are you sure you want to log out of<br>your account?</div></html>");
lblQuestion.setFont(new Font("SansSerif", Font.PLAIN, 14));
lblQuestion.setForeground(muted);
lblQuestion.setHorizontalAlignment(SwingConstants.CENTER);

btnYes.setText("Yes, Log Out");
btnYes.setFont(new Font("SansSerif", Font.BOLD, 16));
btnYes.setBackground(new Color(0xC9A24E));
btnYes.setForeground(new Color(0x0D1830));
btnYes.setBorderPainted(false);
btnYes.setFocusPainted(false);
btnYes.setOpaque(true);
btnYes.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

btnCancel.setText("Cancel");
btnCancel.setFont(new Font("SansSerif", Font.BOLD, 16));
btnCancel.setForeground(gold);
btnCancel.setContentAreaFilled(false);
btnCancel.setFocusPainted(false);
btnCancel.setBorder(new javax.swing.border.LineBorder(new Color(0xC9A24E), 1, true));
btnCancel.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

lblSecure.setText("Your session will end securely.");
lblSecure.setFont(new Font("SansSerif", Font.PLAIN, 12));
lblSecure.setForeground(muted);
lblSecure.setHorizontalAlignment(SwingConstants.CENTER);

lblFooter.setText("\u00A9 2026 ROYAL HAVEN \u00B7 ALL RIGHTS RESERVED");
lblFooter.setFont(new Font("SansSerif", Font.PLAIN, 10));
lblFooter.setForeground(muted);
lblFooter.setHorizontalAlignment(SwingConstants.CENTER);

setLocationRelativeTo(null);
     
     
      
    }
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
    
static class LogoutIcon implements Icon {
    @Override public int getIconWidth()  { return 76; }
    @Override public int getIconHeight() { return 76; }

    @Override
    public void paintIcon(Component c, Graphics g, int x, int y) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.translate(x, y);
        g2.setColor(new Color(0x1B2B4D));
        g2.fillOval(0, 0, 76, 76);
        g2.translate(18, 18);
        g2.scale(40 / 24.0, 40 / 24.0);
        g2.setColor(new Color(0xD4AF5F));
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        Path2D.Double door = new Path2D.Double();
        door.moveTo(10, 4); door.lineTo(4, 4); door.lineTo(4, 20); door.lineTo(10, 20);
        g2.draw(door);
        g2.draw(new Line2D.Double(9, 12, 20, 12));
        Path2D.Double arrow = new Path2D.Double();
        arrow.moveTo(16, 8); arrow.lineTo(20, 12); arrow.lineTo(16, 16);
        g2.draw(arrow);
        g2.dispose();
    }
}
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        pnlLogout = new javax.swing.JPanel();
        lblCrown = new javax.swing.JLabel();
        btnCancel = new javax.swing.JButton();
        lblHotelName = new javax.swing.JLabel();
        lblTagLine = new javax.swing.JLabel();
        jSeparator1 = new javax.swing.JSeparator();
        lblLogoutIcon = new javax.swing.JLabel();
        L = new javax.swing.JLabel();
        lblQuestion = new javax.swing.JLabel();
        btnYes = new javax.swing.JButton();
        lblSecure = new javax.swing.JLabel();
        jSeparator2 = new javax.swing.JSeparator();
        lblFooter = new javax.swing.JLabel();

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 100, Short.MAX_VALUE)
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 100, Short.MAX_VALUE)
        );

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        pnlLogout.setBackground(new java.awt.Color(18, 32, 54));

        lblCrown.setText("l");

        btnCancel.setText("C");
        btnCancel.addActionListener(this::btnCancelActionPerformed);

        lblHotelName.setText("R");

        lblTagLine.setText("B");

        jSeparator1.setBackground(new java.awt.Color(233, 196, 91));
        jSeparator1.setForeground(new java.awt.Color(233, 196, 91));

        lblLogoutIcon.setText("jLabel2");

        L.setText("jLabel2");

        lblQuestion.setText("S");

        btnYes.setText("Y");
        btnYes.addActionListener(this::btnYesActionPerformed);

        lblSecure.setText("Y");

        jSeparator2.setBackground(new java.awt.Color(233, 196, 91));
        jSeparator2.setForeground(new java.awt.Color(233, 196, 91));

        lblFooter.setText("A");

        javax.swing.GroupLayout pnlLogoutLayout = new javax.swing.GroupLayout(pnlLogout);
        pnlLogout.setLayout(pnlLogoutLayout);
        pnlLogoutLayout.setHorizontalGroup(
            pnlLogoutLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlLogoutLayout.createSequentialGroup()
                .addGroup(pnlLogoutLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jSeparator1, javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(pnlLogoutLayout.createSequentialGroup()
                        .addGroup(pnlLogoutLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlLogoutLayout.createSequentialGroup()
                                .addGap(78, 78, 78)
                                .addGroup(pnlLogoutLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(lblHotelName, javax.swing.GroupLayout.PREFERRED_SIZE, 251, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblTagLine, javax.swing.GroupLayout.PREFERRED_SIZE, 210, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(pnlLogoutLayout.createSequentialGroup()
                                .addGap(151, 151, 151)
                                .addComponent(lblLogoutIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 69, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(pnlLogoutLayout.createSequentialGroup()
                                .addGap(80, 80, 80)
                                .addComponent(L, javax.swing.GroupLayout.PREFERRED_SIZE, 224, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(pnlLogoutLayout.createSequentialGroup()
                                .addGap(58, 58, 58)
                                .addGroup(pnlLogoutLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(btnYes, javax.swing.GroupLayout.PREFERRED_SIZE, 294, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(btnCancel, javax.swing.GroupLayout.PREFERRED_SIZE, 294, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlLogoutLayout.createSequentialGroup()
                                .addContainerGap()
                                .addComponent(lblQuestion, javax.swing.GroupLayout.PREFERRED_SIZE, 281, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlLogoutLayout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(lblCrown, javax.swing.GroupLayout.PREFERRED_SIZE, 215, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(118, 118, 118))
            .addGroup(pnlLogoutLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(pnlLogoutLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlLogoutLayout.createSequentialGroup()
                        .addGap(6, 6, 6)
                        .addComponent(lblFooter, javax.swing.GroupLayout.PREFERRED_SIZE, 412, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap(45, Short.MAX_VALUE))
                    .addGroup(pnlLogoutLayout.createSequentialGroup()
                        .addComponent(jSeparator2)
                        .addContainerGap())))
            .addGroup(pnlLogoutLayout.createSequentialGroup()
                .addGap(84, 84, 84)
                .addComponent(lblSecure, javax.swing.GroupLayout.PREFERRED_SIZE, 253, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        pnlLogoutLayout.setVerticalGroup(
            pnlLogoutLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlLogoutLayout.createSequentialGroup()
                .addGap(12, 12, 12)
                .addComponent(lblCrown, javax.swing.GroupLayout.PREFERRED_SIZE, 122, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(lblHotelName, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(lblTagLine)
                .addGap(22, 22, 22)
                .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(lblLogoutIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 47, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(L, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(lblQuestion, javax.swing.GroupLayout.PREFERRED_SIZE, 56, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(btnYes, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(btnCancel, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(lblSecure, javax.swing.GroupLayout.PREFERRED_SIZE, 28, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jSeparator2, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 15, Short.MAX_VALUE)
                .addComponent(lblFooter, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(18, 18, 18)
                .addComponent(pnlLogout, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(pnlLogout, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void btnCancelActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCancelActionPerformed
        // TODO add your handling code here:
        dispose();
    }//GEN-LAST:event_btnCancelActionPerformed

    private void btnYesActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnYesActionPerformed
        // TODO add your handling code here:
// close every open page (Dashboard, Payments, etc.), then go back to login
   
StaffLogin login = new StaffLogin();
login.setVisible(true);
this.dispose();

    }//GEN-LAST:event_btnYesActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ReflectiveOperationException | javax.swing.UnsupportedLookAndFeelException ex) {
            logger.log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(() -> new Logout().setVisible(true));
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel L;
    private javax.swing.JButton btnCancel;
    private javax.swing.JButton btnYes;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JSeparator jSeparator2;
    private javax.swing.JLabel lblCrown;
    private javax.swing.JLabel lblFooter;
    private javax.swing.JLabel lblHotelName;
    private javax.swing.JLabel lblLogoutIcon;
    private javax.swing.JLabel lblQuestion;
    private javax.swing.JLabel lblSecure;
    private javax.swing.JLabel lblTagLine;
    private javax.swing.JPanel pnlLogout;
    // End of variables declaration//GEN-END:variables
}
