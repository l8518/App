import pandas as pd
import numpy as np
from . import models

# Load data as panda dfs #
# stats_ams = pd.read_csv('app/data/ams_stats_infovis.csv')
# stats_ams_meta = pd.read_csv("app/data/ams_stats_infovis_metadata.csv", sep=";")
portraits_meta = pd.read_csv("omniart_eye_dataset/omniart_metadata.csv")
##########################

# TODO: We can do the data stuff here

def get_portraits_by_year(begin_date:str, end_date:str):
    return portraits_meta.query(begin_date + ' <= creation_year <= ' + end_date)

def get_portraits_by_year_with_color(begin_date:str, end_date:str, color:str):
    hex_col = str("#"+color)
    return portraits_meta.query(begin_date + ' <= creation_year <= ' + end_date +'and dominant_color == "' +hex_col +'"')