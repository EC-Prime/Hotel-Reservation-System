/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
package hotel.reservation;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
/**
 *
 * @author DCS Admin
 */
public class dash extends javax.swing.JFrame {
    
    private static final java.util.logging.Logger logger = java.util.logging.Logger.getLogger(dash.class.getName());

    /**
     * Creates new form dash
     */
    public dash() {
        initComponents();
        addOccupancyLegend();
        
        
        
        jScrollPane1.setVerticalScrollBarPolicy(
    javax.swing.JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED
);
         DateTimeFormatter formatter =
        DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy");

String date = LocalDate.now().format(formatter);
String[] parts = date.split(", ");

tbllatestbookings.getTableHeader().setOpaque(true);

tbllatestbookings.getTableHeader().setBackground(
    new java.awt.Color(28,53,85));

tbllatestbookings.getTableHeader().setForeground(
    new java.awt.Color(233, 196, 91));

tbllatestbookings.getTableHeader().setFont(
    new java.awt.Font("SansSerif", java.awt.Font.BOLD, 12));

tbllatestbookings.getTableHeader().setPreferredSize(
    new java.awt.Dimension(0, 35));

tbllatestbookings.getTableHeader().setDefaultRenderer(
    new javax.swing.table.DefaultTableCellRenderer() {
        @Override
        public java.awt.Component getTableCellRendererComponent(
                javax.swing.JTable table, Object value,
                boolean isSelected, boolean hasFocus,
                int row, int column) {

            javax.swing.JLabel label = (javax.swing.JLabel)
                super.getTableCellRendererComponent(
                    table, value, isSelected, hasFocus, row, column);

            label.setBackground(new java.awt.Color(11, 22, 40));
            label.setForeground(new java.awt.Color(233, 196, 91));
            label.setFont(new java.awt.Font(
                "SansSerif", java.awt.Font.BOLD, 12));
            label.setOpaque(true);

            return label;
        }
    });

     tbllatestbookings.setShowHorizontalLines(true);
 tbllatestbookings.setShowVerticalLines(true);
 tbllatestbookings.setGridColor(
    new java.awt.Color(45, 61, 82)
);
 tbllatestbookings.setRowHeight(35);
  tbllatestbookings.setForeground(
  new java.awt.Color(245,247,250));
  
  
  tbllatestbookings.getColumnModel().getColumn(4)
    .setCellRenderer(new javax.swing.table.DefaultTableCellRenderer() {

        @Override
        public java.awt.Component getTableCellRendererComponent(
                javax.swing.JTable table, Object value,
                boolean isSelected, boolean hasFocus,
                int row, int column) {

            javax.swing.JLabel label = (javax.swing.JLabel)
                super.getTableCellRendererComponent(
                    table, value, isSelected, hasFocus, row, column);

            label.setHorizontalAlignment(javax.swing.JLabel.CENTER);
            label.setOpaque(true);
            label.setFont(new java.awt.Font(
                "SansSerif", java.awt.Font.BOLD, 11));

            String status = value == null ? "" : value.toString();

            switch (status) {
                case "Confirmed":
                    label.setBackground(new java.awt.Color(32, 122, 98));
                    label.setForeground(new java.awt.Color(190, 255, 225));
                    break;

                case "Checked In":
                    label.setBackground(new java.awt.Color(36, 76, 122));
                    label.setForeground(new java.awt.Color(190, 220, 255));
                    break;

                case "Pending":
                    label.setBackground(new java.awt.Color(168, 122, 36));
                    label.setForeground(new java.awt.Color(255, 240, 190));
                    break;

                default:
                    label.setBackground(table.getBackground());
                    label.setForeground(table.getForeground());
                    break;
            }

            return label;
        }
    });
  

    }
    
