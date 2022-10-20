const inquirer = require("inquirer");
const mysql = require("mysql2");

// Requires the connection.js file which uses the login info to connect to mysql
const db = require("./db/connection");
// require("console.table");

// The main menu with all of the inquirer prompts
const mainMenu = async () => {
  const promptValue = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View",
          value: "VIEW",
        },
        {
          name: "Add",
          value: "ADD",
        },
        {
          name: "Update",
          value: "UPDATE",
        },
        {
          name: "Delete",
          value: "DELETE",
        },
        {
          name: "Exit",
          value: "EXIT",
        },
      ],
    },
  ]);

  switch (promptValue.choice) {
    case "VIEW":
      selectViewAll();
      break;
    case "ADD":
      selectAdd();
      break;
    case "UPDATE":
      selectUpdate();
      break;
    case "DELETE":
      selectDelete();
      break;
    case "EXIT":
      process.exit();
    default:
      process.exit();
  }
};

// Views all employees and displays it in a table
const viewEmployees = async () => {
  // Creates a table with the employee's first name, last name, title of their role, their salary, and the department their role is in. Also creates a column with their manager's first and last name and id number.
  const [employeeData] = await db.query(
    `SELECT employee.id, 
    employee.first_name,
    employee.last_name, 
    role.title, 
    department.name AS department, 
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`
  );
  console.table(employeeData);
  mainMenu();
};

// Views all roles and displays it in a table
const viewRoles = async () => {
  // Creates a table that displays the role id number, the title of the role, the department that role is a part of, and the id number of the department.
  const [roleData] = await db.query(
    `SELECT role.id, role.title AS job_title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id`
  );
  console.table(roleData);
  mainMenu();
};

// Views all departments and display it in a table
const viewDepartments = async () => {
  // Shows the names of all the departments and their id number
  const [departmentData] = await db.query(`SELECT * FROM department`);
  console.table(departmentData);
  mainMenu();
};

// Add an employee by taking in the information provided by the user using the inquirer prompts
const addEmployee = async () => {
  const promptValue = await inquirer.prompt([
    {
      type: "text",
      name: "first_name",
      message: "What's their first name?",
    },
    {
      type: "text",
      name: "last_name",
      message: "What's their last name?",
    },
    {
      type: "text",
      name: "role",
      message: "What's their role?",
    },
    {
      type: "text",
      name: "manager",
      message: "Who's their manager?",
    },
  ]);

  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  const params = [
    promptValue.first_name,
    promptValue.last_name,
    promptValue.role,
    promptValue.manager,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  console.log("Employee has been added!");
  mainMenu();
};

// Add a role by taking in the information provided by the user using the inquirer prompts
const addRole = async () => {
  const promptValue = await inquirer.prompt([
    {
      type: "text",
      name: "name",
      message: "What is the name of the role?",
    },
    {
      type: "int",
      name: "salary",
      message: "What is the salary for this role?",
    },
    {
      type: "text",
      name: "department",
      message: "What is the department this role falls under?",
    },
  ]);

  const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

  const params = [promptValue.name, promptValue.salary, promptValue.department];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  console.log("A new role has been added!");
  mainMenu();
};

// Add a department by taking in the information provided by the user using the inquirer prompts
const addDepartment = async () => {
  const promptValue = await inquirer.prompt([
    {
      type: "text",
      name: "name",
      message: "What department do you want to add?",
    },
  ]);

  const sql = `INSERT INTO department (name) VALUES (?)`;

  const params = [promptValue.name];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  console.log("The department has been added!");
  mainMenu();
};

// Update an employee by taking in the information provided by the user using the inquirer prompts and inserting it into the employee table
const updateEmpRole = async () => {
  const [employeeData] = await db.query(`SELECT * FROM employee`);
  console.table(employeeData);

  const promptValue = await inquirer.prompt([
    {
      type: "text",
      name: "employee_id",
      message:
        "Looking at the table above, please input the employee's id number from the employee you wish to update.",
    },
  ]);

  const [roleData] = await db.query(`SELECT * FROM role`);
  console.table(roleData);

  const promptValueTwo = await inquirer.prompt([
    {
      type: "int",
      name: "role_id",
      message:
        "Looking at the table above, please input the role id number for the role you would like to assign the employee.",
    },
  ]);

  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

  const params = [promptValueTwo.role_id, promptValue.employee_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });
  console.log("Employee's role was updated!");

  // Shows a table with the updated table of employees
  const [newEmployeeData] = await db.query(`SELECT employee.id, 
    employee.first_name,
    employee.last_name, 
    role.title, 
    department.name AS department, 
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
  console.table(newEmployeeData);

  mainMenu();
};

// Update an employee' manager by taking in the information provided by the user using the inquirer prompts and inserting the information into the employee table
const updateEmployeeManager = async () => {
  const [employeeData] = await db.query(`SELECT employee.id, 
    employee.first_name,
    employee.last_name, 
    role.title, 
    department.name AS department, 
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
  console.table(employeeData);

  const promptValue = await inquirer.prompt([
    {
      type: "text",
      name: "employee_id",
      message:
        "Looking at the table above, please input the employee's id number you wish to update their manager.",
    },
    {
      type: "int",
      name: "manager_id",
      message:
        "Looking at the table above, input the employee's id number you would like to assign as the manager of the employee",
    },
  ]);

  const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

  const params = [promptValue.manager_id, promptValue.employee_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });
  console.log("Employee's manager was updated!");

  // Shows a table with the updated table of employees
  const [newEmployeeData] = await db.query(`SELECT employee.id, 
    employee.first_name,
    employee.last_name, 
    role.title, 
    department.name AS department, 
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    ORDER BY manager`);
  console.table(newEmployeeData);

  mainMenu();
};

