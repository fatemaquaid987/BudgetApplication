# Copyright 2015, Kevin Burke, Kyle Conroy, Ryan Horn, Frank Stratton, Guillaume Binet
# Created as documentation for Flask-RESTful Flask extension

from flask import Flask, render_template, flash
from flask_restful import reqparse, abort, Api, Resource
from flask import jsonify
import json

app = Flask(__name__)
api = Api(app)

app.config.update(dict(SEND_FILE_MAX_AGE_DEFAULT=0))


#categories and purchases collection
CATEGORIES = {
	  1: {'name': 'food', 'budget': 30}
	}
PURCHASES = {
	  1 : {'amount': 10, 'spent_on':'lunch', 'date':1, 'category':1}
	}

def abort_if_cat_doesnt_exist(cat_id):
	if int(cat_id) not in CATEGORIES:
		abort(404, message="CAT {} doesn't exist".format(cat_id))

parser = reqparse.RequestParser()
parser.add_argument('category')
parser.add_argument('budget')
parser.add_argument('purchase')
parser.add_argument('amount')
parser.add_argument('spent_on')
parser.add_argument('date')
parser.add_argument('pur_cat')
parser.add_argument('id')

@app.route("/")
def root_page():
	return render_template("base.html")

class Category(Resource):
	#delete a category
	def delete(self, cat_id):
		abort_if_cat_doesnt_exist(cat_id)
		
		del CATEGORIES[int(cat_id)]
		return '', 204

class CategoryList(Resource):
	#get a list of categories
	def get(self):
		summary = [[cat, CATEGORIES[cat]['name'], CATEGORIES[cat]['budget']]  for cat in CATEGORIES]
		summary = ["cat"] + summary
		
		return jsonify(summary)

	
	#post a category
	def post(self):
		args = parser.parse_args()
		if len(CATEGORIES.keys()) > 0:
			cat_id = int(max(CATEGORIES.keys())) + 1
		else:
			cat_id = 1
	
		CATEGORIES[cat_id] = {'name': args['category'], 'budget':int(args['budget'])}
		return json.dumps(CATEGORIES[cat_id]), 201

class PurchaseList(Resource):
	#get a list of purchases
	def get(self):
		summary = [ [p, PURCHASES[p]['amount'],PURCHASES[p]['spent_on'], PURCHASES[p]['date'], PURCHASES[p]['category']] for p in PURCHASES]
		summary = ["pur"] + summary
		
		return jsonify(summary)

	#post a purchase
	def post(self):
		args = parser.parse_args()
		pur_id = int(max(PURCHASES.keys())) + 1
		PURCHASES[pur_id] = {'amount': args['amount'], 'spent_on':args['spent_on'], 'date': args['date'], 'category': args['pur_cat']}
		return json.dumps(PURCHASES[pur_id]), 201

		


api.add_resource(CategoryList, '/cat')
api.add_resource(Category, '/cat/<cat_id>')
api.add_resource(PurchaseList, '/purchases')

if __name__ == '__main__':
	app.run(debug=True)
