DROP DATABASE IF EXISTS turnsystem;

CREATE DATABASE turnsystem;

USE turnsystem;

-- Table: Clients
CREATE TABLE Clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  phone_number VARCHAR(10)
);

-- Table: Users
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  password VARCHAR(255),
  email VARCHAR(100),
  phone_number VARCHAR(10)
);


-- Table: Services
CREATE TABLE Services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description VARCHAR(255),
  price DECIMAL(10, 2)
);

-- Table: Turns
CREATE TABLE Turns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  date DATE,
  time TIME,
  status enum('Pending', 'Confirmed', 'Cancelled'),
  service_id INT,
  FOREIGN KEY (client_id) REFERENCES Clients(id),
  FOREIGN KEY (service_id) REFERENCES Services(id)
);

-- Table: Payments
CREATE TABLE Payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  turn_id INT,
  amount DECIMAL(10, 2),
  status enum('Paid', 'Pending'),
  FOREIGN KEY (turn_id) REFERENCES Turns(id)
);


-- Table: Administrators
CREATE TABLE Administrators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Inserción de datos en la tabla Clients
INSERT INTO Clients (first_name, last_name, email, phone_number)
VALUES
  ('John', 'Doe', 'johndoe@example.com', '1234567890'),
  ('Jane', 'Smith', 'janesmith@example.com', '9876543210'),
  ('Michael', 'Johnson', 'michaeljohnson@example.com', '5555555555');

-- Inserción de datos en la tabla Services
INSERT INTO Services (name, description, price)
VALUES
  ('Haircut', 'Basic haircut', 25.00),
  ('Manicure', 'Nail care treatment', 20.00),
  ('Massage', 'Full body massage', 50.00);

-- Inserción de datos en la tabla Turns
INSERT INTO Turns (client_id, date, time, status, service_id)
VALUES
  (1, '2023-07-14', '10:00:00', 'Pending', 1),
  (2, '2023-07-15', '15:30:00', 'Confirmed', 2),
  (3, '2023-07-16', '12:00:00', 'Pending', 3);

-- Inserción de datos en la tabla Payments
INSERT INTO Payments (turn_id, amount, status)
VALUES
  (1, 25.00, 'Paid'),
  (2, 20.00, 'Paid'),
  (3, 50.00, 'Pending');

-- Insercion de datos en la tabla Users
INSERT INTO Users (username, password, email, phone_number)
VALUES
  ('johndoe', '123456', '
  johndoe@gmail.com',
  '1234567890'),
  ('janesmith', '123456', '
  janesmith@gmail.com',
  '9876543210'),
  ('michaeljohnson', '123456', 
  'michaeljohnson@gmail.com',
  '5555555555');

-- Inserción de datos en la tabla Administrators
INSERT INTO Administrators (user_id)
VALUES
  (1),
  (2),
  (3);