// Views all employees and displays it in a table and orders the employees by manager
const viewEmpByManager = async () => {
  // Creates a table with the employee's first name, last name, title of their role, their salary, and the department their role is in. Also creates a column with their manager's first and last name and id number.
  const [employeeData] = await db.query(
    `SELECT employee.id, 
    employee.first_name,
    employee.last_name, 
    role.title, 
    department.name AS department, 
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    ORDER BY manager`
  );
  console.table(employeeData);
  mainMenu();
};

// Views all employees and displays it in a table and orders the employees by the department they're in
const viewEmpByDepartment = async () => {
  // Creates a table with the employee's first name, last name, title of their role, their salary, and the department their role is in. Also creates a column with their manager's first and last name and id number.
  const [employeeData] = await db.query(
    `SELECT department.name AS department,
    employee.id, 
    employee.first_name,
    employee.last_name, 
    role.title,  
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    ORDER BY department`
  );
  console.table(employeeData);
  mainMenu();
};

const selectViewAll = async () => {
  const promptValue = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What do you want to view?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES",
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "View Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER",
        },
        {
          name: "View Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
        },
        {
          name: "Exit",
          value: "EXIT",
        },
      ],
    },
  ]);

  switch (promptValue.choice) {
    case "VIEW_EMPLOYEES":
      viewEmployees();
      break;
    case "VIEW_ROLES":
      viewRoles();
      break;
    case "VIEW_DEPARTMENTS":
      viewDepartments();
      break;
    case "VIEW_EMPLOYEES_BY_MANAGER":
      viewEmpByManager();
      break;
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      viewEmpByDepartment();
      break;
    case "EXIT":
      exitMainMenu();
    default:
      exitMainMenu();
  }
};

const selectAdd = async () => {
  const promptValue = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What do you want to add?",
      choices: [
        {
          name: "Add An Employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Add A Role",
          value: "ADD_ROLE",
        },
        {
          name: "Add A Department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "Exit",
          value: "EXIT",
        },
      ],
    },
  ]);

  switch (promptValue.choice) {
    case "ADD_EMPLOYEE":
      addEmployee();
      break;
    case "ADD_ROLE":
      addRole();
      break;
    case "ADD_DEPARTMENT":
      addDepartment();
      break;
    case "EXIT":
      exitMainMenu();
    default:
      exitMainMenu();
  }
};

