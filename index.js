const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/connection");

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
      updateRole();
      break;
    case "EXIT":
      process.exit();
    default:
      process.exit();
  }
};

const viewEmployees = async () => {
  const [employeeData] = await db.query(`SELECT * FROM employee`);
  console.table(employeeData);
  mainMenu();
};

const viewRoles = async () => {
  const [roleData] = await db.query(`SELECT * FROM role`);
  console.table(roleData);
  mainMenu();
};

const viewDepartments = async () => {
  const [departmentData] = await db.query(`SELECT name FROM department`);
  console.table(departmentData);
  mainMenu();
};

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
    console.log(result);
    console.table(result);
    mainMenu();
  });
};

mainMenu();
