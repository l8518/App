from flask import render_template, request, jsonify
import os, json

from . import main
from . import data

@main.route('/', methods=['GET'])
def index():
	return render_template("home.html")

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

@main.route('/api/portrait_count_by_year', methods=['GET'])
def get_portrait_count_by_year():
    portraits_df = data.get_portraits()
    portraits_df = portraits_df.groupby(['creation_year','century']).creation_year.agg('count').to_frame('count').reset_index()    
    return portraits_df[['creation_year','count']].to_json(orient='records')

@main.route('/api/portrait_count_by_century', methods=['GET'])
def get_portrait_count_by_century():
    portraits_df = data.get_portraits()
    portraits_df = portraits_df.groupby(['century']).creation_year.agg('count').to_frame('count').reset_index() 
    return portraits_df.to_json(orient='records')

@main.route('/api/morphed_image_by_year', methods=['GET'])
def morphed_image_by_year():
    return 0

@main.route('/api/testdata', methods=['GET'])
def testdata():
    return data.get_testdata().to_json(orient='records')

