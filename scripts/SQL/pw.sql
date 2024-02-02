
-- Create the database
DROP DATABASE gestãoRestaurantes;
CREATE DATABASE gestãoRestaurantes;
USE gestãoRestaurantes;



-- Create the tables
CREATE TABLE Mesa (
    MesaID INT PRIMARY KEY AUTO_INCREMENT,
    TableNumber INT NOT NULL
);

CREATE TABLE TableOrder (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    MesaID INT,
    CONSTRAINT FK_TableOrder_MesaID
        FOREIGN KEY (MesaID)
        REFERENCES Mesa(MesaID)
);

CREATE TABLE ProductType (
    ProductTypeID INT PRIMARY KEY AUTO_INCREMENT,
    TypeName VARCHAR(50) UNIQUE
);

CREATE TABLE Product (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    ProductTypeID INT,
    CONSTRAINT FK_Product_ProductType
        FOREIGN KEY (ProductTypeID)
        REFERENCES ProductType(ProductTypeID)
);

CREATE TABLE OrderProduct (
    OrderProductID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL,
    CONSTRAINT FK_OrderProduct_OrderID
        FOREIGN KEY (OrderID)
        REFERENCES TableOrder(OrderID),
    CONSTRAINT FK_OrderProduct_ProductID
        FOREIGN KEY (ProductID)
        REFERENCES Product(ProductID)
);

-- Insert sample data for Mesa
INSERT INTO Mesa (TableNumber) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20);


-- Insert sample data for TableOrder
INSERT INTO TableOrder (MesaID) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20);


-- Insert sample data for ProductType
INSERT INTO ProductType (TypeName) VALUES
('Entrada'),
('Prato'),
('Sobremesa'),
('Bebida');

-- Insert sample data for Product
INSERT INTO Product (Name, Quantity, Price, ProductTypeID) VALUES
('Caprese Salad', 2, 9.99, 1),
('Bruschetta', 1, 7.49, 1),
('Margherita Pizza', 1, 12.99, 2),
('Penne alla Vodka', 2, 10.99, 2),
('Grilled Chicken Sandwich', 1, 9.99, 2),
('Chocolate Brownie', 3, 5.99, 3),
('Tiramisu', 2, 7.99, 3),
('Cheesecake', 1, 8.49, 3),
('Coca-Cola', 3, 2.49, 4),
('Orange Juice', 2, 3.29, 4),
('Iced Tea', 1, 2.99, 4),
('Chicken Alfredo', 1, 11.99, 2),
('Mango Sorbet', 2, 4.99, 3),
('Minestrone Soup', 1, 6.49, 1),
('Salmon Fillet', 1, 15.99, 2),
('Tropical Smoothie', 1, 4.49, 4),
('New York Cheesecake', 1, 9.99, 3),
('Vegetable Spring Rolls', 2, 8.49, 1),
('BBQ Chicken Pizza', 1, 13.99, 2),
('Pineapple Upside-Down Cake', 1, 7.49, 3),
('Iced Cappuccino', 3, 3.99, 4),
('Greek Salad', 1, 9.49, 1),
('Shrimp Scampi', 2, 14.99, 2),
('Triple Chocolate Mousse', 1, 10.99, 3),
('Green Tea', 3, 2.79, 4);

-- Insert sample data for OrderProduct
INSERT INTO OrderProduct (OrderID, ProductID, Quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(1, 3, 1),
(2, 4, 2),
(2, 5, 1),
(2, 6, 3),
(3, 7, 2),
(3, 8, 1),
(3, 9, 3);

