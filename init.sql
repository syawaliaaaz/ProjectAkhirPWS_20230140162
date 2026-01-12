-- Create database
CREATE DATABASE IF NOT EXISTS petcare_db;
USE petcare_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  schedule TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pet_id INT NOT NULL,
  doctor_id INT NOT NULL,
  service_id INT NOT NULL,
  date DATETIME NOT NULL,
  status ENUM('pending', 'acc', 'rejected', 'reschedule') DEFAULT 'pending',
  notes TEXT,
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin', 'admin@petcare.com', '$2a$08$examplehashedpassword', 'admin'),
('User', 'user@petcare.com', '$2a$08$examplehashedpassword', 'user');

INSERT IGNORE INTO doctors (name, specialization, schedule) VALUES
('Dr. Ahmad', 'Veterinarian', 'Mon-Fri 9AM-5PM'),
('Dr. Siti', 'Surgeon', 'Tue-Sat 10AM-6PM');

INSERT IGNORE INTO services (name, description, price) VALUES
('Checkup', 'General health checkup', 50000),
('Vaccination', 'Vaccination service', 75000),
('Surgery', 'Surgical procedures', 200000);