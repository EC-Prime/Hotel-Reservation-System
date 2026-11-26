/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hotel.reservation;

import java.awt.*;
import javax.swing.*;
import javax.swing.table.*;

public class ActionRenderer extends JPanel implements TableCellRenderer {

    private JButton btnEdit = new JButton("✎ Edit");
    private JButton btnDelete = new JButton("🗑 Delete");

    public ActionRenderer() {
        setLayout(new FlowLayout(FlowLayout.CENTER, 15, 5));
        setOpaque(true);

        btnEdit.setForeground(new Color(245, 196, 83));
        btnEdit.setBackground(new Color(28, 53, 85));

        btnDelete.setForeground(new Color(220, 100, 100));
        btnDelete.setBackground(new Color(65, 35, 45));

        add(btnEdit);
        add(btnDelete);
    }

    @Override
    public Component getTableCellRendererComponent(
            JTable table, Object value, boolean isSelected,
            boolean hasFocus, int row, int column) {

        setBackground(isSelected ? table.getSelectionBackground()
                                 : table.getBackground());

        return this;
    }
}
