import pandas as pd

from . import models

# Load data as panda dfs #
# stats_ams = pd.read_csv('app/data/ams_stats_infovis.csv')
# stats_ams_meta = pd.read_csv("app/data/ams_stats_infovis_metadata.csv", sep=";")
portraits_meta = pd.read_csv("omniart_eye_dataset/omniart_metadata.csv")


##########################

# TODO: We can do the data stuff here

def get_portraits_by_year(begin_date: str, end_date: str):
    return portraits_meta.query(begin_date + ' <= creation_year <= ' + end_date)


def get_portraits_by_year_with_color(begin_date: str, end_date: str, color: str):
    hex_col = toColor(color)
    results = portraits_meta.query(
        begin_date + ' <= creation_year <= ' + end_date + 'and dominant_color == "' + hex_col + '"')
    return results


def get_portraits_by_year_by_params(filterObj: models.FilterObj):
    female_male_string = female_male_filter(filterObj)

    df = portraits_meta.query(
        filterObj.beginDate + ' <= creation_year <= ' + filterObj.endDate
        + 'and dominant_color == "' + toColor(filterObj.color) + '"'
        + 'and ' + str(filterObj.beginAge) + ' <= age <= ' + str(filterObj.endAge)
        + str(female_male_string)
    )
    return df[df['school_type'].isin(filterObj.schools)]


def toColor(color: str):
    return str("#" + color)


def female_male_filter(filterObj):
    if filterObj.female:
        if filterObj.male:
            return ""  # Standard we always show everything
        else:
            return "and sex == female"
    elif filterObj.male:
        return "and sex == male"
    else:
        return ""  # Standard we always show everything