const selectUpdate = async () => {
  const promptValue = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What do you want to update?",
      choices: [
        {
          name: "Update An Employee's Manager",
          value: "UPDATE_EMPLOYEE_MANAGER",
        },
        {
          name: "Update An Employee's Role",
          value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
          name: "Exit",
          value: "EXIT",
        },
      ],
    },
  ]);

  switch (promptValue.choice) {
    case "UPDATE_EMPLOYEE_MANAGER":
      updateEmployeeManager();
      break;
    case "UPDATE_EMPLOYEE_ROLE":
      updateEmpRole();
      break;
    case "EXIT":
      exitMainMenu();
    default:
      exitMainMenu();
  }
};

const selectDelete = async () => {
  const promptValue = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What do you want to delete?",
      choices: [
        {
          name: "Delete an employee",
          value: "DELETE_EMPLOYEE",
        },
        {
          name: "Delete a role",
          value: "DELETE_ROLE",
        },
        {
          name: "Delete a department",
          value: "DELETE_DEPARTMENT",
        },
        {
          name: "Exit",
          value: "EXIT",
        },
      ],
    },
  ]);

  switch (promptValue.choice) {
    case "DELETE_EMPLOYEE":
      deleteEmployee();
      break;
    case "DELETE_ROLE":
      deleteRole();
      break;
    case "DELETE_DEPARTMENT":
      deleteDepartment();
      break;
    case "EXIT":
      exitMainMenu();
    default:
      exitMainMenu();
  }
};

// Deletes an employee from the database
const deleteEmployee = async () => {
  const [employeeData] = await db.query(`SELECT * FROM employee`);
  console.table(employeeData);

  const promptValue = await inquirer.prompt([
    {
      type: "int",
      name: "employee_id",
      message:
        "Looking at the table above, please input the employee's id number you wish to delete.",
    },
  ]);

  const sql = `DELETE FROM employee 
    WHERE employee.id = (?)`;

  const params = [promptValue.employee_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  console.log("An employee was successfully deleted!");

  // Shows a table with the updated table of employees
  const [newEmployeeData] = await db.query(`SELECT * FROM employee`);
  console.table(newEmployeeData);

  mainMenu();
};

// Deletes a role from the database
const deleteRole = async () => {
  const [roleData] = await db.query(`SELECT * FROM role`);
  console.table(roleData);

  const promptValue = await inquirer.prompt([
    {
      type: "int",
      name: "role_id",
      message:
        "Looking at the table above, please input the role's id number you wish to delete.",
    },
  ]);

  const sql = `DELETE FROM role 
    WHERE role.id = (?)`;

  const params = [promptValue.role_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  console.log("A role was successfully deleted!");

  // Shows a table with the updated table of roles
  const [newRoleData] = await db.query(`SELECT * FROM role`);
  console.table(newRoleData);

  mainMenu();
};

// Deletes a department from the database
const deleteDepartment = async () => {
  const [departmentData] = await db.query(`SELECT * FROM department`);
  console.table(departmentData);

  const promptValue = await inquirer.prompt([
    {
      type: "int",
      name: "department_id",
      message:
        "Looking at the table above, please input the department's id number you wish to delete.",
    },
  ]);

  const sql = `DELETE FROM department 
    WHERE department.id = (?)`;

  const params = [promptValue.department_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  console.log("A department was successfully deleted!");

  // Shows a table with the updated table of departments
  const [newDepartmentData] = await db.query(`SELECT * FROM department`);
  console.table(newDepartmentData);

  mainMenu();
};

// Calls the main menu so the user can exit out of viewing, adding, deleting, and/or updating and go back to the main menu instead of exiting the application entirely
const exitMainMenu = () => {
  console.log("===============================================");
  mainMenu();
};

mainMenu();
