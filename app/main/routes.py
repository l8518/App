from flask import render_template, request
from flask_restplus import inputs
import pandas as pd

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
    all_portaits = all_portaits.drop_duplicates(subset = 'id')
    print('Amount of unique results for query: ', len(all_portaits))
    return all_portaits[['image_url', 'artwork_name', 'artist_full_name', 'creation_year']].iloc[pag: pag + 99].to_json(
        orient='records')


def getFilterParams():
    print(request.args)
    begin_date = request.args.get("beginDate")
    end_date = request.args.get("endDate")
    dimension = request.args.get("dimension")
    dimension_value = request.args.get("dimension-value")
    age = request.args.get("age")
    gender = request.args.get("gender")
    color = request.args.get("color")
    female = "female" in gender
    male = "male" in gender
    female = False
    male = False
    # TODO: WIP - not nice solution atm 🙊🙈
    # - if dimension is present:
    #   --> use selected dimension and value for the specific thing (gender, color group etc)
    #   --> allow to further filter data based on the details filter
    # - if no dimension is present:
    #   --> use the details filter data
    if dimension:
        if (dimension == "age"):
            gender = request.args.get("gender").split(',')
            female = "female" in gender
            male = "male" in gender
            age = dimension_value
            color = request.args.get("color")
        if (dimension == "gender"):
            female = "female" == dimension_value
            male = "male" == dimension_value
            age = request.args.get("age")
            color = request.args.get("color")
        if (dimension == "color-group"):
            gender = request.args.get("gender").split(',')
            female = "female" in gender
            male = "male" in gender
            color = dimension_value # TODO: error? I added the value in Javascript. Fixed?
            age = request.args.get("age")
    
    selected_time = request.args.get("selected_time")

    if age is not None:
        age = age.split(',')  # To list

    if color is not None:
        color = color.split(',')

    filterObj = models.FilterObj(begin_date, end_date, age, female, male, color, selected_time)
    return filterObj


@main.route('/api/portrait_count_by_params', methods=['GET'])
def get_portrait_count_by_params():
    filterObj = getFilterParams()
    print(filterObj)
    res = data.get_portrait_count_by_params(filterObj)
    if isinstance(res, pd.DataFrame):
        return res.to_json(orient='records')
    
    return {'period':'ALL', 'count': res}


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
    return data.get_color_dist(filterObj).to_json(orient='records')


@main.route('/api/colors', methods=['GET'])
def get_colors():
    return data.get_colors().to_json(orient='records')


@main.route('/api/colors_200', methods=['GET'])
def get_colors_200():
    return data.get_colors_200().to_json(orient='records')
