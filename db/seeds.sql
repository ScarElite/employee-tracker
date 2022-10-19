USE employees;

INSERT INTO department (name)
VALUES
("Sales"),
("IT"),
("Legal"),
("Engineering"),
("Finance");

INSERT INTO role (title, salary, department_id)
VALUES
("Sales Lead", 75000, 1),
("IT Support", 1000000, 2),
("Lawyer", 30000, 3),
("Engineer", 150000, 4),
("Accountant", 51000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Alex", "Chen", 1, NULL),
("Lindsay", "Reiner", 2, 1),
("Caleb", "Crum", 1, 1),
("Patrick", "MacDonald", 5, NULL),
("David", "Dowell", 5, 4);