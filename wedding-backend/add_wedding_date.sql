-- Add wedding_date table for single source of truth
CREATE TABLE IF NOT EXISTS wedding_date (
  id INT PRIMARY KEY DEFAULT 1,
  date DATETIME NOT NULL
);

-- Add attendance field to RSVP table
ALTER TABLE rsvp ADD COLUMN attendance VARCHAR(10) DEFAULT 'da';
