@echo off
setlocal
cd /d "%~dp0"

if not exist "dist\Hotel_Reservation.jar" (
    echo The application JAR was not found. Build the project first.
    exit /b 1
)

java -cp "dist\Hotel_Reservation.jar;lib\mysql-connector-j-26.7.0.jar;lib\jbcrypt-0.4.jar" hotel.reservation.HotelReservation
endlocal
