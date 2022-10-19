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
          name: "Add an employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Add a role",
          value: "ADD_ROLE",
        },
        {
          name: "Add a department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "Update an employee's role",
          value: "UPDATE_ROLE",
        },
        {
          name: "Update an Employee's manager",
          value: "UPDATE_EMPLOYEE_MANAGER",
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
    case "ADD_EMPLOYEE":
      addEmployee();
      break;
    case "ADD_ROLE":
      addRole();
      break;
    case "ADD_DEPARTMENT":
      addDepartment();
      break;
    case "UPDATE_ROLE":
      updateEmpRole();
      break;
    case "UPDATE_EMPLOYEE_MANAGER":
      updateEmployeeManager();
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
  mainMenu();
};

// Update an employee' manager by taking in the information provided by the user using the inquirer prompts and inserting the information into the employee table
const updateEmployeeManager = async () => {
  const [employeeData] = await db.query(`SELECT * FROM employee`);
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
        "Input the manager's id number you would like to assign to this employee",
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
  mainMenu();
};

mainMenu();
