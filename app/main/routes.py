from flask import render_template, request, jsonify
import os, json

from app import data
from . import main


@main.route('/', methods=['GET'])
def index():
	return render_template("home.html")


@main.route('/api/helloworld', methods=['GET'])
def api_helloworld():
    d = [2, 10, 10]
    return jsonify(d)