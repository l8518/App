import pandas as pd
import numpy as np
from . import models
from glob import glob
import os.path
import json

# Load data as panda dfs #
heatmap_csv = pd.read_csv("data/heatmap_200.csv")
faces = pd.read_json("data/faces_new.json")
color_groups = pd.read_json("data/group_centers.json")
color_groups_200 = pd.read_json("data/group_centers_200.json")
portraits_with_faces_and_color = pd.read_csv("data/portraits_with_faces_and_color.csv")
metadata_df = pd.read_csv("data/omniart_v3_portrait.csv")


# fetch all json
facessim = {}

# portrait_data = pd.read_csv("data/portraits.csv")

##########################

#def get_portraits_by_year(begin_date: str, end_date: str):
#    return portraits_with_faces_and_color.query(begin_date + ' <= creation_year <= ' + end_date)
def load_facesim():
    files = glob('app/static/img/*.json')
    for f_name in files:
        basename, file_extension = os.path.splitext(os.path.basename(f_name))
        fo = open(f_name)
        facessim[basename] = json.load(fo)
        fo.close()
load_facesim()

def get_heatmap():
    return heatmap_csv


def get_colors():
    return color_groups


def get_colors_200():
    return color_groups_200



def get_portraits_by_year_by_params(filterObj: models.FilterObj):
    # Age filter
    df = portraits_with_faces_and_color[portraits_with_faces_and_color['age'].isin(filterObj.age)]

    # Gender filter
    df = female_male_filter(df, filterObj)

    # Color filter
    df = df[df['group'].isin(filterObj.color)]

    if filterObj.selected_time != "ALL":
        # Filter period
        result = df.query(filterObj.beginDate + ' <= creation_year <= ' + filterObj.endDate)
    else:
        result = df

    print('Amount of results for query: ', len(result))
    return result


def female_male_filter(df, filterObj):
    if filterObj.female is True and filterObj.male is not True:
        df = df.query('gender == "Female"')
    if filterObj.male is True and filterObj.female is not True:
        df = df.query('gender == "Male"')
    return df

def get_faces_by_params(filterObj):

    time = str.lower(filterObj.selected_time)
    keyname = time
    imgname = filterObj.beginDate
    if filterObj.dimension != "none":
        keyname += f"-{filterObj.dimension}"
        imgname = f"{filterObj.dimension_value}-{filterObj.beginDate}"
        if filterObj.selected_time == "ALL":
            imgname = filterObj.dimension_value
    else:
        if filterObj.selected_time == "ALL":
            imgname = "all"
    
    print(imgname)
    if (imgname not in facessim[keyname]):
        return []
    
    faceres = facessim[keyname][imgname]
    
    return faceres[0:min(len(faceres),10)]

def get_portrait_count_by_params(filterObj):
    if filterObj.selected_time == "YEAR":
        yeardf = portraits_with_faces_and_color\
            .groupby(['creation_year'])\
            .creation_year.agg('count').to_frame(
            'count').reset_index()

        yeardf.index = yeardf['creation_year']
        yeardf = yeardf.reindex(np.arange(yeardf.creation_year.min(), yeardf.creation_year.max())+ 1).fillna(0)
        yeardf = yeardf.drop('creation_year', 1)
        yeardf.reset_index(level=0, inplace=True)
        yeardf["count"] = np.log(yeardf["count"])
        return yeardf[['creation_year', 'count']]

    if filterObj.selected_time == "DECADE":
        decadedf = portraits_with_faces_and_color\
            .groupby(portraits_with_faces_and_color.creation_year// 10 * 10)\
            .creation_year.agg('count')\
            .to_frame('count').reset_index()\
            .rename({'creation_year': 'decade'}, axis='columns')
        decadedf.loc[:,'decade'] /= 10
        decadedf.index = decadedf['decade']
        decadedf = decadedf.reindex(np.arange(decadedf.decade.min(), decadedf.decade.max())+ 1).fillna(0)
        decadedf = decadedf.drop('decade', 1)
        decadedf.reset_index(level=0, inplace=True)
        decadedf.loc[:,'decade'] *= 10
        decadedf["count"] = np.log(decadedf["count"])
        return decadedf[['decade','count']]

    if filterObj.selected_time == "CENTURY":
        res = portraits_with_faces_and_color.groupby(['century'])\
            .creation_year.agg('count').to_frame(
            'count').reset_index()
        res["count"] = np.log(res["count"])
        return res[['century', 'count']]
    
    if filterObj.selected_time == "ALL":
        return portraits_with_faces_and_color.shape[0]


def get_bubble(filterObj):
    color_groups.columns = ['R', 'G', 'B', 'group']
    portraits = get_portraits_by_year_by_params(filterObj)

    if filterObj.selected_time == "YEAR":
        dfGrouped = portraits.groupby(['gender', 'age', 'group'])
    elif filterObj.selected_time == "CENTURY":
        # TODO make groups of decades
        dfGrouped = portraits.groupby(['gender', 'age', 'group', 'creation_year'])
    elif filterObj.selected_time == "DECADE":
        dfGrouped = portraits.groupby(['gender', 'age', 'group', 'creation_year'])
    else:
        dfGrouped = portraits.groupby(['gender', 'age', 'group', 'century'])

    dfGrouped = dfGrouped.id.agg('count').to_frame('count').reset_index()
    dfGrouped = pd.merge(dfGrouped, color_groups, on='group', how='outer')

    if filterObj.selected_time == "ALL":
        return dfGrouped[['R', 'G', 'B', 'gender', 'age', 'count', 'century']]
    elif filterObj.selected_time == "CENTURY" or filterObj.selected_time == "DECADE":
        return dfGrouped[['R', 'G', 'B', 'gender', 'age', 'count', 'creation_year']]
    else:
        return dfGrouped[['R', 'G', 'B', 'gender', 'age', 'count']]


def get_color_dist(filterObj):
    portraits = get_portraits_by_year_by_params(filterObj)
    dfGrouped = portraits.groupby(['age', 'group'])
    df = dfGrouped.id.agg('count').to_frame('count').reset_index()
    
    pvdf = df.pivot(index='age', columns='group', values='count').reset_index()
    pvdf = pvdf.fillna(0)
    return pvdf
