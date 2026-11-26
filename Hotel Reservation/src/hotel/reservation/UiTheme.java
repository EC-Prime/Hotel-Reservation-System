package hotel.reservation;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import javax.swing.BorderFactory;
import javax.swing.JScrollPane;
import javax.swing.JTable;

/** Shared visual tokens and compact database-table behavior. */
public final class UiTheme {
    public static final Color NAVY = new Color(18, 32, 54);
    public static final Color NAVY_DEEP = new Color(11, 22, 40);
    public static final Color PANEL = new Color(24, 42, 68);
    public static final Color GOLD = new Color(233, 196, 91);
    public static final Color TEXT = new Color(245, 247, 250);
    public static final Color MUTED = new Color(180, 190, 205);

    private UiTheme() { }

    public static void compactTable(JTable table) {
        table.setFillsViewportHeight(false);
        table.setRowHeight(36);
        table.setBackground(NAVY);
        table.setForeground(TEXT);
        table.setGridColor(new Color(45, 61, 82));
        table.setSelectionBackground(new Color(46, 76, 115));
        table.setSelectionForeground(TEXT);
        table.getTableHeader().setOpaque(true);
        table.getTableHeader().setBackground(NAVY_DEEP);
        table.getTableHeader().setForeground(GOLD);
        table.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 12));
        table.getTableHeader().setPreferredSize(new Dimension(0, 36));
    }

    public static void compactScrollPane(JScrollPane scroll, JTable table, int width) {
        compactTable(table);
        scroll.setBorder(BorderFactory.createEmptyBorder());
        scroll.getViewport().setBackground(NAVY);
        int rows = Math.max(1, table.getRowCount());
        scroll.setPreferredSize(new Dimension(width, Math.min(560, 36 + rows * table.getRowHeight() + 8)));
    }

    public static void compactScrollPaneToRows(JScrollPane scroll, JTable table, int width) {
        compactScrollPane(scroll, table, width);
        scroll.revalidate();
        scroll.getParent().revalidate();
    }
}
