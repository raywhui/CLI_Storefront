var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host:'localhost',
	port:3306,
	user:'root',
	password:'7seas1000suns',
	database:'bamazon'
});

managerFunction();

function managerFunction(){
	inquirer.prompt([
		{
			type:'list',
			name:'manager',
			message:'Select a managerial option:',
			choices: [
				'View Products for Sale',
				'View Low Inventory',
				'Add to Inventory',
				'Add New Product'
			]
		}
	]).then(function(answers){
		//console.log('yay here are the answers:', answers.manager);
		if (answers.manager === 'View Products for Sale'){
			console.log('\n');
			readProducts();
		}else if(answers.manager === 'View Low Inventory'){
			console.log('\n');
			readLowInventory();
		}else if(answers.manager === 'Add to Inventory'){
			addInventory();
		}else if(answers.manager === 'Add New Product'){
			createProduct();
		};
	});
};

function readProducts(){
	connection.query('SELECT * FROM products', function(err,res){
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			// products.push('ID: ' + res[i].item_id + '| Item: ' + res[i].product_name + " | Price: $" + res[i].price);
			console.log('ID: ' + res[i].item_id + ' | Item: ' + res[i].product_name + " | Price: $" + res[i].price + " | Quantity: " + res[i].stock_quantity);
			// console.log(products);
		};
		console.log('\n');
		managerFunction();
	});
};

function readLowInventory(){
	connection.query('SELECT * FROM products WHERE stock_quantity <= 5', function(err,res){
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			// products.push('ID: ' + res[i].item_id + '| Item: ' + res[i].product_name + " | Price: $" + res[i].price);
			console.log('ID: ' + res[i].item_id + ' | Item: ' + res[i].product_name + " | Price: $" + res[i].price + " | Quantity: " + res[i].stock_quantity);
			// console.log(products);
		};
		console.log('\n');
		managerFunction();
	});
};

function addInventory(){	
	inquirer.prompt([
		{
			type:'input',
			name:'idChoice',
			message:'Input ID of item you wish to add inventory to:',
		},
		{
			type:'input',
			name:'unitChoice',
			message:'Input amount of units you wish to restock:',
		}
	]).then(function(answers){
		idCheck(answers.idChoice, answers.unitChoice);	
	})//function(answers)
}; //addInventory()

function idCheck(id, units){
	connection.query('SELECT * FROM products', function(err,res){
		if (err) throw err;

		// res[id-1]===undefined needs to be first, otherwise errors because cannot compare undefined with an integer
		if(res[id-1] === undefined){
			console.log("That's not one of the choices! Do it again!");
			addInventory();
		}else{
			updateProduct(id, res[id-1].stock_quantity, units);
		}
	});
};

function updateProduct(id,initialUnits,units){
	connection.query('UPDATE products SET ? WHERE ?',
		[
			{
				stock_quantity: parseInt(initialUnits) + parseInt(units)
			},
			{
				item_id: id
			}
		],
		function(err,res){
			console.log("\n Product inventory updated. Product ID #" + id + " increased by " + "units.")
	 		console.log('\n');
	 		managerFunction();
	 	});
};

function createProduct(){
	inquirer.prompt([
		{
			type:'input',
			name:'product_name',
			message:'Input name of the product:',
		},
		{
			type:'input',
			name:'department_name',
			message:'Input department name:',
		},		
		{
			type:'input',
			name:'price',
			message:'Input product price ($00.00): $',
		},		
		{
			type:'input',
			name:'stock_quantity',
			message:'Input amount avaiable for purchase:'
		},

	]).then(function(answers){
		connection.query(
    	"INSERT INTO products SET ?",
    	{
    		product_name: answers.product_name,
    		department_name: answers.department_name,
      	price: answers.price,
      	stock_quantity: answers.stock_quantity
    	},
    	function(err, res) {
    	console.log('\n'+answers.product_name+' added to '+ answers.department_name+' at $'+answers.price+'. Only '+answers.stock_quantity+' left in stock.\n');
      managerFunction();
    	}
  	);
	})
};

	// connection.query('UPDATE products SET ? WHERE ?',
	// 	[
	// 		{
	// 			stock_quantity: initialUnits - units
	// 		},
	// 		{
	// 			item_id: id
	// 		}
	// 	],
	//  function(err,res){
	//  	console.log('Thank you for your patronage. Here is your',units,'unit(s) of',whatYouBought + '.');
	//  	console.log('=======================================');
	//  	console.log("That'll be $" + units*price);
	//  	console.log(res.affectedRows + ' products updated.');
	//  });

