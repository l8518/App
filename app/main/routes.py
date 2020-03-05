from flask import render_template, request, jsonify
from flask_restplus import inputs

from . import data
from . import main
from . import models


@main.route('/', methods=['GET'])
def index():
    return render_template("home.html")


@main.route('/temp', methods=['GET'])
def temp():
    return render_template("home_temp.html")


@main.route('/api/portraits', methods=['GET'])
def get_portraits_dominant_color_count():
    df = data.get_portraits_by_year('1400', '1402')
    dominant_color_count = df.groupby(['dominant_color'])['id'].count().reset_index(name="count").to_json(
        orient='records')
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
    dominant_color_count = df.groupby(['dominant_color'])['id'].count().reset_index(name="count").to_json(
        orient='records')
    return dominant_color_count

@main.route('/api/helloworld', methods=['GET'])
def api_helloworld():
    d = [2, 10, 10]
    return jsonify(d)


@main.route('/api/images', methods=['GET'])
def api_images():
    index = request.args.get("index", type=int)
    color = request.args.get("color")  # TODO Should be a list same as age
    age = request.args.get("age")
    female = request.args.get("female", type=inputs.boolean)
    male = request.args.get("male", type=inputs.boolean)

    age = age.split(',')  # To list

    filterObj = models.FilterObj('0', '2020', age, female, male, '')

    if color != None:
        filterObj.color = '000000'

    all_portaits = data.get_portraits_by_year_by_params(filterObj)
    pag = int(index * 100)
    return all_portaits[['image_url', 'artwork_name', 'artist_full_name', 'creation_year']].iloc[pag: pag + 99].to_json(
        orient='records')
