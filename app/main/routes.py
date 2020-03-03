from flask import render_template, request, jsonify
import os, json

from . import main
from . import data

@main.route('/', methods=['GET'])
def index():
	return render_template("home.html")

@main.route('/temp', methods=['GET'])
def temp():
	return render_template("home_temp.html")

@main.route('/api/portraits', methods=['GET'])
def get_portraits_dominant_color_count():
    df = data.get_portraits_by_year('1400','1402')
    dominant_color_count = df.groupby(['dominant_color'])['id'].count().reset_index(name="count").to_json(orient='records')
    return dominant_color_count

@main.route('/api/portraits_heatmap', methods=['GET'])
def get_portraits_heatmap():
    df_heat = data.get_heatmap()
    return df_heat.to_json(orient='records')

@main.route('/api/portraits_for_period', methods=['GET'])
def get_portraits_dominant_color_count_for_period():
    year_start = request.args.get("year_start")
    year_end = request.args.get("year_end")
    df = data.get_portraits_by_year(str(year_start), str(year_end))
    dominant_color_count = df.groupby(['dominant_color'])['id'].count().reset_index(name="count").to_json(orient='records')
    return dominant_color_count

@main.route('/api/helloworld', methods=['GET'])
def api_helloworld():
    d = [2, 10, 10]
    return jsonify(d)