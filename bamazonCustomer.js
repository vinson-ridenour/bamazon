"use strict";

let mysql = require('mysql');
let inquirer = require('inquirer');
let EasyTable = require('easy-table');

let allProductsTable = new EasyTable;

let con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Catelyn9!",
  database: "bamazon"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  console.log("Connected as ID " + con.threadId);
  showProducts();
});

function showProducts() {
con.query("SELECT id, product_name, department_name, price FROM products",function (err, allProductData) {
    if (err) throw err;
    // console.log(allProductData);
    allProductData.forEach(function(products) {
      allProductsTable.cell('Product Id', products.id);
      allProductsTable.cell('Description', products.product_name);
      allProductsTable.cell('Price, USD', products.price, EasyTable.number(2));
      allProductsTable.newRow();
    });
    console.log("===============================================");
    console.log(allProductsTable.toString());
    // jump to inquirer prompt function here for user input
})};


