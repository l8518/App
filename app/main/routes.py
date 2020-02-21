from flask import render_template, request, jsonify
import os, json

from . import main
from . import data

@main.route('/', methods=['GET'])
def index():
	return render_template("home.html")

@main.route('/api/portraits', methods=['GET'])
def get_portraits_dominant_color_count():
    df = data.get_portraits_by_year('1400','1401')
    dominant_color_count = df.groupby(['dominant_color'])['id'].count().reset_index(name="count").to_json(orient='records')
    return dominant_color_count

@main.route('/api/helloworld', methods=['GET'])
def api_helloworld():
    d = [2, 10, 10]
    return jsonify(d)