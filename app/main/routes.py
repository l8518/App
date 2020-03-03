from flask import render_template, request, jsonify
import os, json

from . import main
from . import data
from . import models

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

@main.route('/api/images', methods=['GET'])
def api_images():
    index = int(request.args.get("index"))
    color = request.args.get("color")
    beginAge = int(request.args.get("beginAge"))
    endAge = int(request.args.get("endAge"))
    school = []#list(request.args.get("school"))
    female = bool(request.args.get("female"))
    male = bool(request.args.get("male"))

    filterObj = models.FilterObj('0', '2020', beginAge, endAge, school, female, male)


    if color != None:
        all_portaits = data.get_portraits_by_year_with_color('0', '2020', color)
    # elif school != None:
    # 	all_portaits = data.get_portraits_by_year_with_color('0', '2020', school)
    else:
        all_portaits = data.get_portraits_by_year('0', '2020')
    print(len(all_portaits['image_url']))
    pag = int(index * 100)
    return all_portaits['image_url'].iloc[pag: pag + 99].to_json(orient='records')