@echo off
setlocal
cd /d "%~dp0"

if not exist "dist\Hotel_Reservation_Hardcoded.jar" (
    echo The application JAR was not found. Build the project first.
    exit /b 1
)

java -cp "dist\Hotel_Reservation_Hardcoded.jar;lib\mysql-connector-j-26.7.0.jar" hotel.reservation.HardcodedHotelReservation
endlocal
