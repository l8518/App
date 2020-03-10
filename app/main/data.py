import pandas as pd

from . import models

# Load data as panda dfs #
portraits_meta = pd.read_csv("data/omniart_v3_portrait.csv")
heatmap_csv = pd.read_csv("data/heatmap.csv")
faces = pd.read_json("data/faces_new.json")
color_groups = pd.read_json("data/group_centers.json")
portraits_with_faces_and_color = pd.read_csv("data/portraits_with_faces_and_color.csv")


# portrait_data = pd.read_csv("data/portraits.csv")

##########################

def get_portraits_by_year(begin_date: str, end_date: str):
    return portraits_meta.query(begin_date + ' <= creation_year <= ' + end_date)


def get_heatmap():
    return heatmap_csv


def get_portraits_by_year_by_params(filterObj: models.FilterObj):
    # Age filter
    df = portraits_with_faces_and_color[portraits_with_faces_and_color['age'].isin(filterObj.age)]
    # Gender filter
    df = female_male_filter(df, filterObj)

    # Color filter
    print(filterObj.color)
    df = df[df['group'].isin(filterObj.color)]

    # Filter period
    # portraits_filtered = portraits_meta[~portraits_meta.century.isin([8,13])] #Doesnt work....
    result = df.query(filterObj.beginDate + ' <= creation_year <= ' + filterObj.endDate)
    # Match both datasets

    print('Amount of results for query: ', len(result))
    return result


def toColor(color: str):
    return str("#" + color)


def female_male_filter(df, filterObj):
    if filterObj.female is True and filterObj.male is not True:
        df = df.query('gender == "Female"')
    if filterObj.male is True and filterObj.female is not True:
        df = df.query('gender == "Male"')
    return df


def get_portraits():
    return portraits_meta


def get_bubble(filterObj):
    color_groups.columns = ['R', 'G', 'B', 'group']
    portraits = get_portraits_by_year_by_params(filterObj)
    print(portraits.columns)

    # print(faces)
    # meta_faces = portraits[portraits['id'].isin(faces['imgid'])]
    dfGrouped = portraits.groupby(['gender', 'age', 'group', 'century'])
    dfGrouped = dfGrouped.id.agg('count').to_frame('count').reset_index()
    dfGrouped = pd.merge(dfGrouped, color_groups, on='group', how='outer')
    return dfGrouped[['R', 'G', 'B', 'gender', 'age', 'count', 'century']]
