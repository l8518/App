import pandas as pd

from . import models

# Load data as panda dfs #
heatmap_csv = pd.read_csv("data/heatmap_200.csv")
faces = pd.read_json("data/faces_new.json")
color_groups = pd.read_json("data/group_centers.json")
color_groups_200 = pd.read_json("data/group_centers_200.json")
portraits_with_faces_and_color = pd.read_csv("data/portraits_with_faces_and_color.csv")


# portrait_data = pd.read_csv("data/portraits.csv")

##########################

#def get_portraits_by_year(begin_date: str, end_date: str):
#    return portraits_with_faces_and_color.query(begin_date + ' <= creation_year <= ' + end_date)


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

    # Filter period
    result = df.query(filterObj.beginDate + ' <= creation_year <= ' + filterObj.endDate)

    print('Amount of results for query: ', len(result))
    return result


def female_male_filter(df, filterObj):
    if filterObj.female is True and filterObj.male is not True:
        df = df.query('gender == "Female"')
    if filterObj.male is True and filterObj.female is not True:
        df = df.query('gender == "Male"')
    return df


def get_portrait_count_by_params(filterObj):
    if filterObj.selected_time == "YEAR":
        res = portraits_with_faces_and_color\
            .groupby(['creation_year'])\
            .creation_year.agg('count').to_frame(
            'count').reset_index()
        return res[['creation_year', 'count']]

    if filterObj.selected_time == "DECADE":
        res = portraits_with_faces_and_color\
            .groupby(portraits_with_faces_and_color.creation_year// 10 * 10)\
            .creation_year.agg('count')\
            .to_frame('count').reset_index()\
            .rename({'creation_year': 'decade'}, axis='columns')
        return res[['decade','count']]

    if filterObj.selected_time == "CENTURY":
        res = portraits_with_faces_and_color.groupby(['century'])\
            .creation_year.agg('count').to_frame(
            'count').reset_index()
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
    return df.pivot(index='age', columns='group', values='count').reset_index()
