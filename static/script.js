var timeoutID;
//global variables to store category and purchases response
var catResp = "";
var purResp = "";

function setup() {
	document.getElementById("catButton").addEventListener("click", sendCategory, true);
    document.getElementById("purButton").addEventListener("click", sendPurchase, true);
	// initialize theTable
	poller();
}


/***********************************************************
 * AJAX boilerplate
 ***********************************************************/

function makeRec(method, target, retCode, data) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = makeHandler(method, httpRequest, retCode);
	httpRequest.open(method, target);
	
	if (data) {
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpRequest.send(data);
		
	}
	else {
		httpRequest.send();

	}
		
}


function makeHandler(method, httpRequest, retCode) {
	console.log("making handler!");
	function handler() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === retCode) {
				console.log("recieved response text:  " + httpRequest.responseText);
				if(method == "GET"){
					//if categories are not received, set catResp to response
					if (catResp == "") catResp = httpRequest.responseText;
					//else set purResp to response text
					else purResp = httpRequest.responseText;
				    
				    //if both are recieved, repopulate and reset
				    if((catResp != "" ) && (purResp != ""))
				    {
						repopulate(catResp, purResp);
						catResp = "";
						purResp= "";
						//console.log(catResp);
						//console.log(purResp);

					}

				}
				
			} else {
				alert("There was a problem with the request.  you'll need to refresh the page!");
			}
		}
	}
	return handler;
}


/*******************************************************
 * actual client-side app logic
 *******************************************************/

function poller() {
	makeRec("GET", "/cat", 200);
	makeRec("GET", "/purchases", 200);
	
}

//Sends a category to the server 
function sendCategory() {
	window.clearTimeout(timeoutID);
	var newCatName = document.getElementById("newCatName").value;
	if (newCatName == "") alert("Please enter a category name to proceed.");
	var newCatBudget = document.getElementById("newCatBudget").value;
	var catList = document.getElementById("catList");
	var x = document.getElementById("catList").options.length;
    var taken = 0;
	for(var i =0; i < x; i++)
	{
		if(newCatName == document.getElementById("catList").options[i].value)
		{
			alert("Category name already taken");
			taken=1;
		}
	}

	if (newCatBudget == "") alert("Please enter a budget value to proceed.");
	else if(!parseInt(newCatBudget)) alert("Please enter a number for budget.");

	if((newCatName != "")&&(newCatBudget!= "") &&(taken == 0)&& (parseInt(newCatBudget)))
	{var data;
	data = "category=" + newCatName + "&budget="+newCatBudget;
	console.log(data);
	makeRec("POST", "/cat", 201, data);
	poller();
	document.getElementById("newCatName").value = "";
	document.getElementById("newCatBudget").value = "";
	alert("Category added successfully!");}
}

//sends a purchase to the server
function sendPurchase() {
	window.clearTimeout(timeoutID);
	var newAmount = document.getElementById("newAmount").value;
	if (newAmount == "") alert("Please enter an amount to proceed.");
	else if(!parseInt(newAmount)) alert("Please enter a number for amount.");
	var newName = document.getElementById("newName").value;
	if (newName == "") alert("Please enter what you purchased on to proceed.");
	var newDate = document.getElementById("newDate").value;
	if (newDate == "") alert("Please enter a purchase date to proceed.");
	var category = document.getElementById("purCat").value;
	if (category == "") alert("Please select a category to proceed.");
	if ((newAmount != "")&& parseInt(newAmount) && (newName!= "") && (newDate!="") && (category!=""))
	{var data;
	console.log("purchase category: "+ category);
	data = "amount=" + newAmount + "&spent_on="+newName+ "&date="+newDate+ "&pur_cat="+category.toString();
	console.log(data);
	makeRec("POST", "/purchases", 201, data);
	poller();
	document.getElementById("newAmount").value = "";
	document.getElementById("newName").value = "";
	document.getElementById("newDate").value = "";
	document.getElementById("purCat").value ="";
	alert("Purchase added successfully!");}
}

//deletes a category
function deleteCategory(catID) {
	window.clearTimeout(timeoutID);
	//data = "id=" + catID;
	//console.log(data);
	makeRec("DELETE", "/cat/"+ catID, 204);
	poller();
	alert("Category deleted successfully!");
}


