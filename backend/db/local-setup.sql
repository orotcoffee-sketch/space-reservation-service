-- Local development setup. Run as a MySQL administrator, NOT as the application:
--   mysql -u root -p --init-command="SET @app_pw='<choose a password>'" < db/local-setup.sql
-- (or replace the password manually). The password is never committed.
CREATE DATABASE IF NOT EXISTS space_reservation CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS space_reservation_test CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER IF NOT EXISTS 'space_app'@'localhost' IDENTIFIED BY 'CHANGE_ME';
GRANT ALL PRIVILEGES ON space_reservation.* TO 'space_app'@'localhost';
GRANT ALL PRIVILEGES ON space_reservation_test.* TO 'space_app'@'localhost';
