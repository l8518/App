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
    hex_col = toColor(color)
    results = portraits_meta.query(begin_date + ' <= creation_year <= ' + end_date +'and dominant_color == "' +hex_col +'"')
    return results

def get_portraits_by_year_by_params(filterObj):
    female_male_filter = female_male_filter(filterObj)
    df = portraits_meta.query(
        filterObj.begin_date + ' <= creation_year <= ' + filterObj.end_date 
        +'and dominant_color == "' +toColor(filterObj.end_date) +'"'
        +'and ' +filterObj.beginAge + ' <= age <= ' + filterObj.endAge
        +female_male_filter
    )
    return df[df['school_type'].isin(filterObj.school_type)]

def toColor(color:str):
    return str("#"+color)

def female_male_filter(filterObj):
    if filterObj.female:
        if filterObj.male:
            return 'and sex == female OR sex == male'
        else:
            return 'and sex == female'
    elif filterObj.male:
        return 'and sex == male'
    else:
        return 'and sex == female OR sex == male' # Standard we always show everything
