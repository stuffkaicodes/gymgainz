-- Database setup for Gym App
-- Run this script to create the initial database structure

CREATE DATABASE IF NOT EXISTS gym_app;
USE gym_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username)
);

-- Note: Individual user workout tables will be created dynamically
-- when users register, with the format: user_{userId}_workouts
-- Each table will have this structure:
--
-- CREATE TABLE user_{userId}_workouts (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   date DATE NOT NULL,
--   exercise VARCHAR(255) NOT NULL,
--   weight DECIMAL(10, 2) NOT NULL,
--   number_of_sets INT NOT NULL,
--   number_of_reps INT NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   INDEX idx_date (date),
--   INDEX idx_exercise (exercise)
-- );
