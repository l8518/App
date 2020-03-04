import pandas as pd

from . import models

# Load data as panda dfs #
# stats_ams = pd.read_csv('app/data/ams_stats_infovis.csv')
# stats_ams_meta = pd.read_csv("app/data/ams_stats_infovis_metadata.csv", sep=";")
portraits_meta = pd.read_csv("omniart_eye_dataset/omniart_metadata.csv")

faces = pd.read_json("data/faces.json")


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
    # Age filter
    df = faces[faces['age'].isin(filterObj.age)]
    # Gender filter
    df = female_male_filter(df, filterObj)

    # Color filter
    # df = df[df['color'].isin(filterObj.color)]

    # Filter period
    result = portraits_meta.query(filterObj.beginDate + ' <= creation_year <= ' + filterObj.endDate)
    # Match both datasets
    end = result[result['id'].isin(df['imgid'])]  # Wrong?
    print('Amount of results for query: ', len(end))
    return end


def toColor(color: str):
    return str("#" + color)


def female_male_filter(df, filterObj):
    if filterObj.female is True and filterObj.male is not True:
        df = df.query('gender == "Female"')
    if filterObj.male is True and filterObj.female is not True:
        df = df.query('gender == "Male"')
    return df
