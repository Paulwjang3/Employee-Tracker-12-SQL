const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    database: 'employee_db',
    port: 3306,
});

db.connect(function (err) {
    if (err) throw err;
    startPrompt();
});

function startPrompt() {
    inquirer
    .prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: ['View All Employees', 'Add Employees', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Departments']
    }
]).then((response) => {
    switch (response.choice) {
        case 'View All Employees':
            viewAllEmployees();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateEmployeeRole();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'View All Departments':
            viewAllDepartments();
            break;
        case 'Add Departments':
            addDepartments();
            break;
        default:
            db.end();
    }
})
.catch(err => {
    console.error(err);
});
}

viewAllEmployees = () => {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    
    db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startPrompt();
    });
};

function addEmployee() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: "Enter the employee's first name",
            name: "firstName"
        },
        {
            type: 'input',
            message: "Enter the employee's last name",
            name: 'lastName'
        },
        {
            type: 'input',
            message: "Enter the employee's role id",
            name: 'addEmployeeRole'
        },
        {
            type: 'input',
            message: "Enter the employee's manager id",
            name: 'addEmployeeManager'
        }
    ])
    .then(function (res) {
        const firstName = res.firstName;
        const lastName = res.lastName;
        const employeeRoleID = res.addEmployeeRole;
        const employeeManagerID = res.addEmployeeManager;
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${employeeRoleID}", "${employeeManagerID}")`;
        db.query(query, function (err, res) {
            if (err) {
                throw err;
            }
            console.table(res);
            startPrompt();
        });
    });
}

function updateEmployeeRole() {
    inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the employee's ID you want to be updated",
        name: "updateEmploy"
      },
      {
        type: "input",
        message: "Enter the new role ID for that employee",
        name: "newRole"
      }
    ])
    .then(function (res) {
        const updateEmploy = res.updateEmploy;
        const newRole = res.newRole;
        const queryUpdate = `UPDATE employee SET role_id = "${newRole}" WHERE id = "${updateEmploy}"`;
        db.query(queryUpdate, function (err, res) {
          if (err) {
            throw err;
          }
          console.table(res);
          startPrompt();
        })
      });
}

function viewAllRoles() {
    var query = `SELECT * FROM role`
    db.query(query, function (err, res) {
        console.table(res);
        startPrompt();
    });
}

function addRole() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter the employee's title",
          name: "roleTitle"
        },
        {
          type: "input",
          message: "Enter the employee's salary",
          name: "roleSalary"
        },
        {
          type: "input",
          message: "Enter the employee's department ID",
          name: "roleDept"
        }
      ])
      .then(function (res) {
        const title = res.roleTitle;
        const salary = res.roleSalary;
        const departmentID = res.roleDept;
        const query = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", "${salary}", "${departmentID}")`;
        db.query(query, function (err, res) {
          if (err) {
            throw err;
          }
          console.table(res);
          startPrompt();
        });
      });
  }
  
function viewAllDepartments() {
    var query = `SELECT * FROM department`
    db.query(query, function (err,res) {
        console.table(res);
        startPrompt();
    });
}

function addDept() {
    inquirer
    .prompt({
        type: 'input',
        message: 'Enter the name of the new department',
        name: 'newDept'
    })
    .then(function (res) {
        const newDepartment = res.newDept;
        const query = `INSERT INTO department (name) VALUES ("${newDepartment}")`;
        db.query(query, function (err, res) {
            if (err) {
                throw err;
            }
            console.tables(res);
            startPrompt();
        });
    });
}