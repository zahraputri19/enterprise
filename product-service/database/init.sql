CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) NOT NULL,
    price decimal(10, 2) NOT NULL,
    description text,
    stock int NOT NULL DEFAULT 0,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, stock) VALUES
('Keyboard mekanikal', 'Deskripsi untuk Keyboard Mekanikal', 150000.00, 10),
('Mouse gaming', 'Deskripsi untuk Mouse Gaming', 75000.00, 20),
('Headset gaming', 'Deskripsi untuk Headset Gaming', 200000.00, 15),
('Monitor 24 inch', 'Deskripsi untuk Monitor 24 Inch', 1200000.00, 5),
('RAM 16GB', 'Deskripsi untuk RAM 16GB', 800000.00, 8);