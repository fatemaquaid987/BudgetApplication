# BudgetApplication

A budget and expenses tracking application made using HTML5, CSS, JSON, AJAJ, JavaScript, Python, Flask and, RESTful API.

## Overview
This is a very simple budget application for a single user. The application supports several budget categories, and a set monthly limit for each category (e.g., $700 for rent, $200 for food, $100 for gas, etc.). The application allows the user to enter purchases and presents an up-to-date list of the user's remaining budgeted amount in each category (e.g., you have $0/$700 left for rent, you are $20 over your food budget of $200, and you have $44/$100 left for gas), and the amount spent on uncategorized purchases. for this application, all the server-side data is represented as Python data structures.

## How to run

Open Command prompt on Windows or terminal on Mac.  
Set the FLASK_APP environment variable to your budget.py as: "set FLASK_APP=path/budget.py"  
Run the application using: "flask run"

## Specifications
This application builds a RESTful API for accessing the budget category and to purchase resources. Specifically, users can perform HTTP GETs, POSTs, and DELETEs on "/cats" to get a list of budget categories, add a new category, and delete a category (respectively), and also perform HTTP GETs and POSTs to "/purchases" to get a list of individual purchases by the user and to add a new purchase. All data is transmitted using JSON.   

The user can add a new category by filling the 'Add new category form' or add a new purchase by filling the 'Add new purchase form'. A category can be deleted by simply clicking the delete button beside that category in the summary section at the top.  

When the root resource of this site is accessed ("/"), the Flask application only sends a basic page skeleton to the user along with a JavaScript application that will make AJAJ requests to populate the page.  

Once the page is loaded by a user's browser, it makes AJAJ requests for the list of categories and list of purchases made by the user using the RESTful API.  

Once populated, the page displays the status of each of the user's budget categories, and the total of uncategorized purchases.  
 
The application does not regularly poll the server for updates. However, once user requests any changes (e.g., add a purchase, add a category, delete a category), the application uses AJAJ to fetch the updated information via the RESTful API, and recomputs the status of each of the user's budget categories.   

Because we are not storing the data using SQLAlchemy, the data will not persist across server instances.  

If the server is killed (i.e., Ctrl+C issued), all category/purchase data will be forgotten.  