    private void addOccupancyLegend() {

    pnldonutchart.setLayout(new java.awt.BorderLayout());

    javax.swing.JPanel contentPanel = new javax.swing.JPanel(
            new java.awt.GridLayout(1, 2, 15, 0)
    );

    contentPanel.setBackground(new java.awt.Color(18, 32, 54));

    // Left side: donut chart
    javax.swing.JPanel chartPanel = new javax.swing.JPanel(
            new java.awt.BorderLayout()
    );
    chartPanel.setBackground(new java.awt.Color(18, 32, 54));
    chartPanel.add(new DonutChartPanel(), java.awt.BorderLayout.CENTER);

    // Right side: room-status labels
    javax.swing.JPanel legendPanel = new javax.swing.JPanel(
            new java.awt.GridLayout(4, 1, 0, 10)
    );
    legendPanel.setBackground(new java.awt.Color(18, 32, 54));
    legendPanel.setBorder(
            javax.swing.BorderFactory.createEmptyBorder(20, 10, 20, 10)
    );

    addLegendItem(legendPanel, "Occupied", "55",
            new java.awt.Color(36, 76, 122),
            "Guests currently staying");

    addLegendItem(legendPanel, "Available", "35",
            new java.awt.Color(32, 122, 98),
            "Ready for new guests");

    addLegendItem(legendPanel, "Reserved", "25",
            new java.awt.Color(168, 122, 36),
            "Upcoming bookings");

    addLegendItem(legendPanel, "Maintenance", "5",
            new java.awt.Color(123, 82, 101),
            "Temporarily unavailable");

    contentPanel.add(chartPanel);
    contentPanel.add(legendPanel);

    pnldonutchart.removeAll();
       pnldonutchart.add(contentPanel, java.awt.BorderLayout.CENTER);

      pnldonutchart.revalidate();
     pnldonutchart.repaint();
}

private void addLegendItem(
        javax.swing.JPanel parent,
        String title,
        String count,
        java.awt.Color color,
        String description) {

    javax.swing.JPanel item = new javax.swing.JPanel(
            new java.awt.BorderLayout(8, 0)
    );
    item.setBackground(new java.awt.Color(18, 32, 54));

    javax.swing.JPanel indicator = new javax.swing.JPanel();
    indicator.setBackground(color);
    indicator.setPreferredSize(new java.awt.Dimension(8, 35));

    javax.swing.JPanel textPanel = new javax.swing.JPanel(
            new java.awt.GridLayout(2, 1, 0, 3)
    );
    textPanel.setBackground(new java.awt.Color(18, 32, 54));

    javax.swing.JLabel titleLabel = new javax.swing.JLabel(title);
    titleLabel.setForeground(new java.awt.Color(245, 247, 250));
    titleLabel.setFont(new java.awt.Font(
            "SansSerif", java.awt.Font.BOLD, 13
    ));

    javax.swing.JLabel descriptionLabel =
            new javax.swing.JLabel(description);
    descriptionLabel.setForeground(new java.awt.Color(180, 190, 205));
    descriptionLabel.setFont(new java.awt.Font(
            "SansSerif", java.awt.Font.PLAIN, 10
    ));

    javax.swing.JLabel countLabel = new javax.swing.JLabel(count);
    countLabel.setForeground(new java.awt.Color(233, 196, 91));
    countLabel.setFont(new java.awt.Font(
            "SansSerif", java.awt.Font.BOLD, 16
    ));
    countLabel.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);

    textPanel.add(titleLabel);
    textPanel.add(descriptionLabel);

    item.add(indicator, java.awt.BorderLayout.WEST);
    item.add(textPanel, java.awt.BorderLayout.CENTER);
    item.add(countLabel, java.awt.BorderLayout.EAST);