// helper function for repop:
function addCell(row, text) {
	var newCell = row.insertCell();
	var newText = document.createTextNode(text);
	newCell.appendChild(newText);
}

//helper function to create delete button
function deleteCat(t, arr)
{
	var newRow = document.getElementById(t.toString());
	var newCell = newRow.insertCell();
	var newButton = document.createElement("input");
	newButton.type = "button";
	newButton.value = "Delete " + arr[t][1];
    var id = arr[t][0];
	newButton.addEventListener("click", function() { deleteCategory(id); });
    newCell.appendChild(newButton);
	
}

function repopulate(catResponseText, purResponseText) {
	console.log("repopulating!");
	var row = JSON.parse(catResponseText);
	var row2 = JSON.parse(purResponseText);
	//console.log(row);
	//console.log(row2);
     
    // the resonses can come in any order so check first element('cat' or 'pur')
    // and make sure row is category and row2 is purchases 
	if(row[0] != 'cat') 
	
	{
		var temp = row;
		row= row2;
		row2= temp;
	}
	
	
	var tab = document.getElementById("theTable");
	var newRow, newCell, t, cat, newButton, newDelF, category_list;
    category_list = new Array(0);
    //delet all rows before repopulating
	while (tab.rows.length > 0) {
		tab.deleteRow(0);
	}
	
	//insert headers
    var header_row = tab.insertRow();
    var cell = header_row.insertCell();
    cell.innerHTML = "Category";
    cell.setAttribute("class", "header", 0);
    var cell2 = header_row.insertCell();
    cell2.innerHTML = "Summary";
    cell2.setAttribute("class", "header", 0);
	
	//get the current month
	var cur_month = new Date().getMonth();

    //traverse category list 
	for (t = 1; t <row.length; t++) {
		//insert a row for each category
		newRow = tab.insertRow();
		newRow.setAttribute("id", t.toString());
		
		//add name cell
		addCell(newRow, row[t][1]);
		category_list.push(row[t][1]);
        
        //compute the summary
		var spent = 0;
		var p;
		//check which purchases correpond to this category and compute the total spent amount
		for( p = 1; p< row2.length; p++)
		{
			if (row2[p][4] == row[t][1])
			{
				var p_date = new Date(row2[p][3]);
				//donot add the purchase amount if month is not equal to current month
				if(p_date.getMonth() == cur_month)
				{spent += parseInt(row2[p][1]);}

			}
		}
		
		//create relevant summary based on spent amount
		if( spent > parseInt(row[t][2]) ){
			var rem = spent - parseInt(row[t][2]); 
            var summ = 'You are $'+rem + ' over your budget of  $' + row[t][2] + "."
		}
		else{
			var rem = parseInt(row[t][2]) - spent; 
			var summ = 'You have $'+rem + '/$' + row[t][2] + " remaining."

		}
		
		//add cell for delete button
		addCell(newRow, summ);
		//create a delete button
		deleteCat(t, row);
		
	}
    //console.log(category_list);
	var c;
	var total_purchases = 0;
    
    //traverse purchase list to compute total purchase amount for uncategorized purchases
	for(c=1; c < row2.length; c++)
	{   
		var p_date = new Date(row2[c][3]);
		//only if purchase month is equal to current month
		if(p_date.getMonth() == cur_month)
		{
		var present = 0;
		//console.log(row2[c][4]);
		var k;
       for( k = 1; k <row.length; k++)
       {
       	if(row[k][1] == row2[c][4]) 
       		{
               present = 1;
               break;
       		}
       }
       if(present == 0){
       	total_purchases+=parseInt(row2[c][1]);
         }
       }

	}
	var lastRow = tab.insertRow();
	addCell(lastRow, 'Total of uncategorized purchases ');
	addCell(lastRow, '$'+total_purchases);
	
	//add options for category dataList in add purchase form
	var i;
	var catList = document.getElementById("catList");
	catList.innerHTML = "";
	var noneOp = document.createElement("option");
	noneOp.value = "none";
	catList.appendChild(noneOp);
	for( i =1; i < row.length; i++)
	{
		var newOp = document.createElement("option");
		newOp.value = row[i][1];
		catList.appendChild(newOp);
	}
    
 }
	



// setup load event
window.addEventListener("load", setup, true);
