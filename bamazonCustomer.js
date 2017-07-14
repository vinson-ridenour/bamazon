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

    // jump to inquirer prompt function for user input
    chooseProductAndQuantity();
})};

function chooseProductAndQuantity() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Type the ID of the product you'd like to buy.",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      let userQuery = "SELECT * FROM products WHERE id=?";
      con.query(userQuery, [answer.id], function(err, res) {
        // console.log(res);
        let stock = res[0].stock_quantity;
        let price = res[0].price;
        let productName = res[0].product_name;

        // adequate stock validation
        if (stock >= answer.quantity) {
          console.log(`You want ${answer.quantity} of Product ID ${answer.id} - ${res[0].product_name}` + 
            ` at ${price} each.`);
          
          // update the stock in the database
          updateStock();
        }
          else {
            console.log(`You want for too much! We only have ${stock} units of ${productName} in stock.`);
            chooseProductAndQuantity();
          }
        
        // update stock function
        function updateStock() {
          let updateRecord = 'UPDATE products SET stock_quantity=? WHERE id=?';
          let newQuantity = stock - answer.quantity;
          let totalPrice = answer.quantity * price;
          // console.log(newQuantity, answer.id);

          //update the database with new stock quantity
          con.query(updateRecord, [newQuantity, answer.id], function(err, result) {
            console.log(`New stock for ${productName} is ${newQuantity} units.`);
            
            // show customer the total price
            console.log(`Your total is $${totalPrice}.`);
          });
        };
      });
    });
};


