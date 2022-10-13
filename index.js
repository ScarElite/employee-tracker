const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connect to database
const db = mysql
  .createConnection(
    {
      host: "localhost",
      // MySQL username,
      user: "root",
      // MySQL password
      password: "MySQL2022!@#$",
      database: "employees",
    },
    console.log(`Connected to the employee database`)
  )
  .promise();

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
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "Exit",
          value: "EXIT",
        },
      ],
    },
  ]);

  switch (promptValue) {
    case "VIEW_EMPLOYEES":
      viewEmployees();
      break;
    case "VIEW_DEPARTMENTS":
      viewDepartments();
      break;
    case "EXIT":
      process.exit();
      break;
    default:
      process.exit();
  }

  console.log(choice);
};

const viewEmployees = async () => {
  const [employeeData] = await db.query("SELECT * FROM employee");
  console.table(employeeData);
  mainMenu();
};

const viewDepartments = () => {
  // const [dep]
};

mainMenu();