    parent.add(item);
}
    
  

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    
    
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        mainpanel = new javax.swing.JPanel();
        jLabel15 = new javax.swing.JLabel();
        jLabel16 = new javax.swing.JLabel();
        jLabel18 = new javax.swing.JLabel();
        lbldate1 = new javax.swing.JLabel();
        lbldate2 = new javax.swing.JLabel();
        pnltototalrooms = new javax.swing.JPanel();
        jLabel17 = new javax.swing.JLabel();
        jLabel19 = new javax.swing.JLabel();
        jLabel20 = new javax.swing.JLabel();
        pnlavailablerooms = new javax.swing.JPanel();
        jLabel21 = new javax.swing.JLabel();
        jLabel22 = new javax.swing.JLabel();
        jLabel23 = new javax.swing.JLabel();
        pnlreservations = new javax.swing.JPanel();
        jLabel24 = new javax.swing.JLabel();
        jLabel26 = new javax.swing.JLabel();
        jLabel28 = new javax.swing.JLabel();
        pnlcheckin = new javax.swing.JPanel();
        jLabel25 = new javax.swing.JLabel();
        jLabel27 = new javax.swing.JLabel();
        jLabel29 = new javax.swing.JLabel();
        pnlrecentreservations = new javax.swing.JPanel();
        jLabel30 = new javax.swing.JLabel();
        jScrollPane2 = new javax.swing.JScrollPane();
        tbllatestbookings = new javax.swing.JTable();
        jLabel31 = new javax.swing.JLabel();
        pnldonutchart = new javax.swing.JPanel();
        pnlroomoccupancy1 = new javax.swing.JPanel();
        jScrollPane3 = new javax.swing.JScrollPane();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        mainpanel.setBackground(new java.awt.Color(18, 32, 54));

        jLabel15.setFont(new java.awt.Font("SansSerif", 1, 26)); // NOI18N
        jLabel15.setForeground(new java.awt.Color(245, 247, 250));
        jLabel15.setText("Back, Admin");

        jLabel16.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        jLabel16.setForeground(new java.awt.Color(180, 190, 205));
        jLabel16.setText("Here's what's happening today");

        jLabel18.setFont(new java.awt.Font("SansSerif", 1, 26)); // NOI18N
        jLabel18.setForeground(new java.awt.Color(245, 247, 250));
        jLabel18.setText("Welcome");

        lbldate1.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        lbldate1.setForeground(new java.awt.Color(233, 196, 91));
        lbldate1.setText("Thurday,");

        lbldate2.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        lbldate2.setForeground(new java.awt.Color(233, 196, 91));
        lbldate2.setText(" 22 October 2026");

        pnltototalrooms.setBackground(new java.awt.Color(36, 76, 122));
        pnltototalrooms.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));

        jLabel17.setFont(new java.awt.Font("SansSerif", 1, 13)); // NOI18N
        jLabel17.setForeground(new java.awt.Color(245, 247, 250));
        jLabel17.setText("Total rooms");

        jLabel19.setFont(new java.awt.Font("SansSerif", 1, 28)); // NOI18N
        jLabel19.setForeground(new java.awt.Color(255, 255, 255));
        jLabel19.setText("120");

        jLabel20.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        jLabel20.setForeground(new java.awt.Color(215, 230, 247));
        jLabel20.setText("Rooms in the hotel");

        javax.swing.GroupLayout pnltototalroomsLayout = new javax.swing.GroupLayout(pnltototalrooms);
        pnltototalrooms.setLayout(pnltototalroomsLayout);
        pnltototalroomsLayout.setHorizontalGroup(
            pnltototalroomsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnltototalroomsLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(pnltototalroomsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel19, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel17, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel20))
                .addContainerGap(72, Short.MAX_VALUE))
        );
        pnltototalroomsLayout.setVerticalGroup(
            pnltototalroomsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnltototalroomsLayout.createSequentialGroup()
                .addContainerGap(12, Short.MAX_VALUE)
                .addComponent(jLabel17)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel19, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel20))
        );

        pnlavailablerooms.setBackground(new java.awt.Color(32, 122, 98));
        pnlavailablerooms.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));

        jLabel21.setFont(new java.awt.Font("SansSerif", 1, 13)); // NOI18N
        jLabel21.setForeground(new java.awt.Color(245, 247, 250));
        jLabel21.setText("Available Rooms");

        jLabel22.setFont(new java.awt.Font("SansSerif", 1, 28)); // NOI18N
        jLabel22.setForeground(new java.awt.Color(255, 255, 255));
        jLabel22.setText("35");

        jLabel23.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        jLabel23.setForeground(new java.awt.Color(215, 230, 247));
        jLabel23.setText("Ready for guests");

        javax.swing.GroupLayout pnlavailableroomsLayout = new javax.swing.GroupLayout(pnlavailablerooms);
        pnlavailablerooms.setLayout(pnlavailableroomsLayout);
        pnlavailableroomsLayout.setHorizontalGroup(
            pnlavailableroomsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlavailableroomsLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(pnlavailableroomsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel22, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel21)
                    .addComponent(jLabel23))
                .addContainerGap(70, Short.MAX_VALUE))
        );
        pnlavailableroomsLayout.setVerticalGroup(
            pnlavailableroomsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlavailableroomsLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel21)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel22, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel23)
                .addContainerGap())
        );

        pnlreservations.setBackground(new java.awt.Color(168, 122, 36));
        pnlreservations.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));

        jLabel24.setFont(new java.awt.Font("SansSerif", 1, 13)); // NOI18N
        jLabel24.setForeground(new java.awt.Color(245, 247, 250));
        jLabel24.setText("Todays' Reservation");

        jLabel26.setFont(new java.awt.Font("SansSerif", 1, 28)); // NOI18N
        jLabel26.setForeground(new java.awt.Color(255, 255, 255));
        jLabel26.setText("12");

        jLabel28.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        jLabel28.setForeground(new java.awt.Color(215, 230, 247));
        jLabel28.setText("Booking for today");

        javax.swing.GroupLayout pnlreservationsLayout = new javax.swing.GroupLayout(pnlreservations);
        pnlreservations.setLayout(pnlreservationsLayout);
        pnlreservationsLayout.setHorizontalGroup(
            pnlreservationsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlreservationsLayout.createSequentialGroup()
                .addComponent(jLabel24)
                .addGap(0, 50, Short.MAX_VALUE))
            .addGroup(pnlreservationsLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(pnlreservationsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel28)
                    .addComponent(jLabel26, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        pnlreservationsLayout.setVerticalGroup(
            pnlreservationsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlreservationsLayout.createSequentialGroup()
                .addComponent(jLabel24)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel26, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel28)
                .addContainerGap())
        );

        pnlcheckin.setBackground(new java.awt.Color(166, 79, 87));
        pnlcheckin.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));

        jLabel25.setFont(new java.awt.Font("SansSerif", 1, 13)); // NOI18N
        jLabel25.setForeground(new java.awt.Color(245, 247, 250));
        jLabel25.setText("Check-In guests");

        jLabel27.setFont(new java.awt.Font("SansSerif", 1, 28)); // NOI18N
        jLabel27.setForeground(new java.awt.Color(255, 255, 255));
        jLabel27.setText("28");

        jLabel29.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        jLabel29.setForeground(new java.awt.Color(215, 230, 247));
        jLabel29.setText("Currently staying");

        javax.swing.GroupLayout pnlcheckinLayout = new javax.swing.GroupLayout(pnlcheckin);
        pnlcheckin.setLayout(pnlcheckinLayout);
        pnlcheckinLayout.setHorizontalGroup(
            pnlcheckinLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlcheckinLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(pnlcheckinLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel25)
                    .addComponent(jLabel27, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel29))
                .addContainerGap(69, Short.MAX_VALUE))
        );
        pnlcheckinLayout.setVerticalGroup(
            pnlcheckinLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlcheckinLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel25)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel27, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel29)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pnlrecentreservations.setBackground(new java.awt.Color(18, 32, 54));
        pnlrecentreservations.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(45, 61, 82)));

        jLabel30.setFont(new java.awt.Font("SansSerif", 1, 18)); // NOI18N
        jLabel30.setForeground(new java.awt.Color(245, 247, 250));
        jLabel30.setText("Recent Reservations");

        tbllatestbookings.setBackground(new java.awt.Color(18, 32, 54));
        tbllatestbookings.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        tbllatestbookings.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null, null},
                {"Sarah Johnson", "101", "22 Oct 2026", "24 Oct 2026", "Confirmed"},
                {"Daniel Smith", "205", "22 Oct 2026", "23 Oct 2026", "Checked-in"},
                {"Emily Brown", "108", "23 Oct 2026", "26 Oct 2026", "Pending"},
                {"Micheal Davis", "304", "24 Oct 2026", "27 Oct 2026", "Confirmed"},
                {"Olivia Wilson", "112", "25 Oct 2026", "28 Oct 2026", "Pennding"}
            },
            new String [] {
                "Guest", "Room", "Check-in", "Check-out", "Status"
            }
        ));
        jScrollPane2.setViewportView(tbllatestbookings);

        jLabel31.setFont(new java.awt.Font("SansSerif", 0, 12)); // NOI18N
        jLabel31.setForeground(new java.awt.Color(180, 190, 205));
        jLabel31.setText("Latest hotel reservations");

        pnldonutchart.setBackground(new java.awt.Color(18, 32, 54));

        javax.swing.GroupLayout pnldonutchartLayout = new javax.swing.GroupLayout(pnldonutchart);
        pnldonutchart.setLayout(pnldonutchartLayout);
        pnldonutchartLayout.setHorizontalGroup(
            pnldonutchartLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 359, Short.MAX_VALUE)
        );
        pnldonutchartLayout.setVerticalGroup(
            pnldonutchartLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 190, Short.MAX_VALUE)
        );

        pnlroomoccupancy1.setBackground(new java.awt.Color(18, 32, 54));

        javax.swing.GroupLayout pnlroomoccupancy1Layout = new javax.swing.GroupLayout(pnlroomoccupancy1);
        pnlroomoccupancy1.setLayout(pnlroomoccupancy1Layout);
        pnlroomoccupancy1Layout.setHorizontalGroup(
            pnlroomoccupancy1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 379, Short.MAX_VALUE)
        );
        pnlroomoccupancy1Layout.setVerticalGroup(
            pnlroomoccupancy1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 192, Short.MAX_VALUE)
        );

        javax.swing.GroupLayout pnlrecentreservationsLayout = new javax.swing.GroupLayout(pnlrecentreservations);
        pnlrecentreservations.setLayout(pnlrecentreservationsLayout);
        pnlrecentreservationsLayout.setHorizontalGroup(
            pnlrecentreservationsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane2, javax.swing.GroupLayout.Alignment.TRAILING)
            .addGroup(pnlrecentreservationsLayout.createSequentialGroup()
                .addGroup(pnlrecentreservationsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlrecentreservationsLayout.createSequentialGroup()
                        .addGap(47, 47, 47)
                        .addGroup(pnlrecentreservationsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel31, javax.swing.GroupLayout.PREFERRED_SIZE, 181, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel30)))
                    .addGroup(pnlrecentreservationsLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(pnldonutchart, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(pnlrecentreservationsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlrecentreservationsLayout.createSequentialGroup()
                    .addContainerGap(364, Short.MAX_VALUE)
                    .addComponent(pnlroomoccupancy1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap()))
        );
        pnlrecentreservationsLayout.setVerticalGroup(
            pnlrecentreservationsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlrecentreservationsLayout.createSequentialGroup()
                .addGap(24, 24, 24)
                .addComponent(jLabel30, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel31, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(36, 36, 36)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 270, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(pnldonutchart, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addContainerGap())
            .addGroup(pnlrecentreservationsLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlrecentreservationsLayout.createSequentialGroup()
                    .addContainerGap(392, Short.MAX_VALUE)
                    .addComponent(pnlroomoccupancy1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addContainerGap()))
        );

        javax.swing.GroupLayout mainpanelLayout = new javax.swing.GroupLayout(mainpanel);
        mainpanel.setLayout(mainpanelLayout);
        mainpanelLayout.setHorizontalGroup(
            mainpanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(mainpanelLayout.createSequentialGroup()
                .addGap(40, 40, 40)
                .addGroup(mainpanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(mainpanelLayout.createSequentialGroup()
                        .addComponent(pnltototalrooms, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(pnlavailablerooms, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(pnlreservations, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(pnlcheckin, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(mainpanelLayout.createSequentialGroup()
                        .addGroup(mainpanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel16, javax.swing.GroupLayout.PREFERRED_SIZE, 240, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(mainpanelLayout.createSequentialGroup()
                                .addGap(16, 16, 16)
                                .addComponent(jLabel18))
                            .addComponent(jLabel15, javax.swing.GroupLayout.PREFERRED_SIZE, 222, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGroup(mainpanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(lbldate1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(lbldate2, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(106, 106, 106))
                    .addComponent(pnlrecentreservations, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(0, 303, Short.MAX_VALUE))
        );
        mainpanelLayout.setVerticalGroup(
            mainpanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(mainpanelLayout.createSequentialGroup()
                .addGap(0, 144, Short.MAX_VALUE)
                .addGroup(mainpanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(mainpanelLayout.createSequentialGroup()
                        .addComponent(lbldate1, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(lbldate2, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel18, javax.swing.GroupLayout.PREFERRED_SIZE, 45, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel15, javax.swing.GroupLayout.PREFERRED_SIZE, 25, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 38, Short.MAX_VALUE)
                .addComponent(jLabel16, javax.swing.GroupLayout.PREFERRED_SIZE, 23, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(mainpanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(pnlavailablerooms, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(pnlreservations, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(pnlcheckin, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(pnltototalrooms, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(pnlrecentreservations, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );

        jScrollPane1.setViewportView(mainpanel);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 1100, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 1100, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

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
        java.awt.EventQueue.invokeLater(() -> new dash().setVisible(true));
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel jLabel15;
    private javax.swing.JLabel jLabel16;
    private javax.swing.JLabel jLabel17;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel19;
    private javax.swing.JLabel jLabel20;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel23;
    private javax.swing.JLabel jLabel24;
    private javax.swing.JLabel jLabel25;
    private javax.swing.JLabel jLabel26;
    private javax.swing.JLabel jLabel27;
    private javax.swing.JLabel jLabel28;
    private javax.swing.JLabel jLabel29;
    private javax.swing.JLabel jLabel30;
    private javax.swing.JLabel jLabel31;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JLabel lbldate1;
    private javax.swing.JLabel lbldate2;
    private javax.swing.JPanel mainpanel;
    private javax.swing.JPanel pnlavailablerooms;
    private javax.swing.JPanel pnlcheckin;
    private javax.swing.JPanel pnldonutchart;
    private javax.swing.JPanel pnlrecentreservations;
    private javax.swing.JPanel pnlreservations;
    private javax.swing.JPanel pnlroomoccupancy1;
    private javax.swing.JPanel pnltototalrooms;
    private javax.swing.JTable tbllatestbookings;
    // End of variables declaration//GEN-END:variables
}
