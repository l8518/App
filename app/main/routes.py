from flask import render_template, request
from flask_restplus import inputs

from . import data
from . import main
from . import models


@main.route('/', methods=['GET'])
def index():
    return render_template("home.html")


@main.route('/api/portraits_heatmap', methods=['GET'])
def get_portraits_heatmap():
    df_heat = data.get_heatmap()
    return df_heat.to_json(orient='records')


@main.route('/api/images', methods=['GET'])
def api_images():
    index = request.args.get("index", type=int)
    filterObj = getFilterParams()

    all_portaits = data.get_portraits_by_year_by_params(filterObj)
    pag = int(index * 100)
    return all_portaits[['image_url', 'artwork_name', 'artist_full_name', 'creation_year']].iloc[pag: pag + 99].to_json(
        orient='records')


def getFilterParams():
    begin_date = request.args.get("beginDate")
    end_date = request.args.get("endDate")
    color = request.args.get("color")
    age = request.args.get("age")
    female = request.args.get("female", type=inputs.boolean)
    male = request.args.get("male", type=inputs.boolean)

    age = age.split(',')  # To list
    color = color.split(',')

    filterObj = models.FilterObj(begin_date, end_date, age, female, male, color)
    return filterObj


@main.route('/api/portrait_count_by_year', methods=['GET'])
def get_portrait_count_by_year():
    portraits_df = data.get_portraits()
    portraits_df = portraits_df.groupby(['creation_year', 'century']).creation_year.agg('count').to_frame(
        'count').reset_index()
    return portraits_df[['creation_year', 'count']].to_json(orient='records')


@main.route('/api/portrait_count_by_century', methods=['GET'])
def get_portrait_count_by_century():
    portraits_df = data.get_portraits()
    portraits_df = portraits_df.groupby(['century']).creation_year.agg('count').to_frame('count').reset_index()
    return portraits_df.to_json(orient='records')


@main.route('/api/morphed_image_by_year', methods=['GET'])
def morphed_image_by_year():
    return 0


@main.route('/api/bubble', methods=['GET'])
def bubble_chart():
    filterObj = getFilterParams()
    return data.get_bubble(filterObj).to_json(orient='records')


@main.route('/api/color_dist', methods=['GET'])
def get_color_dist():
    filterObj = getFilterParams()
    return data.get_color_dist(filterObj).to_json(orient='index')


@main.route('/api/colors', methods=['GET'])
def get_colors():
    return data.get_colors().to_json(orient='records')
