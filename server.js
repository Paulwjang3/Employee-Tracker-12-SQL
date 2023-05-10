const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT || 3001,
    user: 'root',
    password: process.env.PASSWORD,
    database: 'employee_db'
});

db.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id" + Connection.threadID)
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
            addEmployees();
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
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    
    db.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    startPrompt();
    })
};

addEmployee = () => {
    
}